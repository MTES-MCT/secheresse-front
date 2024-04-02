<script setup lang="ts">
import { useAddressStore } from '../../store/address';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue';
import { useZoneStore } from '../../store/zone';
import { Zone } from '../../dto/zone.dto';
import utils from '../../utils';

const addressStore = useAddressStore();
const zoneStore = useZoneStore();
const { address, geo, profile } = storeToRefs(addressStore);
const { zones, zone }: Ref<Zone> = storeToRefs(zoneStore);
const { resetAddress, adressString } = addressStore;
const { resetZones } = zoneStore;
const links: Ref<any[]> = ref([{ to: '/', text: 'Accueil' }, { text: 'Votre situation' }]);

const addressToUse: Ref<any> = ref(adressString());

const typeEauSelected = ref('AEP');
const typesEauOptions = [
  {
    text: 'Eau potable',
    value: 'AEP',
  },
  {
    text: 'Eau superficielle',
    value: 'SUP',
  }, {
    text: 'Eau souterraine',
    value: 'SOU',
  },
];

const zoneTypeEau = computed(() => {
  return zones.value.find(z => z.type === typeEauSelected.value);
});

onBeforeUnmount(() => {
  resetAddress();
  resetZones();
});
</script>

<template>
  <div class="situation-status fr-grid-row fr-grid-row--center"
       v-if="addressToUse">
    <div class="fr-col-12 fr-container">
      <DsfrBreadcrumb class="fr-mb-0" :links='links' />
    </div>
    <div class="fr-col-12  fr-container fr-grid-row fr-grid-row--center fr-grid-row--middle fr-mb-1w">
      <h6 class="fr-mr-1w fr-mb-0">Vous pouvez choisir d’afficher les restrictions sur l’eau provenant</h6>
      <DsfrSelect id="type_eau"
                  v-model="typeEauSelected"
                  :options="typesEauOptions" />
    </div>
    <SituationHeader :address="addressToUse"
                     :typeEau="typeEauSelected"
                     :zone="zoneTypeEau" />
    <SituationRestrictions v-if="utils.showRestrictions(zoneTypeEau)"
                           :profile="profile"
                           :zone="zoneTypeEau" />
    <div class="section-title fr-mt-8w" v-if="zoneTypeEau && zoneTypeEau.idZone">
      <DsfrCallout title=""
                   content="">
        <p class="fr-callout__text">
          Certaines restrictions peuvent avoir fait l'objet de précisions
          <br />
          Pour le vérifier, merci de <a class="fr-link"
                                        :href="zone.arrete.cheminFichier"
                                        onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE', 'PROFIL', 'particulier', 1])"
                                        target="_blank"
                                        rel="noopener">
          consulter l'arrêté de restriction</a>
          <span v-if="zone.arrete.cheminFichierArreteCadre"> et de <a class="fr-link"
                                                                      :href="zone.arrete.cheminFichierArreteCadre"
                                                                      onclick="window._paq.push(['trackEvent', 'TELECHARGEMENT ARRETE CADRE', 'PROFIL', 'particulier', 1])"
                                                                      target="_blank"
                                                                      rel="noopener">
            consulter l'arrêté cadre préfectoral</a></span>.
          <br /><br />
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
