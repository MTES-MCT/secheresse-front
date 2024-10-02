<script setup lang="ts">

import { Ref } from 'vue';
import api from '../../api';

definePageMeta({
  layout: 'basic',
});

useHead({
  title: `Abonnement aux alertes VigiEau - ${useRuntimeConfig().public.appName}`,
});

const links: Ref<any[]> = ref([{ 'to': '/', 'text': 'Accueil' }, { 'text': 'Abonnement aux alertes' }]);

const router = useRouter();
const modalSuccessOpened: Ref<boolean> = ref(false);
const modalErrorOpened: Ref<boolean> = ref(false);
const subscribing: Ref<boolean> = ref(false);

const closeModal = (redirect: boolean) => {
  modalSuccessOpened.value = false;
  modalErrorOpened.value = false;
  if (redirect) {
    router.go(-1);
  }
};

const subscribe = async (form: any) => {
  subscribing.value = true;
  const { data, error } = await api.subscribeMail(form);
  subscribing.value = false;
  closeModal(false);
  if (!error.value) {
    modalSuccessOpened.value = true;
  } else {
    modalErrorOpened.value = true;
  }
};
</script>

<template>
  <div class="fr-container">
    <DsfrButton class="fr-my-1w"
                secondary
                icon="ri-arrow-left-line"
                title="Retour à la page précédente"
                @click="router.go(-1)">
      Retour
    </DsfrButton>
    <h1>M'abonner aux alertes VigiEau</h1>
    <p>Tenez vous au courant des changements de situation de votre territoire</p>
    <MailForm :subscribing="subscribing" @subscribe="subscribe($event)" />
  </div>
  <DsfrModal :opened="modalSuccessOpened"
             title=" "
             @close="closeModal(true)">
    <h1>Vous êtes désormais abonné !</h1>
    <p>Vous recevrez un email très prochainement. Vous souhaitez recevoir les alertes pour plusieurs adresses ? Il vous
      suffit de re-remplir
      le formulaire avec la ou les nouvelles adresses.</p>
  </DsfrModal>
  <DsfrModal :opened="modalErrorOpened"
             title=" "
             @close="closeModal(false)">
    <h1>Une erreur est survenue !</h1>
    <p>Veuillez ré-essayer avec une autre adresse.</p>
  </DsfrModal>
</template>
