<script setup lang="ts">
import { Ref } from "vue";
import { TagProps } from "@gouvminint/vue-dsfr/types/components/DsfrTag/DsfrTag.vue";
import { Restriction } from "../../dto/restriction.dto";

const props = defineProps<{
  restriction: Restriction
}>()

const selectedTagIndex: Ref<number> = ref(0);
const thematiqueTags: Ref<TagProps[]> = ref([{
  label: 'Arroser',
  thematique: 'Arrosage',
  icone: 'eau-goutte-arrosoir-interdiction'
}, {
  label: 'Remplir ou vidanger',
  thematique: 'Remplissage vidange',
  icone: 'eau-goutte-piscine-interdiction'
}, {
  label: 'Nettoyer',
  thematique: 'Nettoyage',
  icone: 'eau-goutte-nettoyage-interdiction'
}, {
  label: 'Alimenter des fontaines',
  thematique: 'Alimentation des fontaines publiques et privées',
  icone: 'eau-goutte-fontaine-interdiction'
}, {
  label: 'Irriguer',
  thematique: 'Irrigation',
  icone: 'eau-goutte-remplissage-interdiction'
}, {
  label: 'Effectuer des travaux',
  thematique: 'Travaux en cours d’eau',
  icone: 'eau-goutte-travaux-interdiction'
}, {
  label: 'Abreuver',
  thematique: 'Abreuvement',
  icone: 'eau-goutte-abreuvement-interdiction'
}, {
  label: 'Naviguer',
  thematique: 'Navigation fluviale',
  icone: 'eau-goutte-navigation-interdiction'
}, {
  label: 'Prélever',
  thematique: 'Prélèvement en canaux',
  icone: 'eau-goutte-canaux-interdiction'
}, {
  label: 'ICPE',
  thematique: 'ICPE',
  icone: 'eau-goutte-robinet-interdiction'
}, {
  label: 'Installations de production d`\'électricité d\'origine nucléaire, hydraulique, et thermique à flamme',
  thematique: 'Installations de production d\'électricité d\'origine nucléaire, hydraulique, et thermique à flamme',
  icone: 'eau-goutte-robinet-interdiction'
}]);

const thematiqueTagsFiltered = computed<TagProps[]>(() => {
  let usages = props.restriction.usages;
  return thematiqueTags.value.filter(t => usages.findIndex(u => u.thematique === t.thematique) >= 0);
});

const title = computed<string>(() => {
  switch (props.restriction.profil) {
    case 'exploitation':
      return `En tant qu'agriculteur, ai-je des restrictions pour ?`
    case 'collectivite':
      return `En tant que collectivité, ai-je des restrictions pour ?`
    case 'entreprise':
      return `En tant qu'entreprise, ai-je des restrictions pour ?`
    case 'particulier':
    default:
      return `En tant que particulier, ai-je des restrictions pour ?`
  }
});
</script>

<template>
  <div class="fr-grid-row fr-grid-row--center fr-pt-8w full-width">
    <h2 class="text-align-center">{{ title }}</h2>
    <div class="fr-col-12 fr-grid-row fr-grid-row fr-grid-row--gutters fr-grid-row--center">
      <DsfrTag v-for="(thematique, index) in thematiqueTagsFiltered"
               :label="thematique.label"
               class="fr-m-1w no-checkmark tag-lg"
               :selected="selectedTagIndex === index"
               @click="selectedTagIndex = index"
               tag-name="button"/>
      <DsfrTabs class="tabs-light">
        <DsfrTabContent v-for="(thematique, index) in thematiqueTagsFiltered"
                        :selected="selectedTagIndex === index">
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
            <SituationRestrictionCategorie :thematique="thematique"
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