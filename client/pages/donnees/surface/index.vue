<script setup lang="ts">
import { Ref } from 'vue';

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
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <h1>Évolution journalière du pourcentage de la surface concernée par des niveaux de gravité</h1>
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