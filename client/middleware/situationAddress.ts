import { useAddressStore } from "../store/address";
import { storeToRefs } from "pinia";
import api from "../api";
import utils from "../utils";

export default defineNuxtRouteMiddleware(async (to: any, from: any) => {
  const addressStore = useAddressStore();
  const {address, geo, profile, typeEau} = storeToRefs(addressStore);
  if (address.value || geo.value) {
    return true;
  }

  const addressString: string | null = to.query.adresse ? to.query.adresse : null;
  if (!addressString) {
    return navigateTo({path: '/', query: to.query});
  }
  const profil = to.query.profil ? to.query.profil : profile.value;
  const eau = to.query.typeEau ? to.query.typeEau : typeEau.value;

  // SEARCH ADDRESS
  const {data, error} = await api.searchAddresses(addressString);
  const firstAddress = data.value?.features[0];
  if (!firstAddress) {
    return navigateTo({path: '/', query: to.query});
  }
  await utils.searchZones(firstAddress, null, profil, eau, useRouter());

  if (!address.value && !geo.value) {
    return navigateTo({path: '/', query: to.query})
  }
})