<script setup lang="ts">

</script>

<template>
  <div class="callout fr-grid-row fr-grid-row--middle">
    <div class="fr-col-12 fr-col-md-3 callout--image">
      <img src="/callout_simulateur.svg"
           style="max-width: 100%"
           width="120" height="121"
           alt="Image d'illustration arrosoir"
           title="Image d'illustration arrosoir"
      />
    </div>
    <div class="fr-col-12 fr-col-md-9 callout--text">
      <h4>Découvrez l’estimation de votre consommation</h4>
      <a class="fr-btn"
         target="_blank"
         rel="external"
         href="https://www.cieau.com/le-metier-de-leau/usages-consommation-conseils/calculateur-consommation-eau-annuelle/">
        Découvrer le calculater Cieau
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.callout {
  border: 1px solid var(--yellow-tournesol-850-200);
  background-color: var(--yellow-tournesol-975-75);

  h4 {
    color: var(--yellow-tournesol-main-731);
  }
  
  &--image {
    text-align: center;
  }
  
  &--text {
    text-align: left;    
  }
}

@media screen and (max-width: 767px) {
  .callout--text {
    text-align: center;
  }
}
</style>