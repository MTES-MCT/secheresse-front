<script setup lang="ts">
import { useAddressStore } from "../../store/address";
import { storeToRefs } from "pinia";
import { Ref } from "vue";
import { useRestrictionStore } from "../../store/restrictions";
import { Restriction } from "../../dto/restriction.dto";
import utils from "../../utils";

const addressStore = useAddressStore();
const restrictionStore = useRestrictionStore();
const {address, geo} = storeToRefs(addressStore);
const {restriction}: Ref<Restriction> = storeToRefs(restrictionStore);
const {resetAddress, adressString} = addressStore;
const {isParticulier} = restrictionStore;

const addressToUse: Ref<any> = ref(adressString());
resetAddress();
</script>

<template>
  <div class="situation-status fr-grid-row fr-grid-row--center"
       v-if="addressToUse">
    <SituationHeader :address="addressToUse"
                     :restriction="restriction"/>
    <template v-if="isParticulier()">
      <SituationRestrictions v-if="utils.showRestrictions(restriction)"
                             :restriction="restriction"/>
      <div class="section-title fr-mt-8w">
        <DsfrCallout title=""
                     content="">
          <p class="fr-callout__text">
            <span v-if="false">
              Attention, si vous utilisez de l'eau provenant {{ utils.getProvenanceLabel(restriction, true, true) }}, les restrictions sont consultables via
              cet <a class="fr-link"
                     :href="restriction.arrete.cheminFichier"
                     onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE', 'PROFIL', 'particulier', 1])"
                     target="_blank"
                     rel="noopener">
            arrêté de restriction</a>
            <span v-if="restriction.arrete.cheminFichierArreteCadre"> et cet <a class="fr-link"
                                                                        :href="restriction.arrete.cheminFichierArreteCadre"
                                                                        onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE CADRE', 'PROFIL', 'particulier', 1])"
                                                                        target="_blank"
                                                                        rel="noopener">
            arrêté cadre préfectoral</a></span>.
            <br/><br/>
            Votre mairie a pu renforcer ces restrictions, pensez à la consulter.
            </span>
            <span v-else>
              Certaines restrictions peuvent avoir fait l'objet de précisions
            <br/>
            Pour le vérifier, merci de <a class="fr-link"
                                          :href="restriction.arrete.cheminFichier"
                                          onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE', 'PROFIL', 'particulier', 1])"
                                          target="_blank"
                                          rel="noopener">
            consulter l'arrêté de restriction</a>
            <span v-if="restriction.arrete.cheminFichierArreteCadre"> et de <a class="fr-link"
                                                                       :href="restriction.arrete.cheminFichierArreteCadre"
                                                                       onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE CADRE', 'PROFIL', 'particulier', 1])"
                                                                       target="_blank"
                                                                       rel="noopener">
            consulter l'arrêté cadre préfectoral</a></span>.
            <br/><br/>
            Votre mairie a pu renforcer ces restrictions, pensez à la consulter.
            </span>
          </p>
        </DsfrCallout>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.section-title {
  text-align: left;
}
</style>
