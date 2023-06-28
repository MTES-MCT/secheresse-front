<script setup lang="ts">
import { Usage } from "../../dto/usage.dto";
import { Ref } from "vue";

const props = defineProps<{
  usage: Usage,
  departement: string,
  thematique: string
}>()

const closeModal = () => {
  modalOpened.value = false;
}

const signalRestriction = () => {
  window._paq.push(['trackEvent', 'SIGNALEMENT RESTRICTION', props.departement, props.usage.usage, 1]);
  modalOpened.value = false;
}

const modalOpened: Ref<boolean> = ref(false);
const modalActions: Ref<any[]> = ref([{label: "Je ne comprend pas cette restriction", onClick: signalRestriction}, {
  label: "Annuler",
  onClick: closeModal,
  secondary: true
}]);

const cardDesc = computed((): string => {
  let cardDesc = '';
  cardDesc += props.usage.details ? props.usage.details : '';
  cardDesc += (props.usage.niveauRestriction === 'Interdiction sur plage horaire' && props.usage.heureDebut && props.usage.heureFin) ? `Interdit de ${props.usage.heureDebut} à ${props.usage.heureFin}` : '';
  cardDesc += props.usage.erreur ? `Consulter l'arrêté` : '';
  return cardDesc;
})

const cardIcon = computed((): string => {
  switch (props.thematique) {
    case 'Arrosage':
      return 'eau-goutte-arrosoir-interdiction'
    case 'Remplissage vidange':
      return 'eau-goutte-remplissage-interdiction'
    case 'Nettoyage':
      return 'eau-goutte-nettoyage-interdiction'
    case 'Alimentation des fontaines publiques et privées':
      return 'eau-goutte-robinet-interdiction'
    default:
      return 'eau-goutte-robinet-interdiction'
  }
})
</script>

<template>
  <div class="eau-card fr-p-2w">
    <div class="eau-card__header">
      <VIcon :name="cardIcon" scale="5"/>
    </div>
    <h6 class="eau-card__title fr-my-2w">
      {{ usage.usage }}

      <DsfrButton icon="ri-error-warning-line"
                  label="Signaler une restriction peu compréhensible"
                  icon-only
                  tertiary
                  size="small"
                  @click="modalOpened = true"
                  no-outline/>
    </h6>
    <div class="eau-card__desc">
      {{ cardDesc }}
    </div>
  </div>
  <DsfrModal :opened="modalOpened"
             title="Je ne comprends pas cette restriction"
             icon="ri-error-warning-line"
             :actions="modalActions"
             @close="closeModal">
    <div>
      Si la restriction "{{ usage.usage }}" est peu compréhensible, merci de nous le faire remonter.<br/>Nous la modifierons si nécessaire !
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