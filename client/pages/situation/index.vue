<script setup lang="ts">
import { useAddressStore } from "../../store/address";
import { useZoneStore } from "../../store/zone";

definePageMeta({
  layout: 'basic',
  middleware: 'situation-address'
})

const addressStore = useAddressStore();
const zoneStore = useZoneStore();
const {adressString} = addressStore;
const {isParticulier} = zoneStore;

useHead({
  title: `Situation ${adressString()} - ${useRuntimeConfig().public.appName}`
})
</script>

<template>
  <div>
    <SituationStatus/>
    <AccueilGestes v-if="isParticulier()"/>
    <AccueilLiens/>
    <AccueilFaq/>
  </div>
</template>
