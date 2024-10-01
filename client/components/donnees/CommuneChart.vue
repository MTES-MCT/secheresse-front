<script setup lang="ts">
import api from '../../api';
import moment from 'moment';
import html2canvas from 'html2canvas';

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
const loading = ref(false);
const restrictionsFiltered = ref([]);
const screenshotZone = ref();

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
  loading.value = true;
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
  restrictionsFiltered.value = communeStats.value.restrictions.filter((r: any) => {
    return moment(r.date, 'YYYY-MM-DD').isSameOrAfter(moment(dateDebut.value, 'YYYY-MM-DD')) &&
      moment(r.date, 'YYYY-MM-DD').isSameOrBefore(moment(dateFin.value, 'YYYY-MM-DD'));
  });
}

async function downloadGraph() {
  html2canvas(screenshotZone.value, { scale: 2 }).then((canvas) => {
    const content = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = content.replace('image/png', 'image/octet-stream');
    a.download = `commune_${props.codeInsee}_${dateDebut.value}_${dateFin.value}.png`;
    a.click();
  });
}
</script>

<template>
  <template v-if="!loading">
    <template v-if="!showError && communeStats">
      <div ref="screenshotZone">
        <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
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
          <div class="fr-col-12">
            <DsfrAlert type="info" class="fr-my-2w">
              Nous ne sommes pas en mesure de fournir les restrictions appliquées sur l'eau potable avant le 28/04/2024.
              Pour connaître les niveaux de restrictions en vigueur; veuillez vous référer aux niveaux de restrictions
              des
              eaux superficielles et souterraines.
            </DsfrAlert>
          </div>
        </div>
        <h6 class="fr-mb-1w">Tout type d'eau</h6>
        <DonneesCommuneBarChart :restrictions="restrictionsFiltered"
                                :communeNom="communeStats.commune.nom" />
        <div v-for="typeEau of typesEauOptions">
          <h6 class="fr-mb-1w">{{ typeEau.text }}</h6>
          <DonneesCommuneBarChart :typeEau="typeEau.value"
                                  :restrictions="restrictionsFiltered"
                                  :communeNom="communeStats.commune.nom" />
        </div>
        <div class="fr-grid-row">
          <DsfrBadge small
                     no-icon
                     class="situation-level-bg-0 fr-mr-1w fr-mt-1w"
                     label="pas de restrictions" />
          <DsfrBadge small
                     no-icon
                     class="situation-level-bg-1 fr-mr-1w fr-mt-1w"
                     label="vigilance" />
          <DsfrBadge small
                     no-icon
                     class="situation-level-bg-2 fr-mr-1w fr-mt-1w"
                     label="alerte" />
          <DsfrBadge small
                     no-icon
                     class="situation-level-bg-3 fr-mr-1w fr-mt-1w"
                     label="alerte renforcée" />
          <DsfrBadge small
                     no-icon
                     class="situation-level-bg-4 fr-mt-1w"
                     label="crise" />
        </div>
      </div>

      <div class="text-align-right fr-mt-1w">
        <DsfrButton @click="downloadGraph()">
          Télécharger le graphique en .png
        </DsfrButton>
      </div>

      <DonneesCommuneTable class="fr-mt-4w"
                           :dataCommune="restrictionsFiltered"
                           :communeNom="communeStats.commune.nom"
                           :dateDebut="dateDebut"
                           :dateFin="dateFin" />
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
.chart-container {
  max-height: 400px;
}

.fr-grid-row {
  align-items: end;
}

.situation-level-bg-0 {
  color: var(--grey-0-1000);
}

.situation-level-bg-1 {
  background-color: #FFEDA0;
  color: var(--grey-0-1000);
}
</style>