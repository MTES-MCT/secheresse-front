<script setup lang="ts">

import { Ref } from "vue";

definePageMeta({
  layout: 'basic',
})

const address: Ref<any> = ref(null);
const situation: Ref<any> = ref({
  "nbTerritories": 35,
  "rank": 2
})
</script>

<template>
  <div>
    <HomePresentation @address="address = $event"/>
    <HomeSituation v-if="!address"/>
    <HomeSituationStatus v-else
                         :address=address
                         :situation="situation"
    />
    <HomeGestes/>
    <HomeComment/>
  </div>
</template>
