import { defineStore } from 'pinia'
import { Restriction } from "../dto/restriction.dto";
import { Ref } from "vue";

export const useRestrictionsStore = defineStore('restrictionStore', () => {
  const restrictions: Ref<Restriction[] | null> = ref(null);

  function setRestrictions(value: Restriction[], profile: string): void {
    restrictions.value = formatRestrictions(value, profile);
  }

  function resetRestrictions(): void {
    restrictions.value = null;
  }

  function formatRestrictions(restrictions: Restriction[], profile: string): Restriction[] {
    if (!restrictions) {
      return restrictions;
    }
    return restrictions.map(r => {
      r.profil = profile;
      r.usages = r.usages?.sort((a, b) => a.usage.localeCompare(b.usage));
      return r;
    });
  }
  
  function isParticulier(): boolean {
    return restrictions.value ? restrictions.value[0].profil === 'particulier' : false;
  }

  return {setRestrictions, resetRestrictions, restrictions, isParticulier}
})