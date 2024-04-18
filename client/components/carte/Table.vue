<script setup lang="ts">
import api from "../../api";
import utils from "../../utils";
import { Ref } from "vue";

const headers = ['N° Département', 'Département', 'Niveau de gravité'];
const rows = [];
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
  }
];
const query: Ref<string> = ref('');
const rowsFiltered: Ref<any[]> = ref([]);
const componentKey = ref(0);

const {data, error} = await api.getDepartmentsData();
data.value?.forEach((d: any) => {
  const dr = dataResume.find(r => r.niveauGravite === (d.niveauGraviteMax ? d.niveauGraviteMax : 'pas_de_restrictions'));
  rows.push([d.code, d.nom, dr ? dr.label : 'Pas de restrictions']);
  if (dr) dr.number++;
});
rowsFiltered.value = [...rows];

const classObject = (rank: number | undefined): any => {
  return [`situation-level-bg-${rank}`];
}

function checkKeyboardNav($event) {
  if (['search', 'Enter'].includes($event.key)) {
    filterDepartments();
  }
}

function filterDepartments() {
  rowsFiltered.value = rows.filter(r => {
    return r.findIndex(x => x.toLowerCase().includes(query.value.toLowerCase())) >= 0;
  });
  componentKey.value += 1;
}
</script>

<template>
  <template v-if="rows?.length > 0">
    <div class="fr-grid-row fr-grid-row--center fr-mt-2w departement-card-wrapper">
      <div class="fr-col-lg fr-p-2w fr-m-1w departement-card" v-for="resume of dataResume">
        <div>
          <DsfrBadge small
                     no-icon
                     :class="classObject(utils.getRestrictionRank(resume.niveauGravite))"
                     :label="resume.label"/>
        </div>
        <div class="departement-card__number fr-mt-1w">
          {{ resume.number }} départements
        </div>
      </div>
    </div>
    <DsfrSearchBar v-model="query"
                   placeholder="Rechercher"
                   large
                   buttonText="Rechercher"
                   ref="input"
                   @search="checkKeyboardNav({key: 'search'})"/>
    <DsfrTable title=""
               :headers="headers"
               :rows="rowsFiltered"
               :pagination="true"
               :key="componentKey"
               class="fr-table--layout-fixed"/>    
  </template>
  <template v-else>
    <p class="fr-mt-4w">Une erreur est survenue dans la récupération des données. Veuillez ré-essayer dans quelques instants.</p>
  </template>
</template>

<style scoped lang="scss">
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