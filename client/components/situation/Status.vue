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

const showRestrictions = computed<boolean>(() => {
  let show = false;
  restrictions.value.forEach((r: Restriction) => {
    if (r.usages && r.usages.length > 0) {
      show = true;
    }
  });
  return show;
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
      <SituationRestrictions v-if="showRestrictions"
                             :restrictions="restrictions"/>
      <div class="fr-col-12 fr-grid-row fr-grid-row--center fr-mt-4w" v-else>
        L’état de la ressource en eau appelle à la vigilance de chacun, chaque geste compte pour économiser l’eau. Vous n’êtes pas soumis à
        des restrictions en eau.
      </div>
      <div class="section-title fr-mt-8w">
        <DsfrCallout title=""
                     content="">
          <p class="fr-callout__text">
            <span v-if="restrictions.length > 1 && !sameUsages">Ces restrictions s'appliquent à l'eau qui provient {{
                utils.getProvenanceLabel(restrictions[0], true)
              }}.<br/></span>
            Certaines restrictions peuvent aussi avoir fait l'objet de précisions
            <span v-if="restrictions.length > 1 && !sameUsages">, notamment si l'eau provient {{
                utils.getProvenanceLabel(restrictions[0], true, true)
              }}</span>.
            <br/>
            Pour le vérifier, merci de <a class="fr-link"
                                          :href="arretes[0].cheminFichier"
                                          target="_blank"
                                          rel="noopener">
            consulter l'arrêté préfectoral</a>
            <br/><br/>
            Votre mairie a pu renforcer ces restrictions, pensez à la consulter.
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
