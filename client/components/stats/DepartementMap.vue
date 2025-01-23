<script setup lang="ts">
import * as maplibregl from 'maplibre-gl';
import { Ref } from "vue";
import utils from "../../utils";

const props = defineProps<{
  stats: any
}>();

const mapContainer = shallowRef(null);
const map: Ref<any> = shallowRef(null);
const isMapSupported: boolean = utils.isWebglSupported();
const legendTooltip = ref('');

const initialState = [[-7.075195, 41.211722], [11.403809, 51.248163]];
const maxDepartementSearches = Math.max(...Object.values(props.stats.departementRepartition));
const minDepartementSearches = Math.min(...Object.values(props.stats.departementRepartition));
const maxRegionSearches = Math.max(...Object.values(props.stats.regionRepartition));
const minRegionSearches = Math.min(...Object.values(props.stats.regionRepartition));
legendTooltip.value = `${minDepartementSearches} à ${maxDepartementSearches}`;

onMounted(() => {
  if (!isMapSupported) {
    return;
  }

  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: `https://openmaptiles.data.gouv.fr/styles/osm-bright/style.json`,
    bounds: initialState
  });


  // Add zoom and rotation controls to the map.
  map.value?.addControl(new maplibregl.NavigationControl(), 'bottom-right');

  // Add geolocate control to the map.
  map.value?.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }), 'bottom-right'
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

    const matchDepartementExpression = ['match', ['get', 'code']];
    Object.keys(props.stats.departementRepartition).forEach((d: any) => {
      const searches = props.stats.departementRepartition[d];
      const color = (searches - minDepartementSearches) / (maxDepartementSearches - minDepartementSearches);
      matchDepartementExpression.push(d, `rgb(${color * (49 - 255) + 255}, ${color * (49 - 255) + 255}, ${color * (120 - 255) + 255})`);
    });
    matchDepartementExpression.push('rgba(0, 0, 0, 0)');

    const matchRegionExpression = ['match', ['get', 'code']];
    Object.keys(props.stats.regionRepartition).forEach((r: any) => {
      const searches = props.stats.regionRepartition[r];
      const color = (searches - minRegionSearches) / (maxRegionSearches - minRegionSearches);
      matchRegionExpression.push(r, `rgb(${color * (49 - 255) + 255}, ${color * (49 - 255) + 255}, ${color * (120 - 255) + 255})`);
    });
    matchRegionExpression.push('rgba(0, 0, 0, 0)');

    map.value?.addSource('cadastre', {
      type: 'vector',
      url:
          `https://openmaptiles.data.gouv.fr/data/decoupage-administratif.json`
    });
    map.value?.addLayer({
      id: 'departements-data',
      type: 'fill',
      source: 'cadastre',
      'source-layer': 'departements',
      layout: {
        visibility: 'visible'
      },
      paint: {
        'fill-outline-color': '#888888',
        'fill-color': matchDepartementExpression,
        'fill-opacity': {
          stops: [[5, 1], [6, 0.8], [7, 0.7], [8, 0.6], [9, 0.5], [10, 0.4], [11, 0.3]]
        }
      }
    }, firstSymbolId);
    map.value?.addLayer({
      id: 'regions-data',
      type: 'fill',
      source: 'cadastre',
      'source-layer': 'regions',
      layout: {
        visibility: 'none'
      },
      paint: {
        'fill-outline-color': '#888888',
        'fill-color': matchRegionExpression,
        'fill-opacity': {
          stops: [[5, 1], [6, 0.8], [7, 0.7], [8, 0.6], [9, 0.5], [10, 0.4], [11, 0.3]]
        }
      }
    }, firstSymbolId);

  });

  // Create a popup, but don't add it to the map yet.
  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false
  }).setMaxWidth('300px');

  const sumSearches: number = Object.values(props.stats.departementRepartition).reduce((a: number, b: number) => {
    return a + b;
  });
  map.value?.on('mousemove', 'departements-data', (e: any) => {
    map.value.getCanvas().style.cursor = 'pointer';

    const searches = props.stats.departementRepartition[e.features[0].properties.code];
    const description = `<div>${e.features[0].properties.nom} (${e.features[0].properties.code})</div>
<div>${utils.numberWithSpaces(searches)} (${(searches * 100 / sumSearches).toFixed(2)}%)</div>`;

    popup.setLngLat(e.lngLat).setHTML(description).addTo(map.value);
  });

  map.value?.on('mousemove', 'regions-data', (e: any) => {
    map.value.getCanvas().style.cursor = 'pointer';

    const searches = props.stats.regionRepartition[e.features[0].properties.code];
    const description = `<div>${e.features[0].properties.nom}</div>
<div>${utils.numberWithSpaces(searches)} (${(searches * 100 / sumSearches).toFixed(2)}%)</div>`;

    popup.setLngLat(e.lngLat).setHTML(description).addTo(map.value);
  });

  map.value?.on('mouseleave', 'departements-data', () => {
    popup.remove();
  });

  map.value?.on('mouseleave', 'regions-data', () => {
    popup.remove();
  });
});

onUnmounted(() => {
  map.value?.remove();
});

const mapTags: Ref<any[]> = ref([{
  label: 'Métropole',
  bounds: initialState
}, {
  label: 'La Réunion',
  bounds: [[54.615784, -21.749296], [56.497192, -20.522216]]
}, {
  label: 'Guadeloupe',
  bounds: [[-62.119446, 15.612456], [-60.762634, 16.617770]]
}, {
  label: 'Martinique',
  bounds: [[-61.480865, 14.193832], [-60.570374, 14.964687]]
}, {
  label: 'Mayotte',
  bounds: [[44.748688, -13.175771], [45.532837, -12.507643]]
}, {
  label: 'Guyane',
  bounds: [[-55.261230, 1.790480], [-51.130371, 6.107784]]
}]);

const repartitionTags: Ref<any[]> = ref([{
  label: 'Par département',
  value: true
}, {
  label: 'Par région',
  value: false
}]);
const selectedRepartitionTag: Ref<string> = ref(true);

const flyToLocation = (bounds: any) => {
  map.value?.fitBounds(bounds);
};

const updateLayerFilter = () => {
  legendTooltip.value = selectedRepartitionTag.value ? `${minDepartementSearches} à ${maxDepartementSearches}` : `${minRegionSearches} à ${maxRegionSearches}`;
  map.value?.setLayoutProperty(selectedRepartitionTag.value ? 'regions-data' : 'departements-data', 'visibility', 'none');
  map.value?.setLayoutProperty(selectedRepartitionTag.value ? 'departements-data' : 'regions-data', 'visibility', 'visible');
};
</script>

<template>
  <div v-if="isMapSupported">
    <div class="map-pre-actions">
      <div class="map-pre-actions-card fr-p-1w fr-m-1w">
        <h6 class="fr-mb-1w fr-mr-2w">Maille :</h6>
        <DsfrRadioButton v-for="option of repartitionTags"
                         :modelValue="selectedRepartitionTag"
                         v-bind="option"
                         :small="true"
                         class="fr-mb-1w"
                         @update:modelValue="selectedRepartitionTag = $event; updateLayerFilter();"
        />
        <div class="map-legende">
          <div class="map-legende-carre"></div>
          <div class="map-legende-text">
            {{ legendTooltip }}
            <span> </span>
          </div>
        </div>
      </div>
      <div class="map-pre-actions-card fr-p-1w fr-m-1w">
        <h6 class="fr-mb-1w fr-mr-2w">Raccourcis :</h6>
        <DsfrTag v-for="tag in mapTags"
                 :label="tag.label"
                 class="fr-m-1w"
                 small
                 @click="flyToLocation(tag.bounds)"
                 tag-name="button"/>
      </div>
    </div>
    <div style="height: 75vh">
      <div class="map-wrap">
        <div class="map" ref="mapContainer"></div>
      </div>
    </div>
  </div>
  <template v-else>
    <DsfrAlert title="Votre navigateur ne supporte pas les cartographies"
               description="Impossible d'afficher la carte de la répartition géographique des recherches sur les 30 derniers jours"
               type="error"
               :closeable="false"
    />
  </template>
</template>

<style scoped lang="scss">
.map-wrap {
  position: absolute;
  width: calc(100vw);
  max-width: calc(100% - 2px);
  height: calc(75vh + 3px);
  left: 1px;

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

  .map-legende {
    &-carre {
      height: 20px;
      min-width: 200px;
      width: 100%;
      background: linear-gradient(0.25turn, rgba(255, 255, 255), rgb(49, 49, 120));
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
}

@media screen and (max-width: 767px) {
  .map-wrap {
    height: 75vh
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
</style>