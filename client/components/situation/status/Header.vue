<script setup lang="ts">
import utils from "../../../utils";
import { Restriction } from "../../../dto/restriction.dto";
import { Ref } from "vue";

const props = defineProps<{
  restriction: Restriction
  address: any
}>();

const links: Ref<any[]> = ref([{to: '/', text: 'Accueil'}, {
  to: '/situation/recherche',
  text: `Quelle est la situation de ma commune ?`
}, {text: 'Votre adresse'}]);

const badgeLabel = computed<string>(() => {
  return utils.getSituationBadgeLabel(utils.getRestrictionRank(props.restriction));
});

const situationLabel = computed<string>(() => {
  return utils.getSituationLabel(utils.getRestrictionRank(props.restriction))
});

const dateArrete = computed<string | null>(() => {
  if (!props.restriction.arrete?.dateDebutValidite) {
    return null;
  }
  return new Date(props.restriction.arrete.dateDebutValidite).toLocaleDateString('fr-FR');
});

</script>

<template>
  <div class="situation-status-header fr-grid-row fr-pb-4w"
       :class="'situation-level-' + utils.getRestrictionRank(restriction)">
    <div class="fr-col-12">
      <DsfrBreadcrumb :links='links'/>
    </div>
    <div class="fr-col-12 fr-col-md-6">
      <DsfrBadge small
                 class="fr-mb-2w"
                 :class="'situation-level-' + utils.getRestrictionRank(restriction)"
                 type="error"
                 :label="badgeLabel"/>
      <div class="fr-mb-2w">
        <span class="fr-icon-map-pin-user-line fr-mr-1w" aria-hidden="true"></span>
        {{ address?.properties.label }}
      </div>
      <h3>Votre territoire est actuellement <span :class="'situation-level-c-' + utils.getRestrictionRank(restriction)">{{
          situationLabel
        }}</span></h3>
      <div v-if="dateArrete">Arrêté en date du {{ dateArrete }}</div>
      <div>Le respect des restrictions <b>est obligatoire</b> sous peine de recevoir une <b>amende</b> de 1 000 000€</div>
    </div>
    <div class="fr-col-12 fr-col-md-6 button-wrapper">
      <DsfrButton label="Télécharger l'arrêté préfectoral"/>
    </div>
  </div>
</template>

<style lang="scss">
.situation-status-header {
  max-width: 1000px;
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
    z-index: -1;
  }

  &.situation-level {
    &-4:before {
      background: linear-gradient(270deg, var(--pink-macaron-925-125), var(--pink-macaron-850-200));
      opacity: 0.5;
    }

    &-3:before {
      background: linear-gradient(270deg, var(--yellow-tournesol-975-75), var(--pink-macaron-925-125));
      opacity: 0.5;
    }

    &-2:before {
      background: linear-gradient(270deg, var(--yellow-moutarde-975-75), var(--yellow-moutarde-950-100));
      opacity: 0.3;
    }

    &-1:before {
      background: linear-gradient(270deg, var(--blue-ecume-975-75), var(--orange-terre-battue-950-100));
      opacity: 0.5;
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