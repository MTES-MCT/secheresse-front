<script setup lang="ts">
import { Ref } from 'vue';
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
  TimeScale,
  ArcElement,
  Colors,
} from 'chart.js';
import 'chartjs-adapter-luxon';
import api from '../../api';
import utils from '../../utils';

definePageMeta({
  layout: 'basic',
});

const appName = useRuntimeConfig().public.appName;
useHead({
  title: `Statistiques - ${useRuntimeConfig().public.appName}`,
});

const links: Ref<any[]> = ref([{ 'to': '/', 'text': 'Accueil' }, { 'text': 'Statistiques' }]);

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, LineController, TimeScale, ArcElement, Colors);

const { data, error } = await api.getStats();
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <div>
      <h1>Statistiques depuis le 10 Juillet 2023</h1>
      <template v-if="data">
        <div class="fr-grid-row fr-grid-row--top fr-grid-row--gutters">
          <div class="fr-col-12">
            <StatsLineChart :stats="data" />
          </div>
          <div class="fr-col-12 fr-col-md-6">
            <StatsProfileRepartition :stats="data" />
          </div>
          <div class="fr-col-12 fr-col-md-6">
            <DsfrCallout :title="utils.numberWithSpaces(data.subscriptions)"
                         content="personnes abonnées aux alertes mail - qui informent l'usager sur un changement de niveau de gravité sur sa zone"
            />
          </div>
          <div class="fr-col-12">
            <StatsDepartementWrapper :stats="data" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>