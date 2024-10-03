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
import { useRefDataStore } from '../../store/refData';
import { BassinVersant } from '../../dto/bassinVersant.dto';
import { Region } from '../..//dto/region.dto';
import { Departement } from '../..//dto/departement.dto';
import html2canvas from 'html2canvas';
import moment from 'moment/moment';
import { helpers, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import utils from '../../utils';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, LineController, TimeScale, ArcElement, Colors, Filler);

const refDataStore = useRefDataStore();
const loading = ref(false);
const chartLineData = ref(null);
const dataArea = ref(null);
const computeDisabled = ref(true);

const dateMin = ref('2013-01-01');
const tmp = new Date();
tmp.setFullYear(tmp.getFullYear() - 1);
const currentDate = ref(new Date().toISOString().split('T')[0]);
const territoire = ref();
const screenshotZone = ref();

const typesEauOptions = [
  {
    text: 'Eau potable',
    value: 'AEP',
  },
  {
    text: `Eau superficielle`,
    value: 'ESU',
  }, {
    text: 'Eau souterraine',
    value: 'ESO',
  },
];

const areaOptions = ref([]);

const formData = reactive({
  typeEau: 'AEP',
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
    typeEau: {
      required: helpers.withMessage('Le type d\'eau est obligatoire.', required),
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
  const { data, error } = await api.getDataArea(formData.dateDebut, formData.dateFin, formData.area);
  if (data.value) {
    dataArea.value = data.value;
    territoire.value = areaOptions.value.find((a: any) => a.value === formData.area);
    sortData();
  }
  computeDisabled.value = true;
  loading.value = false;
}

function sortData() {
  loading.value = true;
  chartLineData.value = {
    labels: dataArea.value.map((s: any) => s.date),
    datasets: [
      {
        label: 'Vigilance',
        data: dataArea.value.map((s: any) => Number(s[formData.typeEau].vigilance)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FFEDA0',
        backgroundColor: '#FFEDA080',
      },
      {
        label: 'Alerte',
        data: dataArea.value.map((s: any) => Number(s[formData.typeEau].alerte)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FEB24C',
        backgroundColor: '#FEB24C80',
      },
      {
        label: 'Alerte renforcée',
        data: dataArea.value.map((s: any) => Number(s[formData.typeEau].alerte_renforcee)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FC4E2A',
        backgroundColor: '#FC4E2A80',
      },
      {
        label: 'Crise',
        data: dataArea.value.map((s: any) => Number(s[formData.typeEau].crise)),
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
      ticks: {
        callback: (value: number) => `${value}%`,
      },
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
    a.download = `graphique_surface_${territoire.value.text}_${formData.dateDebut}_${formData.dateFin}_${formData.typeEau}.png`;
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
      <div class="fr-col-lg-2 fr-col-6">
        <DsfrInputGroup :error-message="utils.showInputError(v$, 'typeEau')">
          <DsfrSelect label="Type d'eau"
                      v-model="formData.typeEau"
                      @update:modelValue="sortData()"
                      :options="typesEauOptions"
                      required />
        </DsfrInputGroup>
      </div>
      <div class="fr-col-lg-2 fr-col-6">
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
      <div data-html2canvas-ignore="true" class="fr-col-lg-2 fr-col-6">
        <DsfrButton :disabled="computeDisabled"
                    @click="loadData()">
          Calculer
        </DsfrButton>
      </div>
    </div>
    <div class="fr-col-12">
      <DsfrAlert data-html2canvas-ignore="true" type="info" class="fr-my-2w">
        Nous ne sommes pas en mesure de fournir les restrictions appliquées sur l'eau potable avant le 28/04/2024. Pour
        connaître les niveaux de restrictions en vigueur, veuillez vous référer aux niveaux de restrictions des eaux
        superficielles et souterraines.
      </DsfrAlert>
    </div>
    <template v-if="!loading">
      <Line v-if="chartLineData"
            id="area-chart-line"
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

    <DonneesAreaTable class="fr-mt-4w"
                      :dataArea="dataArea"
                      :typeEau="formData.typeEau"
                      :territoire="territoire?.text"
                      :dateDebut="formData.dateDebut"
                      :dateFin="formData.dateFin" />
  </template>
  <template v-if="loading">
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