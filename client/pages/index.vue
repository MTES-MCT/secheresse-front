<script setup lang="ts">
definePageMeta({
  layout: 'basic',
})

useHead({
  title: `${useRuntimeConfig().public.appName} - Accueil`
})
</script>

<template>
  <div>
    <AccueilPresentation/>
    <AccueilGestes/>
    <AccueilLiens />
    <AccueilFaq />
  </div>
</template>
