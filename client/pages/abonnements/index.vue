<script setup lang="ts">

import api from "../../api";
import { Ref } from "vue";
import { Subscription } from "../../dto/subscription.dto";

definePageMeta({
  layout: 'basic',
  middleware: 'abonnements'
})

useHead({
  title: `Abonnements - ${useRuntimeConfig().public.appName}`
})
const links: Ref<any[]> = ref([{"to": "/", "text": "Accueil"}, {"text": "Abonnements"}]);
const loading: Ref<boolean> = ref(false);
const modalOpened: Ref<boolean> = ref(false);
const modalTitle: Ref<string> = ref('');
const modalText: Ref<string> = ref('');
const modalIcon: Ref<string> = ref('');
const modalActions: Ref<any[]> = ref([]);

const router = useRouter();
const route = useRoute();
const {data: userSubscriptions, error} = await api.getUserSubscriptions(route.query.token);

if (!userSubscriptions.value || userSubscriptions.value.length < 1 || error.value) {
  router.push('/');
}

const unsubscribe = async (ids: string[]) => {
  loading.value = true;
  const {data, error} = ids.length > 1 ? await api.unsubscribeAll(route.query.token) : await api.unsubscribe(ids[0], route.query.token);
  if (!error.value) {
    userSubscriptions.value = userSubscriptions.value.filter(s => !ids.includes(s._id));
  }
  loading.value = false;
  closeModal();
};

const askUnsubscribe = (subscriptions: Subscription[]) => {
  modalTitle.value = 'Désabonnement';
  modalText.value = subscriptions.length > 1 ? `Voulez-vous vous désabonner de toutes les notifications de changement de restrictions pour vos <b>${subscriptions.length} adresses</b> ?`
    : `Voulez-vous vous désabonner des notifications de changement de restrictions pour l'adresse <b>${subscriptions[0].libelleLocalisation}</b> ?`;
  modalActions.value = [{
    label: 'Valider',
    onClick: unsubscribe.bind(this, subscriptions.map(s => s._id))
  }, {label: 'Annuler', onClick: closeModal, secondary: true}];
  modalOpened.value = true;
}

const closeModal = () => {
  modalOpened.value = false;
  if (userSubscriptions.value.length < 1) {
    router.push('/');
  }
};
</script>

<template>
  <DsfrBreadcrumb :links='links'/>
  <div class="fr-mt-8w" v-if="userSubscriptions">
    <h1>Abonnements</h1>
    <h2>{{ route.query.email }}</h2>
    <div class="fr-grid-row fr-grid-row--gutters">
      <SubscriptionsCard v-for="subscription in userSubscriptions"
                         :loading="loading"
                         :subscription="subscription"
                         @unsubscribe="askUnsubscribe([subscription])"/>
    </div>
    <div v-if="userSubscriptions.length > 1">
      <DsfrButton class="fr-mt-2w"
                  label="Me désabonner de toutes les adresses"
                  :disabled="loading"
                  @click="askUnsubscribe(userSubscriptions)"/>
    </div>
  </div>
  <DsfrModal :opened="modalOpened"
             :title="modalTitle"
             :icon="modalIcon"
             :actions=modalActions
             @close="closeModal">
    <div v-html="modalText"></div>
  </DsfrModal>
</template>
