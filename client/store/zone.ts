import { defineStore } from 'pinia'
import { Zone } from "../dto/zone.dto";
import { Ref } from "vue";
import { Departement } from "../dto/departement.dto";

export const useZoneStore = defineStore('zoneStore', () => {
  const zones: Ref<Zone[] | null> = ref(null);
  const zone: Ref<Zone | null> = computed(() => zones.value ? zones.value[0] : null);

  function setZone(value: Zone, profile: string, departementConfig: Departement): void {
    zones.value = [formatZone(value, profile, departementConfig)];
  }

  function resetZones(): void {
    zones.value = null;
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

  return {setZone, resetZones, zones, zone, isParticulier}
})