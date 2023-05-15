<script setup lang="ts">
import { useAddressStore } from "../../store/address";

const addressStore = useAddressStore();
const router = useRouter();
const {setAddress} = addressStore;
const searchSituation = (address: any) => {
  setAddress(address);
  router.push({path: '/situation/adresse'});
}
</script>

<template>
  <div class="presentation fr-grid-row fr-grid-row--center fr-mt-8w fr-pb-4w">
    <div class="section-title presentation-title">
      <h1>Chaque geste compte, préservons nos ressources</h1>
      <div>
        Nos nappes phréatiques sont basses, nous devons tous faire attention à notre consommation d’eau. Avec eau-sécheresse.gouv.fr, nous
        vous permettons de rester informé sur votre situation locale tout en vous partageant les conseils les plus appropriés.
      </div>
    </div>

    <div class="search-card fr-col-12 fr-p-md-6w fr-p-1w fr-mt-4w">
      <div class="search-card-wrapper">
        <h2>Les restrictions me concernent-elles ?</h2>
        <MixinsAdresse @address="searchSituation"/>
      </div>
    </div>

    <DsfrModal
      :opened="false"
      title="Titre de la modale"
      icon="ri-arrow-right-line"
      :actions='[{"label":"Valider"},{"label":"Annuler","secondary":true}]'>
      Lorem ipsum
    </DsfrModal>
  </div>
</template>

<style scoped lang="scss">
.presentation {
  .section-title {
    position: relative;

    &:before {
      content: "";
      position: absolute;
      width: 100vw;
      height: calc(100% + 12rem);
      top: -4rem;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      background: linear-gradient(270deg, var(--blue-france-950-100), 70%, var(--yellow-tournesol-975-75));
      opacity: 0.5;
      z-index: -1;
    }
  }
}

.search-card {
  background-color: var(--background-default-grey);
  border: 1px var(--blue-france-925-125) solid;

  &-wrapper {
    max-width: 650px;
    margin: auto;
    text-align: left;

    h2 {
      text-align: center;
    }
  }
}
</style>