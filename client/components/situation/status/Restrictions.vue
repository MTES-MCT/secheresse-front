<script setup lang="ts">
import { Ref } from "vue";
import restrictions from '../../../data/restrictions.json';
import { TagProps } from "@gouvminint/vue-dsfr/types/components/DsfrTag/DsfrTag.vue";

const selectedTagIndex: Ref<number> = ref(0);
const restrictionTags: Ref<TagProps[]> = ref([{
  label: "Arroser",
  thematique: "Arrosage"
}, {
  label: "Remplir",
  thematique: "Piscine"
}, {
  label: "Nettoyer",
  thematique: "Nettoyage"
}, {
  label: "Alimenter des fontaines publiques ou privées",
  thematique: "Fontaines"
}, {
  label: "Prélever en canaux",
  thematique: "Irrigation"
}, {
  label: "Effectuer des travaux",
  thematique: "Travaux"
}]);

const restrictionsFiltered = (tag: any) => {
  return restrictions.data.filter(l => l.thematique === tag.thematique);
};
</script>

<template>
  <div class="fr-grid-row fr-grid-row--center fr-pt-8w fr-pb-8w">
    <h4>Est-ce que je peux ?</h4>
    <div class="fr-col-12 fr-grid-row fr-grid-row fr-grid-row--gutters fr-grid-row--center">
      <DsfrTag v-for="(tag, index) in restrictionTags"
               :label="tag.label"
               class="fr-m-1w"
               :selected="selectedTagIndex === index"
               @click="selectedTagIndex = index"
               tag-name="button"/>
      <DsfrTabs class="tabs-light">
        <DsfrTabContent v-for="(tag, index) in restrictionTags"
                        :selected="selectedTagIndex === index">
          <div class="fr-grid-row fr-grid-row fr-grid-row--gutters fr-grid-row--center">
            <SituationStatusRestrictionCard v-for="restriction in restrictionsFiltered(tag)"
                                            :restriction="restriction"
            />
          </div>
        </DsfrTabContent>
      </DsfrTabs>
    </div>
  </div>
</template>

<style lang="scss">
.fr-tabs {
  width: 100%;
}
</style>