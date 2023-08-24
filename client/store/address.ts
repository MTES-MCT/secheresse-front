import { defineStore } from 'pinia'
import { Ref } from "vue";
import { Address } from "../dto/address.dto";
import { Geo } from "../dto/geo.dto";

export const useAddressStore = defineStore('addressStore', () => {
  const address: Ref<Address | null> = ref(null);
  const geo: Ref<Geo | null> = ref(null);

  function setAddress(value: Address): void {
    address.value = value
  }

  function setGeo(value: Geo): void {
    geo.value = value
  }

  function resetAddress(): void {
    address.value = null;
    geo.value = null;
  }

  function adressString(): string | undefined {
    if (address.value) {
      return address.value.properties.label
    } else if (geo.value) {
      return geo.value.nom
    }
  }

  return {setAddress, setGeo, resetAddress, adressString, address, geo}
})