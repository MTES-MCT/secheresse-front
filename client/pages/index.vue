<script setup lang="ts">
definePageMeta({
  layout: 'basic',
})

useHead({
  title: `Accueil - ${useRuntimeConfig().public.appName}`
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
