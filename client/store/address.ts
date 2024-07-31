import { defineStore } from 'pinia'
import { Ref } from "vue";
import { Address } from "../dto/address.dto";
import { Geo } from "../dto/geo.dto";

export const useAddressStore = defineStore('addressStore', () => {
  const address: Ref<Address | null> = ref(null);
  const geo: Ref<Geo | null> = ref(null);
  const profile: Ref<string> = ref('particulier');
  const typeEau: Ref<string> = ref('AEP');

  function setAddress(value: Address): void {
    address.value = value
  }

  function setGeo(value: Geo): void {
    geo.value = value
  }

  function setProfile(value: string): void {
    profile.value = ['particulier', 'entreprise', 'exploitation', 'collectivite'].includes(value) ? value : profile.value;
  }

  function setTypeEau(value: string): void {
    typeEau.value = ['SUP', 'SOU', 'AEP'].includes(value) ? value : typeEau.value;
  }

  function resetAddress(): void {
    address.value = null;
    geo.value = null;
  }

  function adressString(): string | undefined {
    if (address.value) {
      return address.value.properties.label
    } else if (geo.value) {
      return geo.value.nom
    }
  }

  function getCodeDepartement(): string | undefined {
    if (address.value) {
      return address.value.properties.postcode.slice(0, 2);
    } else if (geo.value) {
      return geo.value.codeDepartement
    }
  }

  function isParticulier(): boolean {
    return profile.value ? profile.value === 'particulier' : false;
  }

  return {setAddress, setGeo, setProfile, setTypeEau, resetAddress, adressString, address, geo, profile, typeEau, isParticulier, getCodeDepartement}
})