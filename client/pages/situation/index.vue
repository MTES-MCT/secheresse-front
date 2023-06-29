<script setup lang="ts">
import { useRestrictionsStore } from "../../store/restrictions";

definePageMeta({
  layout: 'basic',
  middleware: 'situation-address'
})

useHead({
  title: `${useRuntimeConfig().public.appName} - Situation`
})

const restrictionsStore = useRestrictionsStore();
const {isParticulier} = restrictionsStore;
</script>

<template>
  <div>
    <SituationStatus/>
    <AccueilGestes />
    <AccueilLiens />
    <AccueilFaq/>
  </div>
</template>
