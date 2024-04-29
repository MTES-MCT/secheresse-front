<script setup lang="ts">
import utils from '../../utils';
import { Zone } from '../../dto/zone.dto';
import { Ref } from 'vue';
import { useAddressStore } from '../../store/address';
import niveauxGravite from '../../dto/niveauGravite';

const props = defineProps<{
  typeEau: 'AEP' | 'SUP' | 'SOU',
  zone: Zone
  address: string
}>();

const adressStore = useAddressStore();
const { isParticulier } = adressStore;
const modalOpened: Ref<boolean> = ref(false);

const badgeLabel = (rank: number | undefined, showRank: boolean = false) => {
  return showRank ? utils.getSituationBadgeLabel(rank) : utils.getShortSituationLabel(rank);
};

const classObject = (rank: number | undefined): any => {
  const bgClass = `situation-level-bg-${rank}`;
  const colorClass = `situation-level-c-${rank}`;
  const cssClass: any = {
    'situation-disabled': utils.getRestrictionRank(props.zone?.niveauGravite) !== rank,
  };
  cssClass[bgClass] = true;
  cssClass[colorClass] = utils.getRestrictionRank(props.zone?.niveauGravite) !== rank;
  return cssClass;
};

const situationLabel = computed<string>(() => {
  return utils.getShortSituationLabel(utils.getRestrictionRank(props.zone?.niveauGravite));
});

const typeEauLabel = computed(() => {
  switch (props.typeEau) {
    case 'AEP':
      return 'L\'eau potable';
    case 'SUP':
      return 'L\'eau prélevée dans les cours d\'eau';
    case 'SOU':
      return 'L\'eau prélevée dans les nappes';
  }
});
const niveauGravite = computed(() => {
  return niveauxGravite.find(n => n.niveauGravite === (props.zone ? props.zone?.niveauGravite : null));
});
</script>

<template>
  <div class="situation-status-header fr-container fr-grid-row fr-py-4w"
       :class="'situation-level-' + utils.getRestrictionRank(zone?.niveauGravite)">
    <div class="fr-col-12 situation-status-header__info-wrapper"
         :class="!zone?.id ? 'fr-col-md-8' : ''">
      <div class="fr-mb-2w fr-grid-row fr-grid-row--middle">
        <DsfrBadge small
                   no-icon
                   :class="classObject(utils.getRestrictionRank(zone?.niveauGravite))"
                   :label="badgeLabel(utils.getRestrictionRank(zone?.niveauGravite))" />
        <VIcon class="fr-mx-1w" name="ri-map-pin-user-line" />
        {{ address }}
      </div>
      <h1 v-if="zone?.id" class="h2">{{ typeEauLabel }} est en <span
        :class="'situation-level-c-' + utils.getRestrictionRank(zone?.niveauGravite)">{{
          situationLabel
        }}</span> à votre adresse.</h1>
      <h1 class="h2" v-else>
        {{ typeEauLabel }} n'est <span class="situation-level-c-0">pas concernée par des restrictions</span> à votre adresse.
      </h1>
    </div>
    <div class="fr-col-12 situation-status-header__info-wrapper">
      {{ niveauGravite.description }}
    </div>
    <div v-if="!utils.showRestrictions(zone) && isParticulier()" class="fr-col-12 fr-col-md-8 situation-status-header__info-wrapper">
      Nous vous conseillons tout de même de suivre les eco-gestes ci-dessous.
    </div>
    <div class="fr-col-12 show-sm text-align-center fr-mt-2w">
      <router-link to="/"
                   class="fr-btn fr-btn--secondary full-width fr-grid-row--center">
        Effectuer une nouvelle recherche
        <VIcon class="fr-ml-1w" name="ri-search-line" />
      </router-link>
      <DsfrButton class="full-width fr-mt-1w fr-grid-row--center"
                  secondary
                  @click="utils.openTally">
        Donner mon avis
        <VIcon class="fr-ml-1w" name="ri-survey-line" />
      </DsfrButton>
    </div>
    <div class="fr-col-12 fr-mt-2w">
      <MixinsShare :situationLabel="situationLabel" :address="address" />
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