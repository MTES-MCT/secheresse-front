<script setup lang="ts">

</script>

<template>
  <div class="callout fr-grid-row fr-grid-row--middle">
    <div class="fr-col-12 callout--image">
      <img src="/callout_simulateur.svg"
           style="max-width: 100%"
           width="120" height="121"
           title="Image d'illustration arrosoir"
      />
    </div>
    <div class="fr-col-12 callout--text">
      <h4>Estimer votre consommation d'eau annuelle</h4>
      <a class="fr-btn"
         id="matomo_calculateur_consommation"
         target="_blank"
         rel="external"
         href="https://www.cieau.com/le-metier-de-leau/usages-consommation-conseils/calculateur-consommation-eau-annuelle/">
        Je découvre le calculateur Cieau
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.callout {
  border: 1px solid var(--yellow-tournesol-main-731);
  background-color: var(--yellow-tournesol-975-75);
}

@media screen and (max-width: 767px) {
  .callout {
    &--text, &--image {
      text-align: center;
    }
  }
}
</style>