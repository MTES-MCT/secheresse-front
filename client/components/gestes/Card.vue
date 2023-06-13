<script setup lang="ts">
const props = defineProps<{
  geste: { title: string, description: string, economie: string, home: boolean, large: boolean, icon: string }
}>()
</script>

<template>
  <div class="fr-col-12 fr-col-md-4" :class="geste.large ? '' : 'fr-col-lg-3'">
    <div class="eau-card fr-p-2w">
      <h6 class="eau-card__title fr-my-2w">
        <div class="fr-grid-row">
          <div v-if="geste.icon" class="fr-col-3" :style="'max-width: 60px'">
            <VIcon :name="geste.icon"
                   scale="3"/>
          </div>
          <div :class="geste.icon ? 'fr-col-9' : 'fr-col-12'">
            {{ geste.title }}
          </div>
        </div>
      </h6>
      <div class="eau-card__desc" v-if="geste.description" v-html="geste.description">
      </div>
      <br v-if="geste.economie && geste.description" />
      <div class="eau-card__desc" v-if="geste.economie">
        <b>Économie réalisée : </b> {{ geste.economie }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.eau-card {
  background-color: var(--background-default-grey);
  height: 100%;
}
</style>