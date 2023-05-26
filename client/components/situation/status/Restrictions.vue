<script setup lang="ts">
import { Ref } from "vue";
import restrictions from '../../../data/restrictions.json';
import { TagProps } from "@gouvminint/vue-dsfr/types/components/DsfrTag/DsfrTag.vue";

const selectedTagIndex: Ref<number> = ref(0);
const restrictionTags: Ref<TagProps[]> = ref([{
  label: "Arroser",
  tagName: "button",
  selected: true,
  thematique: "Arrosage"
}, {
  label: "Remplir",
  tagName: "button",
  selected: false,
  thematique: "Piscine"
}, {
  label: "Nettoyer",
  tagName: "button",
  selected: false,
  thematique: "Nettoyage"
}, {
  label: "Alimenter des fontaines publiques ou privées",
  tagName: "button",
  selected: false,
  thematique: "Fontaines"
}, {
  label: "Prélever en canaux",
  tagName: "button",
  selected: false,
  thematique: "Irrigation"
}, {
  label: "Effectuer des travaux",
  tagName: "button",
  selected: false,
  thematique: "Travaux"
}]);

const restrictionsFiltered = computed<any>(() => {
  return restrictions.data.filter(l => l.thematique === restrictionTags.value[selectedTagIndex.value].thematique);
});
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
      <SituationStatusRestrictionCard v-for="restriction in restrictionsFiltered"
                                      :restriction="restriction"
      />
    </div>
  </div>
</template>

<style lang="scss">
.fr-tabs {
  width: 100%;
}
</style>