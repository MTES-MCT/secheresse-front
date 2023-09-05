import { defineStore } from 'pinia'
import { Zone } from "../dto/zone.dto";
import { Ref } from "vue";
import { Departement } from "../dto/departement.dto";

export const useZoneStore = defineStore('zoneStore', () => {
  const zones: Ref<Zone[] | null> = ref(null);
  const zone: Ref<Zone | null> = computed(() => zones.value ? zones.value[0] : null);

  function setZones(value: Zone[], departementConfig: Departement): void {
    zones.value = formatZones(value, departementConfig);
  }

  function resetZones(): void {
    zones.value = null;
  }

  function formatZones(zones: Zone[], departementConfig: Departement): Zone[] {
    if (!zones || zones.length < 1) {
      return zones;
    }
    zones.map(zone => {
      zone.usages = zone.usages?.sort((a, b) => a.usage.localeCompare(b.usage));
      zone.departementConfig = departementConfig;
    })

    zones.sort((a, b) => utils.getRestrictionRank(b.niveauAlerte) - utils.getRestrictionRank(a.niveauAlerte));
    return zones;
  }

  return {setZones, resetZones, zones, zone}
})