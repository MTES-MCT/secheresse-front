<script setup lang="ts">
import { Ref } from 'vue';
import { Zone } from '../../dto/zone.dto';
import { Usage } from '~/client/dto/usage.dto';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  usages: Usage[],
  zone: Zone,
  profile: string
}>();

const selectedTagIndex: Ref<number> = ref(0);
const thematiqueTags: Ref<TagProps[]> = ref([{
  label: 'Arroser',
  icon: 'eau-goutte-arrosoir-interdiction',
}, {
  label: 'Remplir ou vidanger',
  icon: 'eau-goutte-piscine-interdiction',
}, {
  label: 'Nettoyer',
  icon: 'eau-goutte-nettoyage-interdiction',
}, {
  label: 'Alimenter des fontaines et autres usages de loisirs',
  icon: 'eau-goutte-fontaine-interdiction',
}, {
  label: 'Irriguer',
  icon: 'eau-goutte-remplissage-interdiction',
}, {
  label: 'Travaux et activités en cours d\'eau',
  icon: 'eau-goutte-travaux-interdiction',
}, {
  label: 'Abreuver',
  icon: 'eau-goutte-abreuvement-interdiction',
}, {
  label: 'Prélever',
  icon: 'eau-goutte-canaux-interdiction',
}, {
  label: 'ICPE',
  icon: 'eau-goutte-robinet-interdiction',
}, {
  label: 'Activités économiques',
  icon: 'eau-goutte-robinet-interdiction',
}, {
  label: 'Ouvrages hydrauliques',
  icon: 'eau-goutte-robinet-interdiction',
}, {
  label: 'Sécurité incendie',
  icon: 'eau-goutte-robinet-interdiction',
}, {
  label: 'Rejeter',
  icon: 'eau-goutte-robinet-interdiction',
}, {
  label: 'Installations de production d\'électricité',
  icon: 'eau-goutte-robinet-interdiction',
}]);

const thematiqueTagsFiltered = computed<TagProps[]>(() => {
  return thematiqueTags.value.filter(t => props.usages.findIndex(u => u.thematique === t.label) >= 0);
});

const usagesFiltered = (thematique: string): Usage[] => {
  return props.usages.filter(u => u.thematique === thematique.label);
};

const activeAccordion = ref<number>();

watch(() => props.profile, () => {
  selectedTagIndex.value = 0;
});
</script>

<template>
  <div class="fr-container fr-grid-row fr-grid-row--center fr-pt-4w">
    <h2 class="text-align-center">Détails des restrictions</h2>
    <div v-if="thematiqueTagsFiltered.length > 0" class="fr-col-12 text-align-center fr-mb-2w">
      Le respect des restrictions est obligatoire sous peine de recevoir une amende de 1500€
    </div>
    <DsfrAccordionsGroup v-model="activeAccordion" class="full-width show-sm">
      <template v-for="(thematique, index) in thematiqueTagsFiltered">
        <DsfrAccordion :title="thematique.label"
                       titleTag="h4"
                       :id="index.toString()">
          <template v-if="usagesFiltered(thematique).length > 0">
            <div class="fr-grid-row fr-grid-row--gutters">
              <div v-for="usage in usagesFiltered(thematique)"
                   class="fr-col-12">
                <SituationRestrictionCard :usage="usage"
                                          :thematique="thematique"
                                          :departement="zone.departement" />
              </div>
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
        </DsfrAccordion>
      </template>
    </DsfrAccordionsGroup>
    <div class="hide-sm fr-col-12 fr-grid-row fr-grid-row fr-grid-row--gutters fr-grid-row--center">
      <div class="text-align-center fr-mb-2w">
        <DsfrTag v-for="(thematique, index) in thematiqueTagsFiltered"
                 class="fr-m-1w no-checkmark tag-lg"
                 :aria-pressed="selectedTagIndex === index"
                 @click="selectedTagIndex = index"
                 tag-name="button">
          <Icon :icon="'vigieau:' + thematique.icon" class="fr-mr-1w" />
          {{ thematique.label }}
        </DsfrTag>
      </div>
      <div class="restriction full-width">
        <DsfrTabs class="tabs-light"
                  v-model="selectedTagIndex">
          <DsfrTabContent v-for="(thematique, index) in thematiqueTagsFiltered"
                          :panel-id="'tab-content-' + index"
                          :tab-id="'tab-' + index">
            <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-pb-2w">
              <template v-if="usagesFiltered(thematique).length > 0">
                <div v-for="usage in usagesFiltered(thematique)"
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
      </div>
    </div>

    <div v-if="thematiqueTagsFiltered.length === 0"
         class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-p-2w">
      <div class="fr-col-12 fr-col-md-4">
        <div class="eau-card fr-p-2w">
          <div class="eau-card__desc">
            Aucune restriction
          </div>
        </div>
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-my-2w">
        <DsfrCallout>
          <b>Besoin de précision sur les restrictions ?</b><br />
          <b>La zone d’alerte concernée par votre est adresse est {{ zone.nom }}</b><br />
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
          <br /><br />
          Votre mairie a pu renforcer ces restrictions, pensez à la consulter.
        </DsfrCallout>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.fr-tabs {
  width: 100%;
}

.fr-highlight {
  text-align: left;
}
</style>