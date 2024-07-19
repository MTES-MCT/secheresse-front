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
const dataDepartement = ref(null);
const computeDisabled = ref(true);

const dateMin = ref('2013-01-01');
const tmp = new Date();
tmp.setFullYear(tmp.getFullYear() - 1);
const dateDebut = ref(tmp.toISOString().split('T')[0]);
const dateFin = ref(new Date().toISOString().split('T')[0]);
const currentDate = ref(new Date().toISOString().split('T')[0]);
const area = ref('all');

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
  const { data, error } = await api.getDataDepartement(dateDebut.value, dateFin.value);
  if (data.value) {
    dataDepartement.value = data.value;
    sortData();
  }
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
</script>

<template>
  <h4>Evolution journalière du nombre de départements soumis à restriction</h4>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-3">
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
    <div class="fr-col-3">
      <DsfrButton :disabled="computeDisabled"
                  @click="loadData()">
        Calculer
      </DsfrButton>
    </div>
  </div>
  <template v-if="!loading">
    <Line v-if="chartLineData"
          :options="chartLineOptions"
          :data="chartLineData"
          :style="{'min-height': '400px'}" />
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
}
</style>