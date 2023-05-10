<script setup lang="ts">
const props = defineProps<{
  geste: {title: string, description: string}
}>()
</script>

<template>
  <div class="fr-col-12 fr-col-md-4 fr-col-lg-3">
    <DsfrTile :title="geste.title"
              :description="geste.description"
              class="tile-light"
    />
  </div>
</template>

<style lang="scss">
.tile-light.fr-tile {
  box-shadow: none;
  
  .fr-tile__body {
    text-align: left;
    align-items: baseline;
  }
  
  .fr-tile__title {
    color: var(--blue-france-sun-113-625)
  }
}
</style>