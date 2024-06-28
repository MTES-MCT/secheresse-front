<script setup lang="ts">
definePageMeta({
  layout: 'emails-chambery',
});

const appName = useRuntimeConfig().public.appName;
useHead({
  title: `Emails - ${appName}`,
});
</script>

<template>
  <div class="fr-container">
    <h1 class="text-align-center fr-mt-4w">Merci !</h1>
    <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
      <div class="fr-col-3 text-align-right">
        <img src="/emails_popcorn.png"
             style="max-width: 100%"
             height="100"
             title="Image d'illustration popcorn"
        />
      </div>
      <div class="fr-col-9">
        Retrouvez nous tout l'été pour des conseils sur les économies d'eau !
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Nothing+You+Could+Do&display=swap');

h1 {
  font-family: "Nothing You Could Do", cursive;
  font-weight: 400;
  font-style: normal;
}

.text-align-right {
  text-align: right;
}
</style>