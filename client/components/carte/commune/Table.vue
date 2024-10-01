<script setup lang="ts">
import moment from 'moment';
import { json2csv } from 'json-2-csv';

const props = defineProps<{
  dataCommune: any,
  maxPonderation: number,
  territoire: string,
  dateDebut: string,
  dateFin: string,
}>();

const headers = ['Commune', 'Pourcentage', 'Pondération'];
const rows = ref([]);
const componentKey = ref(0);

async function downloadCsv() {
  const formatData = rows.value
    .map((r: any) => {
      return {
        commune: r[0],
        pourcentage: r[1].replace('%', ''),
        ponderation: r[2],
      };
    });
  const csv = await json2csv(formatData, {
    expandArrayObjects: true,
  });

  // Create a CSV file and allow the user to download it
  let blob = new Blob([csv], { type: 'text/csv' });
  let url = window.URL.createObjectURL(blob);

  let a = document.createElement('a');
  a.href = url;
  a.download = `tableau_ponderation_commune_${props.dateDebut}_${props.dateFin}.csv`;
  a.click();
}

watch(() => [props.dataCommune], () => {
  if (!props.dataCommune || !props.maxPonderation) {
    return;
  }
  rows.value = props.dataCommune.map(c => {
    return [
      c.code,
      Math.min(c.ponderation / props.maxPonderation * 100, 100).toFixed(2) + '%',
      c.ponderation,
    ];
  });
  componentKey.value++;
}, { immediate: true });
</script>

<template>
  <DsfrTable :headers="headers"
             :rows="rows"
             :pagination="true"
             :key="componentKey"
             class="fr-table--layout-fixed fr-table--no-title" />

  <div class="text-align-right fr-mt-1w">
    <DsfrButton @click="downloadCsv()">
      Télécharger les données (CSV)
    </DsfrButton>
  </div>
</template>