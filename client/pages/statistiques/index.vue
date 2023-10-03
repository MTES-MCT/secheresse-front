<script setup lang="ts">
import { Ref } from "vue";
import { Line, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
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

if (data.value) {

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
      backgroundColor: ['#000091', '#c9191e', '#18753c', '#FEB24C'],
      data: []
    }]
  };
  const profiles = Object.keys(Profile);
  profiles.forEach(p => {
    chartePieData.datasets[0].data.push(data.value.profileRepartition[p]);
  });
}

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
  maintainAspectRatio: false,
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

const tooltipPieLabel = (tooltipItem: any): string => {
  let sum = tooltipItem.dataset.data.reduce((a: number, b: number) => {
    return a + b;
  })
  const percentage = (tooltipItem.raw * 100 / sum).toFixed(2) + "%";

  return `${sum} (${percentage})`;
};

const chartPieOptions: ChartOptions = {
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: tooltipPieLabel,
      }
    }
  }
}
</script>

<template>
  <DsfrBreadcrumb :links='links'/>
  <div>
    <h1>Statistiques depuis le 10 Juillet 2023</h1>
    <template v-if="data">
      <div class="fr-grid-row fr-grid-row--top fr-grid-row--gutters">
        <div class="fr-col-12">
          <DsfrCallout>
            <Line :options="chartLineOptions"
                  :data="chartLineData"
                  :style="{'min-height': '400px'}"/>
          </DsfrCallout>
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrCallout title="Répartition des profils des visiteurs sur les 30 derniers jours">
            <Doughnut :options="chartPieOptions"
                      :data="chartePieData"
                      :style="{'max-height': '400px'}"/>
          </DsfrCallout>
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrCallout :title="data.subscriptions"
                       content="personnes abonnées aux notifications de changement de niveau d'alerte"
          />
        </div>
      </div>
    </template>
  </div>
</template>