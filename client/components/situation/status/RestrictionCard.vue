<script setup lang="ts">
import { Restriction } from "../../../dto/restriction.dto";

const props = defineProps<{
  restriction: Restriction
}>()
</script>

<template>
  <div class="fr-col-12 fr-col-md-4 fr-col-lg-3">
    <div class="eau-card fr-p-2w">
      <DsfrBadge small
                 class="fr-mr-1w"
                 label="label"
                 no-icon/>
      <DsfrBadge small
                 label="label"
                 no-icon/>
      <h6 class="eau-card__title fr-mt-2w fr-mb-2w">
        {{ restriction.usage }}
      </h6>
      <div class="eau-card__desc">
        {{ restriction.niveauRestriction }}<br/>
        {{ restriction.details }}
      </div>
    </div>    
  </div>
</template>

<style lang="scss" scoped>
.eau-card {
  background-color: var(--background-default-grey);
}
</style>