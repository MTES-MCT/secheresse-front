import { Ref } from 'vue';
import { Departement } from '../dto/departement.dto';
import { Region } from '../dto/region.dto';
import { BassinVersant } from '../dto/bassinVersant.dto';

export const useRefDataStore = defineStore('refDataStore', () => {
  const departements: Ref<Departement[]> = ref([]);
  const regions: Ref<Region[]> = ref([]);
  const bassinsVersants: Ref<BassinVersant[]> = ref([]);

  function setDepartements(value: Departement[]): void {
    departements.value = value;
  }

  function setRegions(value: Region[]): void {
    regions.value = value;
  }

  function setBassinsVersants(value: BassinVersant[]): void {
    bassinsVersants.value = value;
  }

  return { setDepartements, departements, setRegions, regions, setBassinsVersants, bassinsVersants };
});