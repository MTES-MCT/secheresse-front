import { useAddressStore } from "../store/address";
import { storeToRefs } from "pinia";
import { useRestrictionStore } from "../store/restrictions";

export default defineNuxtRouteMiddleware((to: any, from: any) => {
  const addressStore = useAddressStore();
  const {address, geo} = storeToRefs(addressStore);
  const restrictionStore = useRestrictionStore();
  const {restriction} = storeToRefs(restrictionStore);

  if ((!address.value && !geo.value) || !restriction.value) {
    return navigateTo({path: '/', query: to.query})
  }
})