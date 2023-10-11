<script setup lang="ts">
import { Ref } from "vue/dist/vue";
import utils from "../../utils";

const props = defineProps<{
  stats: any
}>();

const headers = ['N° Département', 'Nombre recherches', '% recherches'];
const rows = [];
const query: Ref<string> = ref('');
const rowsFiltered: Ref<any[]> = ref([]);
const componentKey = ref(0);
const sumSearches = Object.values(props.stats.departementRepartition).reduce((a: number, b: number) => {
  return a + b;
});
Object.keys(props.stats.departementRepartition).forEach((d: any) => {
  rows.push([d, `${utils.numberWithSpaces(props.stats.departementRepartition[d])}`, `${(props.stats.departementRepartition[d] * 100 / sumSearches).toFixed(2)}%`]);
});
rowsFiltered.value = [...rows];

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
    <p class="fr-mt-4w">Une erreur est survenue dans la récupération des données. Veuillez ré-essayer dans quelques
      instants.</p>
  </template>
</template>

<style scoped lang="scss">
.fr-search-bar {
  :deep(.fr-btn) {
    margin-top: 0;
  }
}
</style>