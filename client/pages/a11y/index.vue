<script setup lang="ts">
definePageMeta({
  layout: 'basic',
})

const links: any[] = ref([{"to":"/","text":"Accueil"},{"text":"Accessibilité"}])
</script>

<template>
  <DsfrBreadcrumb :links='links'/>
  <div class="fr-mt-8w">
    <h1>Accessibilité</h1>
  </div>
</template>