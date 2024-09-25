<script setup lang="ts">
import * as maplibregl from 'maplibre-gl';
import { Ref } from 'vue';
import api from '../../../api';
import moment, { Moment } from 'moment';
import { useRefDataStore } from '../../../store/refData';

const props = defineProps<{
  embedded: any,
  dateBegin: string,
  dateEnd: string,
  area: string,
  loading: boolean,
}>();

const refDataStore = useRefDataStore();
const computingCommunes: Ref<boolean> = ref(false);
const mapContainer = shallowRef(null);
const map: Ref<any> = shallowRef(null);
const isMapSupported: boolean = utils.isWebglSupported();
const showError = ref(false);
const communeSelected = ref(0);
const communeData = ref(null);
const communeDataComputed = ref(null);
const departementDataComputed = ref(null);
const maxPonderation = ref(0);
const router = useRouter();
const depsSelected = ref([]);

const initialState = [[-7.075195, 41.211722], [11.403809, 51.248163]];

let firstSymbolId: any;

// Create a popup, but don't add it to the map yet.
const popup = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
}).setMaxWidth('300px');

// Load data
communeData.value = (await api.getDataDuree()).data.value;

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

  map.value?.on('click', 'communes-data', (e: any) => {
    const feature = e.features.some((f: any) => f.properties.plm) ?
      e.features.filter((f: any) => f.properties.plm)[0] : e.features[0];
    communeSelected.value = feature ? feature.properties.code : 0;
    updateContourFilter();
    if (!feature) {
      return;
    }
    const description = utils.generatePopupCommuneHtml(feature.properties);
    popup.setLngLat(e.lngLat).setHTML(description).addTo(map.value);

    const btn = document.getElementsByClassName('btn-map-popup')[0];
    if (!btn) {
      return;
    }
    btn.addEventListener('click', async () => {
      router.push(`/donnees/commune/${feature.properties.code}`);
    });
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

async function downloadMap() {
  const dpi = 300;
  Object.defineProperty(window, 'devicePixelRatio', {
    get: function() {return dpi / 96}
  });
  const content = map.value?.getCanvas().toDataURL('image/png');

  const a = document.createElement('a');
  a.href = content.replace('image/png', 'image/octet-stream');
  a.download = `carte_evolution_${props.dateBegin}-${props.dateEnd}.png`;
  a.click();
}

function resetCommuneSelected() {
  communeSelected.value = 0;
  updateContourFilter();
  popup.remove();
}

function computeMinMaxPonderation(dateBegin: Moment, dateEnd: Moment) {
  // Pondération de crise : 4 points par jour
  // On considère que la pondération MAX est de 1 jour sur 2 en crise (4x15 = 60 points par mois)
  let p = 0;
  for (let m = moment(dateBegin); m.diff(dateEnd, 'days') <= 0; m.add(1, 'month')) {
    p += 60;
  }
  maxPonderation.value = p;
}

function computeData() {
  const dateBegin = props.dateBegin ? moment(props.dateBegin, 'YYYY-MM') : null;
  const dateEnd = props.dateEnd ? moment(props.dateEnd, 'YYYY-MM') : null;
  if (!dateBegin || !dateEnd || !communeData.value) {
    return;
  }
  resetCommuneSelected();
  computeArea();
  computeMinMaxPonderation(dateBegin, dateEnd);
  computingCommunes.value = true;
  communeDataComputed.value = [];
  departementDataComputed.value = [];
  const communesFiltered = depsSelected.value && depsSelected.value.length > 0 ? communeData.value.filter((commune: any) => {
    return depsSelected.value.includes(getDepartementCode(commune.code));
  }) : communeData.value;
  for (const commune of communesFiltered) {
    const ponderation = commune.restrictions
      .filter((r: any) => {
        return moment(r.d, 'YYYY-MM').isSameOrAfter(dateBegin) && moment(r.d, 'YYYY-MM').isSameOrBefore(dateEnd);
      })
      .reduce((acc: any, value: any) => acc + (value.p ? value.p : 0), 0);
    communeDataComputed.value.push({
      code: commune.code,
      // FILTRER PAR DATE
      ponderation: ponderation,
    });
    const depCode = getDepartementCode(commune.code);
    const index = departementDataComputed.value.findIndex(d => d.code === depCode);
    if(index < 0) {
      departementDataComputed.value.push({
        code: depCode,
        ponderations: [ponderation]
      })
    } else {
      departementDataComputed.value[index].ponderations.push(ponderation);
    }
  }
  for (const departement of departementDataComputed.value) {
    departement.ponderation = Math.round(departement.ponderations.reduce((acc: any, value: any) => acc + value, 0) / departement.ponderations.length);
    delete departement.ponderations;
  }
  console.log(communeDataComputed.value);
  console.log(departementDataComputed.value);
  computingCommunes.value = false;
  showCommunesPonderation();
}

function getDepartementCode(codeInsee: string) {
  let toReturn = codeInsee.slice(0, 2);
  if (toReturn === '97' || toReturn === '98') {
    toReturn = codeInsee.slice(0, 3);
  }
  return toReturn;
}

function showCommunesPonderation() {
  console.log('SHOW COMMUNES PONDERATION');
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
        stops: [[5, 1], [6, 0.8], [7, 0.7], [8, 0.6], [9, 0.5], [10, 0.4], [11, 0.3]],
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
        stops: [[5, 1], [6, 0.8], [7, 0.7], [8, 0.6], [9, 0.5], [10, 0.4], [11, 0.3]],
      },
    },
  }, firstSymbolId);
}

function computeColorExpression(code: string, ponderation: number, expression: any) {
  const p = ponderation > maxPonderation.value ? maxPonderation.value : ponderation;
  const percentage = p / maxPonderation.value;

  // Les valeurs RVB pour les deux couleurs
  const startColor = { r: 255, g: 237, b: 160 }; // Jaune vigilance
  const endColor = { r: 177, g: 0, b: 38 }; // Rouge crise

  // Calculer la couleur en fonction du pourcentage
  const r = Math.round(startColor.r + (endColor.r - startColor.r) * (percentage));
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * (percentage));
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * (percentage));

  expression.push(code, `rgb(${r}, ${g}, ${b})`);
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
    <div class="map-legend">
      <div class="map-legende-carre"></div>
      <div class="map-legende-text">
        <span> </span>
      </div>
    </div>

    <div class="text-align-right">
      <DsfrButton @click="downloadMap()">
        Télécharger la carte en .png
      </DsfrButton>
    </div>
  </div>
  <template v-else>
    <DsfrAlert title="Votre navigateur ne supporte pas les cartographies"
               description="Impossible d'afficher la carte de la situation de la sécheresse en France"
               type="error"
               :closeable="false"
    />
  </template>

  <!--  <DsfrModal :opened="modalOpened"-->
  <!--             :title="modalTitle"-->
  <!--             :icon="modalIcon"-->
  <!--             :actions=modalActions-->
  <!--             @close="closeModal">-->
  <!--    <div v-html="modalText"></div>-->
  <!--  </DsfrModal>-->
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

.map-legende {
  &-carre {
    height: 20px;
    min-width: 200px;
    width: 100%;
    max-width: 100px;
    background: linear-gradient(0.25turn, rgb(255, 237, 160), rgb(177, 0, 38));
  }

  &-text {
    text-align: justify;
    height: 21px;
    overflow: hidden;

    span {
      width: 100%;
      display: inline-block;
    }
  }
}

@media screen and (max-width: 767px) {
  .map-wrap {
    height: 75vh;

    &-embedded {
      height: calc(100vh - 160px);
    }
  }

  .map-legende, .map-pre-actions, .map-post-actions {
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