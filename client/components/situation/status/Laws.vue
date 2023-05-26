<script setup lang="ts">
import { Ref } from "vue";
import laws from '../../../data/laws.json';
import { TagProps } from "@gouvminint/vue-dsfr/types/components/DsfrTag/DsfrTag.vue";

const selectedTagIndex: Ref<number> = ref(0);
const lawTags: Ref<TagProps[]> = ref([{
  label: "Arroser",
  tagName: "button",
  selected: true
}, {
  label: "Remplir",
  tagName: "button",
  selected: false
}, {
  label: "Nettoyer",
  tagName: "button",
  selected: false
}, {
  label: "Alimenter des fontaines publiques ou privées",
  tagName: "button",
  selected: false
}, {
  label: "Prélever en canaux",
  tagName: "button",
  selected: false
}, {
  label: "Effectuer des travaux",
  tagName: "button",
  selected: false
}]);

const lawsFiltered = computed<any>(() => {
  return laws.data.filter(l => true);
});
</script>

<template>
  <div class="fr-grid-row fr-grid-row--center fr-pt-8w fr-pb-8w">
    <h4>Est-ce que je peux ?</h4>
    <div class="fr-col-12 fr-grid-row fr-grid-row fr-grid-row--gutters fr-grid-row--center">
      <DsfrTag v-for="(tag, index) in lawTags"
               :label="tag.label"
               class="fr-m-1w"
               :selected="selectedTagIndex === index"
               @click="selectedTagIndex = index"
               tag-name="button"/>
      <SituationStatusLawCard v-for="law in lawsFiltered"
                              :law="law"
      />
    </div>
  </div>
</template>

<style lang="scss">
.fr-tabs {
  width: 100%;
}
</style>