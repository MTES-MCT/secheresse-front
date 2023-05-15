<script setup lang="ts">
import { Ref } from "vue";
import utils from "../../utils";
import api from "../../api";

const emit = defineEmits(['address']);

const addressQuery: Ref<string> = ref('');
const addresses: Ref<any[]> = ref([]);
const loadAddresses: Ref<boolean> = ref(true);

const selectAddress = (address: string | any) => {
  if (typeof address === 'string') {
    addressQuery.value = address;
    if (address === '') {
      emit('address', null);
    }
    return;
  }
  loadAddresses.value = false;
  addressQuery.value = address.properties.label;
  emit('address', address);
}

watch(addressQuery, utils.debounce(async () => {
  if (!addressQuery.value || !loadAddresses.value) {
    loadAddresses.value = true;
    addresses.value = [];
    return;
  }
  const result: any = await api.searchAddresses(addressQuery.value);
  addresses.value = result.features;
}, 500));
</script>

<template>
  <div class="fr-mb-1w">Où habitez-vous ? (Adresse complète ou préfecture)</div>
  <FdrAutoComplete placeholder="Ex: 20 avenue de Ségur, 75007, Paris"
                   :model-value="addressQuery"
                   :options="addresses"
                   display-key="properties.label"
                   data-cy="AddressSearchInput"
                   @update:modelValue="selectAddress($event)"/>
  <DsfrNotice title="Nous ne conservons pas vos données et votre adresse"
              class="notice-light fr-mt-1w"/>
</template>

<style scoped lang="scss">
.fr-notice {
  margin: auto
}
</style>