import { defineStore } from 'pinia'
import { Restriction } from "../dto/restriction.dto";
import { Ref } from "vue";

export const useRestrictionsStore = defineStore('restrictionStore', () => {
  const restrictions: Ref<Restriction[] | null> = ref(null);

  function setRestrictions(value: Restriction[]): void {
    restrictions.value = value
  }

  function resetRestrictions(): void {
    restrictions.value = null;
  }

  return {setRestrictions, resetRestrictions, restrictions}
})