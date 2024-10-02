<script setup lang="ts">
import { BassinVersant } from '../../../dto/bassinVersant.dto';
import { Region } from '../../../dto/region.dto';
import { Departement } from '../../../dto/departement.dto';
import { useRefDataStore } from '../../../store/refData';
import moment from 'moment';
import { helpers, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import utils from '../../../utils';

const props = defineProps<{
  loading: boolean,
}>();

const emit = defineEmits<{
  filterChange: any;
}>();

const refDataStore = useRefDataStore();
const dateMin = ref('2013-01');
const currentDate = moment();
const computeDisabled = ref(true);
const modalOpened = ref(false);
const modalDescription = ref(`Nous vous informons que le lancement d'un calcul sur l'ensemble de la France peut prendre 1 à 2 minutes. Si vous êtes intéressé par une zone spécifique, nous vous recommandons de la sélectionner à l'aide du filtre "territoire".`);

const areaOptions = ref([]);

const formData = reactive({
  dateDebut: moment(currentDate).subtract(1, 'year').format('YYYY-MM'),
  dateFin: currentDate.format('YYYY-MM'),
  area: null,
});
const rules = computed(() => {
  return {
    dateDebut: {
      required: helpers.withMessage('La date de début est obligatoire.', required),
      minValue: helpers.withMessage('La date de début doit être supérieure à Janvier 2013.', (val: string) => {
        if (val) {
          return moment(val, 'YYYY-MM') >= moment(dateMin.value, 'YYYY-MM');
        }
        return true;
      }),
      maxValue: helpers.withMessage('La date de début doit être inférieure à la date de fin.', (val: string) => {
        if (formData.dateFin && val) {
          return moment(val, 'YYYY-MM') <= moment(formData.dateFin, 'YYYY-MM');
        }
        return true;
      }),
      isValid: helpers.withMessage('La date de début doit être sous la forme YYYY-MM (ex : 2024-01).', (val: string) => {
        if (val) {
          return moment(val, 'YYYY-MM', true).isValid();
        }
        return true;
      }),
    },
    dateFin: {
      required: helpers.withMessage('La date de fin est obligatoire.', required),
      minValue: helpers.withMessage('La date de fin doit être supérieure à la date de début.', (val: string) => {
        if (formData.dateDebut && val) {
          return moment(val, 'YYYY-MM') >= moment(formData.dateDebut, 'YYYY-MM');
        }
        return true;
      }),
      maxValue: helpers.withMessage('La date de fin doit être inférieure à la date du jour.', (val: string) => {
        if (val) {
          return moment(val, 'YYYY-MM') <= moment().endOf('month');
        }
        return true;
      }),
      isValid: helpers.withMessage('La date de fin doit être sous la forme YYYY-MM (ex : 2024-01).', (val: string) => {
        if (val) {
          return moment(val, 'YYYY-MM', true).isValid();
        }
        return true;
      }),
    },
    area: {
      required: helpers.withMessage('Le territoire est obligatoire.', (val: string) => {
        return val !== null;
      }),
    },
  };
});

const v$ = useVuelidate(rules, formData);

const askLoadData = (async () => {
  await v$.value.$validate();
  if (v$.value.$error) {
    return;
  }
  const areaText = areaOptions.value.find((a: any) => a.value === formData.area)?.text;
  if (areaText === 'France entière') {
    modalOpened.value = true;
    return;
  }
  loadData();
});

const loadData = (() => {
  const areaText = areaOptions.value.find((a: any) => a.value === formData.area)?.text;
  emit('filterChange', {
    dateDebut: formData.dateDebut,
    dateFin: formData.dateFin,
    area: formData.area,
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
      <DsfrInputGroup :error-message="utils.showInputError(v$, 'area')">
        <DsfrSelect label="Territoire"
                    v-model="formData.area"
                    @update:modelValue="computeDisabled = !(formData.area !== null && formData.dateDebut && formData.dateFin)"
                    :options="areaOptions"
                    required />
      </DsfrInputGroup>
    </div>
    <div class="fr-col-lg-3 fr-col-6">
      <DsfrInputGroup :error-message="utils.showInputError(v$, 'dateDebut')">
        <DsfrInput
          id="dateDebut"
          v-model="formData.dateDebut"
          @update:modelValue="computeDisabled = !(formData.area !== null && formData.dateDebut && formData.dateFin)"
          label="Date début"
          label-visible
          type="month"
          name="dateDebutCarte"
          :min="dateMin"
          :max="formData.dateFin ? formData.dateFin : currentDate.format('YYYY-MM')"
          required
        />
      </DsfrInputGroup>
    </div>
    <div class="fr-col-lg-3 fr-col-6">
      <DsfrInputGroup :error-message="utils.showInputError(v$, 'dateFin')">
        <DsfrInput
          id="dateFin"
          v-model="formData.dateFin"
          @update:modelValue="computeDisabled = !(formData.area !== null && formData.dateDebut && formData.dateFin)"
          label="Date fin"
          label-visible
          type="month"
          name="dateCarte"
          :min="formData.dateDebut"
          :max="currentDate.format('YYYY-MM')"
          required
        />
      </DsfrInputGroup>
    </div>
    <div data-html2canvas-ignore="true" class="fr-col-lg-3 fr-col-6">
      <DsfrButton :disabled="loading || computeDisabled"
                  @click="askLoadData()">
        <div class="fr-grid-row fr-grid-row--middle">
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

  :deep(.fr-select-group) {
    margin-bottom: 0;
  }
}
</style>