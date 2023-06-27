import { defineStore } from 'pinia'
import { Restriction } from "../dto/restriction.dto";
import { Ref } from "vue";
import utils from "../utils";
import { Departement } from "../dto/departement.dto";

export const useRestrictionsStore = defineStore('restrictionStore', () => {
  const restrictions: Ref<Restriction[] | null> = ref(null);

  function setRestrictions(value: Restriction[], profile: string, departementConfig: Departement): void {
    restrictions.value = formatRestrictions(value, profile, departementConfig);
  }

  function resetRestrictions(): void {
    restrictions.value = null;
  }

  function formatRestrictions(restrictions: Restriction[], profile: string, departementConfig: Departement): Restriction[] {
    if (!restrictions) {
      return restrictions;
    }
    // @ts-ignore
    if (departementConfig.affichageRestrictionSiSuperpositionTypeZone === 'Affichage Prio Eau Sou') {
      restrictions.sort((a, b) => a.type === 'SOU' ? -1 : 1);
    } else if (departementConfig.affichageRestrictionSiSuperpositionTypeZone === 'Affichage Prio Eau Sup') {
      restrictions.sort((a, b) => a.type === 'SUP' ? -1 : 1);
    } else if (departementConfig.affichageRestrictionSiSuperpositionTypeZone === 'Affichage Uniquement Niveau Gravité Max') {
      restrictions.sort((a, b) => utils.getRestrictionRank(b) - utils.getRestrictionRank(a));
      restrictions = [restrictions[0]];
    } else {
      restrictions.sort((a, b) => utils.getRestrictionRank(b) - utils.getRestrictionRank(a));
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