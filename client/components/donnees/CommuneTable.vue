<script setup lang="ts">
import moment from 'moment';
import { json2csv } from 'json-2-csv';
import { RestrictionNiveauGraviteFr } from '../../dto/restriction.dto';

const props = defineProps<{
  dataCommune: any,
  dateDebut: string,
  dateFin: string,
  communeNom: string,
}>();

const headers = ['Date', 'Eau potable', 'Eau superficielle', 'Eau souterraine'];
const rows = ref([]);
const componentKey = ref(0);

async function downloadCsv() {
  const formatData = props.dataCommune
    .map((stat: any) => {
      return {
        date: stat.date,
        AEP: stat.AEP,
        SUP: stat.SUP,
        SOU: stat.SOU,
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
  a.download = `commune_${props.communeNom}_${props.dateDebut}_${props.dateFin}.csv`;
  a.click();
}

watch(() => [props.dataCommune], () => {
  if(!props.dataCommune) {
    return;
  }
  rows.value = props.dataCommune.map(s => {
    return [
      moment(s.date).format('DD/MM/YYYY'),
      s.AEP ? RestrictionNiveauGraviteFr[s.AEP] : 'Pas de restrictions',
      s.SUP ? RestrictionNiveauGraviteFr[s.SUP] : 'Pas de restrictions',
      s.SOU ? RestrictionNiveauGraviteFr[s.SOU] : 'Pas de restrictions',
    ];
  });
  componentKey.value ++;
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