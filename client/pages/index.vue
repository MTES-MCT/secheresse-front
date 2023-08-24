<script setup lang="ts">
import { useAddressStore } from "../store/address";

definePageMeta({
  layout: 'basic',
})

useHead({
  title: `Accueil - ${useRuntimeConfig().public.appName}`
})

const addressStore = useAddressStore();
const {isParticulier} = addressStore;
</script>

<template>
  <div>
    <AccueilPresentation/>
    <AccueilCarte />
    <AccueilGestes v-if="isParticulier()"/>
    <AccueilLiens />
    <AccueilFaq />
  </div>
</template>
