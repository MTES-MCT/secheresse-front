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


ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, LineController, TimeScale, ArcElement, Colors, Filler);

const loading = ref(false);
const chartLineData = ref(null);
const dataArea = ref(null);
const computeDisabled = ref(true);

const dateMin = ref('2013-01-01');
const tmp = new Date();
tmp.setFullYear(tmp.getFullYear() - 1);
const dateDebut = ref(tmp.toISOString().split('T')[0]);
const dateFin = ref(new Date().toISOString().split('T')[0]);
const currentDate = ref(new Date().toISOString().split('T')[0]);
const typeEau = ref('AEP');
const area = ref('all');

const typesEauOptions = [
  {
    text: 'Eau potable',
    value: 'AEP',
  },
  {
    text: `Eau superficielle`,
    value: 'ESO',
  }, {
    text: 'Eau souterraine',
    value: 'ESU',
  },
];

const areaOptions = [
  {
    text: 'France entière',
    value: 'all',
  },
  {
    text: `Métropole`,
    value: 'metropole',
  }, {
    text: 'DROM',
    value: 'drom',
  },
];

async function loadData() {
  loading.value = true;
  const { data, error } = await api.getDataArea(dateDebut.value, dateFin.value);
  if (data.value) {
    dataArea.value = data.value;
    sortData();
  }
  loading.value = false;
}

function sortData() {
  loading.value = true;
  chartLineData.value = {
    labels: dataArea.value.map((s: any) => s.date),
    datasets: [
      {
        label: 'Vigilance',
        data: dataArea.value.map((s: any) => Number(s[typeEau.value].vigilance)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FFEDA0',
        backgroundColor: '#FFEDA080',
      },
      {
        label: 'Alerte',
        data: dataArea.value.map((s: any) => Number(s[typeEau.value].alerte)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FEB24C',
        backgroundColor: '#FEB24C80',
      },
      {
        label: 'Alerte renforcée',
        data: dataArea.value.map((s: any) => Number(s[typeEau.value].alerte_renforcee)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FC4E2A',
        backgroundColor: '#FC4E2A80',
      },
      {
        label: 'Crise',
        data: dataArea.value.map((s: any) => Number(s[typeEau.value].crise)),
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
  const date = new Date(tooltipItems[0].parsed.x);
  const year: string | number = date.getFullYear();
  let month: string | number = date.getMonth() + 1;
  let dt: string | number = date.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return `${dt}/${month}/${year}`;
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
  },
};
</script>

<template>
  <h4>Evolution journalière du pourcentage de la surface concernée par des niveaux de gravité</h4>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-2">
      <DsfrSelect label="Type d'eau"
                  v-model="typeEau"
                  @update:modelValue="sortData()"
                  :options="typesEauOptions" />
    </div>
    <div class="fr-col-2">
      <DsfrSelect label="Territoire"
                  disabled
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
        type="date"
        name="dateCarte"
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
        type="date"
        name="dateCarte"
        :min="dateDebut"
        :max="currentDate"
      />
    </div>
    <div class="fr-col-2">
      <DsfrButton :disabled="computeDisabled"
                  @click="loadData()">
        Calculer
      </DsfrButton>
    </div>
  </div>
  <Line v-if="!loading && chartLineData"
        :options="chartLineOptions"
        :data="chartLineData"
        :style="{'min-height': '400px'}" />
</template>

<style lang="scss" scoped>
.fr-grid-row {
  align-items: end;
}
</style>