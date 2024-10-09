<script setup lang="ts">
const proParcours = ref(false);
const typeEau = ref(null);
const departementCode = ref(null);
const pointSelected = ref(null);
const profil = ref(null);

const selectPointOnMap = (event: any) => {
  pointSelected.value = event;
};

const openProParcours = (event: any) => {
  typeEau.value = event.typeEau;
  departementCode.value = event.departement;
  profil.value = event.profil;
  proParcours.value = true;
}
</script>

<template>
  <div class="presentation fr-py-4w">
    <div class="fr-container">
      <template v-if="proParcours">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-lg-7 fr-hidden fr-unhidden-lg">
            <MixinsMapPoint class="wrap-map" @selectPoint="selectPointOnMap($event)" />
          </div>

          <div class="search-card fr-col-12 fr-col-lg-5 fr-p-md-3w fr-p-1w">
            <div class="search-card-wrapper">
              <MixinsSearchPro :departementCode="departementCode"
                               :typeEau="typeEau"
                               :profil="profil"
                               :pointSelected="pointSelected"
                               @return="proParcours = false" />
            </div>
          </div>

          <div class="fr-col-12 fr-hidden-lg">
            <MixinsMapPoint class="wrap-map" @selectPoint="selectPointOnMap($event)" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="fr-grid-row fr-grid-row--middle">
          <div class="fr-col-12 fr-col-lg-6">
            <h1>Suis-je concerné par les restrictions ?</h1>
          </div>

          <div class="search-card fr-col-12 fr-col-lg-6 fr-p-md-3w fr-p-1w">
            <div class="search-card-wrapper">
              <MixinsSearch @proParcours="openProParcours($event)" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.presentation {
  background: var(--yellow-tournesol-975-75);
  background-image: url('/accueil_background.svg');
  background-size: cover;
  background-position: bottom;
}

.search-card {
  background-color: var(--background-default-grey);
  border: 1px var(--blue-cumulus-main-526) solid;
  border-radius: 15px;

  &-wrapper {
    max-width: 700px;
    margin: auto;
  }
}

.wrap-map {
  border-radius: 15px;
  overflow: hidden;
}

.fr-notice {
  width: 100vw;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}
</style>