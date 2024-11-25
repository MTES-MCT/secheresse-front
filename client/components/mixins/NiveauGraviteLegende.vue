<script setup lang="ts">
import niveauxGravite from '../../dto/niveauGravite';
</script>

<template>
  <div class="fr-grid-row">
    <template v-for="legend in niveauxGravite">
      <DsfrTooltip on-hover
                   :content="legend.description">
        <DsfrBadge small
                   @click="$event.preventDefault();"
                   class="fr-mr-1w"
                   :class="legend.class"
                   type=""
                   :label="legend.text" />
      </DsfrTooltip>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.situation-level-bg-0 {
  color: var(--grey-0-1000);
}

:deep(.fr-link) {
  background: none;
}
</style>