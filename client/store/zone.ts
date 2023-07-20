import { defineStore } from 'pinia'
import { Zone } from "../dto/zone.dto";
import { Ref } from "vue";
import { Departement } from "../dto/departement.dto";

export const useZoneStore = defineStore('zoneStore', () => {
  const zones: Ref<Zone[] | null> = ref(null);
  const zone: Ref<Zone | null> = computed(() => zones.value ? zones.value[0] : null);

  function setZones(value: Zone[], profile: string, departementConfig: Departement): void {
    zones.value = formatZones(value, profile, departementConfig);
  }

  function resetZones(): void {
    zones.value = null;
  }

  function formatZones(zones: Zone[], profile: string, departementConfig: Departement): Zone[] {
    if (!zones || zones.length < 1) {
      return zones;
    }
    zones.map(zone => {
      zone.profil = profile;
      zone.usages = zone.usages?.sort((a, b) => a.usage.localeCompare(b.usage));
      zone.departementConfig = departementConfig;
    })

    zones.sort((a, b) => utils.getRestrictionRank(b) - utils.getRestrictionRank(a));
    return zones;
  }

  function isParticulier(): boolean {
    return zone.value ? zone.value.profil === 'particulier' : false;
  }

  return {setZones, resetZones, zones, zone, isParticulier}
})