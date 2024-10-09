<script setup lang="ts">
import { Ref } from 'vue';

definePageMeta({
  layout: 'basic',
});

useHead({
  title: `Évolution départements - ${useRuntimeConfig().public.appName}`,
});

const links: Ref<any[]> = ref([{ to: '/', text: 'Accueil' }, {
  text: 'Données sécheresse',
  to: '/donnees',
}, { text: 'Évolution journalière du nombre de départements soumis à restriction' }]);
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <h1>Évolution journalière du nombre de départements soumis à restriction</h1>
  </div>
  <div class="background-blue fr-py-2w">
    <div class="fr-container">
      <DonneesDepartementChart />
    </div>
  </div>
</template>

<style lang="scss">
.background-blue {
  background-color: var(--blue-france-975-75);
}
</style>