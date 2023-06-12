import { defineStore } from 'pinia'
import { Restriction } from "../dto/restriction.dto";
import { Ref } from "vue";

export const useRestrictionsStore = defineStore('restrictionStore', () => {
  const restrictions: Ref<Restriction[] | null> = ref(null);

  function setRestrictions(value: Restriction[]): void {
    restrictions.value = formatRestrictions(value);
  }

  function resetRestrictions(): void {
    restrictions.value = null;
  }

  function formatRestrictions(restrictions: Restriction[]): Restriction[] {
    if (!restrictions) {
      return restrictions;
    }
    return restrictions.map(r => {
      r.usages = r.usages.sort((a, b) => a.usage.localeCompare(b.usage));
      return r;
    });
  }

  return {setRestrictions, resetRestrictions, restrictions}
})