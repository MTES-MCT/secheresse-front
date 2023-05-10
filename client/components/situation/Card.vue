<script setup lang="ts">
const props = defineProps<{
  situation: { rank: number, nbTerritories: number }
}>()

const badgeLabel = computed<string>(() => {
  let label = `${props.situation.rank}/4 - `
  switch (props.situation.rank) {
    case 1:
      label += 'En état de vigilance';
      break;
    case 2:
      label += `En état d'alerte`;
      break;
    case 3:
      label += `En état d'alerte renforcé`;
      break;
    case 4:
      label += `En état de crise`;
      break;
  }
  return label;
})

const cardDescription = computed<string>(() => {
  switch (props.situation.rank) {
    case 1:
      return `Pas de restrictions, mais l’adoption des éco-gestes est fortement conseillée afin d’éviter une future crise !`;
    case 2:
      return `Réduction des prélèvements, restrictions et limitations préfectorales. Vérifiez vite votre situation afin de savoir si elles vous concernent.`;
    case 3:
      return `Réduction des prélèvements, restrictions et limitations préfectorales. Vérifiez vite votre situation afin de savoir si elles vous concernent.`;
    case 4:
      return `Arrêt des prélèvements non prioritaires y compris des prélèvements à des fins agricoles.`;
  }
})
</script>

<template>
  <div class="fr-col-12 fr-col-md-6">
    <div class="situation-card fr-p-2w">
      <DsfrBadge small type="warning" :label="badgeLabel" no-icon/>
      <h3 class="situation-card__title fr-mt-2w fr-mb-2w">
        {{ situation.nbTerritories }} Territoires concernés
      </h3>
      <div class="situation-card__desc">
        {{ cardDescription }}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.situation-card {
  width: 100%;
  border: 1px var(--grey-950-100) solid;
  box-sizing: border-box;
  
  &__title {
    color: var(--blue-france-sun-113-625);
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 700;
  }
}
</style>