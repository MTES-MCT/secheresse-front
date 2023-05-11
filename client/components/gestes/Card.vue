<script setup lang="ts">
const props = defineProps<{
  geste: {title: string, description: string}
}>()
</script>

<template>
  <div class="fr-col-12 fr-col-md-4 fr-col-lg-3">
    <div class="geste-card fr-p-2w">
      <h3 class="geste-card__title fr-mt-2w fr-mb-2w">
        {{ geste.title }}
      </h3>
      <div class="geste-card__desc">
        {{ geste.description }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.geste-card {
  width: 100%;
  border: 1px var(--grey-950-100) solid;
  box-sizing: border-box;
  background-color: var(--background-default-grey);

  &__title {
    color: var(--blue-france-sun-113-625);
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 700;
  }
}
</style>