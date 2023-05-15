import { useAddressStore } from "../store/address";
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware(() => {
  const addressStore = useAddressStore();
  const {address} = storeToRefs(addressStore);
  
  if (address.value === null) {
    return navigateTo('/')
  }
})