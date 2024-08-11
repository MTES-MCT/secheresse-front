<script setup lang="ts">
import api from '../../api';
import utils from '../../utils';
import { Ref } from 'vue';
import { json2csv } from 'json-2-csv';

const props = defineProps<{
  date: string,
  area: string,
  light: boolean,
  filterText: string,
}>();

const headers = ['N° Département', 'Département', 'Niveau de gravité'];
const dataResume = [
  {
    label: 'Pas de restrictions',
    niveauGravite: 'pas_de_restrictions',
    number: 0,
  },
  {
    label: 'Vigilance',
    niveauGravite: 'vigilance',
    number: 0,
  },
  {
    label: 'Alerte',
    niveauGravite: 'alerte',
    number: 0,
  },
  {
    label: 'Alerte renforcée',
    niveauGravite: 'alerte_renforcee',
    number: 0,
  },
  {
    label: 'Crise',
    niveauGravite: 'crise',
    number: 0,
  },
];
const query: Ref<string> = ref('');
const rows = ref([]);
const rowsFiltered: Ref<any[]> = ref([]);
const componentKey = ref(0);
const loading = ref(false);
const departementsData = ref([]);

async function loadData() {
  rows.value = [];
  loading.value = true;
  const { data, error } = await api.getDepartmentsData(props.date, props.area);
  dataResume.map(r => r.number = 0);
  departementsData.value = data.value;
  data.value?.forEach((d: any) => {
    const dr = dataResume.find(r => r.niveauGravite === (d.niveauGraviteMax ? d.niveauGraviteMax : 'pas_de_restrictions'));
    rows.value.push([d.code, d.nom, dr ? dr.label : 'Pas de restrictions']);
    if (dr) dr.number++;
  });
  rowsFiltered.value = [...rows.value];
  loading.value = false;
}

const classObject = (rank: number | undefined): any => {
  return [`situation-level-bg-${rank}`];
};

function checkKeyboardNav($event) {
  if (['search', 'Enter'].includes($event.key)) {
    filterDepartments();
  }
}

function filterDepartments() {
  rowsFiltered.value = rows.value.filter(r => {
    return r.findIndex(x => x.toLowerCase().includes(query.value.toLowerCase())) >= 0;
  });
  componentKey.value += 1;
}

async function downloadCsv() {
  const formatDepartements = departementsData.value
    .map((departement: any) => {
      return {
        code: departement.code,
        nom: departement.nom,
        region: departement.region,
        niveau_gravite_max: departement.niveauGraviteMax,
      };
    });
  const csv = await json2csv(formatDepartements, {
    expandArrayObjects: true,
  });

  // Create a CSV file and allow the user to download it
  let blob = new Blob([csv], { type: 'text/csv' });
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = `situation_departement_${props.date}.csv`;
  document.body.appendChild(a);
  a.click();
}

const tableTitle = computed(() => {
  if (props.light) {
    return '';
  }
  return `Niveau de gravité maximal observé par département ${props.filterText ? '(' + props.filterText + ')' : ''}`;
});

const pageTitle = computed(() => {
  return `Situation de la sécheresse en France (niveau de gravité maximum contasté par
          département) - ${props.filterText ? props.filterText : ''}`;
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
  <div class="carte-table" :class="light ? 'carte-table__light' : ''">
    <template v-if="rows?.length > 0">
      <div class="carte-table-header">
        <h3 class="fr-mt-2w fr-mb-1w fr-h4">{{ pageTitle }}</h3>
        <div class="fr-grid-row fr-grid-row--center departement-card-wrapper fr-mb-2w">
          <div class="fr-col-lg fr-p-2w fr-m-1w departement-card" v-for="resume of dataResume">
            <div>
              <DsfrBadge small
                         no-icon
                         :class="classObject(utils.getRestrictionRank(resume.niveauGravite))"
                         :label="resume.label" />
            </div>
            <div class="departement-card__number fr-mt-1w">
              {{ resume.number }} départements
            </div>
          </div>
        </div>
      </div>
      <div class="carte-table-body">
        <h3 v-if="!light" class="fr-pt-2w fr-mb-1w">Niveau de gravité maximal observé par département</h3>
        <DsfrSearchBar v-model="query"
                       v-if="!light"
                       placeholder="Rechercher"
                       large
                       buttonText="Rechercher"
                       ref="input"
                       @search="checkKeyboardNav({key: 'search'})" />
        <DsfrTable :title="tableTitle"
                   :headers="headers"
                   :rows="rowsFiltered"
                   :pagination="true"
                   :key="componentKey"
                   class="fr-table--layout-fixed" />
      </div>

      <div class="text-align-right fr-mt-1w">
        <DsfrButton @click="downloadCsv()">
          Télécharger les données (CSV)
        </DsfrButton>
      </div>
    </template>
    <template v-else-if="loading">
      <div class="fr-grid-row fr-grid-row--center fr-my-2w">
        <Loader :show="true" />
      </div>
    </template>
    <template v-else>
      <p class="fr-mt-4w">Une erreur est survenue dans la récupération des données. Veuillez ré-essayer dans quelques
        instants.</p>
    </template>
  </div>
</template>

<style scoped lang="scss">
.carte-table {
  &-header, &-body {
    padding: 0 2rem;
  }

  &.carte-table__light {
    .carte-table {
      &-header, &-body {
        padding: 0rem;
      }
    }
  }

  &-body {
    background: var(--grey-1000-50);
    padding-bottom: 1rem;
  }

  .loader {
    text-align: center;
  }
}

.departement-card {
  border-radius: 4px;
  background-color: var(--grey-1000-50);
  border: 1px solid var(--border-default-grey);

  &__number {
    color: var(--background-action-high-blue-france);
    font-weight: bold;
  }

  &-wrapper {
    margin: 0 -0.5rem;
  }
}
</style>