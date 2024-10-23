<script setup lang="ts">
import { ChartOptions } from "chart.js";
import { Line } from "vue-chartjs";
import moment from 'moment';

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
  return moment(tooltipItems[0].parsed.x).format('DD/MM/YYYY');
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