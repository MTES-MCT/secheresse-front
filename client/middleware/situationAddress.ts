import { useAddressStore } from "../store/address";
import { storeToRefs } from "pinia";
import { useZoneStore } from "../store/zone";

export default defineNuxtRouteMiddleware((to: any, from: any) => {
  const addressStore = useAddressStore();
  const {address, geo} = storeToRefs(addressStore);
  const zoneStore = useZoneStore();
  const {zone} = storeToRefs(zoneStore);

  if ((!address.value && !geo.value) || !zone.value) {
    return navigateTo({path: '/', query: to.query})
  }
})