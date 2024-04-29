import { defineStore } from 'pinia'
import { Zone } from "../dto/zone.dto";
import { Ref } from "vue";

export const useZoneStore = defineStore('zoneStore', () => {
  const zones: Ref<Zone[] | null> = ref(null);
  const zone: Ref<Zone | null> = computed(() => zones.value ? zones.value[0] : null);

  function setZones(value: Zone[]): void {
    zones.value = formatZones(value);
  }

  function resetZones(): void {
    zones.value = null;
  }

  function formatZones(zones: Zone[]): Zone[] {
    if (!zones || zones.length < 1) {
      return zones;
    }
    zones.map(zone => {
      zone.usages = zone.usages?.sort((a, b) => a.nom.localeCompare(b.nom));
    })

    zones.sort((a, b) => utils.getRestrictionRank(b.niveauGravite) - utils.getRestrictionRank(a.niveauGravite));
    return zones;
  }

  return {setZones, resetZones, zones, zone}
})