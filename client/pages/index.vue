<script setup lang="ts">
definePageMeta({
  layout: 'basic',
})

useHead({
  title: `Préservons l'eau - Accueil`
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
