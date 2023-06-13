<script setup lang="ts">
import { useRestrictionsStore } from "../../store/restrictions";

definePageMeta({
  layout: 'basic',
  middleware: 'situation-address'
})

useHead({
  title: `Préservons l'eau - Situation`
})

const restrictionsStore = useRestrictionsStore();
const {isParticulier} = restrictionsStore;
</script>

<template>
  <div>
    <SituationStatus/>
    <AccueilGestes v-if="isParticulier()"/>
    <AccueilFaq/>
  </div>
</template>
