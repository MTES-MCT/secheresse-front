import { useAddressStore } from "../store/address";
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to: any, from: any) => {
  const addressStore = useAddressStore();
  const {address, geo} = storeToRefs(addressStore);

  if (!address.value && !geo.value) {
    return navigateTo({path: '/', query: to.query})
  }
})