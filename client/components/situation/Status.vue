<script setup lang="ts">
import { useAddressStore } from "../../store/address";
import { storeToRefs } from "pinia";
import { Ref } from "vue";
import { useRestrictionsStore } from "../../store/restrictions";
import { Restriction } from "../../dto/restriction.dto";
import { Arrete } from "../../dto/arrete.dto";
import utils from "../../utils";

const addressStore = useAddressStore();
const restrictionsStore = useRestrictionsStore();
const {address, geo} = storeToRefs(addressStore);
const {restrictions}: Ref<Restriction[]> = storeToRefs(restrictionsStore);
const {resetAddress} = addressStore;
const {isParticulier} = restrictionsStore;

const addressToUse: Ref<any> = ref(null);
if (address.value) {
  addressToUse.value = address.value.properties.label
} else if (geo.value) {
  addressToUse.value = geo.value.nom
}
resetAddress();

const arretes = computed<Arrete[]>(() => {
  return utils.getArretes(restrictions.value);
});

const sameUsages = computed<boolean>(() => {
  if (!restrictions.value[0].usagesHash) {
    return false;
  }
  const usagesHash = restrictions.value[0].usagesHash;
  return restrictions.value.every(r => r.usagesHash === usagesHash);
});
</script>

<template>
  <div class="situation-status fr-grid-row fr-grid-row--center"
       v-if="addressToUse">
    <SituationHeader :address="addressToUse"
                     :restrictions="restrictions"/>
    <template v-if="isParticulier()">
      <SituationRestrictions v-if="utils.showRestrictions(restrictions)"
                             :restrictions="restrictions"/>
      <div class="fr-col-12 fr-grid-row fr-grid-row--center fr-mt-4w" v-else>
        L’état de la ressource en eau appelle à la vigilance de chacun, chaque geste compte pour économiser l’eau.
      </div>
      <div class="section-title fr-mt-8w">
        <DsfrCallout title=""
                     content="">
          <p class="fr-callout__text">
            <span v-if="restrictions.length > 1 && !sameUsages">
              Attention, si vous utilisez de l'eau provenant {{ utils.getProvenanceLabel(restrictions[0], true, true) }}, les restrictions sont consultables via
              cet <a class="fr-link"
                     :href="arretes[0].cheminFichier"
                     onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE', 'PROFIL', 'particulier', 1])"
                     target="_blank"
                     rel="noopener">
            arrêté de restriction</a>
            <span v-if="arretes[0].cheminFichierArreteCadre"> et cet <a class="fr-link"
                                                                        :href="arretes[0].cheminFichierArreteCadre"
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
                                          :href="arretes[0].cheminFichier"
                                          onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE', 'PROFIL', 'particulier', 1])"
                                          target="_blank"
                                          rel="noopener">
            consulter l'arrêté de restriction</a>
            <span v-if="arretes[0].cheminFichierArreteCadre"> et de <a class="fr-link"
                                                                       :href="arretes[0].cheminFichierArreteCadre"
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
