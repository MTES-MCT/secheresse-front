<script setup lang="ts">
import { Ref } from 'vue';
import { useRefDataStore } from '../../../store/refData';

definePageMeta({
  layout: 'basic',
});

useHead({
  title: `Évolution surface - ${useRuntimeConfig().public.appName}`,
});

const links: Ref<any[]> = ref([{ to: '/', text: 'Accueil' }, {
  text: 'Données sécheresse',
  to: '/donnees',
}, { text: 'Évolution journalière du pourcentage de la surface concernée par des niveaux de gravité' }]);
const refDataStore = useRefDataStore();
await refDataStore.loadRefData();
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <h1>Évolution journalière du pourcentage de la surface concernée par des niveaux de gravité</h1>
    <DsfrAlert type="info" class="fr-mb-2w">
      Nous ne sommes pas en mesure de fournir les restrictions appliquées sur l'eau potable avant le 28/04/2024. Pour connaître les niveaux de restrictions en vigueur; veuillez vous référer aux niveaux de restrictions des eaux superficielles et souterraines.
    </DsfrAlert>
  </div>
  <div class="background-blue fr-py-2w">
    <div class="fr-container">
      <DonneesAreaChart />
    </div>
  </div>
</template>

<style lang="scss">
.background-blue {
  background-color: var(--blue-france-975-75);
}
</style>