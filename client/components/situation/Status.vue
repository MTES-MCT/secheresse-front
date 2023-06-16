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
        Aucune restriction en cours à votre adresse.
      </div>
      <div class="section-title fr-mt-8w">
        <div class="fr-mb-4w">
          Certaines restrictions peuvent ne pas apparaître ici, elles peuvent aussi avoir fait l'objet de précision.
          <br/><br/>Pour le vérifier, merci de consulter l'arrêté préfectoral ci-dessous et de contacter votre mairie qui a pu renforcer ces restrictions.
        </div>
        <div v-for="(a, index) in arretes">
          <a class="fr-btn fr-mt-1w fr-mb-4w"
             :href="a.cheminFichier"
             target="_blank"
             rel="noopener">
            Consulter l'arrêté préfectoral{{ arretes.length > 1 ? ` n°${index + 1}` : `` }}
          </a>
        </div>
      </div>
    </template>
  </div>
</template>