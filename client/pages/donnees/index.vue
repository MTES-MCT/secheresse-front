<script setup lang="ts">
import { Ref } from 'vue';

definePageMeta({
  layout: 'basic',
});

const appName = useRuntimeConfig().public.appName;
useHead({
  title: `Données - ${useRuntimeConfig().public.appName}`,
});

const links: Ref<any[]> = ref([{ 'to': '/', 'text': 'Accueil' }, { 'text': 'Données' }]);
</script>

<template>
  <div class="fr-container">
    <h1>Données sécheresse</h1>
    <DsfrNotice class="fr-mb-2w" title="Besoin de données complémentaires ?" />
    <h2 class="fr-h4">Carte et historique des restrictions</h2>
    <DonneesFilter />
    <div style="position: relative;">
      <CarteMap :embedded="false"
                :light="true"
                :date="'2024-07-16'" />
    </div>
    <CarteTable :light="true"
                :date="'2024-07-16'" />
    <DonneesArretesRestrictionsTable :date="'2024-07-16'" />
  </div>
</template>