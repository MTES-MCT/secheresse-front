<script setup lang="ts">
import api from '../../api';
import utils from '../../utils';
import { Ref } from 'vue';

const props = defineProps<{
  date: string
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

async function loadData() {
  rows.value = [];
  loading.value = true;
  const { data, error } = await api.getDepartmentsData(props.date);
  dataResume.map(r => r.number = 0);
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

watch(() => props.date, () => {
  const date = new Date(props.date);
  if (!date) {
    return;
  }
  loadData();
}, { immediate: true });
</script>

<template>
  <div class="carte-table">
    <template v-if="rows?.length > 0">
      <div class="carte-table-header">
        <h3 class="fr-mt-2w fr-mb-1w">Situation de la sécheresse en France (niveau de gravité maximum contasté par
          département)</h3>
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
        <h3 class="fr-pt-2w fr-mb-1w">Niveau de gravité maximal observé par département</h3>
        <DsfrSearchBar v-model="query"
                       placeholder="Rechercher"
                       large
                       buttonText="Rechercher"
                       ref="input"
                       @search="checkKeyboardNav({key: 'search'})" />
        <DsfrTable title=""
                   :headers="headers"
                   :rows="rowsFiltered"
                   :pagination="true"
                   :key="componentKey"
                   class="fr-table--layout-fixed" />
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

h3 {
  font-size: 1.3rem;
  line-height: 1.3rem;
}
</style>