<script setup lang="ts">
</script>

<template>
  <div class="presentation fr-py-4w">
    <div class="fr-container fr-grid-row fr-grid-row--middle">
      <div class="fr-col-12 fr-col-lg-6">
        <h1>Suis-je concerné par les restritions ?</h1>
      </div>

      <div class="search-card fr-col-12 fr-col-lg-6 fr-p-md-6w fr-p-1w">
        <div class="search-card-wrapper">
          <MixinsSearch />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.presentation {
  background: var(--yellow-tournesol-975-75);
}

.search-card {
  background-color: var(--background-default-grey);
  border: 1px var(--blue-cumulus-main-526) solid;

  &-wrapper {
    max-width: 700px;
    margin: auto;
  }
}

.fr-notice {
  width: 100vw;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}
</style>