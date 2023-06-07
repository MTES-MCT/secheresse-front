<script setup lang="ts">
import { Ref } from "vue";
import { TagProps } from "@gouvminint/vue-dsfr/types/components/DsfrTag/DsfrTag.vue";
import { Restriction } from "../../../dto/restriction.dto";

const props = defineProps<{
  restrictions: Restriction[]
}>()

const selectedTagIndex: Ref<number> = ref(0);
const thematiqueTags: Ref<TagProps[]> = ref([{
  label: "Arroser",
  thematique: "Arrosage"
}, {
  label: "Remplir ou vidanger sa piscine",
  thematique: "Remplissage vidange"
}, {
  label: "Nettoyer",
  thematique: "Nettoyage"
}, {
  label: "Alimenter des fontaines",
  thematique: "Alimentation des fontaines publiques et privées"
}, {
  label: "Irriguer",
  thematique: "Irrigation"
}, {
  label: "Effectuer des travaux",
  thematique: "Travaux en cours d’eau"
}, {
  label: "Abreuver",
  thematique: "Abreuvement"
}, {
  label: "Naviguer",
  thematique: "Navigation fluviale"
}, {
  label: "Prélèver en canaux",
  thematique: "Prélèvement en canaux"
}, {
  label: "ICPE",
  thematique: "ICPE"
}, {
  label: "Installations de production d'électricité d'origine nucléaire, hydraulique, et thermique à flamme",
  thematique: "Installations de production d'électricité d'origine nucléaire, hydraulique, et thermique à flamme"
}]);

const thematiqueTagsFiltered = computed<TagProps[]>(() => {
  let usages = [];
  props.restrictions.forEach(r => usages = usages.concat(r.usages));
  return thematiqueTags.value.filter(t => usages.findIndex(u => u.thematique === t.thematique) >= 0);
});

const sameUsages = computed<boolean>(() => {
  if (!props.restrictions[0].usagesHash) {
    return false;
  }
  const usagesHash = props.restrictions[0].usagesHash;
  return props.restrictions.every(r => r.usagesHash === usagesHash);
});
</script>

<template>
  <div class="fr-grid-row fr-grid-row--center fr-pt-8w full-width">
    <h4>Est-ce que je peux ?</h4>
    <div class="fr-mb-4w" v-if="restrictions.length > 1 && !sameUsages">
      Votre approvisionnement en eau provient de deux sources différentes : l'eau de surface (rivières, lacs) et les nappes souterraines,
      qui peuvent être impactées différemment par la sécheresse. D’autre part, l’eau sur votre commune prend sa source dans différents
      bassins versants. Or le niveau d'eau d'un bassin versant à un autre est différent, raison pour laquelle les restrictions sont
      susceptibles d’être différentes en fonction de là où vous habitez sur la commune. Il est important d'adopter une utilisation
      responsable de l'eau en tenant compte de ces spécificités.
    </div>
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
          <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
            <template v-if="restrictions.length > 1 && !sameUsages">
              <SituationStatusRestrictionCardWaterType v-for="restriction in restrictions"
                                                       :thematique="thematique.thematique"
                                                       :restriction="restriction"
                                                       :light="false"
              />
            </template>
            <template v-else>
              <SituationStatusRestrictionCardWaterType :thematique="thematique.thematique"
                                                       :restriction="restrictions[0]"
                                                       :light="true"
              />
            </template>
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