<script setup lang="ts">
import { Ref } from 'vue';
import { useRefDataStore } from '../../../store/refData';

definePageMeta({
  layout: 'basic',
});

useHead({
  title: `Évolution par commune - ${useRuntimeConfig().public.appName}`,
});

const links: Ref<any[]> = ref([{ to: '/', text: 'Accueil' }, {
  text: 'Données sécheresse',
  to: '/donnees',
}, { text: 'Évolution de la situation de la sécheresse par commune' }]);
const refDataStore = useRefDataStore();
await refDataStore.loadRefData();
const filterData: any = ref(null);
const filterText: any = ref(null);

const setFilterData = (data: any) => {
  filterData.value = JSON.parse(JSON.stringify(data));
  if (filterData.value.date && filterData.value.areaText) {
    filterText.value = `${filterData.value.areaText} au ${new Date(filterData.value.date).toLocaleDateString()}`;
  } else {
    filterText.value = null;
  }
};

</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <h1>Évolution de la situation de la sécheresse par commune</h1>
    <DsfrAlert class="fr-mb-2w" type="warning"
               description="La carte nationale peux prendre du temps à se charger. Si vous souhaitez ne visualiser qu'une partie du territoire n'hésitez pas à restreindre l'affichage via le filtre territoire." />
  </div>
  <div class="background-blue fr-py-2w">
    <div class="fr-container">
      <CarteCommuneFilter @filterChange="setFilterData($event)" />
      <div style="position: relative;">
        <CarteCommuneMap :embedded="false"
                         :light="true"
                         :dateBegin="filterData?.dateDebut"
                         :dateEnd="filterData?.dateFin"
                         :area="filterData?.area"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.background-blue {
  background-color: var(--blue-france-975-75);
}
</style>