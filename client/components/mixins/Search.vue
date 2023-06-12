<script setup lang="ts">
import { Ref } from "vue";
import utils from "../../utils";
import api from "../../api";
import { Address } from "../../dto/address.dto";
import { Profile } from "../../dto/profile.enum";

const props = defineProps<{
  loading: boolean,
  query: string
}>()

const emit = defineEmits<{
  search: [{
    address: Address | null,
    type: string
  }]
}>();

const addressQuery: Ref<string> = ref('');
const addresses: Ref<Address[]> = ref([]);
const loadAddresses: Ref<boolean> = ref(true);
const modalTitle: Ref<string> = ref('');
const modalText: Ref<string> = ref('');
const modalOpened: Ref<boolean> = ref(false);
const loadingAdresses: Ref<boolean> = ref(false);
const profileTags: Ref<any[]> = ref([]);
const selectedTagType: Ref<string> = ref('particulier');

for (let profile in Profile) {
  profileTags.value.push({
    label: Profile[profile],
    type: profile
  })
}

const selectAddress = (address: string | Address) => {
  if (typeof address === 'string') {
    addressQuery.value = address;
    if (address === '') {
      emit('search', {
        type: selectedTagType.value,
        address: null
      });
    }
    return;
  }
  // Si c'est un objet Adresse
  if (addressQuery.value === address.properties.label) {
    addresses.value = [];
  } else {
    loadAddresses.value = false;
  }
  addressQuery.value = address.properties.label;
  emit('search', {
    type: selectedTagType.value,
    address: address
  });
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
  addresses.value = response.value ? response.value.features : [];
}, 500));

if (props.query) {
  addressQuery.value = props.query;
}
</script>

<template>
  <div class="fr-grid-row">
    <div class="fr-col-12 fr-col-lg-6">
      <div>Agissez-vous en tant que ?</div>
      <DsfrTag v-for="tag in profileTags"
               :label="tag.label"
               class="fr-m-1w"
               :selected="selectedTagType === tag.type"
               @click="selectedTagType = tag.type"
               tag-name="button"/>
    </div>
    <div class="fr-col-12 fr-col-lg-6">
      <div class="fr-mb-1w">Où habitez-vous ? (Adresse complète)</div>
      <div class="autocomplete-wrapper">
        <FdrAutoComplete placeholder="Ex: 20 avenue de Ségur, 75007, Paris"
                         :model-value="addressQuery"
                         :options="addresses"
                         label="Champ de recherche d'adresse"
                         display-key="properties.label"
                         data-cy="AddressSearchInput"
                         @update:modelValue="selectAddress($event)"/>
        <Loader class="adresse-loader" :show="loadingAdresses || loading"/>
      </div>
    </div>
  </div>
  <DsfrNotice title="Nous ne conservons pas vos données et votre adresse"
              class="notice-light fr-mt-2w"/>
  <DsfrModal :opened="modalOpened"
             :title="modalTitle"
             icon="ri-checkbox-circle-line"
             :actions='[{label:"Recommencer"}]'>
    {{ modalText }}
  </DsfrModal>
</template>

<style scoped lang="scss">
.fr-notice {
  margin: auto
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