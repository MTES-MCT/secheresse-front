<script setup lang="ts">
import utils from "../../../utils";

const props = defineProps<{
  situation: { rank: number, nbTerritories: number }
  address: any
}>()

const badgeLabel = computed<string>(() => {
  return utils.getSituationBadgeLabel(props.situation.rank)
})

const situationLabel = computed<string>(() => {
  return utils.getSituationLabel(props.situation.rank)
})
</script>

<template>
  <div class="situation-status-header fr-grid-row fr-grid-row--gutters"
       :class="'situation-level-' + props.situation.rank">
    <div class="fr-col-12 fr-col-md-6">
      <DsfrBadge small
                 class="fr-mb-2w"
                 :class="'situation-level-' + props.situation.rank"
                 :label="badgeLabel"
                 no-icon/>
      <div class="fr-mb-2w">{{ address.properties.label }}</div>
      <h3>Votre territoire est actuellement en <span class="situation-level-c-4">{{ situationLabel }}</span></h3>
      <div>Le respect des restrictions <b>est obligatoire</b> sous peine de recevoir une <b>amende</b> de 1 000 000€</div>
    </div>
    <div class="fr-col-12 fr-col-md-6 button-wrapper">
      <DsfrButton label="Télécharger l'arrêté préfectoral"/>
    </div>
  </div>
</template>

<style lang="scss">
.situation-status-header {
  width: 90%;
  position: relative;
  margin: auto;

  &:before {
    content: "";
    position: absolute;
    width: 100vw;
    height: 100%;
    left: 50%;
    top: 0;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    opacity: 0.8;
    z-index: -1;
  }

  &.situation-level {
    &-4:before {
      background: linear-gradient(270deg, rgba(254, 240, 229, 0.5) 0%, rgba(254, 233, 231, 0.5) 100%);
    }

    &-3:before {
      background: linear-gradient(270deg, rgba(254, 240, 229, 0.5) 0%, rgba(254, 233, 231, 0.5) 100%);
    }

    &-2:before {
      background: linear-gradient(270deg, rgba(252, 246, 232, 0.5) 0%, rgba(254, 242, 228, 0.5) 100%);
    }

    &-1:before {
      background: linear-gradient(270deg, rgba(218, 218, 238, 0.5) 0%, rgba(239, 236, 228, 0.5) 100%);
    }
  }

  .button-wrapper {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }

  h3 span {
    text-transform: lowercase;
  }
}
</style>