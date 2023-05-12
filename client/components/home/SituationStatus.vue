<script setup lang="ts">
const props = defineProps<{
  situation: { rank: number, nbTerritories: number }
  address: any
}>()

</script>

<template>
  <div class="situation-status fr-grid-row fr-grid-row--center fr-mt-4w fr-mb-4w">
    <div class="section-title fr-mb-8w">
      <h1>Votre situation en temps réel</h1>
    </div>
    <SituationStatusHeader :address="address" class="fr-mb-4w" />
    <SituationStatusLaws />
  </div>
</template>