<script setup lang="ts">
import { useAddressStore } from "../../store/address";
import { storeToRefs } from "pinia";
import { Ref } from "vue";
import { useZoneStore } from "../../store/zone";
import { Zone } from "../../dto/zone.dto";
import utils from "../../utils";

const addressStore = useAddressStore();
const zoneStore = useZoneStore();
const {address, geo} = storeToRefs(addressStore);
const {zones, zone}: Ref<Zone> = storeToRefs(zoneStore);
const {resetAddress, adressString} = addressStore;

const addressToUse: Ref<any> = ref(adressString());
resetAddress();
</script>

<template>
  <div class="situation-status fr-grid-row fr-grid-row--center"
       v-if="addressToUse">
    <SituationHeader :address="addressToUse"
                     :zone="zone"/>
    <SituationRestrictions v-if="utils.showRestrictions(zone)"
                           :zones="zones"/>
    <div class="section-title fr-mt-8w" v-if="zone && zone.idZone">
      <DsfrCallout title=""
                   content="">
        <p class="fr-callout__text">
          Certaines restrictions peuvent avoir fait l'objet de précisions
          <br/>
          Pour le vérifier, merci de <a class="fr-link"
                                        :href="zone.arrete.cheminFichier"
                                        onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE', 'PROFIL', 'particulier', 1])"
                                        target="_blank"
                                        rel="noopener">
          consulter l'arrêté de restriction</a>
          <span v-if="zone.arrete.cheminFichierArreteCadre && !zone.departementConfig.arDifferentAc"> et de <a class="fr-link"
                                                                                                               :href="zone.arrete.cheminFichierArreteCadre"
                                                                                                               onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE CADRE', 'PROFIL', 'particulier', 1])"
                                                                                                               target="_blank"
                                                                                                               rel="noopener">
            consulter l'arrêté cadre préfectoral</a></span>.
          <br/><br/>
          Votre mairie a pu renforcer ces restrictions, pensez à la consulter.
        </p>
      </DsfrCallout>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-title {
  text-align: left;
}
</style>
