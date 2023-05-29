<script setup lang="ts">
import { Ref } from "vue";
import { TagProps } from "@gouvminint/vue-dsfr/types/components/DsfrTag/DsfrTag.vue";
import { Restriction } from "../../../dto/restriction.dto";

const props = defineProps<{
  restriction: Restriction
}>()

const selectedTagIndex: Ref<number> = ref(0);
const thematiqueTags: Ref<TagProps[]> = ref([{
  label: "Arroser",
  thematique: "Arrosage"
}, {
  label: "Remplir",
  thematique: "Remplissage vidange"
}, {
  label: "Nettoyer",
  thematique: "Nettoyage"
}, {
  label: "Alimenter des fontaines publiques ou privées",
  thematique: "Alimentation des fontaines publiques et privées"
}, {
  label: "Prélever en canaux",
  thematique: "Irrigation"
}, {
  label: "Effectuer des travaux",
  thematique: "Travaux en cours d’eau"
}, {
  label: "Abreuvement",
  thematique: "Abreuvement"
}]);

const thematiqueTagsFiltered = computed<TagProps[]>(() => {
  return thematiqueTags.value.filter(t => props.restriction.usages.findIndex(u => u.thematique === t.thematique) >= 0);
});

const usagesFiltered = (thematique: any) => {
  return props.restriction.usages.filter(u => u.thematique === thematique.thematique);
};
</script>

<template>
  <div class="fr-grid-row fr-grid-row--center fr-pt-8w fr-pb-8w">
    <h4>Est-ce que je peux ?</h4>
    <div class="fr-col-12 fr-grid-row fr-grid-row fr-grid-row--gutters fr-grid-row--center">
      <DsfrTag v-for="(thematique, index) in thematiqueTagsFiltered"
               :label="thematique.label"
               class="fr-m-1w"
               :selected="selectedTagIndex === index"
               @click="selectedTagIndex = index"
               tag-name="button"/>
      <DsfrTabs class="tabs-light">
        <DsfrTabContent v-for="(thematique, index) in thematiqueTagsFiltered"
                        :selected="selectedTagIndex === index">
          <div class="fr-grid-row fr-grid-row fr-grid-row--gutters fr-grid-row--center">
            <SituationStatusRestrictionCard v-for="usage in usagesFiltered(thematique)"
                                            :usage="usage"
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