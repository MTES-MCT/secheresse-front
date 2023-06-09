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

const links: Ref<any[]> = ref([{to: '/', text: 'Accueil'}, {
  to: '/situation/recherche',
  text: `Quelles sont les restrictions qui me concernent ?`
}, {text: 'Votre adresse'}]);

const badgeLabel = computed<string>(() => {
  return utils.getSituationLabel(utils.getRestrictionRank(restriction.value));
});

const situationLabel = computed<string>(() => {
  return utils.getShortSituationLabel(utils.getRestrictionRank(restriction.value))
});

const dateArrete = computed<string | null>(() => {
  if (!restriction.value.arrete?.dateDebutValidite) {
    return null;
  }
  return new Date(restriction.value.arrete.dateDebutValidite).toLocaleDateString('fr-FR');
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
    <div class="fr-col-12 fr-col-md-6 situation-status-header__info-wrapper">
      <DsfrBadge small
                 class="fr-mb-2w"
                 :class="'situation-level-' + utils.getRestrictionRank(restriction)"
                 type=""
                 :label="badgeLabel"/>
      <div class="fr-mb-2w">
        <span class="fr-icon-map-pin-user-line fr-mr-1w" aria-hidden="true"></span>
        {{ address }}
      </div>
      <h3>Votre êtes sur une zone en <span :class="'situation-level-c-' + utils.getRestrictionRank(restriction)">{{
          situationLabel
        }}</span></h3>
      <div v-if="dateArrete">Arrêté en date du {{ dateArrete }}</div>
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