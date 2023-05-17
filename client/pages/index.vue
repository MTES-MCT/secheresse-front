<script setup lang="ts">
definePageMeta({
  layout: 'basic',
})

useHead({
  title: `Eau sécheresse - Accueil`
})
</script>

<template>
  <div>
    <HomePresentation/>
    <HomeSituation/>
    <HomeGestes/>
    <HomeComment/>
    <HomeFaq />
  </div>
</template>
