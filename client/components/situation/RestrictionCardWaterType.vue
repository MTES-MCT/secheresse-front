<script setup lang="ts">
import { Restriction } from "../../dto/restriction.dto";
import utils from "../../utils";

const props = defineProps<{
  thematique: string,
  restriction: Restriction,
  light: boolean,
}>()

const cardTitle = computed((): string => {
  switch (props.restriction.type) {
    case 'SOU':
      return 'Par prélèvement en nappe d\'eau souterraine'
    case 'SUP':
      return 'Par pompage en cours d\'eau'
  }
});

const cardDesc = computed((): string => {
  switch (props.restriction.type) {
    case 'SOU':
      return 'Eau provenant des formations géologiques, aquifères'
    case 'SUP':
      return 'Eau provenant des rivières ou des lacs'
  }
});

const cardIcon = computed((): string => {
  switch (props.restriction.type) {
    case 'SOU':
      return 'eau-souterraine'
    case 'SUP':
      return 'eau-surface'
  }
});

const badgeLabel = computed<string>(() => {
  return `${utils.getRestrictionRank(props.restriction)}/4 ` + utils.getSituationLabel(utils.getRestrictionRank(props.restriction));
});

// const dateArrete = computed<string | null>(() => {
//   if (!props.restriction.arrete?.dateDebutValidite) {
//     return null;
//   }
//   return new Date(props.restriction.arrete.dateDebutValidite).toLocaleDateString('fr-FR');
// });

const usagesFiltered = () => {
  return props.restriction.usages.filter(u => u.thematique === props.thematique);
};
</script>

<template>
  <div class="fr-col-12 fr-col-md-6 wrapper-not-light" v-if="!light">
    <div class="eau-card eau-type-card fr-p-2w fr-grid-row">
      <div class="fr-col-10">
        <h6 class="eau-type-card__title fr-my-2w">
          {{ cardTitle }}
        </h6>
        <div>
          {{ cardDesc }}
        </div>
        <div>
          <DsfrBadge small
                     class="fr-mb-2w"
                     :class="'situation-level-' + utils.getRestrictionRank(restriction)"
                     type=""
                     :label="badgeLabel"/>
        </div>
      </div>
      <div class="eau-type-card__icon fr-col-2"
           :class="'situation-level-c-' + utils.getRestrictionRank(restriction)">
        <VIcon :name="cardIcon"/>
      </div>
    </div>
    <SituationRestrictionCard v-for="usage in usagesFiltered()"
                                    :usage="usage"
    />
  </div>
  <div class="fr-col-12 fr-grid-row fr-grid-row--gutters fr-grid-row--center" v-else>
    <div v-for="usage in usagesFiltered()"
         class="fr-col-12 fr-col-md-4 fr-col-lg-3">
      <SituationRestrictionCard :usage="usage"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.eau-type-card {
  background-color: var(--background-default-grey);

  &__icon {
    border-left: 1px var(--grey-950-100) solid;
    display: flex;
    align-items: center;
    justify-content: center;

    & > * {
      width: 80%;
      height: auto;
    }
  }
}

.wrapper-not-light {
  .eau-card:not(.eau-type-card) {
    border-top: none;
  }
}
</style>