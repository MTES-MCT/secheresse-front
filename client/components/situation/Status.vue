<script setup lang="ts">
import { useAddressStore } from '../../store/address';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue';
import { useZoneStore } from '../../store/zone';
import { Zone } from '../../dto/zone.dto';
import utils from '../../utils';

const addressStore = useAddressStore();
const zoneStore = useZoneStore();
const { profile, typeEau } = storeToRefs(addressStore);
const { zones }: Ref<Zone> = storeToRefs(zoneStore);
const { resetAddress, adressString } = addressStore;
const { resetZones } = zoneStore;
const links: Ref<any[]> = ref([{ to: '/', text: 'Accueil' }, { text: 'Votre situation' }]);

const addressToUse: Ref<any> = ref(adressString());

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
  return zones.value.find(z => z.type === typeEau.value);
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
                  v-model="typeEau"
                  :options="typesEauOptions" />
    </div>
    <SituationHeader :address="addressToUse"
                     :typeEau="typeEau"
                     :zone="zoneTypeEau" />
    <SituationRestrictions v-if="utils.showRestrictions(zoneTypeEau)"
                           :profile="profile"
                           :zone="zoneTypeEau" />
  </div>
</template>

<style scoped lang="scss">
.section-title {
  text-align: left;
}
</style>
