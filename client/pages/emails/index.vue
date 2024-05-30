<script setup lang="ts">
definePageMeta({
  layout: 'basic',
});

const appName = useRuntimeConfig().public.appName;
useHead({
  title: `Emails - ${appName}`,
});
</script>

<template>
  <div class="fr-container">
    <h1 class="text-align-center">Merci</h1>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col-3 text-align-right">
        <img src="/emails_popcorn.png"
             style="max-width: 100%"
             height="100"
             title="Image d'illustration popcorn"
        />
      </div>
      <div class="fr-col-9">
        Retrouvez notre prochain épisode le samedi 15 juin dans votre boite email !
      </div>
    </div>
  </div>
</template>