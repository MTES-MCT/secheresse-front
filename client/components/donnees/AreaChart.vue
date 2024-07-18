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

async function loadData() {
  loading.value = true;
  const { data, error } = await api.getDataArea('2024-07-15', '2024-07-18');
  if (data.value) {
    chartLineData.value = {
      labels: data.value.map((s: any) => s.date),
      datasets: [
        {
          label: 'Vigilance',
          data: data.value.map((s: any) => Number(s.AEP.vigilance)),
          fill: {
            target: 'stack',
          },
          borderColor: '#FFEDA0',
          backgroundColor: '#FFEDA080',
        },
        {
          label: 'Alerte',
          data: data.value.map((s: any) => Number(s.AEP.alerte)),
          fill: {
            target: 'stack',
          },
          borderColor: '#FEB24C',
          backgroundColor: '#FEB24C80',
        },
        {
          label: 'Alerte renforcée',
          data: data.value.map((s: any) => Number(s.AEP.alerte_renforcee)),
          fill: {
            target: 'stack',
          },
          borderColor: '#FC4E2A',
          backgroundColor: '#FC4E2A80',
        },
        {
          label: 'Crise',
          data: data.value.map((s: any) => Number(s.AEP.crise)),
          fill: {
            target: 'stack',
          },
          borderColor: '#B10026',
          backgroundColor: '#B1002680',
        },
      ],
    };
  }
  data.value?.forEach((d: any) => {
    console.log(d);
  });
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
    }
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
  <Line v-if="chartLineData"
        :options="chartLineOptions"
        :data="chartLineData"
        :style="{'min-height': '400px'}" />
</template>