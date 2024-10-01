<script setup lang="ts">
import api from '../../api';
import {
  ArcElement, BarElement,
  CategoryScale,
  Chart as ChartJS, ChartOptions, Colors, Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-luxon';
import { Bar } from 'vue-chartjs';
import moment from 'moment';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, TimeScale, ArcElement, Colors, Filler);

const props = defineProps<{
  codeInsee: string,
}>();

const emit = defineEmits<{
  commune: any;
}>();

const communeStats = ref(null);
const showError = ref(false);
const router = useRouter();
const route = useRoute();
const errorButtons = [
  {
    label: 'Page d\'accueil',
    onClick: () => {
      router.push('/');
    },
  },
];
const computeDisabled = ref(true);
const dateMin = ref('2013-01-01');
const tmp = new Date();
tmp.setFullYear(tmp.getFullYear() - 1);
const dateDebut = ref(route.query.dateDebut ? route.query.dateDebut : dateMin.value);
const dateFin = ref(route.query.dateFin ? route.query.dateFin : new Date().toISOString().split('T')[0]);
const currentDate = ref(new Date().toISOString().split('T')[0]);
const chartLineData = ref(null);
const typeEau = ref('SUP');
const loading = ref(true);

const typesEauOptions = [
  {
    text: 'Eau potable',
    value: 'AEP',
  },
  {
    text: `Eau superficielle`,
    value: 'SUP',
  }, {
    text: 'Eau souterraine',
    value: 'SOU',
  },
];

onMounted(async () => {
  const { data, error } = await api.getDataCommune(props.codeInsee);
  if (data.value) {
    communeStats.value = data.value;
    emit('commune', communeStats.value.commune);
    sortData();
  } else if (error.value) {
    showError.value = true;
  }
  loading.value = false;
});

function sortData() {
  const restrictions = communeStats.value.restrictions.filter((r: any) => {
    return moment(r.date, 'YYYY-MM-DD').isSameOrAfter(moment(dateDebut.value, 'YYYY-MM-DD')) &&
      moment(r.date, 'YYYY-MM-DD').isSameOrBefore(moment(dateFin.value, 'YYYY-MM-DD'));
  });
  chartLineData.value = {
    labels: restrictions.map((r: any) => r.date),
    datasets: [
      {
        label: `${communeStats.value?.commune.nom}`,
        data: restrictions.map((r: any) => {
          switch (r[typeEau.value]) {
            case 'vigilance':
              return 1;
            case 'alerte':
              return 2;
            case 'alerte_renforcee':
              return 3;
            case 'crise':
              return 4;
            default:
              return 0;
          }
        }),
        backgroundColor: (context: any) => colorFunction(context.raw),
        segment: {},
      },
    ],
  };
}

function colorFunction(yval: any) {
  switch (yval) {
    case 4:
      return '#B10026';
    case 3:
      return '#FC4E2A';
    case 2:
      return '#FEB24C';
    case 1:
      return '#FFEDA0';
    default:
      return '#9db5ff';
  }
}

function labelFunction(value: any) {
  switch (value) {
    case 4:
      return 'Crise';
    case 3:
      return 'Alerte renforcée';
    case 2:
      return 'Alerte';
    case 1:
      return 'Vigilance';
    case 0:
      return 'Pas de restrictions';
  }
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
  maintainAspectRatio: true,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'week',
      },
    },
    y: {
      beginAtZero: true,
      min: 0,
      ticks: {
        callback: (value: number) => labelFunction(value),
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
        label: (value) => labelFunction(value.raw),
      },
    },
    legend: {
      display: false,
    },
  },
};

async function downloadGraph() {
  const el = document.getElementById('area-chart-line') as HTMLCanvasElement;
  const content = el.toDataURL('image/png');

  const a = document.createElement('a');
  a.href = content.replace('image/png', 'image/octet-stream');
  a.download = `commune_${props.codeInsee}.png`;
  a.click();
}
</script>

<template>
  <template v-if="!loading">
    <template v-if="!showError && communeStats">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-lg-3 fr-col-12">
          <DsfrSelect label="Type d'eau"
                      v-model="typeEau"
                      @update:modelValue="computeDisabled = false"
                      :options="typesEauOptions" />
        </div>
        <div class="fr-col-lg-3 fr-col-6">
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
        <div class="fr-col-lg-3 fr-col-6">
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
        <div class="fr-col-lg-3 fr-col-6">
          <DsfrButton :disabled="computeDisabled"
                      @click="sortData()">
            Calculer
          </DsfrButton>
        </div>
      </div>
      <Bar v-if="chartLineData"
           id="area-chart-line"
           :options="chartLineOptions"
           :data="chartLineData" />

      <div class="text-align-right fr-mt-1w">
        <DsfrButton @click="downloadGraph()">
          Télécharger le graphique en .png
        </DsfrButton>
      </div>
    </template>
    <template v-else>
      <DsfrErrorPage class="fr-mt-8w"
                     title="Oups, une erreur est survenue"
                     subtitle="Il semblerait qu'il y ai un problème avec le code INSEE de votre commune."
                     description=""
                     help=""
                     :buttons="errorButtons"
      />
    </template>
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