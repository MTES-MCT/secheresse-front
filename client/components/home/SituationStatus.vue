<script setup lang="ts">
const props = defineProps<{
  situation: { rank: number, nbTerritories: number }
  address: any
}>()

</script>

<template>
  <div class="situation-status fr-grid-row fr-grid-row--center fr-mt-4w fr-mb-4w">
    <div class="situation-status-title fr-mb-8w">
      <h1>Votre <span class="keyword-highlight">situation</span> en temps réel</h1>
    </div>
    <SituationStatusHeader :address="address" class="fr-mb-4w" />
    <SituationStatusLaws />
  </div>
</template>

<style lang="scss">
.situation-status {
  &-title {
    text-align: center;
    width: 70%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>