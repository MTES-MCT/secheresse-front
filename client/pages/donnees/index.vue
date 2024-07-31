<script setup lang="ts">
import { Ref } from 'vue';
import api from '../../api';
import { useRefDataStore } from '../../store/refData';

definePageMeta({
  layout: 'basic',
});

const appName = useRuntimeConfig().public.appName;
useHead({
  title: `Données - ${useRuntimeConfig().public.appName}`,
});

const links: Ref<any[]> = ref([{ 'to': '/', 'text': 'Accueil' }, { 'text': 'Données' }]);
const refDataStore = useRefDataStore();
const filterData: any = ref(null);

// LOAD REF DATA
const { data, error } = await api.getRefData();
if (data.value) {
  refDataStore.setBassinsVersants(data.value.bassinsVersants);
  refDataStore.setRegions(data.value.regions);
  refDataStore.setDepartements(data.value.departements);
}

const setFilterData = (data: any) => {
  filterData.value = JSON.parse(JSON.stringify(data));
};
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <h1>Données sécheresse</h1>
    <DsfrHighlight class="fr-mb-2w">
      Retrouvez les données brutes sur <a href="https://www.data.gouv.fr/fr/datasets/donnee-secheresse-vigieau/"
                                          target="_blank" rel="external" class="fr-link">data.gouv</a><br />
      Si vous avez de besoins spécifiques, envoyer nous un email à contact.vigieau@beta.gouv.fr
    </DsfrHighlight>
  </div>
  <div class="background-blue fr-py-2w">
    <div class="fr-container">
      <h2 class="fr-h4">Carte et historique des restrictions</h2>
      <DonneesFilter @filterChange="setFilterData($event)" />
      <template v-if="filterData">
        <div style="position: relative;">
          <CarteMap :embedded="false"
                    :light="true"
                    :date="filterData.date" />
        </div>
        <DonneesArretesRestrictionsTable :date="filterData.date"
                                         :area="filterData.area" />
        <CarteTable :light="true"
                    :date="filterData.date"
                    :area="filterData.area" />
      </template>
    </div>
  </div>

  <div class="fr-container fr-py-2w">
    <DonneesAreaChart />
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