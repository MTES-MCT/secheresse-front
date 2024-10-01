<script setup lang="ts">
import moment from 'moment';
import { json2csv } from 'json-2-csv';

const props = defineProps<{
  dataDepartement: any,
  territoire: string,
  dateDebut: string,
  dateFin: string,
}>();

const headers = ['Date', 'Vigilance', 'Alerte', 'Alerte renforcée', 'Crise'];
const rows = ref([]);

async function downloadCsv() {
  const formatData = props.dataDepartement
    .map((stat: any) => {
      return {
        date: stat.date,
        vigilance: stat.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'vigilance' ? 1 : 0), 0),
        alerte: stat.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'alerte' ? 1 : 0), 0),
        alerte_renforcee: stat.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'alerte_renforcee' ? 1 : 0), 0),
        crise: stat.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'crise' ? 1 : 0), 0),
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
  a.download = `tableau_departements_${props.territoire}_${props.dateDebut}_${props.dateFin}.csv`;
  a.click();
}

watch(() => [props.dataDepartement], () => {
  rows.value = props.dataDepartement.map(s => {
    return [
      moment(s.date).format('DD/MM/YYYY'),
      s.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'vigilance' ? 1 : 0), 0),
      s.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'alerte' ? 1 : 0), 0),
      s.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'alerte_renforcee' ? 1 : 0), 0),
      s.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'crise' ? 1 : 0), 0),
    ];
  });
}, { immediate: true });
</script>

<template>
  <DsfrTable :headers="headers"
             :rows="rows"
             :pagination="true"
             class="fr-table--layout-fixed fr-table--no-title" />

  <div class="text-align-right fr-mt-1w">
    <DsfrButton @click="downloadCsv()">
      Télécharger les données (CSV)
    </DsfrButton>
  </div>
</template>