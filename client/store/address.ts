import { defineStore } from 'pinia'

export const useAddressStore = defineStore('addressStore', () => {
  const address = ref(null);

  function setAddress(value: any) {
    address.value = value
  }

  function resetAddress() {
    address.value = null;
  }

  return {setAddress, resetAddress, address}
})