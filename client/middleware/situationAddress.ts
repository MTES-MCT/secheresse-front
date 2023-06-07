import { useAddressStore } from "../store/address";
import { storeToRefs } from "pinia";
import { useRestrictionsStore } from "../store/restrictions";

export default defineNuxtRouteMiddleware(() => {
  const addressStore = useAddressStore();
  const {address, geo} = storeToRefs(addressStore);
  const restrictionsStore = useRestrictionsStore();
  const {restrictions} = storeToRefs(restrictionsStore);
  
  if ((!address.value && !geo.value) || !restrictions.value) {
    return navigateTo('/')
  }
})