<script setup lang="ts">
definePageMeta({
  layout: 'basic',
})

const links: any[] = ref([{"to":"/","text":"Accueil"},{"text":"Mentions légales"}])
</script>

<template>
  <DsfrBreadcrumb :links='links'/>
  <div class="fr-mt-8w">
    <h1>Mentions légales</h1>
  </div>
</template>