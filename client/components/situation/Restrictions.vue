<script setup lang="ts">
import { Ref } from 'vue';
import { TagProps } from '@gouvminint/vue-dsfr/types/components/DsfrTag/DsfrTag.vue';
import { Zone } from '../../dto/zone.dto';
import { Usage } from '~/client/dto/usage.dto';

const props = defineProps<{
  zone: Zone,
  profile: string
}>();

const selectedTagIndex: Ref<number> = ref(0);
// const expandedIndex: Ref<string | null> = ref(props.zones.length > 1 ? null : '0');
const thematiqueTags: Ref<TagProps[]> = ref([{
  label: 'Arroser',
  icone: 'eau-goutte-arrosoir-interdiction',
}, {
  label: 'Remplir ou vidanger',
  icone: 'eau-goutte-piscine-interdiction',
}, {
  label: 'Nettoyer',
  icone: 'eau-goutte-nettoyage-interdiction',
}, {
  label: 'Alimenter des fontaines et autres usages de loisirs',
  icone: 'eau-goutte-fontaine-interdiction',
}, {
  label: 'Irriguer',
  icone: 'eau-goutte-remplissage-interdiction',
}, {
  label: 'Travaux et activités en cours d\'eau',
  icone: 'eau-goutte-travaux-interdiction',
}, {
  label: 'Abreuver',
  icone: 'eau-goutte-abreuvement-interdiction',
}, {
  label: 'Prélever',
  icone: 'eau-goutte-canaux-interdiction',
}, {
  label: 'ICPE',
  icone: 'eau-goutte-robinet-interdiction',
}, {
  label: 'Activités économiques',
  icone: 'eau-goutte-robinet-interdiction',
}, {
  label: 'Ouvrages hydrauliques',
  icone: 'eau-goutte-robinet-interdiction',
}, {
  label: 'Sécurité incendie',
  icone: 'eau-goutte-robinet-interdiction',
}, {
  label: 'Rejeter',
  icone: 'eau-goutte-robinet-interdiction',
}, {
  label: 'Installations de production d\'électricité',
  icone: 'eau-goutte-robinet-interdiction',
}]);

const thematiqueTagsFiltered = computed<TagProps[]>(() => {
  return thematiqueTags.value.filter(t => props.zone.usages.findIndex(u => u.thematique === t.label) >= 0);
});

const usagesFiltered = (zone: Zone): Usage[] => {
  return props.zone.usages.filter(u => u.thematique === thematiqueTagsFiltered.value[selectedTagIndex.value].label);
};

const title = computed<string>(() => {
  switch (props.profile) {
    case 'exploitation':
      return `En tant qu'agriculteur, ai-je des restrictions pour ?`;
    case 'collectivite':
      return `En tant que collectivité, ai-je des restrictions pour ?`;
    case 'entreprise':
      return `En tant qu'entreprise, ai-je des restrictions pour ?`;
    case 'particulier':
    default:
      return `En tant que particulier, ai-je des restrictions pour ?`;
  }
});
</script>

<template>
  <div class="fr-grid-row fr-grid-row--center fr-pt-8w">
    <h2 class="fr-container text-align-center">{{ title }}</h2>
    <div class="fr-col-12 fr-grid-row fr-grid-row fr-grid-row--gutters fr-grid-row--center">
      <div class="fr-container text-align-center fr-mb-2w">
        <DsfrTag v-for="(thematique, index) in thematiqueTagsFiltered"
                 :label="thematique.label"
                 class="fr-m-1w no-checkmark tag-lg"
                 :aria-pressed="selectedTagIndex === index"
                 @click="selectedTagIndex = index"
                 tag-name="button" />
      </div>
      <div class="restriction full-width">
        <div class="fr-container">
          <DsfrTabs class="tabs-light">
            <DsfrTabContent v-for="(thematique, index) in thematiqueTagsFiltered"
                            :selected="selectedTagIndex === index">
              <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-p-2w">
                <template v-if="usagesFiltered(zone).length > 0">
                  <div v-for="usage in usagesFiltered(zone)"
                       class="fr-col-12 fr-col-md-4">
                    <SituationRestrictionCard :usage="usage"
                                              :thematique="thematique"
                                              :departement="zone.departement" />
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
            </DsfrTabContent>
          </DsfrTabs>
          <div class="fr-grid-row fr-grid-row--center">
            <b>Le respect des restrictions est obligatoire sous peine de recevoir une amende de 1500€</b>
            <div class="fr-mt-4w">
              <DsfrHighlight>
                <b>Besoin de précision sur les restrictions ?</b><br />
                Merci de consulter <a class="fr-link"
                                      :href="zone.arrete.cheminFichier"
                                      onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE', 'PROFIL', 'particulier', 1])"
                                      target="_blank"
                                      rel="noopener">
                l'arrêté de restriction</a> et de consulter <a class="fr-link"
                                                               :href="zone.arrete.cheminFichierArreteCadre"
                                                               onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE CADRE', 'PROFIL', 'particulier', 1])"
                                                               target="_blank"
                                                               rel="noopener">
                l'arrêté cadre préfectoral</a>.
              </DsfrHighlight>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.fr-tabs {
  width: 100%;
}

.restriction {
  background: var(--background-alt-blue-france);
}

.fr-highlight {
  text-align: left;
}
</style>