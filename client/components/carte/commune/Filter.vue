<script setup lang="ts">
import { BassinVersant } from '../../../dto/bassinVersant.dto';
import { Region } from '../../../dto/region.dto';
import { Departement } from '../../../dto/departement.dto';
import { useRefDataStore } from '../../../store/refData';
import moment from 'moment';

const emit = defineEmits<{
  filterChange: any;
}>();

const refDataStore = useRefDataStore();
const dateMin = ref('2013-01');
const currentDate = moment();
const tmp = moment();
tmp.subtract(1, 'year');
const dateDebut = ref(tmp.format('YYYY-MM'));
const dateFin = ref(currentDate.format('YYYY-MM'));
const area = ref('');
const computeDisabled = ref(false);

const areaOptions = ref([]);

const loadData = (() => {
  const areaText = areaOptions.value.find(a => a.value === area.value)?.text
  emit('filterChange', {
    dateDebut: dateDebut.value,
    dateFin: dateFin.value,
    area: area.value,
    areaText: areaText,
  });
  computeDisabled.value = true;
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
    <div class="fr-col-3">
      <DsfrSelect label="Territoire"
                  v-model="area"
                  @update:modelValue="computeDisabled = false"
                  :options="areaOptions" />
    </div>
    <div class="fr-col-3">
      <DsfrInput
        id="dateDebut"
        v-model="dateDebut"
        @update:modelValue="computeDisabled = false"
        label="Date début"
        label-visible
        type="month"
        name="dateDebutCarte"
        :min="dateMin"
        :max="dateFin"
      />
    </div>
    <div class="fr-col-3">
      <DsfrInput
        id="dateFin"
        v-model="dateFin"
        @update:modelValue="computeDisabled = false"
        label="Date fin"
        label-visible
        type="month"
        name="dateCarte"
        :min="dateDebut"
        :max="currentDate.format('YYYY-MM')"
      />
    </div>
    <div class="fr-col-3">
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
}
</style>