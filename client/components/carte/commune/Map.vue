<script setup lang="ts">
import * as maplibregl from 'maplibre-gl';
import { Ref } from 'vue';
import api from '../../../api';
import moment, { Moment } from 'moment';
import { useRefDataStore } from '../../../store/refData';
import CommuneWorker from '@/assets/workers/communeMap?worker';

const props = defineProps<{
  embedded: any,
  dateBegin: string,
  dateEnd: string,
  area: string,
}>();

const emit = defineEmits<{
  beginLoading: any;
  endLoading: any;
  downloadMap: any;
}>();

const refDataStore = useRefDataStore();
const computingCommunes: Ref<boolean> = ref(false);
const mapContainer = shallowRef(null);
const map: Ref<any> = shallowRef(null);
const isMapSupported: boolean = utils.isWebglSupported();
const showError = ref(false);
const communeSelected = ref(0);
const communeNameSelected: Ref<null | string> = ref(null);
const communeData = ref(null);
const communeDataComputed = ref(null);
const departementDataComputed = ref(null);
const maxPonderation = ref(0);
const router = useRouter();
const depsSelected = ref([]);
const expanded = ref(false);
const loading = ref(false);

const initialState = [[-7.075195, 41.211722], [11.403809, 51.248163]];

let firstSymbolId: any;

// Create a popup, but don't add it to the map yet.
const popup = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
}).setMaxWidth('350px');
popup.on('open', () => {
  setTimeout(() => {
    loadPopupData();
  }, 100);
});

onMounted(async () => {
  loading.value = true;
  // Load data
  communeData.value = (await api.getDataDuree()).data.value;
  loading.value = false;
});

onMounted(() => {
  if (!isMapSupported) {
    return;
  }

  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: `https://openmaptiles.data.gouv.fr/styles/osm-bright/style.json`,
    bounds: initialState,
    preserveDrawingBuffer: true,
  });


  // Add zoom and rotation controls to the map.
  map.value?.addControl(new maplibregl.NavigationControl(), 'bottom-right');

  // Add geolocate control to the map.
  map.value?.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    }), 'bottom-right',
  );

  // Add fullscreen control to the map.
  map.value?.addControl(new maplibregl.FullscreenControl(), 'bottom-right');

  map.value?.on('load', () => {
    const layers = map.value.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol') {
        firstSymbolId = layers[i].id;
        break;
      }
    }
    map.value?.addSource('decoupage-administratif', {
      type: 'vector',
      url:
        `https://openmaptiles.data.gouv.fr/data/decoupage-administratif.json`,
    });
    addSourceAndLayerZones();
    if (communeDataComputed.value) {
      showCommunesPonderation();
    }
  });

  map.value?.on('click', 'communes-data', async (e: any) => {
    const feature = e.features.some((f: any) => f.properties.plm) ?
      e.features.filter((f: any) => f.properties.plm)[0] : e.features[0];
    communeSelected.value = feature ? feature.properties.code : 0;
    communeNameSelected.value = feature ? feature.properties.nom : null;
    updateContourFilter();
    if (!feature) {
      return;
    }
    const description = utils.generatePopupCommuneHtml(communeNameSelected.value);
    popup.setLngLat(e.lngLat).setHTML(description).addTo(map.value);

    linkPopupBtn();
  });

  map.value?.on('mouseenter', 'zones-data', () => {
    // Change the cursor style as a UI indicator.
    map.value.getCanvas().style.cursor = 'pointer';
  });

  map.value?.on('mouseleave', 'zones-data', () => {
    map.value.getCanvas().style.cursor = '';
  });
});

onUnmounted(() => {
  map.value?.remove();
});

const mapTags: Ref<any[]> = ref([{
  label: 'Métropole',
  bounds: initialState,
}, {
  label: 'La Réunion',
  bounds: [[54.615784, -21.749296], [56.497192, -20.522216]],
}, {
  label: 'Guadeloupe',
  bounds: [[-62.119446, 15.612456], [-60.762634, 16.617770]],
}, {
  label: 'Martinique',
  bounds: [[-61.480865, 14.193832], [-60.570374, 14.964687]],
}, {
  label: 'Mayotte',
  bounds: [[44.748688, -13.175771], [45.532837, -12.507643]],
}, {
  label: 'Guyane',
  bounds: [[-55.261230, 1.790480], [-51.130371, 6.107784]],
}]);

const legende = [
  {
    color: `rgba(0, 0, 0, 0)`,
  },
  {
    color: `rgb(227, 227, 253)`,
  },
  {
    color: `rgb(168, 168, 209)`,
  },
  {
    color: `rgb(110, 110, 165)`,
  },
  {
    color: `rgb(49, 49, 120)`,
  },
  {
    color: `rgb(0, 0, 0)`,
  },
];

const flyToLocation = (bounds: any) => {
  map.value?.fitBounds(bounds);
};

const updateContourFilter = () => {
  map.value?.setFilter('communes-contour', ['all', ['==', 'code', communeSelected.value]]);
};

const updateDepartementsContourFilter = () => {
  map.value?.setFilter('departements-contour', ['in', 'code', ...depsSelected.value]);
};

const addSourceAndLayerZones = () => {
  if (map.value?.getLayer('departements-data')) {
    map.value?.removeLayer('departements-data');
  }
  if (map.value?.getLayer('zones-contour')) {
    map.value?.removeLayer('zones-contour');
  }

  map.value?.addLayer({
    id: 'all-departements-data',
    type: 'line',
    source: 'decoupage-administratif',
    'source-layer': 'departements',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#888888',
      'line-width': 1,
    },
  }, firstSymbolId);

  map.value?.addLayer({
    id: 'departements-contour',
    type: 'line',
    source: 'decoupage-administratif',
    'source-layer': 'departements',
    filter: ['all', ['in', 'code', ...depsSelected.value]],
    paint: {
      'line-color': '#000',
      'line-width': 2,
    },
  }, firstSymbolId);

  map.value?.addLayer({
    id: 'communes-contour',
    type: 'line',
    source: 'decoupage-administratif',
    'source-layer': 'communes',
    filter: ['all', ['==', 'code', communeSelected.value]],
    paint: {
      'line-color': '#000091',
      'line-width': 3,
    },
  }, firstSymbolId);
};

const loadPopupData = async () => {
  const { data, error } = await api.getDataCommune(communeSelected.value, props.dateBegin, props.dateEnd);
  if (data.value) {
    const dateBegin = props.dateBegin ? moment(props.dateBegin, 'YYYY-MM').startOf('month') : null;
    const dateEnd = props.dateEnd ? moment(props.dateEnd, 'YYYY-MM').endOf('month') : null;
    const niveauGravitePriority = {
      null: 0,
      'vigilance': 1,
      'alerte': 2,
      'alerte_renforcee': 3,
      'crise': 4,
    };
    const restrictions = data.value.restrictions.map((r: any) => {
      r.niveauGravite = Math.max(niveauGravitePriority[r.AEP], niveauGravitePriority[r.SUP], niveauGravitePriority[r.SOU]);
      return r;
    });
    const noDays = restrictions.filter((r: any) => {
      return r.niveauGravite === 0;
    }).length;
    const vigilanceDays = restrictions.filter((r: any) => {
      return r.niveauGravite === 1;
    }).length;
    const alerteDays = restrictions.filter((r: any) => {
      return r.niveauGravite === 2;
    }).length;
    const alerteRenforceeDays = restrictions.filter((r: any) => {
      return r.niveauGravite === 3;
    }).length;
    const criseDays = restrictions.filter((r: any) => {
      return r.niveauGravite === 4;
    }).length;
    const nbDays = dateEnd ? dateEnd.diff(dateBegin, 'days') : 1;
    const description = utils.generateFullPopupCommuneHtml(communeNameSelected.value, {
      noDays,
      vigilanceDays,
      alerteDays,
      alerteRenforceeDays,
      criseDays,
      nbDays,
    });
    popup.setHTML(description);
    linkPopupBtn();
  }
};

const linkPopupBtn = () => {
  const btn = document.getElementsByClassName('btn-map-popup')[0];
  if (!btn) {
    return;
  }
  btn.addEventListener('click', async () => {
    let query: any = {};
    query.dateDebut = moment(props.dateBegin, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
    query.dateFin = moment(props.dateEnd, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');
    router.push({ path: `/donnees/commune/${communeSelected.value}`, query });
  });
};

async function downloadMap() {
  emit('downloadMap');
}

function resetCommuneSelected() {
  communeSelected.value = 0;
  updateContourFilter();
  popup.remove();
}

function computeMinMaxPonderation(dateBegin: Moment, dateEnd: Moment) {
  // Pondération de crise : 4 points par jour
  // On considère que la pondération MAX est de 1 jour sur 2 en crise (2 points par jour)
  maxPonderation.value = dateEnd.diff(dateBegin, 'days') * 2;
}

async function computeData() {
  const dateBegin = props.dateBegin ? moment(props.dateBegin, 'YYYY-MM') : null;
  const dateEnd = props.dateEnd ? moment(props.dateEnd, 'YYYY-MM') : null;
  if (!dateBegin || !dateEnd || !communeData.value) {
    return;
  }
  emit('beginLoading');

  resetCommuneSelected();
  computeArea();
  computeMinMaxPonderation(dateBegin, dateEnd);

  computingCommunes.value = true;
  communeDataComputed.value = [];
  departementDataComputed.value = [];

  const communeDataBis = toRaw(communeData.value);
  const worker = new CommuneWorker();

  // Envoyer les données au Worker
  worker.postMessage({
      communesData: communeDataBis,
      depsSelected: depsSelected.value.map((d: any) => {
        return d;
      }),
      dateBegin: dateBegin.format('YYYY-MM-DD'),
      dateEnd: dateEnd.format('YYYY-MM-DD'),
    },
  );

  // Écouter les messages du Worker (résultats)
  worker.onmessage = (e) => {
    const { communeDataReturned, departementData } = e.data;
    communeDataComputed.value = JSON.parse(JSON.stringify(communeDataReturned));
    departementDataComputed.value = JSON.parse(JSON.stringify(departementData));

    computingCommunes.value = false;
    showCommunesPonderation();

    // Arrêter le Worker pour libérer la mémoire
    worker.terminate();
    emit('endLoading');
  };
}

function showCommunesPonderation() {
  if (map.value?.getLayer('communes-data')) {
    map.value?.removeLayer('communes-data');
  }
  if (map.value?.getLayer('departements-data')) {
    map.value?.removeLayer('departements-data');
  }

  const matchCommuneExpression = ['match', ['get', 'code']];
  for (const commune of communeDataComputed.value) {
    computeColorExpression(commune.code, commune.ponderation, matchCommuneExpression);
  }
  matchCommuneExpression.push('rgba(0, 0, 0, 0)');

  map.value?.addLayer({
    id: 'communes-data',
    type: 'fill',
    source: 'decoupage-administratif',
    'source-layer': 'communes',
    layout: {},
    paint: {
      'fill-outline-color': '#888888',
      'fill-color': matchCommuneExpression,
      'fill-opacity': {
        stops: [[5, 1], [6, 0.9]],
      },
    },
  }, firstSymbolId);

  const matchDepartementExpression = ['match', ['get', 'code']];
  for (const departement of departementDataComputed.value) {
    computeColorExpression(departement.code, departement.ponderation, matchDepartementExpression);
  }
  matchDepartementExpression.push('rgba(0, 0, 0, 0)');

  map.value?.addLayer({
    id: 'departements-data',
    type: 'fill',
    source: 'decoupage-administratif',
    'source-layer': 'departements',
    layout: {},
    maxzoom: 8,
    paint: {
      'fill-color': matchDepartementExpression,
      'fill-opacity': {
        stops: [[5, 1], [6, 0.9]],
      },
    },
  }, firstSymbolId);
}

function computeColorExpression(code: string, ponderation: number, expression: any) {
  const p = ponderation > maxPonderation.value ? maxPonderation.value : ponderation;
  const percentage = p / maxPonderation.value * 100;
  if (percentage <= 0) {
    expression.push(code, legende[0].color);
  } else if (percentage < 25) {
    expression.push(code, legende[1].color);
  } else if (percentage < 50) {
    expression.push(code, legende[2].color);
  } else if (percentage < 75) {
    expression.push(code, legende[3].color);
  } else if (percentage < 100) {
    expression.push(code, legende[4].color);
  } else {
    expression.push(code, legende[5].color);
  }
}

function computeArea() {
  let deps = [];
  let territoire = null;
  let idTerritoire = null;
  if (props.area) {
    territoire = props.area.split('=')[0];
    idTerritoire = props.area.split('=')[1];
  }
  if (territoire === 'bassinVersant' && idTerritoire) {
    const bassinVersantDeps = refDataStore.bassinsVersants.find((r: any) => r.id === +idTerritoire)?.departements;
    deps = refDataStore.departements.filter((d: any) => bassinVersantDeps.some(bvd => bvd.id === d.id));
  } else if (territoire === 'region' && idTerritoire) {
    const regionDeps = refDataStore.regions.find((r: any) => r.id === +idTerritoire)?.departements;
    deps = refDataStore.departements.filter((d: any) => regionDeps.some(rd => rd.id === d.id));
  } else if (territoire === 'departement' && idTerritoire) {
    deps = refDataStore.departements.filter((d: any) => d.id === +idTerritoire);
  }
  if (deps && deps.length > 0) {
    const llb = new maplibregl.LngLatBounds();
    deps.forEach((d: any) => {
      llb.extend([d.bounds.minLat, d.bounds.minLong]);
      llb.extend([d.bounds.maxLat, d.bounds.maxLong]);
    });
    map.value?.fitBounds(llb, {
      padding: 30,
    });
  }
  depsSelected.value = deps.map((d: any) => d.code);
  updateDepartementsContourFilter();
}

watch(() => [props.dateBegin, props.dateEnd, props.area], () => {
  computeData();
}, { immediate: true });
</script>

<template>
  <div v-if="isMapSupported">
    <div v-if=loading
         class="fr-grid-row fr-grid-row--center fr-my-2w">
      <Loader :show="true" />
    </div>
    <div v-show=!loading>
      <div class="map-pre-actions">
        <div v-if="showError"
             class="map-pre-actions-card fr-p-1w fr-m-1w">
          <DsfrAlert description="Une erreur est survenue lors du chargement de la carte"
                     type="error"
                     :closeable="false"
          />
        </div>
        <div class="map-pre-actions-card fr-p-1w fr-m-1w">
          <h6 class="fr-mb-1w fr-mr-2w">Raccourcis :</h6>
          <DsfrTag v-for="tag in mapTags"
                   :label="tag.label"
                   class="fr-m-1w"
                   small
                   @click="flyToLocation(tag.bounds)"
                   tag-name="button" />
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12" style="position:relative;"
             :style="embedded ? 'height: calc(100vh - 125px)' : 'height: 75vh'">
          <div :class="{
          'map-wrap-embedded': embedded
        }" class="map-wrap">
            <div class="map" ref="mapContainer"></div>
          </div>
        </div>
      </div>
      <div class="map-legend fr-grid-row fr-grid-row--middle">
        <div>Zones non concernées par la sécheresse</div>
        <div v-for="legend of legende"
             :style="{'background-color': legend.color}"
             class="map-legend-carre fr-mx-1w"></div>
        <div>Situations extrèmes</div>
      </div>

      <div data-html2canvas-ignore="true" class="text-align-right">
        <DsfrButton @click="downloadMap()">
          Télécharger la carte en .png
        </DsfrButton>
      </div>
    </div>

    <div data-html2canvas-ignore="true">
      <div class="full-width fr-my-2w">
        <DsfrAccordion title="Méthodologie de calcul de la carte"
                       :expanded-id="expanded"
                       titleTag="h4"
                       @expand="expanded = !expanded"
                       :id="true">
          <div>
            Les couleurs de la carte traduisent un "score de restrictions appliquées aux usages de l'eau". Ce score est
            calculé pour chaque commune en combinant deux facteurs : la durée et l'intensité des
            restrictions.<br /><br />
            L'intensité des restrictions est classée en cinq niveaux, chacun pondéré selon sa sévérité&nbsp;:
            <ul>
              <li>Pas de restrictions&nbsp;: 0</li>
              <li>Vigilance&nbsp;: 0,5</li>
              <li>Alerte&nbsp;: 2</li>
              <li>Alerte renforcée&nbsp;: 3</li>
              <li>Crise&nbsp;: 4</li>
            </ul>

            La durée correspond au nombre de jours pendant lesquels ces restrictions sont en place. Pour chaque commune,
            le score est obtenu en multipliant la pondération par le nombre de jours concerné par chaque niveau de
            restriction, puis en additionnant ces valeurs. Ce score cumulatif est ensuite comparé à un score maximal
            théorique (limité à 60 points par mois, soit 15 jours de crise) pour le normaliser sur une échelle de 0 à
            100
            %. Le score est limité pour éviter des valeurs trop élevées dans les cas extrêmes.<br /><br />

            Les résultats sont ensuite visualisés à l'aide d'un code couleur. Plus le score est élevé, plus la couleur
            est
            foncée, indiquant une gravité et/ou une durée importante des restrictions dans la commune. L'échelle
            utilisée
            est la suivante&nbsp;:

            <ul>
              <li>
                <div class="map-legend-carre fr-mr-1w" :style="{'background-color': legende[0].color}"></div>
                0%&nbsp;: zones non concernées par la sécheresse sur la période (le fond de carte est affiché sans
                couleur)
              </li>
              <li>
                <div class="map-legend-carre fr-mr-1w" :style="{'background-color': legende[1].color}"></div>
                entre 0% et 24%&nbsp;: zones faiblement concernées par la sécheresse (ex : toute la période en
                vigilance)
              </li>
              <li>
                <div class="map-legend-carre fr-mr-1w" :style="{'background-color': legende[2].color}"></div>
                entre 25% et 49%&nbsp;: zones moyennement concernées (ex : la moitié de la période en alerte)
              </li>
              <li>
                <div class="map-legend-carre fr-mr-1w" :style="{'background-color': legende[3].color}"></div>
                entre 50% et 74%&nbsp;: zones fortement concernées (ex: la moitié de la période en alerte renforcée)
              </li>
              <li>
                <div class="map-legend-carre fr-mr-1w" :style="{'background-color': legende[4].color}"></div>
                entre 75% et 99%&nbsp;: zones très fortement concernées (ex: jusqu'à la moitié de la période en crise)
              </li>
              <li>
                <div class="map-legend-carre fr-mr-1w" :style="{'background-color': legende[5].color}"></div>
                100%&nbsp;: situations extrêmes (ex : plus de la moitié de la période en crise)
              </li>
            </ul>

            Plus le score est élevé, plus la couleur est foncée, indiquant une gravité et/ou une durée importante des
            restrictions dans la commune. Une même couleur peut ainsi correspondre à des situations très variées. Pour
            mieux comprendre la situation d'une commune, nous vous invitons à consulter son historique.
          </div>
        </DsfrAccordion>
      </div>

      <CarteCommuneTable :dataCommune="communeDataComputed"
                         :maxPonderation="maxPonderation"
                         :dateDebut="dateBegin"
                         :dateFin="dateEnd"/>
    </div>
  </div>
  <template v-else>
    <DsfrAlert title="Votre navigateur ne supporte pas les cartographies"
               description="Impossible d'afficher la carte de la situation de la sécheresse en France"
               type="error"
               :closeable="false"
    />
  </template>
</template>

<style lang="scss">
.map-wrap {
  position: relative;
  width: 100%;
  height: calc(75vh - 2rem);
  left: 0;
  max-width: calc(100% + 32px);

  &-embedded {
    position: absolute;
    width: calc(100vw + 32px);
    max-width: calc(100% + 32px);
    left: -32px;
    height: calc(100vh - 125px - 12px);
  }

  .map {
    width: 100%;
    height: 100%;
  }
}

.map-pre-actions {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;

  &-card {
    background-color: var(--grey-1000-50);
    font-size: 14px;
    border-radius: 4px;
    opacity: 0.9;
  }

  .fr-tag {
    display: block;
  }
}

h6 {
  font-size: 16px;
}

.maplibregl-map {
  font-family: inherit;
}

.maplibregl-popup-content {
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
  font-size: 1rem;

  .map-popup {
    &-zone {
      font-weight: bold;
    }
  }
}

.map-legend {
  font-weight: bold;

  &-carre {
    height: 20px;
    width: 40px;
    border: 1px solid var(--grey-425-625);;
    border-radius: .25rem;
    display: inline-block;
  }
}

@media screen and (max-width: 767px) {
  .map-wrap {
    height: 75vh;

    &-embedded {
      height: calc(100vh - 160px);
    }
  }

  .map-pre-actions, .map-post-actions {
    position: relative;
    top: 0;
    left: 0;
    bottom: 0;
    opacity: 1;

    .fr-tag {
      display: initial;
    }
  }
}

@media screen and (max-width: 991px) {
  .map-legend {
    margin-top: 2rem;
  }
}
</style>