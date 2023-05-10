<script setup lang="ts">
const props = defineProps<{
  situation: { rank: number, nbTerritories: number }
  address: any
}>()

const badgeLabel = computed<string>(() => {
  return `Crise: Niveau 4/4`;
})
</script>

<template>
  <div class="situation-status-header fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-col-md-6">
      <DsfrBadge small type="error" :label="badgeLabel" no-icon/>
      <div>{{ address.properties.label }}</div>
      <h3>Votre territoire est actuellement en <span class="keyword-highlight">état de crise</span></h3>
      <div>Le respect des restrictions <b>est obligatoire</b> sous peine de recevoir une <b>amende</b> de 1 000 000€</div>
    </div>
    <div class="fr-col-12 fr-col-md-6 button-wrapper">
      <DsfrButton label="Télécharger l'arrêté préfectoral" />      
    </div>
  </div>
</template>

<style lang="scss">
.situation-status-header {
  background-color: var(--info-975-75);
  width: 100%;
  
  .button-wrapper {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }
}
</style>