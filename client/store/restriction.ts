import { defineStore } from 'pinia'
import { Restriction } from "../dto/restriction.dto";
import { Ref } from "vue";

export const useRestrictionStore = defineStore('restrictionStore', () => {
  const restriction: Ref<Restriction | null> = ref(null);

  function setRestriction(value: any): void {
    restriction.value = value
  }

  function resetRestriction(): void {
    restriction.value = null;
  }

  return {setRestriction, resetRestriction, restriction}
})