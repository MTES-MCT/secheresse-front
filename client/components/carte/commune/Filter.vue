<script setup lang="ts">
import { BassinVersant } from '../../../dto/bassinVersant.dto';
import { Region } from '../../../dto/region.dto';
import { Departement } from '../../../dto/departement.dto';
import { useRefDataStore } from '../../../store/refData';
import moment from 'moment';

const props = defineProps<{
  loading: boolean,
}>();

const emit = defineEmits<{
  filterChange: any;
}>();

const refDataStore = useRefDataStore();
const dateMin = ref('2013-01');
const currentDate = moment();
const dateDebut = ref(moment(currentDate).subtract(1, 'year').format('YYYY-MM'));
const dateFin = ref(currentDate.format('YYYY-MM'));
const area = ref(null);
const computeDisabled = ref(true);
const modalOpened = ref(false);
const modalDescription = ref(`Nous vous informons que le lancement d'un calcul sur l'ensemble de la France peut prendre 1 à 2 minutes. Si vous êtes intéressé par une zone spécifique, nous vous recommandons de la sélectionner à l'aide du filtre "territoire".`);

const areaOptions = ref([]);

const askLoadData = (() => {
  const areaText = areaOptions.value.find((a: any) => a.value === area.value)?.text;
  if (areaText === 'France entière') {
    modalOpened.value = true;
    return;
  }
  loadData();
});

const loadData = (() => {
  const areaText = areaOptions.value.find((a: any) => a.value === area.value)?.text;
  emit('filterChange', {
    dateDebut: dateDebut.value,
    dateFin: dateFin.value,
    area: area.value,
    areaText: areaText,
  });
  computeDisabled.value = true;
  modalOpened.value = false;
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
    <div class="fr-col-lg-3 fr-col-12">
      <DsfrSelect label="Territoire"
                  v-model="area"
                  @update:modelValue="computeDisabled = !(area !== null && dateDebut && dateFin)"
                  :options="areaOptions"
                  required />
    </div>
    <div class="fr-col-lg-3 fr-col-6">
      <DsfrInput
        id="dateDebut"
        v-model="dateDebut"
        @update:modelValue="computeDisabled = !(area !== null && dateDebut && dateFin)"
        label="Date début"
        label-visible
        type="month"
        name="dateDebutCarte"
        :min="dateMin"
        :max="dateFin ? dateFin : currentDate.format('YYYY-MM')"
        required
      />
    </div>
    <div class="fr-col-lg-3 fr-col-6">
      <DsfrInput
        id="dateFin"
        v-model="dateFin"
        @update:modelValue="computeDisabled = !(area !== null && dateDebut && dateFin)"
        label="Date fin"
        label-visible
        type="month"
        name="dateCarte"
        :min="dateDebut"
        :max="currentDate.format('YYYY-MM')"
        required
      />
    </div>
    <div class="fr-col-lg-3 fr-col-6">
      <DsfrButton :disabled="loading || computeDisabled"
                  @click="askLoadData()">
        <div class="fr-grid-row fr-grid-row--middle" >
          Calculer
          <Loader class="fr-ml-1w" :show="loading" />
        </div>
      </DsfrButton>
    </div>
  </div>

  <MixinsConfirmationModal
    :opened="modalOpened"
    title="Vous demandez le calcul de données sur la France entière"
    :description="modalDescription"
    @close="modalOpened = false"
    @confirm="loadData()"
  />
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