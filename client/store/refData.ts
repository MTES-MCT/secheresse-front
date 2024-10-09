import { Ref } from 'vue';
import { Departement } from '../dto/departement.dto';
import { Region } from '../dto/region.dto';
import { BassinVersant } from '../dto/bassinVersant.dto';
import api from '../api';

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

  async function loadRefData() {
    if(departements.value.length > 0 && regions.value.length > 0 && bassinsVersants.value.length > 0) {
      return;
    }
    const { data, error } = await api.getRefData();
    if (data.value) {
      setBassinsVersants(data.value.bassinsVersants);
      setRegions(data.value.regions);
      setDepartements(data.value.departements);
    }
  }

  loadRefData();

  return { setDepartements, departements, setRegions, regions, setBassinsVersants, bassinsVersants, loadRefData };
});