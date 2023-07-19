import { defineStore } from 'pinia'
import { Zone } from "../dto/zone.dto";
import { Ref } from "vue";
import { Departement } from "../dto/departement.dto";

export const useZoneStore = defineStore('zoneStore', () => {
  const zone: Ref<Zone | null> = ref(null);

  function setRestriction(value: Zone, profile: string, departementConfig: Departement): void {
    zone.value = formatZone(value, profile, departementConfig);
  }

  function resetRestriction(): void {
    zone.value = null;
  }

  function formatZone(zone: Zone, profile: string, departementConfig: Departement): Zone {
    if (!zone) {
      return zone;
    }
    zone.profil = profile;
    zone.usages = zone.usages?.sort((a, b) => a.usage.localeCompare(b.usage));
    zone.departementConfig = departementConfig;
    return zone;
  }

  function isParticulier(): boolean {
    return zone.value ? zone.value.profil === 'particulier' : false;
  }

  return {setRestriction, resetRestriction, zone, isParticulier}
})