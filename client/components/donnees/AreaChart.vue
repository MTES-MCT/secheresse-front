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
import { useRefDataStore } from '../../store/refData';
import { BassinVersant } from '../../dto/bassinVersant.dto';
import { Region } from '../..//dto/region.dto';
import { Departement } from '../..//dto/departement.dto';
import html2canvas from 'html2canvas';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, LineController, TimeScale, ArcElement, Colors, Filler);

const refDataStore = useRefDataStore();
const loading = ref(false);
const chartLineData = ref(null);
const dataArea = ref(null);
const computeDisabled = ref(true);

const dateMin = ref('2013-01-01');
const tmp = new Date();
tmp.setFullYear(tmp.getFullYear() - 1);
const dateDebut = ref(tmp.toISOString().split('T')[0]);
const dateFin = ref(new Date().toISOString().split('T')[0]);
const currentDate = ref(new Date().toISOString().split('T')[0]);
const typeEau = ref('AEP');
const area = ref('');
const territoire = ref();
const screenshotZone = ref();

const typesEauOptions = [
  {
    text: 'Eau potable',
    value: 'AEP',
  },
  {
    text: `Eau superficielle`,
    value: 'ESU',
  }, {
    text: 'Eau souterraine',
    value: 'ESO',
  },
];

const areaOptions = ref([]);

async function loadData() {
  loading.value = true;
  const { data, error } = await api.getDataArea(dateDebut.value, dateFin.value, area.value);
  if (data.value) {
    dataArea.value = data.value;
    territoire.value = areaOptions.value.find((a: any) => a.value === area.value);
    sortData();
  }
  computeDisabled.value = true;
  loading.value = false;
}

function sortData() {
  loading.value = true;
  chartLineData.value = {
    labels: dataArea.value.map((s: any) => s.date),
    datasets: [
      {
        label: 'Vigilance',
        data: dataArea.value.map((s: any) => Number(s[typeEau.value].vigilance)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FFEDA0',
        backgroundColor: '#FFEDA080',
      },
      {
        label: 'Alerte',
        data: dataArea.value.map((s: any) => Number(s[typeEau.value].alerte)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FEB24C',
        backgroundColor: '#FEB24C80',
      },
      {
        label: 'Alerte renforcée',
        data: dataArea.value.map((s: any) => Number(s[typeEau.value].alerte_renforcee)),
        fill: {
          target: 'stack',
        },
        borderColor: '#FC4E2A',
        backgroundColor: '#FC4E2A80',
      },
      {
        label: 'Crise',
        data: dataArea.value.map((s: any) => Number(s[typeEau.value].crise)),
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
      beginAtZero: true,
      min: 0,
      suggestedMax: 5,
      ticks: {
        callback: (value: number) => `${value}%`,
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
      },
    },
    legend: {
      position: 'bottom',
    },
  },
};

async function downloadGraph() {
  html2canvas(screenshotZone.value, { scale: 2 }).then((canvas) => {
    const content = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = content.replace('image/png', 'image/octet-stream');
    a.download = `graphique_surface_${territoire.value.text}_${dateDebut.value}_${dateFin.value}_${typeEau.value}.png`;
    a.click();
  });
}

watch(() => refDataStore.departements, () => {
  areaOptions.value = [{
    text: 'France entière',
    value: '',
  }];
  areaOptions.value.push({
    text: 'Bassins Versants',
    disabled: true,
  });
  refDataStore.bassinsVersants.forEach((b: BassinVersant) => {
    areaOptions.value.push({
      text: b.nom,
      value: `bassinVersant=${b.id}`,
    });
  });
  areaOptions.value.push({
    text: 'Régions',
    disabled: true,
  });
  refDataStore.regions.forEach((r: Region) => {
    areaOptions.value.push({
      text: r.nom,
      value: `region=${r.id}`,
    });
  });
  areaOptions.value.push({
    text: 'Départements',
    disabled: true,
  });
  refDataStore.departements.forEach((d: Departement) => {
    areaOptions.value.push({
      text: d.nom,
      value: `departement=${d.id}`,
    });
  });
}, {
  immediate: true,
});
</script>

<template>
  <div ref="screenshotZone">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-lg-2 fr-col-6">
        <DsfrSelect label="Type d'eau"
                    v-model="typeEau"
                    @update:modelValue="sortData()"
                    :options="typesEauOptions" />
      </div>
      <div class="fr-col-lg-2 fr-col-6">
        <DsfrSelect label="Territoire"
                    v-model="area"
                    @update:modelValue="computeDisabled = false"
                    :options="areaOptions" />
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
      <div class="fr-col-lg-2 fr-col-6">
        <DsfrButton :disabled="computeDisabled"
                    @click="loadData()">
          Calculer
        </DsfrButton>
      </div>
    </div>
    <div class="fr-col-12">
      <DsfrAlert type="info" class="fr-my-2w">
        Nous ne sommes pas en mesure de fournir les restrictions appliquées sur l'eau potable avant le 28/04/2024. Pour
        connaître les niveaux de restrictions en vigueur; veuillez vous référer aux niveaux de restrictions des eaux
        superficielles et souterraines.
      </DsfrAlert>
    </div>
    <template v-if="!loading">
      <Line v-if="chartLineData"
            id="area-chart-line"
            :options="chartLineOptions"
            :data="chartLineData" />
    </template>
  </div>
  <template v-if="!loading">
    <div class="text-align-right fr-mt-1w">
      <DsfrButton @click="downloadGraph()">
        Télécharger le graphique en .png
      </DsfrButton>
    </div>

    <DonneesAreaTable class="fr-mt-4w"
                      :dataArea="dataArea"
                      :typeEau="typeEau"
                      :territoire="territoire?.text"
                      :dateDebut="dateDebut"
                      :dateFin="dateFin" />
  </template>
  <template v-if="loading">
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