<script setup lang="ts">
import { Ref } from "vue";
import utils from "../../utils";
import api from "../../api";
import { Address } from "../../dto/address.dto";
import { Geo } from "~/client/dto/geo.dto";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  query: {
    type: String,
    default: ''
  },
  address: {
    type: Object,
    default: null
  },
  geo: {
    type: Object,
    default: null
  },
  light: {
    type: Boolean,
    default: false
  },
  showGeoloc: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  exactAddress: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  search: [{
    address: Address | null,
    geo: Geo | null,
  }]
}>();

const _closeModal = (): void => {
  modalOpened.value = false;
};

const addressQuery: Ref<string> = ref('');
const addresses: Ref<Address[]> = ref([]);
const loadAddresses: Ref<boolean> = ref(true);
const loadingAdresses: Ref<boolean> = ref(false);
const autoSelectAddress: Ref<boolean> = ref(false);
const modalOpened: Ref<boolean> = ref(false);
const modalActions: Ref<any[]> = ref([{label: "Recommencer", onClick: _closeModal}]);

const selectAddress = (address: string | Address | null, geo = null) => {
  if (!address && !geo) {
    emit('search', {
      address: null,
      geo: null
    });
    return;
  }
  if (typeof address === 'string') {
    addressQuery.value = address;
    if (address === '') {
      emit('search', {
        address: null,
        geo: null
      });
    }
    return;
  }
  // Si c'est un objet Adresse ou Geo
  if ((address && addressQuery.value === address.properties.label) || (geo && addressQuery.value === geo.nom)) {
    addresses.value = [];
  } else {
    loadAddresses.value = false;
  }
  addressQuery.value = address ? address.properties.label : geo.nom;
  emit('search', {
    address: address,
    geo: geo
  });
}

const geoloc = () => {
  const successCallback = async (position) => {
    const {data} = await api.searchGeoByLatlon(position.coords.longitude, position.coords.latitude);
    if (data.value && data.value[0]) {
      addressQuery.value = data.value[0].nom;
      selectAddress(null, data.value[0]);
    }
  };

  const errorCallback = () => {
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

if (props.address || props.geo) {
  if (!props.exactAddress || (props.address && props.address.properties.type === 'housenumber')) {
    addressQuery.value = props.address ? props.address.properties.label : props.geo.nom;
    selectAddress(props.address, props.geo);
  }
}

watch(addressQuery, utils.debounce(async () => {
  if (!addressQuery.value || !loadAddresses.value) {
    loadAddresses.value = true;
    addresses.value = [];
    return;
  }
  loadingAdresses.value = true;
  const {data: response, error} = await api.searchAddresses(addressQuery.value, props.exactAddress);
  loadingAdresses.value = false;
  addresses.value = response.value ? response.value.features : [];
  if (autoSelectAddress.value) {
    autoSelectAddress.value = false;
    selectAddress(addresses.value[0]);
  }
}, 500));


if (props.query && !props.address && !props.geo) {
  autoSelectAddress.value = true;
  addressQuery.value = props.query;
}
</script>

<template>
  <div class="search fr-grid-row fr-grid-row--gutters" :class="{light: light}">
    <div class="fr-col-12">
      <div class="fr-mb-1w">Entrez votre adresse complète</div>
      <div class="autocomplete-wrapper">
        <FdrAutoComplete placeholder="Ex: 20 avenue de Ségur, 75007, Paris"
                         :model-value="addressQuery"
                         :options="addresses"
                         label="Champ de recherche d'adresse"
                         display-key="properties.label"
                         data-cy="AddressSearchInput"
                         :light="light"
                         :disabled="disabled"
                         @update:modelValue="selectAddress($event)"
                         @search="selectAddress($event)"/>
        <Loader class="adresse-loader" :show="loadingAdresses || loading"/>
      </div>
    </div>
  </div>
  <div v-if="showGeoloc" class="btn-geoloc">
    <DsfrButton label="Géo-localisez moi"
                icon="ri-map-pin-user-line"
                class="fr-mt-1w"
                @click="geoloc()"
                tertiary/>
  </div>
  <DsfrNotice v-if="!light"
              title="Nous ne conservons pas vos données et votre adresse"
              class="notice-light fr-mt-1w"/>
  <DsfrModal :opened="modalOpened"
             title="Cela n'a pas fonctionné comme prévu !"
             icon="ri-arrow-right-line"
             :actions=modalActions
             @close="_closeModal">
    <div>
      Nous sommes désolés, une erreur s’est glissée dans notre système et nous n’avons pas pu traiter correctement votre requête
    </div>
  </DsfrModal>
</template>

<style scoped lang="scss">
.fr-notice, .btn-geoloc {
  width: fit-content;
}

.autocomplete-wrapper {
  position: relative;

  .adresse-loader {
    position: absolute;
    top: 8px;
    left: 0;
  }
}
</style>