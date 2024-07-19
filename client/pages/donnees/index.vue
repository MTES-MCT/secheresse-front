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
    <DsfrHighlight class="fr-mb-2w">
      Retrouvez les données brutes sur <a href="https://www.data.gouv.fr/fr/datasets/donnee-secheresse-vigieau/" target="_blank" rel="external" class="fr-link">data.gouv</a><br/>
      Si vous avez de besoins spécifiques, envoyer nous un email à contact.vigieau@beta.gouv.fr
    </DsfrHighlight>
    <div>
      <h2 class="fr-h4">Carte et historique des restrictions</h2>
      <DonneesFilter @filterChange="setFilterData($event)" />
      <template v-if="filterData">
        <div style="position: relative;">
          <CarteMap :embedded="false"
                    :light="true"
                    :date="filterData.date" />
        </div>
        <DonneesArretesRestrictionsTable :date="filterData.date" />
        <CarteTable :light="true"
                    :date="filterData.date" />
      </template>
    </div>

    <DonneesAreaChart />
    <DonneesDepartementChart />
  </div>
</template>