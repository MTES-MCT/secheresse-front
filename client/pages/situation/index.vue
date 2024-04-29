<script setup lang="ts">
import { useAddressStore } from "../../store/address";

definePageMeta({
  layout: 'basic',
  middleware: 'situation-address'
})

const addressStore = useAddressStore();
const {adressString, isParticulier} = addressStore;

useHead({
  title: `Situation ${adressString()} - ${useRuntimeConfig().public.appName}`
})
</script>

<template>
  <div>
    <SituationStatus/>
    <MixinsEmail />
    <AccueilGestes v-if="isParticulier()"/>
    <AccueilLiens/>
    <AccueilFaq/>
  </div>
</template>
