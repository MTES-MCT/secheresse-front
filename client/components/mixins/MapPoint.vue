<script setup lang="ts">
import { Ref } from 'vue';
import * as maplibregl from 'maplibre-gl';
import api from '../../api';

const emit = defineEmits<{
  selectPoint: any;
}>();

const isMapSupported: boolean = utils.isWebglSupported();
const map: Ref<any> = shallowRef(null);
const mapContainer = shallowRef(null);
const initialState = [[-7.075195, 41.211722], [11.403809, 51.248163]];
const loading = ref(false);

// Create a popup, but don't add it to the map yet.
const popup = new maplibregl.Popup({
  closeButton: true,
  closeOnClick: false,
}).setMaxWidth('300px');

const marker = new maplibregl.Marker();

const popupHtml = `<div>
<button class="fr-btn btn-map-popup">
Sélectionner ce point
</button>
</div>`;

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

  map.value?.on('click', async (e: any) => {
    if (loading.value) {
      return;
    }
    loading.value = true;
    const coordinates = e.lngLat;
    const dataAddress = (await api.searchAddressByLatlon(coordinates.lng, coordinates.lat)).data;
    const dataGeo = (await api.searchGeoByLatlon(coordinates.lng, coordinates.lat)).data;
    let html = popupHtml;
    if (dataAddress.value?.features[0]?.properties?.label) {
      html = `Adresse proche&nbsp: ${dataAddress.value.features[0].properties.label}<br/><br/>` + html;
    } else if (dataGeo.value && dataGeo.value[0]?.code) {
      html = `Commune&nbsp: ${dataGeo.value[0].nom} (${dataGeo.value[0].code})<br/><br/>` + html;
    }
    loading.value = false;
    popup.setLngLat(coordinates).setHTML(html).addTo(map.value);

    const btn = document.getElementsByClassName('btn-map-popup')[0];
    if (!btn) {
      return;
    }
    btn.addEventListener('click', async () => {
      const toReturn = {
        lng: coordinates.lng,
        lat: coordinates.lat,
        commune: dataAddress.value?.features[0]?.properties?.citycode ? dataAddress.value.features[0].properties.citycode :
          dataGeo.value[0]?.code ? dataGeo.value[0].code : null,
        communeNom: dataGeo.value[0]?.nom,
      };
      emit('selectPoint', toReturn);
      marker.setLngLat(coordinates).addTo(map.value);
      popup.remove();
    });
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

</script>

<template>

  <div class="full-width" v-if="isMapSupported">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 overall-wrapper">
        <div class="map-pre-actions">
          <div class="map-pre-actions-card fr-p-1w fr-m-1w">
            <h6 class="fr-mb-1w fr-mr-2w">Raccourcis&nbsp;:</h6>
            <DsfrTag v-for="tag in mapTags"
                     :label="tag.label"
                     class="fr-m-1w"
                     small
                     @click="flyToLocation(tag.bounds)"
                     tag-name="button" />
          </div>
        </div>
        <div class="map-wrap" :class="{'map-wrap--loading': loading}">
          <div class="map" ref="mapContainer"></div>
        </div>
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
</template>

<style lang="scss" scoped>
.overall-wrapper {
  height: 50vh;
  position: relative;
}

.map-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  left: 0;

  .map {
    width: 100%;
    height: 100%;
  }

  &--loading :deep(.maplibregl-canvas-container.maplibregl-interactive) {
    cursor: wait;
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

:deep(.maplibregl-map) {
  font-family: inherit;
}

:deep(.maplibregl-popup-content) {
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
}

@media screen and (max-width: 767px) {
  .overall-wrapper {
    height: calc(50vh + 128px);
  }

  .map-wrap {
    height: 50vh;
  }

  .map-pre-actions {
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