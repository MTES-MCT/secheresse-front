<script setup lang="ts">
import { BassinVersant } from '../../dto/bassinVersant.dto';
import { Region } from '../../dto/region.dto';
import { Departement } from '../../dto/departement.dto';
import { useRefDataStore } from '../../store/refData';

const emit = defineEmits<{
  filterChange: any;
}>();

const refDataStore = useRefDataStore();
const date = ref(new Date().toISOString().split('T')[0]);
const currentDate = new Date();
const area = ref('');

const areaOptions = ref([]);

const loadData = (() => {
  emit('filterChange', {
    date: date.value,
    area: area.value,
  });
});

onMounted(() => {
  loadData();
});

watch(() => refDataStore.departements, () => {
  areaOptions.value = [{
    text: 'France entière',
    value: '',
  }];
  areaOptions.value.push({
    text: 'Bassins Versants',
    disabled: true,
  });
  refDataStore.bassinsVersants.forEach((b: BassinVersant) => {
    areaOptions.value.push({
      text: b.nom,
      value: `bassinVersant=${b.id}`,
    });
  });
  areaOptions.value.push({
    text: 'Régions',
    disabled: true,
  });
  refDataStore.regions.forEach((r: Region) => {
    areaOptions.value.push({
      text: r.nom,
      value: `region=${r.id}`,
    });
  });
  areaOptions.value.push({
    text: 'Départements',
    disabled: true,
  });
  refDataStore.departements.forEach((d: Departement) => {
    areaOptions.value.push({
      text: d.nom,
      value: `departement=${d.id}`,
    });
  });
}, {
  immediate: true,
});
</script>

<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-4">
      <DsfrSelect label="Territoire"
                  v-model="area"
                  :options="areaOptions" />
    </div>
    <div class="fr-col-4">
      <DsfrInput
        id="dateCarte"
        v-model="date"
        label="Filtrer par date"
        label-visible
        type="date"
        name="dateCarte"
        min="2012-01-01"
        :max="currentDate.toISOString().split('T')[0]"
      />
    </div>
    <div class="fr-col-3">
      <DsfrButton @click="loadData()">
        Calculer
      </DsfrButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fr-grid-row {
  align-items: end;
}
</style>