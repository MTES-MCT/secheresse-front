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
    <AccueilGestes v-if="isParticulier()"/>
    <CarteWrapper />
    <MixinsEmail/>
    <AccueilLiens/>
    <AccueilFaq/>
  </div>
</template>
