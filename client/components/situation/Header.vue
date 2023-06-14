<script setup lang="ts">
import utils from "../../utils";
import { Restriction } from "../../dto/restriction.dto";
import { Ref } from "vue";
import { Arrete } from "../../dto/arrete.dto";

const props = defineProps<{
  restrictions: Restriction[]
  address: string
}>();
let restriction: Ref<Restriction> = ref();

const links: Ref<any[]> = ref([{to: '/', text: 'Accueil'}, {text: 'Votre situation'}]);
const restrictionRanks = [1, 2, 3, 4];

const badgeLabel = (rank: number | undefined, showRank: boolean = false) => {
  return showRank ? utils.getSituationBadgeLabel(rank) : utils.getSituationLabel(rank);
};

const classObject = (rank: number | undefined): any => {
  const colorClass = `situation-level-c-${rank}`;
  const bgClass = `situation-level-bg-${rank}`;
  const cssClass: any = {
    'situation-disabled': utils.getRestrictionRank(restriction.value) !== rank
  }
  cssClass[colorClass] = true;
  cssClass[bgClass] = true;
  return cssClass;
}

const situationLabel = computed<string>(() => {
  return utils.getShortSituationLabel(utils.getRestrictionRank(restriction.value))
});

const arretes = computed<Arrete[]>(() => {
  return utils.getArretes(props.restrictions);
});

onMounted(() => {
  if (props.restrictions.length === 1) {
    restriction.value = props.restrictions[0];
  }
  const restrictionsSort = [...props.restrictions].sort((a, b) => utils.getRestrictionRank(b) - utils.getRestrictionRank(a));
  restriction.value = restrictionsSort[0];
})

</script>

<template>
  <div class="situation-status-header fr-grid-row fr-pb-4w"
       v-if="restriction"
       :class="'situation-level-' + utils.getRestrictionRank(restriction)">
    <div class="fr-col-12">
      <DsfrBreadcrumb :links='links'/>
    </div>
    <div class="fr-col-12 situation-status-header__info-wrapper">
      <DsfrBadge small
                 class="fr-mb-2w show-sm situation-no-background"
                 :class="classObject(utils.getRestrictionRank(restriction))"
                 :label="badgeLabel(utils.getRestrictionRank(restriction), true)"/>
      <DsfrBadge v-for="rank of restrictionRanks"
                 small
                 class="fr-mb-2w fr-ml-1w hide-sm situation-no-background"
                 :class="classObject(rank)"
                 :label="badgeLabel(rank)"/>
      <div class="fr-mb-2w">
        <VIcon name="ri-map-pin-user-line"/>
        {{ address }}
        <router-link to="/" class="fr-link fr-ml-1w hide-sm">
          Effectuer une nouvelle recherche
          <VIcon name="ri-search-line"/>
        </router-link>
      </div>
      <h3>Votre êtes sur une zone en <span :class="'situation-level-c-' + utils.getRestrictionRank(restriction)">{{
          situationLabel
        }}</span></h3>
    </div>
    <div class="fr-col-12 fr-col-md-6 situation-status-header__info-wrapper">
      <div>Le respect des restrictions <b>est obligatoire</b> sous peine de recevoir une <b>amende</b> de 1500€</div>
    </div>
    <div class="fr-col-12 fr-col-md-6 fr-grid-row fr-grid-row--bottom">
      <div class="fr-col-12 situation-status-header__btn-wrapper ">
        <div v-for="(a, index) in arretes">
          <a class="fr-btn fr-mt-1w"
             :href="a.cheminFichier"
             target="_blank"
             rel="noopener">
            Consulter l'arrêté préfectoral{{ arretes.length > 1 ? ` n°${index + 1}` : `` }}
          </a>
        </div>
      </div>
      <div class="fr-col-12 show-sm text-align-center fr-mt-2w">
        <router-link to="/" class="fr-link fr-ml-1w">
          Effectuer une nouvelle recherche
          <VIcon name="ri-search-line"/>
        </router-link>
      </div>
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

  .situation-disabled {
    color: var(--grey-925-125);
  }

  h3 span {
    text-transform: lowercase;
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
  }
}
</style>