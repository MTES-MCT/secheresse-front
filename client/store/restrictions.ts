import { defineStore } from 'pinia'
import { Restriction } from "../dto/restriction.dto";
import { Ref } from "vue";
import { Departement } from "../dto/departement.dto";

export const useRestrictionStore = defineStore('restrictionStore', () => {
  const restriction: Ref<Restriction | null> = ref(null);

  function setRestriction(value: Restriction, profile: string, departementConfig: Departement): void {
    restriction.value = formatRestriction(value, profile, departementConfig);
  }

  function resetRestriction(): void {
    restriction.value = null;
    departementConfig.value = null;
  }

  function formatRestriction(restriction: Restriction, profile: string, departementConfig: Departement): Restriction {
    if (!restriction) {
      return restriction;
    }
    restriction.profil = profile;
    restriction.usages = restriction.usages?.sort((a, b) => a.usage.localeCompare(b.usage));
    restriction.departementConfig = departementConfig;
    return restriction;
  }

  function isParticulier(): boolean {
    return restriction.value ? restriction.value.profil === 'particulier' : false;
  }

  return {setRestriction, resetRestriction, restriction, isParticulier}
})