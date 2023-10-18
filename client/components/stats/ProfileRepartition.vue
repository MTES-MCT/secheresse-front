<script setup lang="ts">
import { ChartOptions } from "chart.js";
import { Doughnut } from "vue-chartjs";
import { Profile } from "../../dto/profile.enum";
import utils from "../../utils";

const props = defineProps<{
  stats: any
}>();

const chartePieData = {
  labels: Object.values(Profile),
  datasets: [{
    data: []
  }]
};
const profiles = Object.keys(Profile);
profiles.forEach(p => {
  chartePieData.datasets[0].data.push(props.stats.profileRepartition[p]);
});

const tooltipPieLabel = (tooltipItem: any): string => {
  let sum = tooltipItem.dataset.data.reduce((a: number, b: number) => {
    return a + b;
  })
  const percentage = (tooltipItem.raw * 100 / sum).toFixed(2) + "%";

  return `${utils.numberWithSpaces(tooltipItem.raw)} (${percentage})`;
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
  <DsfrCallout title="Répartition des profils des visiteurs sur les 30 derniers jours">
    <Doughnut :options="chartPieOptions"
              :data="chartePieData"
              :style="{'max-height': '400px'}"/>
  </DsfrCallout>
</template>