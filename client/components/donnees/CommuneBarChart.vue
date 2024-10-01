<script setup lang="ts">
import {
  ArcElement, BarElement,
  CategoryScale,
  Chart as ChartJS, ChartOptions, Colors, Filler,
  Legend,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-luxon';
import { Bar } from 'vue-chartjs';
import moment from 'moment';
import { RestrictionNiveauGraviteFr } from '../../dto/restriction.dto';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, TimeScale, ArcElement, Colors, Filler);

const props = defineProps<{
  typeEau: string,
  restrictions: any[],
  communeNom: string,
}>();

const chartLineData = ref(null);

function computeBarChart() {
  chartLineData.value = {
    labels: props.restrictions.map((r: any) => r.date),
    datasets: [
      {
        label: `${props.communeNom}`,
        data: props.restrictions.map((r: any) => 1),
        backgroundColor: (context: any) => colorFunction(context),
        segment: {},
      },
    ],
  };
}

function colorFunction(context: any) {
  const restriction = props.restrictions[context.index];
  let r = null;
  const niveauGravitePriority = {
    null: 0,
    'vigilance': 1,
    'alerte': 2,
    'alerte_renforcee': 3,
    'crise': 4,
  };
  if(!props.typeEau) {
    r = Math.max(niveauGravitePriority[restriction.AEP], niveauGravitePriority[restriction.SUP], niveauGravitePriority[restriction.SOU]);
  } else {
    r = niveauGravitePriority[restriction[props.typeEau]];
  }
  switch (r) {
    case 4:
      return '#B10026';
    case 3:
      return '#FC4E2A';
    case 2:
      return '#FEB24C';
    case 1:
      return '#FFEDA0';
    default:
      return '#e8edff';
  }
}

function labelFunction(value: any) {
  const restriction = props.restrictions[value.dataIndex];
  switch (restriction[props.typeEau]) {
    case 'crise':
    case 'alerte_renforcee':
    case 'alerte':
    case 'vigilance':
      return RestrictionNiveauGraviteFr[restriction[props.typeEau]];
    default:
      return 'Pas de restrictions';
  }
}

const tooltipTitle = (tooltipItems: any[]): string => {
  return moment(tooltipItems[0].parsed.x).format('DD/MM/YYYY');
};

const chartLineOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  barPercentage: 1,
  categoryPercentage: 1,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'week',
      },
      grid: {
        display: false,
        borderColor: 'rgba(0, 0, 0, 0)',
      },
    },
    y: {
      beginAtZero: true,
      min: 0,
      ticks: {
        display: false,
      },
      grid: {
        display: false,
        borderColor: 'rgba(0, 0, 0, 0)',
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
        label: (value) => labelFunction(value),
      },
    },
    legend: {
      display: false,
    },
  },
};

watch(() => props.restrictions, () => {
  computeBarChart();
}, { immediate: true });
</script>

<template>
  <div class="chart-container">
    <Bar v-if="chartLineData"
         id="area-chart-line"
         :options="chartLineOptions"
         :data="chartLineData" />
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  max-height: 400px;
}

.fr-grid-row {
  align-items: end;
}
</style>