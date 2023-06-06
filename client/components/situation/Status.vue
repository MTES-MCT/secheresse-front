<script setup lang="ts">
import { useAddressStore } from "../../store/address";
import { storeToRefs } from "pinia";
import { Ref } from "vue";
import { useRestrictionsStore } from "../../store/restrictions";
import { Restriction } from "~/client/dto/restriction.dto";

const addressStore = useAddressStore();
const restrictionsStore = useRestrictionsStore();
const {address} = storeToRefs(addressStore);
const {restrictions}: Restriction[] = storeToRefs(restrictionsStore);
const {resetAddress} = addressStore;

const addressToUse: Ref<any> = ref(null);
addressToUse.value = {...address.value};
resetAddress();
</script>

<template>
  <div class="situation-status fr-grid-row fr-grid-row--center fr-mb-4w"
       v-if="addressToUse">
    <SituationStatusHeader :address="addressToUse"
                           :restrictions="restrictions"/>
    <SituationStatusRestrictions v-if="restrictions[0] && restrictions[0].usages && restrictions[0].usages.length > 0"
                                 :restrictions="restrictions"/>
    <div class="section-title fr-mt-8w">
      <h2>Il est possible que des exceptions existent pour certaines restrictions.</h2>
      <div class="fr-mb-4w">
        Certaines exceptions peuvent ne pas apparaître ici, pour les connaître vous pouvez télécharger l’arrêté préfectoral ci-dessous.
      </div>
      <div v-for="(r, index) in restrictions">
        <a class="fr-btn fr-mt-1w"
           :href="r.arrete.cheminFichier"
           target="_blank"
           rel="noopener">
          Télécharger l'arrêté préfectoral n°{{ index + 1 }}
        </a>
      </div>
    </div>
  </div>
</template>