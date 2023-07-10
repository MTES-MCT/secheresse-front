<script setup lang="ts">
import { Restriction } from "../../dto/restriction.dto";
import { Usage } from "~/client/dto/usage.dto";

const props = defineProps<{
  thematique: any,
  restriction: Restriction
}>();

const usagesFiltered = (restriction: Restriction): Usage[] => {
  return restriction.usages.filter(u => u.thematique === props.thematique.thematique);
};
</script>

<template>
  <div class="fr-col-12 fr-grid-row fr-grid-row--gutters fr-grid-row--center">
    <template v-if="usagesFiltered(restriction).length > 0">
      <div v-for="usage in usagesFiltered(restriction)"
           class="fr-col-12 fr-col-md-4">
        <SituationRestrictionCard :usage="usage"
                                  :thematique="thematique"
                                  :departement="restriction.departement"/>
      </div>
    </template>
    <template v-else>
      <div class="fr-col-12 fr-col-md-4">
        <div class="eau-card fr-p-2w">
          <div class="eau-card__desc">
            Aucune restriction
          </div>
        </div>
      </div>
    </template>
  </div>
</template>