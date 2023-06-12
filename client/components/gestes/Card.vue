<script setup lang="ts">
const props = defineProps<{
  geste: { title: string, description: string, home: boolean, large: boolean, icon: string }
}>()
</script>

<template>
  <div class="fr-col-12 fr-col-md-4" :class="geste.large ? '' : 'fr-col-lg-3'">
    <div class="eau-card fr-p-2w">
      <h6 class="eau-card__title fr-my-2w">
        <VIcon v-if="geste.icon"
               :name="geste.icon"
               scale="3"/>
        <br v-if="geste.icon"/>
        <br v-if="geste.icon"/>
        {{ geste.title }}
      </h6>
      <div class="eau-card__desc" v-html="geste.description">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.eau-card {
  background-color: var(--background-default-grey);
}
</style>