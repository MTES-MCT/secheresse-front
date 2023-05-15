<script setup lang="ts">
import { useAddressStore } from "../../store/address";
import { storeToRefs } from "pinia";
import { Ref } from "vue";
import api from "../../api";

const addressStore = useAddressStore();
const {address} = storeToRefs(addressStore);
const {resetAddress} = addressStore;

const situation: Ref<any> = ref(await api.searchSituation());

const addressToUse: Ref<any> = ref(null);
addressToUse.value = {...address.value};
resetAddress();
</script>

<template>
  <div class="situation-status fr-grid-row fr-grid-row--center fr-mb-4w"
       v-if="addressToUse">
    <SituationStatusHeader :address="addressToUse"
                           :situation="situation"/>
    <SituationStatusLaws v-if="situation.rank > 1"/>
    <div class="section-title fr-mt-8w">
      <h2>Il est possible que des exceptions existent pour certaines restrictions.</h2>
      <div class="fr-mb-4w">
        Certaines exceptions peuvent ne pas apparaître ici, pour les connaître vous pouvez télécharger l’arrêté préfectoral ci-dessous.
      </div>
      <DsfrButton label="Télécharger l'arrêté préfectoral"/>
    </div>
  </div>
</template>