<script setup lang="ts">
import { useAddressStore } from "../store/address";

definePageMeta({
  layout: 'basic',
  middleware: 'home'
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
    <AccueilTypesEau/>
    <CarteWrapper />
    <AccueilGestes v-if="isParticulier()"/>
    <MixinsEmail/>
    <AccueilLiens/>
    <AccueilFaq/>
  </div>
</template>
