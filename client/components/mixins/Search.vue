<script setup lang="ts">
import { Ref } from "vue";
import utils from "../../utils";
import api from "../../api";
import { Address } from "../../dto/address.dto";
import { Profile } from "../../dto/profile.enum";
import { Geo } from "~/client/dto/geo.dto";

const props = defineProps<{
  loading: boolean,
  query: string,
  profile: string
}>()

const emit = defineEmits<{
  search: [{
    address: Address | null,
    geo: Geo | null,
    type: string
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
const profileTags: Ref<any[]> = ref([]);
const selectedTagType: Ref<string> = ref('particulier');
const modalOpened: Ref<boolean> = ref(false);
const modalActions: Ref<any[]> = ref([{label: "Recommencer", onClick: _closeModal}]);

for (let profile in Profile) {
  profileTags.value.push({
    label: Profile[profile],
    type: profile
  })
}

const selectAddress = (address: string | Address | null, geo = null) => {
  if (!address && !geo) {
    return;
  }
  if (typeof address === 'string') {
    addressQuery.value = address;
    if (address === '') {
      emit('search', {
        type: selectedTagType.value,
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
    type: selectedTagType.value,
    address: address,
    geo: geo
  });
}

const _formatAddresses = (addresses: Address[]): Address[] => {
  return addresses.map(a => {
    if (a.properties.type === 'municipality') {
      a.properties.label = `${a.properties.label}, ${a.properties.citycode >= '97' ? a.properties.citycode.slice(0, 3) : a.properties.citycode.slice(0, 2)}`;
    }
    return a;
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

watch(addressQuery, utils.debounce(async () => {
  if (!addressQuery.value || !loadAddresses.value) {
    loadAddresses.value = true;
    addresses.value = [];
    return;
  }
  loadingAdresses.value = true;
  const {data: response, error} = await api.searchAddresses(addressQuery.value);
  loadingAdresses.value = false;
  addresses.value = response.value ? _formatAddresses(response.value.features) : [];
  if(autoSelectAddress.value) {
    autoSelectAddress.value = false;
    selectAddress(addresses.value[0]);
  }
}, 500));

if (props.profile) {
  selectedTagType.value = props.profile;
}
if (props.query) {
  autoSelectAddress.value = true;
  addressQuery.value = props.query;
}
</script>

<template>
  <div class="search fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 text-align-center">
      <div>Agissez-vous en tant que ?</div>
      <DsfrTag v-for="tag in profileTags"
               :label="tag.label"
               class="fr-m-1w tag-lg"
               :selected="selectedTagType === tag.type"
               @click="selectedTagType = tag.type"
               tag-name="button"/>
    </div>
    <div class="fr-col-12">
      <div class="fr-mb-1w">Où habitez-vous ? (Adresse complète)</div>
      <div class="autocomplete-wrapper">
        <FdrAutoComplete placeholder="Ex: 20 avenue de Ségur, 75007, Paris"
                         :model-value="addressQuery"
                         :options="addresses"
                         label="Champ de recherche d'adresse"
                         display-key="properties.label"
                         data-cy="AddressSearchInput"
                         @update:modelValue="selectAddress($event)"
                         @search="selectAddress($event)"/>
        <Loader class="adresse-loader" :show="loadingAdresses || loading"/>
      </div>
    </div>
  </div>
  <div class="btn-geoloc">
    <DsfrButton label="Géo-localisez moi"
                icon="ri-map-pin-user-line"
                class="fr-mt-1w"
                @click="geoloc()"
                tertiary/>
  </div>
  <DsfrNotice title="Nous ne conservons pas vos données et votre adresse"
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
  margin: auto;
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

@media screen and (max-width: 991px) {
  .search {
    text-align: center;
  }
}
</style>