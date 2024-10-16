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
const computeDisabled = ref(true);

const areaOptions = ref([]);

const loadData = (() => {
  const areaText = areaOptions.value.find(a => a.value === area.value)?.text;
  emit('filterChange', {
    date: date.value,
    area: area.value,
    areaText: areaText,
  });
  computeDisabled.value = true;
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
    <div class="fr-col-lg-4 fr-col-md-6 fr-col-12">
      <DsfrSelect label="Territoire"
                  v-model="area"
                  @update:modelValue="computeDisabled = false"
                  :options="areaOptions"
                  required />
    </div>
    <div class="fr-col-lg-4 fr-col-md-6 fr-col-12">
      <DsfrInput
        id="dateCarte"
        v-model="date"
        @update:modelValue="computeDisabled = false"
        label="Filtrer par date"
        label-visible
        type="date"
        name="dateCarte"
        min="2012-01-01"
        :max="currentDate.toISOString().split('T')[0]"
        required
      />
    </div>
    <div data-html2canvas-ignore="true" class="fr-col-lg-3 fr-col-6">
      <DsfrButton :disabled="computeDisabled"
                  @click="loadData()">
        Calculer
      </DsfrButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fr-grid-row {
  align-items: end;

  :deep(.fr-select) {
    option:disabled {
      font-weight: bold;
    }
  }
}
</style>