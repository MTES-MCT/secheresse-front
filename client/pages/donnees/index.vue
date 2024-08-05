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

const links: Ref<any[]> = ref([{ 'to': '/', 'text': 'Accueil' }, { 'text': 'Données sécheresse' }]);
const refDataStore = useRefDataStore();
const filterData: any = ref(null);
const filterText: any = ref(null);

// LOAD REF DATA
const { data, error } = await api.getRefData();
if (data.value) {
  refDataStore.setBassinsVersants(data.value.bassinsVersants);
  refDataStore.setRegions(data.value.regions);
  refDataStore.setDepartements(data.value.departements);
}

const setFilterData = (data: any) => {
  filterData.value = JSON.parse(JSON.stringify(data));
  if(filterData.value.date && filterData.value.areaText) {
    filterText.value = `${filterData.value.areaText} au ${new Date(filterData.value.date).toLocaleDateString()}`;
  } else {
    filterText.value = null;
  }
};
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <h1>Données sécheresse</h1>
    <DsfrHighlight class="fr-mb-2w">
      Retrouvez les données brutes sur <a href="https://www.data.gouv.fr/fr/datasets/donnee-secheresse-vigieau/"
                                          target="_blank" rel="external" class="fr-link">data.gouv</a><br />
      Si vous avez des besoins spécifiques, envoyez nous un email à contact.vigieau@beta.gouv.fr
    </DsfrHighlight>
  </div>
  <div class="background-blue fr-py-2w">
    <div class="fr-container">
      <DonneesFilter @filterChange="setFilterData($event)" />
      <h2 class="fr-h4 fr-mt-2w">Carte et historique des restrictions <span v-if="filterText">({{ filterText}})</span></h2>
      <template v-if="filterData">
        <div style="position: relative;">
          <CarteMap :embedded="false"
                    :light="true"
                    :date="filterData.date"
                    :area="filterData.area" />
        </div>
        <DonneesArretesRestrictionsTable :date="filterData.date"
                                         :area="filterData.area"
                                         :filterText="filterText"/>
        <CarteTable :light="true"
                    :date="filterData.date"
                    :area="filterData.area"
                    :filterText="filterText" />
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