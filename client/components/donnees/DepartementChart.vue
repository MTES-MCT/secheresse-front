<script setup lang="ts">
import api from '../../api';
import { Line } from 'vue-chartjs';
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions, Colors, Filler,
  Legend,
  LinearScale, LineController,
  LineElement, PointElement, TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-luxon';
import { BassinVersant } from '../../dto/bassinVersant.dto';
import { Region } from '../../dto/region.dto';
import { Departement } from '../../dto/departement.dto';
import { useRefDataStore } from '../../store/refData';
import html2canvas from 'html2canvas';
import { helpers, required } from '@vuelidate/validators';
import moment from 'moment';
import useVuelidate from '@vuelidate/core';
import utils from '../../utils';


ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, LineController, TimeScale, ArcElement, Colors, Filler);

const refDataStore = useRefDataStore();
const loading = ref(false);
const chartLineData = ref(null);
const dataDepartement = ref(null);
const computeDisabled = ref(true);

const dateMin = ref('2013-01-01');
const tmp = new Date();
tmp.setFullYear(tmp.getFullYear() - 1);
const currentDate = ref(new Date().toISOString().split('T')[0]);
const territoire = ref();
const screenshotZone = ref();

const areaOptions = ref([]);

const formData = reactive({
  dateDebut: tmp.toISOString().split('T')[0],
  dateFin: new Date().toISOString().split('T')[0],
  area: '',
});
const rules = computed(() => {
  return {
    dateDebut: {
      required: helpers.withMessage('La date de début est obligatoire.', required),
      minValue: helpers.withMessage('La date de début doit être supérieure à Janvier 2013.', (val: string) => {
        if (val) {
          return moment(val, 'YYYY-MM-DD') >= moment(dateMin.value, 'YYYY-MM-DD');
        }
        return true;
      }),
      maxValue: helpers.withMessage('La date de début doit être inférieure à la date de fin.', (val: string) => {
        if (formData.dateFin && val) {
          return moment(val, 'YYYY-MM-DD') <= moment(formData.dateFin, 'YYYY-MM-DD');
        }
        return true;
      }),
      isValid: helpers.withMessage('La date de début doit être sous la forme YYYY-MM-DD (ex : 2024-01-01).', (val: string) => {
        if (val) {
          return moment(val, 'YYYY-MM-DD', true).isValid();
        }
        return true;
      }),
    },
    dateFin: {
      required: helpers.withMessage('La date de fin est obligatoire.', required),
      minValue: helpers.withMessage('La date de fin doit être supérieure à la date de début.', (val: string) => {
        if (formData.dateDebut && val) {
          return moment(val, 'YYYY-MM-DD') >= moment(formData.dateDebut, 'YYYY-MM-DD');
        }
        return true;
      }),
      maxValue: helpers.withMessage('La date de fin doit être inférieure à la date du jour.', (val: string) => {
        if (val) {
          return moment(val, 'YYYY-MM-DD') <= moment();
        }
        return true;
      }),
      isValid: helpers.withMessage('La date de fin doit être sous la forme YYYY-MM-DD (ex : 2024-01-01).', (val: string) => {
        if (val) {
          return moment(val, 'YYYY-MM-DD', true).isValid();
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

async function loadData() {
  await v$.value.$validate();
  if (v$.value.$error) {
    return;
  }
  loading.value = true;
  const { data, error } = await api.getDataDepartement(formData.dateDebut, formData.dateFin, formData.area);
  if (data.value) {
    dataDepartement.value = data.value;
    territoire.value = areaOptions.value.find((a: any) => a.value === formData.area);
    sortData();
  }
  computeDisabled.value = true;
  loading.value = false;
}

function sortData() {
  loading.value = true;
  chartLineData.value = {
    labels: dataDepartement.value.map((d: any) => d.date),
    datasets: [
      {
        label: 'Vigilance',
        data: dataDepartement.value.map((d: any) => d.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'vigilance' ? 1 : 0), 0)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FFEDA0',
        backgroundColor: '#FFEDA080',
      },
      {
        label: 'Alerte',
        data: dataDepartement.value.map((d: any) => d.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'alerte' ? 1 : 0), 0)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FEB24C',
        backgroundColor: '#FEB24C80',
      },
      {
        label: 'Alerte renforcée',
        data: dataDepartement.value.map((d: any) => d.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'alerte_renforcee' ? 1 : 0), 0)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FC4E2A',
        backgroundColor: '#FC4E2A80',
      },
      {
        label: 'Crise',
        data: dataDepartement.value.map((d: any) => d.departements.reduce((acc: number, dep: any) => acc + (dep.niveauGravite === 'crise' ? 1 : 0), 0)),
        fill: {
          target: 'stack',
        },
        borderColor: '#B10026',
        backgroundColor: '#B1002680',
      },
    ],
  };
  loading.value = false;
}

loadData();

const tooltipTitle = (tooltipItems: any[]): string => {
  return moment(tooltipItems[0].parsed.x).format('DD/MM/YYYY');
};

const chartLineOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'week',
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      min: 0,
      suggestedMax: 5,
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    tooltip: {
      callbacks: {
        title: tooltipTitle,
      },
    },
    legend: {
      position: 'bottom',
    },
  },
};

async function downloadGraph() {
  html2canvas(screenshotZone.value, { scale: 2 }).then((canvas) => {
    const content = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = content.replace('image/png', 'image/octet-stream');
    a.download = `graphique_departements_${territoire.value.text}_${formData.dateDebut}_${formData.dateFin}.png`;
    a.click();

  });
}

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
  <div ref="screenshotZone">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-lg-3 fr-col-12">
        <DsfrInputGroup :error-message="utils.showInputError(v$, 'area')">
          <DsfrSelect label="Territoire"
                      v-model="formData.area"
                      @update:modelValue="computeDisabled = false"
                      :options="areaOptions"
                      required />
        </DsfrInputGroup>
      </div>
      <div class="fr-col-lg-3 fr-col-6">
        <DsfrInputGroup :error-message="utils.showInputError(v$, 'dateDebut')">
          <DsfrInput
            id="dateDebut"
            v-model="formData.dateDebut"
            @update:modelValue="computeDisabled = false"
            label="Date début"
            label-visible
            type="date"
            name="dateCarte"
            :min="dateMin"
            :max="formData.dateFin"
            required
          />
        </DsfrInputGroup>
      </div>
      <div class="fr-col-lg-3 fr-col-6">
        <DsfrInputGroup :error-message="utils.showInputError(v$, 'dateFin')">
          <DsfrInput
            id="dateFin"
            v-model="formData.dateFin"
            @update:modelValue="computeDisabled = false"
            label="Date fin"
            label-visible
            type="date"
            name="dateCarte"
            :min="formData.dateDebut"
            :max="currentDate"
            required
          />
        </DsfrInputGroup>
      </div>
      <div data-html2canvas-ignore="true" class="fr-col-lg-3 fr-col-6">
        <DsfrButton :disabled="computeDisabled"
                    @click="loadData()">
          Calculer
        </DsfrButton>
      </div>
    </div>
    <template v-if="!loading">
      <Line v-if="chartLineData"
            id="departement-chart-line"
            :options="chartLineOptions"
            :data="chartLineData" />
    </template>
  </div>
  <template v-if="!loading">
    <div class="text-align-right fr-mt-1w">
      <DsfrButton @click="downloadGraph()">
        Télécharger le graphique en .png
      </DsfrButton>
    </div>

    <DonneesDepartementTable class="fr-mt-4w"
                             :dataDepartement="dataDepartement"
                             :territoire="territoire?.text"
                             :dateDebut="dateDebut"
                             :dateFin="dateFin" />
  </template>
  <template v-else>
    <div class="fr-grid-row fr-grid-row--center fr-my-2w">
      <Loader :show="true" />
    </div>
  </template>
</template>

<style lang="scss" scoped>
.fr-grid-row {
  align-items: end;

  :deep(.fr-select-group) {
    margin-bottom: 0;
  }
}
</style>