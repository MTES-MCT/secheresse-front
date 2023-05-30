<script setup lang="ts">
import { Ref } from "vue";
import utils from "../../utils";
import api from "../../api";
import { Address } from "../../dto/address.dto";

const emit = defineEmits(['address']);

const addressQuery: Ref<string> = ref('');
const addresses: Ref<Address[]> = ref([]);
const loadAddresses: Ref<boolean> = ref(true);
const modalTitle: Ref<string> = ref('');
const modalText: Ref<string> = ref('');
const modalOpened: Ref<boolean> = ref(false);

const selectAddress = (address: string | Address) => {
  if (typeof address === 'string') {
    addressQuery.value = address;
    if (address === '') {
      emit('address', null);
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
  emit('address', address);
}

watch(addressQuery, utils.debounce(async () => {
  if (!addressQuery.value || !loadAddresses.value) {
    loadAddresses.value = true;
    addresses.value = [];
    return;
  }
  const {data: response, error} = await api.searchAddresses(addressQuery.value);
  addresses.value = response.value ? response.value.features : [];
}, 500));
</script>

<template>
  <div class="fr-mb-1w">Où habitez-vous ? (Adresse complète ou commune)</div>
  <FdrAutoComplete placeholder="Ex: 20 avenue de Ségur, 75007, Paris"
                   :model-value="addressQuery"
                   :options="addresses"
                   label="Champ de recherche d'adresse"
                   display-key="properties.label"
                   data-cy="AddressSearchInput"
                   @update:modelValue="selectAddress($event)"/>
  <DsfrNotice title="Nous ne conservons pas vos données et votre adresse"
              class="notice-light fr-mt-1w"/>
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
</style>