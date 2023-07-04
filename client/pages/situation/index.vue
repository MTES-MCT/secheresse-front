<script setup lang="ts">
import { useAddressStore } from "../../store/address";

definePageMeta({
  layout: 'basic',
  middleware: 'situation-address'
})

const addressStore = useAddressStore();
const {adressString} = addressStore;

useHead({
  title: `Situation ${adressString()} - ${useRuntimeConfig().public.appName}`
})
</script>

<template>
  <div>
    <SituationStatus/>
    <AccueilGestes/>
    <AccueilLiens/>
    <AccueilFaq/>
  </div>
</template>
