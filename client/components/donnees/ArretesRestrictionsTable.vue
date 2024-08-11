<script setup lang="ts">
import api from '../../api';
import utils from '../../utils';
import { json2csv } from 'json-2-csv';

const props = defineProps<{
  date: string,
  area: string,
  filterText: string,
}>();

const headers = ['Numéro', 'Département', 'Niveau de gravité maximum', 'Ressources concernées',
  'Date de début de validite', 'Date de fin de validité', 'Téléchargement'];
const rows = ref([]);
const loading = ref(false);
const componentKey = ref(0);
const ars = ref([]);

async function loadData() {
  rows.value = [];
  loading.value = true;
  const { data, error } = await api.getArretesRestrictions(props.date, props.area);
  ars.value = data.value;
  data.value?.forEach((d: any) => {
    rows.value.push([d.numero, d.departement?.nom, utils.getShortSituationLabel(utils.getRestrictionRank(d.niveauGraviteMax)),
      d.types.map(t => utils.getTypeLabel(t)).join(', '), d.dateDebut, d.dateFin ? d.dateFin : '', d.fichier ? {
        component: 'a',
        text: `Ouvrir l'arrêté`,
        class: 'fr-link',
        href: d.fichier.url,
        target: '_blank',
      } : '']);
  });
  loading.value = false;
}

async function downloadCsv() {
  const formatArretes = ars.value
    .map((arrete: any) => {
      return {
        id: arrete.id,
        numero: arrete.numero,
        date_debut: arrete.dateDebut,
        date_signature: arrete.dateSignature,
        date_fin: arrete.dateFin,
        statut: arrete.statut,
        departement: arrete.departement.code,
        chemin_fichier: arrete.fichier ? arrete.fichier?.url : '',
        arrete_cadre: arrete.arretesCadre?.map((arreteCadre: any) => {
          return {
            id: arreteCadre.id,
            numero: arreteCadre.numero,
            date_debut: arrete.dateDebut,
            date_signature: arrete.dateSignature,
            chemin_fichier: arreteCadre.fichier ? arreteCadre.fichier?.url : '',
          };
        }),
      };
    });
  const csv = await json2csv(formatArretes, {
    expandArrayObjects: true,
  });

  // Create a CSV file and allow the user to download it
  let blob = new Blob([csv], { type: 'text/csv' });
  let url = window.URL.createObjectURL(blob);

  let a = document.createElement('a');
  a.href = url;
  a.download = `arretes_restrictions_${props.date}.csv`;
  a.click();
}

const tableTitle = computed(() => {
  return `Arrêtés de restrictions ${props.filterText ? '(' + props.filterText + ')' : ''}`;
});

watch(() => props, () => {
  const date = new Date(props.date);
  if (!date) {
    return;
  }
  loadData();
}, { immediate: true, deep: true });
</script>

<template>
  <div>
    <template v-if="!loading">
      <DsfrTable :title="tableTitle"
                 :headers="headers"
                 :rows="rows"
                 :pagination="true"
                 :key="componentKey"
                 class="fr-table--layout-fixed" />

      <div class="text-align-right fr-mt-1w">
        <DsfrButton @click="downloadCsv()">
          Télécharger les données (CSV)
        </DsfrButton>
      </div>
    </template>
    <template v-else>
      <div class="fr-grid-row fr-grid-row--center fr-my-2w">
        <Loader :show="true" />
      </div>
    </template>
  </div>
</template>