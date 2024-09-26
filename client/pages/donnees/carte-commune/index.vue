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
const loading = ref(false);

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
  </div>
  <div class="background-blue fr-py-2w">
    <div class="fr-container">
      <CarteCommuneFilter :loading="loading"
                          @filterChange="setFilterData($event)" />
      <DsfrAlert class="fr-my-2w" type="warning">
        La carte nationale peut prendre du temps à se charger.
        Si vous souhaitez ne visualiser qu'une partie du territoire, il est recommandé de restreindre l'affichage via le filtre territoire ou en zoomant sur la carte.<br/>
        Si vous chargez des données supérieures à la taille d'un département, n'hésitez pas à zoomer pour avoir les informations à la maille de la commune.
      </DsfrAlert>
      <div style="position: relative;">
        <CarteCommuneMap :embedded="false"
                         :light="true"
                         :dateBegin="filterData?.dateDebut"
                         :dateEnd="filterData?.dateFin"
                         :area="filterData?.area"
                         @beginLoading="loading = true"
                         @endLoading="loading = false"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.background-blue {
  background-color: var(--blue-france-975-75);
}
</style>