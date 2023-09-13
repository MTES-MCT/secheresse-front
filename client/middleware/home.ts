import { useAddressStore } from "../store/address";
import { storeToRefs } from "pinia";

export default defineNuxtRouteMiddleware((to: any, from: any) => {
  const addressStore = useAddressStore();
  const {profile} = storeToRefs(addressStore);

  if (!to.query.profil) {
    const queries = to.query;
    queries.profil = profile.value;
    return navigateTo({path: '/', query: queries});
  }
})