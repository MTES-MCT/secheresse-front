<script setup lang="ts">
import { ChartOptions } from "chart.js";
import { Line } from "vue-chartjs";

const props = defineProps<{
  stats: any
}>();

const chartLineData = {
  labels: props.stats.statsByDay.map((s: any) => s.date),
  datasets: [
    {
      label: 'Visiteurs',
      data: props.stats.statsByDay.map((s: any) => s.visits)
    },
    {
      label: 'Recherche de restrictions',
      data: props.stats.statsByDay.map((s: any) => s.restrictionsSearch)
    },
    {
      label: 'Téléchargement d\'arrêtés',
      data: props.stats.statsByDay.map((s: any) => s.arreteDownloads)
    }
  ]
};

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
</script>

<template>
  <DsfrCallout>
    <Line :options="chartLineOptions"
          :data="chartLineData"
          :style="{'min-height': '400px'}"/>
  </DsfrCallout>  
</template>