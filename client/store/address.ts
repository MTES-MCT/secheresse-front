import { defineStore } from 'pinia'
import { Ref } from "vue";
import { Address } from "../dto/address.dto";

export const useAddressStore = defineStore('addressStore', () => {
  const address: Ref<Address | null> = ref(null);

  function setAddress(value: any): void {
    address.value = value
  }

  function resetAddress(): void {
    address.value = null;
  }

  return {setAddress, resetAddress, address}
})