<script setup lang="ts">
import gestes from '../../data/gestes.json'
</script>

<template>
  <div class="gestes fr-grid-row fr-grid-row--center fr-pt-4w fr-pb-4w">
    <div class="section-title fr-mb-8w">
      <h1>Les gestes à adopter dès maintenant</h1>
      <span>En plus des restrictions, l’adoption des éco-gestes est un bon moyen de préserver les réserves d’eau et d’éviter que la situation s’aggrave. Voici quelques exemples d’habitudes à prendre pour limiter sa consommation d’eau à l’échelle individuelle.</span>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-8w">
      <GestesCard v-for="geste in gestes.data"
                  :geste="geste"
      />
      <GestesCardMore />
    </div>
    <span>Les mesures en litres d'eau annoncées sont des mesures moyennes constatées.</span>
  </div>
</template>

<style lang="scss">
.gestes {
  position: relative;
  
  &:before {
    content: "";
    position: absolute;
    width: 100vw;
    height: 100%;
    left: 50%;
    top: 0;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    background: linear-gradient(180deg, #FFFBF4 0%, #ECECFE 100%);
    opacity: 0.8;
    z-index: -1;
  }
}
</style>