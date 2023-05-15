<script setup lang="ts">
import { useAddressStore } from '../../store/address';
import { storeToRefs } from "pinia";

const links: any[] = ref([{to: '/', text: 'Accueil'}, {text: `Quelle est la situation sur mon territoire ?`}]);

const addressStore = useAddressStore();
const {setAddress} = addressStore;
const {address} = storeToRefs(addressStore);
</script>

<template>
  <div>
    <div class="section-title situation-recherche">
      <div class="situation-recherche-header">
        <DsfrBreadcrumb :links='links'/>
        <DsfrStepper :steps='["Votre adresse","Votre situation"]'
                     :current-step="1"/>
      </div>
      <div class="situation-recherche-body">
        <div class="fr-mb-4w fr-mt-8w">
          <MixinsAdresse @address="setAddress($event)"/>
        </div>
        <div class="fr-grid-row fr-grid-row--center">
          <NuxtLink to="/situation/adresse" :event="!address ? '' : 'click'">
            <DsfrButton label="Valider cette adresse"
                        data-cy="SituationRechercheBtn"
                        :disabled="!address"/>
          </NuxtLink>
        </div>
        <DsfrCallout title="Votre adresse n'est pas conservée"
                     class="fr-mt-4w"
                     content="L’adresse nous permet de trouver la préfecture à laquelle vous êtes rattaché pour vous fournir les bonnes informations !"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.situation-recherche {
  text-align: left;

  &-header {
    position: relative;

    &:before {
      content: "";
      position: absolute;
      width: 100vw;
      height: calc(100% + 2rem);
      top: -1rem;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      background: linear-gradient(270deg, rgba(218, 218, 238, 0.5) 0%, rgba(239, 236, 228, 0.5) 100%);
      z-index: -1;
    }
  }

  &-body {
    position: relative;
    max-width: 600px;
    margin: auto;

    &:before {
      content: "";
      position: absolute;
      width: 100vw;
      height: calc(100% + 7rem);
      top: -3rem;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      background: var(--blue-france-975-75);
      z-index: -1;
    }
  }
}
</style>