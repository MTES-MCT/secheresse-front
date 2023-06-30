<script setup lang="ts">
import { Ref } from "vue";

definePageMeta({
  layout: 'basic',
})

const appName = useRuntimeConfig().public.appName;
useHead({
  title: `Données personnelles - ${useRuntimeConfig().public.appName}`
})

const links: Ref<any[]> = ref([{"to": "/", "text": "Accueil"}, {"text": "Données personnelles"}])
</script>

<template>
  <DsfrBreadcrumb :links='links'/>
  <div class="fr-mt-8w">
    <h1>Données personnelles</h1>
    <p>{{ appName }} ne recueille aucune donnée personnelle.</p>
  </div>
</template>