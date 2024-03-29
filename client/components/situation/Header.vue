<script setup lang="ts">
import utils from "../../utils";
import { Zone } from "../../dto/zone.dto";
import { Ref } from "vue";
import { useAddressStore } from "../../store/address";

const props = defineProps<{
  zone: Zone
  address: string
}>();

const adressStore = useAddressStore();
const {isParticulier} = adressStore;
const links: Ref<any[]> = ref([{to: '/', text: 'Accueil'}, {text: 'Votre situation'}]);
const modalOpened: Ref<boolean> = ref(false);
const restrictionRanks = [1, 2, 3, 4];

const badgeLabel = (rank: number | undefined, showRank: boolean = false) => {
  return showRank ? utils.getSituationBadgeLabel(rank) : utils.getShortSituationLabel(rank);
};

const classObject = (rank: number | undefined): any => {
  const bgClass = `situation-level-bg-${rank}`;
  const colorClass = `situation-level-c-${rank}`;
  const cssClass: any = {
    'situation-disabled': utils.getRestrictionRank(props.zone?.niveauAlerte) !== rank
  }
  cssClass[bgClass] = true;
  cssClass[colorClass] = utils.getRestrictionRank(props.zone?.niveauAlerte) !== rank;
  return cssClass;
}

const situationLabel = computed<string>(() => {
  return utils.getShortSituationLabel(utils.getRestrictionRank(props.zone?.niveauAlerte))
});
</script>

<template>
  <div class="situation-status-header fr-grid-row fr-pb-4w"
       :class="'situation-level-' + utils.getRestrictionRank(zone?.niveauAlerte)">
    <div class="fr-col-12">
      <DsfrBreadcrumb :links='links'/>
    </div>
    <div class="fr-col-12 situation-status-header__info-wrapper"
         :class="!zone?.idZone ? 'fr-col-md-8' : ''">
      <div class="fr-grid-row fr-grid-row--middle fr-mb-2w"
           v-if="zone?.idZone">
        <DsfrBadge small
                   class="show-sm"
                   no-icon
                   :class="classObject(utils.getRestrictionRank(zone?.niveauAlerte))"
                   :label="badgeLabel(utils.getRestrictionRank(zone?.niveauAlerte))"/>
        <DsfrBadge v-for="rank of restrictionRanks"
                   small
                   no-icon
                   class="fr-ml-1w hide-sm"
                   :class="classObject(rank)"
                   :label="badgeLabel(rank)"/>
        <DsfrButton icon="ri-information-fill"
                    label="Information sur les niveaux d'alerte"
                    icon-only
                    tertiary
                    size="small"
                    @click="modalOpened = true"
                    no-outline/>
      </div>
      <div class="fr-mb-2w">
        <VIcon name="ri-map-pin-user-line"/>
        {{ address }}
      </div>
      <h1 v-if="zone?.idZone" class="h2">Vous êtes sur une zone en <span
        :class="'situation-level-c-' + utils.getRestrictionRank(zone?.niveauAlerte)">{{
          situationLabel
        }}</span></h1>
      <h1 class="h2" v-else>
        Vous êtes sur une zone qui n'est <span class="situation-level-c-0">pas concernée par des restrictions</span>
      </h1>
    </div>
    <div class="fr-col-12 situation-status-header__info-wrapper"
         v-if="utils.showRestrictions(zone)">
      <div>Le respect des restrictions <b>est obligatoire</b> sous peine de recevoir une <b>amende</b> de 1500€</div>
    </div>
    <div class="fr-col-12 fr-col-md-8 situation-status-header__info-wrapper" v-else>
      <div v-if="!zone?.idZone">
        Aucune restriction n'est à appliquer à votre adresse.
        <template v-if="isParticulier()">Nous vous conseillons tout de même de suivre les eco-gestes ci-dessous.</template>
      </div>
      <div v-else>
        L’état de la ressource en eau appelle à la vigilance de chacun.
        <template v-if="isParticulier()"> Nous vous conseillons de suivre les eco-gestes ci-dessous.</template>
        <br/>
        Chaque geste compte pour économiser l’eau.
      </div>
    </div>
    <div class="fr-col-12 show-sm text-align-center fr-mt-2w">
      <router-link to="/"
                   class="fr-btn fr-btn--secondary full-width fr-grid-row--center">
        Effectuer une nouvelle recherche
        <VIcon class="fr-ml-1w" name="ri-search-line"/>
      </router-link>
      <DsfrButton class="full-width fr-mt-1w fr-grid-row--center"
                  secondary
                  @click="utils.openTally">
        Donner mon avis
        <VIcon class="fr-ml-1w" name="ri-survey-line"/>
      </DsfrButton>
    </div>
    <div class="fr-col-12 fr-mt-2w">
      <MixinsShare :situationLabel="situationLabel" :address="address"/>
    </div>
  </div>
  <DsfrModal :opened="modalOpened"
             title="Signification des niveaux d'alerte"
             icon="ri-information-line"
             @close="modalOpened = false">
    <MixinsSignificationNiveauxAlerte/>
  </DsfrModal>
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

    &-0:before {
      background: linear-gradient(270deg, var(--info-950-100), var(--blue-france-975-75));
    }
  }

  .situation-disabled {
    background-color: var(--grey-1000-50);
  }

  h1 {
    span {
      text-transform: lowercase;
    }
  }

  &__btn-wrapper {
    text-align: right;
  }
}

@media screen and (max-width: 767px) {
  .situation-status-header {
    &__btn-wrapper, &__info-wrapper {
      text-align: center;
    }

    &__info-wrapper .fr-grid-row {
      justify-content: center;
    }
  }
}
</style>