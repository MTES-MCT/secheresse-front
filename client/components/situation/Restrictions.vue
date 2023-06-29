<script setup lang="ts">
import { Ref } from "vue";
import { TagProps } from "@gouvminint/vue-dsfr/types/components/DsfrTag/DsfrTag.vue";
import { Restriction } from "../../dto/restriction.dto";

const props = defineProps<{
  restrictions: Restriction[]
}>()

const selectedTagIndex: Ref<number> = ref(0);
const thematiqueTags: Ref<TagProps[]> = ref([{
  label: 'Arroser',
  thematique: 'Arrosage',
}, {
  label: 'Remplir ou vidanger',
  thematique: 'Remplissage vidange',
}, {
  label: 'Nettoyer',
  thematique: 'Nettoyage',
}, {
  label: 'Alimenter des fontaines',
  thematique: 'Alimentation des fontaines publiques et privées',
}, {
  label: 'Irriguer',
  thematique: 'Irrigation'
}, {
  label: 'Effectuer des travaux',
  thematique: 'Travaux en cours d’eau'
}, {
  label: 'Abreuver',
  thematique: 'Abreuvement'
}, {
  label: 'Naviguer',
  thematique: 'Navigation fluviale'
}, {
  label: 'Prélever',
  thematique: 'Prélèvement en canaux'
}, {
  label: 'ICPE',
  thematique: 'ICPE'
}, {
  label: 'Installations de production d`\'électricité d\'origine nucléaire, hydraulique, et thermique à flamme',
  thematique: 'Installations de production d\'électricité d\'origine nucléaire, hydraulique, et thermique à flamme'
}]);

const thematiqueTagsFiltered = computed<TagProps[]>(() => {
  let usages = props.restrictions[0].usages;
  return thematiqueTags.value.filter(t => usages.findIndex(u => u.thematique === t.thematique) >= 0);
});

const title = computed<string>(() => {
  switch (props.restrictions[0].profil) {
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
            <SituationRestrictionCategorie :thematique="thematique.thematique"
                                           :restrictions="restrictions"
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