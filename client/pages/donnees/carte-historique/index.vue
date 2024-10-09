<script setup lang="ts">
import { Ref } from 'vue';
import html2canvas from 'html2canvas';

definePageMeta({
  layout: 'basic',
});

useHead({
  title: `Carte et historique - ${useRuntimeConfig().public.appName}`,
});

const links: Ref<any[]> = ref([{ to: '/', text: 'Accueil' }, {
  text: 'Données sécheresse',
  to: '/donnees',
}, { text: 'Carte et historique des restrictions' }]);
const filterData: any = ref(null);
const filterText: any = ref(null);
const screenshotZone = ref();

const setFilterData = (data: any) => {
  filterData.value = JSON.parse(JSON.stringify(data));
  if (filterData.value.date && filterData.value.areaText) {
    filterText.value = `${filterData.value.areaText} au ${new Date(filterData.value.date).toLocaleDateString()}`;
  } else {
    filterText.value = null;
  }
};

const downloadMap = (typeEau) => {
  html2canvas(screenshotZone.value, {
    scale: 2, useCORS: true, ignoreElements: (element) => {
      return element.classList.contains('maplibregl-control-container');
    },
  }).then((canvas) => {
    const content = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = content.replace('image/png', 'image/octet-stream');
    a.download = `carte_historique_${typeEau}_${filterData.value?.date}.png`;
    a.click();
  });
};
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <h1>Carte et historique des restrictions</h1>
  </div>
  <div class="background-blue fr-py-2w">
    <div class="fr-container">
      <div ref="screenshotZone">
        <DonneesFilter @filterChange="setFilterData($event)" />
        <h2 class="fr-h4 fr-mt-2w">Carte et historique des restrictions <span v-if="filterText">({{ filterText
          }})</span>
        </h2>
        <DsfrAlert data-html2canvas-ignore="true" class="fr-mb-2w" type="info">
          Nous ne sommes pas en mesure de fournir les restrictions appliquées sur l'eau potable avant le 28/04/2024.
          Pour connaître les niveaux de restrictions en vigueur; veuillez vous référer aux niveaux de restrictions des
          eaux superficielles et souterraines.
        </DsfrAlert>
        <template v-if="filterData">
          <div style="position: relative;">
            <CarteMap :embedded="false"
                      :light="true"
                      :date="filterData.date"
                      :area="filterData.area"
                      @downloadMap="downloadMap($event)" />
          </div>
        </template>
      </div>
      <template v-if="filterData">
        <DonneesArretesRestrictionsTable :date="filterData.date"
                                         :area="filterData.area"
                                         :filterText="filterText" />
        <CarteTable :light="true"
                    :date="filterData.date"
                    :area="filterData.area"
                    :filterText="filterText" />
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.background-blue {
  background-color: var(--blue-france-975-75);
}
</style>