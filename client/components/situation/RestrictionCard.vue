<script setup lang="ts">
import { Usage } from '../../dto/usage.dto';
import { Ref } from 'vue';
import api from '../../api';

const props = defineProps<{
  usage: Usage,
  departement: string,
  thematique: any
}>();

const feedbackComment = ref(null);
const cardId = utils.getRandomString(5);
const questionBtn = ref(null);

const closeModal = () => {
  modalOpened.value = false;
  modalSuccessOpened.value = false;
  feedbackComment.value = null;
  nextTick(() => {
    questionBtn.value?.focus();
  })
};

const signalRestriction = async () => {
  const { data, error } = await api.signalRestriction(props.usage.id, feedbackComment.value);
  modalOpened.value = false;
  modalSuccessOpened.value = true;
  feedbackComment.value = null;
};

const modalOpened: Ref<boolean> = ref(false);
const modalSuccessOpened: Ref<boolean> = ref(false);
const modalActions: Ref<any[]> = ref([{ label: 'Je ne comprends pas cette restriction', onClick: signalRestriction }, {
  label: 'Annuler',
  onClick: closeModal,
  secondary: true,
  title: 'Annuler et fermer'
}]);
const modalActionsSuccess: Ref<any[]> = ref([{ label: 'Fermer', onClick: closeModal }]);
</script>

<template>
  <div class="eau-card fr-p-2w">
    <div class="eau-card__title fr-mb-1w">
      <h3 :id="cardId" class="h6 fr-m-0">
        {{ usage.nom }}
      </h3>

      <DsfrButton icon="ri-question-line"
                  label="Je ne comprends pas cette restriction"
                  icon-only
                  tertiary
                  size="small"
                  @click="modalOpened = true"
                  :aria-describedby="cardId"
                  ref="questionBtn"
                  no-outline />
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
      <p>
        Si la restriction "{{ usage.nom }}" est peu compréhensible, merci de nous le faire remonter.<br />Nous la
        modifierons si nécessaire !
      </p>
    </div>
    <DsfrInputGroup>
      <DsfrInput
        v-model="feedbackComment"
        :is-textarea="true"
        label="Commentaire (facultatif)"
        label-visible
        type="text"
        rows="4"
        :required="false"
        maxlength="255"
      />
      <span class="fr-input-group__sub-hint">
          {{ feedbackComment ? feedbackComment.length : 0 }}/255
        </span>
    </DsfrInputGroup>
  </DsfrModal>
  <DsfrModal :opened="modalSuccessOpened"
             title=" "
             icon="ri-checkbox-circle-line"
             :actions="modalActionsSuccess"
             @close="closeModal">
    <div>
      <p>
        Votre retour a bien été pris en compte !
      </p>
    </div>
  </DsfrModal>
</template>

<style lang="scss" scoped>
.eau-card {
  .eau-card {
    &__title {
      h3 {
        color: currentColor;
      }
    }

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