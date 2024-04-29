<script setup lang="ts">
import * as maplibregl from 'maplibre-gl';
import { Ref } from 'vue';
import { PMTiles, Protocol } from 'pmtiles';
import { useAddressStore } from '../../store/address';
import { storeToRefs } from 'pinia';
import api from '../../api';
import niveauxGravite from '../../dto/niveauGravite';

const props = defineProps<{
  embedded: any
}>();

const modalOpened: Ref<boolean> = ref(false);
const modalTitle: Ref<string> = ref('');
const modalText: Ref<string> = ref('');
const modalIcon: Ref<string> = ref('');
const modalActions: Ref<any[]> = ref([]);
const loadingZones: Ref<boolean> = ref(false);
const mapContainer = shallowRef(null);
const map: Ref<any> = shallowRef(null);
const isMapSupported: boolean = utils.isWebglSupported();
const runtimeConfig = useRuntimeConfig();
const zoneSelected = ref(0);
const route = useRoute();
const departementCode = route.query.depCode;

const initialState = [[-7.075195, 41.211722], [11.403809, 51.248163]];

let protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);
const PMTILES_URL = runtimeConfig.public.pmtilesUrl;
const p = new PMTiles(PMTILES_URL);
// this is so we share one instance across the JS code and the map renderer
protocol.add(p);

onMounted(() => {
  if (!isMapSupported) {
    return;
  }

  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: `https://etalab-tiles.fr/styles/osm-bright/style.json`,
    bounds: initialState,
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
    let firstSymbolId;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol') {
        firstSymbolId = layers[i].id;
        break;
      }
    }
    map.value?.addSource('zones', {
      type: 'vector',
      url:
        `pmtiles://${PMTILES_URL}`,
    });
    map.value?.addSource('cadastre', {
      type: 'vector',
      url:
        `https://etalab-tiles.fr/data/decoupage-administratif.json`,
    });
    map.value?.addLayer({
      id: 'zones-data',
      type: 'fill',
      source: 'zones',
      'source-layer': 'zones_arretes_en_vigueur',
      filter: ['==', 'type', selectedTypeEau.value],
      paint: {
        'fill-color': [
          'match',
          ['get', 'niveauGravite'],
          'vigilance',
          '#FFEDA0',
          'alerte',
          '#FEB24C',
          'alerte_renforcee',
          '#FC4E2A',
          'crise',
          '#B10026',
          '#e8edff',
        ],
        'fill-opacity': {
          stops: [[5, 1], [6, 0.8], [7, 0.7], [8, 0.6], [9, 0.5], [10, 0.4], [11, 0.3]],
        },
      },
    }, firstSymbolId);
    map.value?.addLayer({
      id: 'departements-data',
      type: 'line',
      source: 'cadastre',
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
      id: 'zones-contour',
      type: 'line',
      source: 'zones',
      'source-layer': 'zones_arretes_en_vigueur',
      filter: ['all', ['==', 'type', selectedTypeEau.value], ['==', 'id', zoneSelected.value]],
      paint: {
        'line-color': '#000091',
        'line-width': 3,
      },
    }, firstSymbolId);
  });

  // Create a popup, but don't add it to the map yet.
  const popup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: false,
  }).setMaxWidth('300px');

  map.value?.on('click', 'zones-data', (e: any) => {
    zoneSelected.value = e.features[0].properties.id;
    updateContourFilter();
    const description = utils.generatePopupHtml(e.features[0].properties);

    popup.setLngLat(e.lngLat).setHTML(description).addTo(map.value);

    const btn = document.getElementsByClassName('btn-map-popup')[0];
    btn.addEventListener('click', async () => {
      let dataAddress;
      let dataGeo;
      dataAddress = (await api.searchAddressByLatlon(e.lngLat.lng, e.lngLat.lat)).data;
      if (!dataAddress.value?.features[0]) {
        dataGeo = (await api.searchGeoByLatlon(e.lngLat.lng, e.lngLat.lat)).data;
      }
      utils.searchZones(!dataGeo?.value ? dataAddress.value.features[0] : null, 
        dataGeo?.value ? dataGeo.value[0] : null, 
        profile.value, 
        selectedTypeEau.value,
        router, 
        modalTitle,
        modalText, 
        modalIcon,
        modalActions, 
        modalOpened,
        loadingZones);
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

const typeEauTags: Ref<any[]> = ref([{
  label: 'Eau potable',
  value: 'AEP',
}, {
  label: 'Eau superficielle',
  value: 'SUP',
}, {
  label: 'Eau souterraine',
  value: 'SOU',
}]);
const selectedTypeEau: Ref<string> = ref('AEP');
const adressStore = useAddressStore();
const { profile } = storeToRefs(adressStore);
const router = useRouter();
const expandedId = ref<string>();

const flyToLocation = (bounds: any) => {
  map.value?.fitBounds(bounds);
};

const updateLayerFilter = () => {
  map.value?.setFilter('zones-data', ['==', 'type', selectedTypeEau.value]);
};

const updateContourFilter = () => {
  map.value?.setFilter('zones-contour', ['all', ['==', 'type', selectedTypeEau.value], ['==', 'id', zoneSelected.value]]);
};

const closeModal = () => {
  modalOpened.value = false;
};

const classObject = (rank: number | undefined): any => {
  const bgClass = `situation-level-bg-${rank}`;
  const cssClass: any = {};
  cssClass[bgClass] = true;
  return cssClass;
};
</script>

<template>
  <div v-if="isMapSupported">
    <div class="map-pre-actions">
      <div class="map-pre-actions-card fr-p-1w fr-m-1w">
        <h6 class="fr-mb-1w fr-mr-2w">Situation par ressource :</h6>
        <DsfrRadioButton v-for="option of typeEauTags"
                         :modelValue="selectedTypeEau"
                         v-bind="option"
                         :small="true"
                         class="fr-mb-1w"
                         @update:modelValue="selectedTypeEau = $event; updateLayerFilter();"
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
      <div class="fr-col-12 fr-col-lg-9" style="position:relative; height: 75vh" :style="embedded ? 'height: 90vh' : 'height: 75vh'">
        <div class="map-wrap" :class="embedded ? 'map-wrap-embedded' : ''">
          <div class="map" ref="mapContainer"></div>
        </div>
      </div>
      <div class="map-legend fr-col-12 fr-col-lg-3">
        <h3>Niveau de restriction affiché sur la carte</h3>
        <DsfrAccordionsGroup>
          <li v-for="legend in niveauxGravite">
            <DsfrAccordion
              :expanded-id="expandedId"
              @expand="expandedId = $event">
              <template v-slot:title>
                <DsfrBadge small
                           class="fr-mr-1w"
                           :class="legend.class"
                           type=""
                           :label="legend.text" />
              </template>
              {{ legend.description }}
            </DsfrAccordion>
          </li>
        </DsfrAccordionsGroup>
      </div>
    </div>
  </div>
  <template v-else>
    <DsfrAlert title="Votre navigateur ne supporte pas les cartographies"
               description="Impossible d'afficher la carte de la situation de la sécheresse en France"
               type="error"
               :closeable="false"
    />
  </template>

  <DsfrModal :opened="modalOpened"
             :title="modalTitle"
             :icon="modalIcon"
             :actions=modalActions
             @close="closeModal">
    <div v-html="modalText"></div>
  </DsfrModal>
</template>

<style lang="scss">
.map-wrap {
  position: absolute;
  width: calc(100vw + 32px);
  max-width: calc(100% + 32px);
  height: calc(75vh - 3rem);
  left: -32px;

  &-embedded {
    height: calc(90vh - 3rem);
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

.map-legend, .maplibregl-popup-content {
  .situation-level-bg-1 {
    background-color: #FFEDA0;
    color: var(--grey-50-1000);
  }

  .situation-level-bg-0 {
    background-color: #e8edff;
    color: var(--grey-50-1000);
  }
}

@media screen and (max-width: 767px) {
  .map-wrap {
    height: 75vh;

    &-embedded {
      height: calc(90vh);
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