<script setup lang="ts">
import { Ref } from 'vue';

definePageMeta({
  layout: 'basic',
});

const route = useRoute();

useHead({
  title: `Historique commune ${route.params.code_insee} - ${useRuntimeConfig().public.appName}`,
});

const links: Ref<any[]> = ref([{ to: '/', text: 'Accueil' }, { to: '/donnees', text: 'Données sécheresse' }, { text: 'Historique commune' }]);

const communeName = ref(null);
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <h1>Commune - {{ route.params.code_insee }} <span v-if="communeName">({{ communeName }})</span></h1>
    <DonneesCommune :codeInsee="route.params.code_insee" @commune="communeName = $event.nom" />
  </div>
</template>