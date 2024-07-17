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
const filterData: any = ref(null);

const setFilterData = (data: any) => {
  filterData.value = data;
};
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <h1>Données sécheresse</h1>
    <DsfrNotice class="fr-mb-2w" title="Besoin de données complémentaires ?" />
    <h2 class="fr-h4">Carte et historique des restrictions</h2>
    <DonneesFilter @filterChange="setFilterData($event)" />
    <template v-if="filterData">
      <div style="position: relative;">
        <CarteMap :embedded="false"
                  :light="true"
                  :date="filterData.date" />
      </div>
      <CarteTable :light="true"
                  :date="filterData.date" />
      <DonneesArretesRestrictionsTable :date="filterData.date" />
    </template>
  </div>
</template>