<script setup lang="ts">
import moment from 'moment';
import { json2csv } from 'json-2-csv';

const props = defineProps<{
  dataDepartement: any,
  typeEau: any,
  territoire: string,
  dateDebut: string,
  dateFin: string,
}>();

const headers = ['Date', 'Vigilance', 'Alerte', 'Alerte renforcée', 'Crise'];
const rows = ref([]);
const componentKey = ref(0);

async function downloadCsv() {
  const formatData = props.dataDepartement
    .map((stat: any) => {
      return {
        date: stat.date,
        vigilance: stat.departements.reduce((acc: number, dep: any) => acc + (getNiveauGravite(dep) === 'vigilance' ? 1 : 0), 0),
        alerte: stat.departements.reduce((acc: number, dep: any) => acc + (getNiveauGravite(dep) === 'alerte' ? 1 : 0), 0),
        alerte_renforcee: stat.departements.reduce((acc: number, dep: any) => acc + (getNiveauGravite(dep) === 'alerte_renforcee' ? 1 : 0), 0),
        crise: stat.departements.reduce((acc: number, dep: any) => acc + (getNiveauGravite(dep) === 'crise' ? 1 : 0), 0),
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
  a.download = `tableau_departements_${props.territoire}_${props.dateDebut}_${props.dateFin}_${props.typeEau}.csv`;
  a.click();
}

const getNiveauGravite = (departement: any) => {
  switch (props.typeEau) {
    case 'SUP':
      return departement.niveauGraviteSup;
    case 'SOU':
      return departement.niveauGraviteSou;
    case 'AEP':
      return departement.niveauGraviteAep;
    default:
      return departement.niveauGravite;
  }
};

watch(() => [props.typeEau, props.dataDepartement], () => {
  if (!props.dataDepartement) {
    return;
  }
  rows.value = props.dataDepartement.map(s => {
    return [
      moment(s.date).format('DD/MM/YYYY'),
      s.departements.reduce((acc: number, dep: any) => acc + (getNiveauGravite(dep) === 'vigilance' ? 1 : 0), 0),
      s.departements.reduce((acc: number, dep: any) => acc + (getNiveauGravite(dep) === 'alerte' ? 1 : 0), 0),
      s.departements.reduce((acc: number, dep: any) => acc + (getNiveauGravite(dep) === 'alerte_renforcee' ? 1 : 0), 0),
      s.departements.reduce((acc: number, dep: any) => acc + (getNiveauGravite(dep) === 'crise' ? 1 : 0), 0),
    ];
  });
  componentKey.value++;
}, { immediate: true });
</script>

<template>
  <DsfrTable title="Évolution journalière du nombre de départements soumis à restriction"
             :headers="headers"
             :rows="rows"
             :pagination="true"
             :key="componentKey"
             class="fr-table--sm fr-table--no-title" />

  <div class="text-align-right fr-mt-1w">
    <DsfrButton @click="downloadCsv()">
      Télécharger les données (CSV)
    </DsfrButton>
  </div>
</template>

<style lang="scss" scoped>
.fr-table {
  overflow: auto;
}

@media screen and (min-width: 768px) {
  .fr-table > :deep(table) {
    display: table;
    table-layout: fixed;
  }
}
</style>