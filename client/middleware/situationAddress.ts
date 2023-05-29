import { useAddressStore } from "../store/address";
import { storeToRefs } from "pinia";
import { useRestrictionStore } from "../store/restriction";

export default defineNuxtRouteMiddleware(() => {
  const addressStore = useAddressStore();
  const {address} = storeToRefs(addressStore);
  const restrictionStore = useRestrictionStore();
  const {restriction} = storeToRefs(restrictionStore);
  
  if (!address.value || !restriction.value) {
    return navigateTo('/')
  }
})