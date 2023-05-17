<script setup lang="ts">
definePageMeta({
  layout: 'basic',
})

useHead({
  title: `Eau sécheresse - Cookies`
})

const links: any[] = ref([{"to":"/","text":"Accueil"},{"text":"Cookies"}])
</script>

<template>
  <DsfrBreadcrumb :links='links'/>
  <div class="fr-mt-8w">
    <h1>Cookies</h1>
  </div>
</template>