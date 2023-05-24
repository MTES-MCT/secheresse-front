<script setup lang="ts">
definePageMeta({
  layout: 'basic',
  middleware: 'situation-address'
})

useHead({
  title: `Préservons l'eau - Situation`
})
</script>

<template>
  <div>
    <SituationStatus/>
    <HomeGestes/>
    <HomeFaq />
  </div>
</template>
