<script setup lang="ts">
const props = defineProps<{
  geste: { title: string, description: string, home: boolean, large: boolean }
}>()
</script>

<template>
  <div class="fr-col-12 fr-col-md-4" :class="geste.large ? '' : 'fr-col-lg-3'">
    <div class="eau-card fr-p-2w">
      <h6 class="eau-card__title fr-mt-2w fr-mb-2w">
        {{ geste.title }}
      </h6>
      <div class="eau-card__desc">
        {{ geste.description }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.eau-card {
  background-color: var(--background-default-grey);
}
</style>