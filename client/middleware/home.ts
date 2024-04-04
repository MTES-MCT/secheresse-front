import { useAddressStore } from "../store/address";
import { storeToRefs } from "pinia";
import api from "../api";
import utils from "../utils";

export default defineNuxtRouteMiddleware(async (to: any, from: any) => {
  const addressStore = useAddressStore();
  const {profile, typeEau} = storeToRefs(addressStore);
  
  const profil = to.query.profil ? to.query.profil : profile.value;
  const eau = to.query.typeEau ? to.query.typeEau : typeEau.value;
  
  addressStore.setProfile(profil);
  addressStore.setTypeEau(eau);
  
  return true;
})