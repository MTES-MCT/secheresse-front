<script setup lang="ts">
import api from '../../api';
import utils from '../../utils';

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

async function loadData() {
  rows.value = [];
  loading.value = true;
  const { data, error } = await api.getArretesRestrictions(props.date, props.area);
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
    </template>
    <template v-else>
      <div class="fr-grid-row fr-grid-row--center fr-my-2w">
        <Loader :show="true" />
      </div>
    </template>
  </div>
</template>