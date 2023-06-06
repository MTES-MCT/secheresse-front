<script setup lang="ts">
import { Usage } from "../../../dto/usage.dto";

const props = defineProps<{
  usage: Usage
}>()

const cardDesc = computed((): string => {
  let cardDesc = '';
  cardDesc += props.usage.details ? props.usage.details : '';
  cardDesc += (props.usage.niveauRestriction === 'Interdiction sur plage horaire' && props.usage.heureDebut && props.usage.heureFin) ? `Interdit de ${props.usage.heureDebut} à ${props.usage.heureFin}` : '';
  cardDesc += props.usage.erreur ? `Consulter l'arrêté` : '';
  return cardDesc;
})
</script>

<template>
  <div class="eau-card fr-p-2w">
    <h6 class="eau-card__title fr-my-2w">
      {{ usage.usage }}
    </h6>
    <div class="eau-card__desc">
      {{ cardDesc }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.eau-card {
  background-color: var(--background-default-grey);

  .eau-card__desc {
    white-space: pre-wrap;
  }
}
</style>