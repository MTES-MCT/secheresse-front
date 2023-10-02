<script setup lang="ts">
import { Ref } from "vue";
import { Line, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  ChartOptions,
  TimeScale,
  ArcElement
} from 'chart.js';
import 'chartjs-adapter-luxon';
import api from "../../api";
import { Profile } from "../../dto/profile.enum";

definePageMeta({
  layout: 'basic',
})

const appName = useRuntimeConfig().public.appName;
useHead({
  title: `Statistiques - ${useRuntimeConfig().public.appName}`
})

const links: Ref<any[]> = ref([{"to": "/", "text": "Accueil"}, {"text": "Statistiques"}])

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, LineController, TimeScale, ArcElement)

const {data, error} = await api.getStats();
const chartLineData = {
  labels: data.value.statsByDay.map((s: any) => s.date),
  datasets: [
    {
      label: 'Visiteurs',
      backgroundColor: '#000091',
      borderColor: '#000091',
      data: data.value.statsByDay.map((s: any) => s.visits)
    },
    {
      label: 'Recherche de restrictions',
      backgroundColor: '#c9191e',
      borderColor: '#c9191e',
      data: data.value.statsByDay.map((s: any) => s.restrictionsSearch)
    },
    {
      label: 'Téléchargement d\'arrêtés',
      backgroundColor: '#18753c',
      borderColor: '#18753c',
      data: data.value.statsByDay.map((s: any) => s.arreteDownloads)
    }
  ]
};

const chartePieData = {
  labels: Object.values(Profile),
  datasets: [{
    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
    data: []
  }]
};
const profiles = Object.keys(Profile);
profiles.forEach(p => {
  chartePieData.datasets[0].data.push(data.value.profileRepartition[p]);
})

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
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'week'
      }
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
      }
    }
  }
};

const chartPieOptions: ChartOptions = {
  responsive: true,
}
</script>

<template>
  <DsfrBreadcrumb :links='links'/>
  <div class="fr-mt-8w">
    <h1>Statistiques</h1>
    <template v-if="data">
      <Line :options="chartLineOptions" :data="chartLineData"/>
      <div class="fr-grid-row fr-grid-row--middle">
        <DsfrCallout :title="data.subscriptions"
                     class="fr-col-12 fr-col-md-6"
                     content="personnes abonnées aux notifications de changement de niveau d'alerte"
        />
        <Doughnut :options="chartPieOptions"
                  :data="chartePieData"
                  class="fr-col-12 fr-col-md-6"
                  :style="{'max-height': '400px'}"/>
      </div>
    </template>
  </div>
</template>