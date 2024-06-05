<script setup lang="ts">
import { Usage } from "../../dto/usage.dto";
import { Ref } from "vue";
import api from '../../api';

const props = defineProps<{
  usage: Usage,
  departement: string,
  thematique: any
}>()

const closeModal = () => {
  modalOpened.value = false;
  modalSuccessOpened.value = false;
}

const signalRestriction = async () => {
  const { data, error } = await api.signalRestriction(props.usage.id);
  modalOpened.value = false;
  modalSuccessOpened.value = true;
}

const modalOpened: Ref<boolean> = ref(false);
const modalSuccessOpened: Ref<boolean> = ref(false);
const modalActions: Ref<any[]> = ref([{label: "Je ne comprends pas cette restriction", onClick: signalRestriction}, {
  label: "Annuler",
  onClick: closeModal,
  secondary: true
}]);
const modalActionsSuccess: Ref<any[]> = ref([{label: "Fermer", onClick: closeModal}]);
</script>

<template>
  <div class="eau-card fr-p-2w">
    <div class="eau-card__header">
      <VIcon :name="thematique.icone" scale="5"/>
    </div>
    <div class="h6 eau-card__title fr-my-2w">
      {{ usage.nom }}

      <DsfrButton icon="ri-question-line"
                  label="Je ne comprends pas cette restriction"
                  icon-only
                  tertiary
                  size="small"
                  @click="modalOpened = true"
                  no-outline/>
    </div>
    <div class="eau-card__desc">
      {{ usage.description }}
    </div>
  </div>
  <DsfrModal :opened="modalOpened"
             title="Je ne comprends pas cette restriction"
             icon="ri-question-line"
             :actions="modalActions"
             @close="closeModal">
    <div>
      Si la restriction "{{ usage.nom }}" est peu compréhensible, merci de nous le faire remonter.<br/>Nous la modifierons si nécessaire !
    </div>
  </DsfrModal>
  <DsfrModal :opened="modalSuccessOpened"
             title=" "
             icon="ri-checkbox-circle-line"
             :actions="modalActionsSuccess"
             @close="closeModal">
    <div>
      Votre retour a bien été pris en compte !
    </div>
  </DsfrModal>
</template>

<style lang="scss" scoped>
.eau-card {
  .eau-card {
    &__header {
      color: var(--blue-france-sun-113-625);
    }

    &__desc {
      white-space: pre-wrap;
      font-size: 1rem;
    }
  }
}
</style>