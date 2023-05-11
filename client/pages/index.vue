<script setup lang="ts">

import { Ref } from "vue";

definePageMeta({
  layout: 'basic',
})

const address: Ref<any> = ref(null);
</script>

<template>
  <div>
    <HomePresentation @address="address = $event"/>
    <HomeSituation v-if="!address"/>
    <HomeSituationStatus v-else
                         :address=address
    />
    <HomeGestes/>
    <HomeComment />
  </div>
</template>
