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
const { zones } = storeToRefs(zoneStore);
const { resetAddress, adressString } = addressStore;
const { resetZones } = zoneStore;
const links: Ref<any[]> = ref([{ to: '/', text: 'Accueil' }, { text: 'Votre situation' }]);

const addressToUse: Ref<any> = ref(adressString());

const typesEauOptions = [
  {
    text: 'du robinet',
    value: 'AEP',
  },
  {
    text: `d'un cours d'eau, d'une rivière`,
    value: 'SUP',
  }, {
    text: 'des nappes (puits ou forage)',
    value: 'SOU',
  },
];
const profileOptions = [
  {
    value: 'particulier',
    text: 'particulier'
  },
  {
    value: 'entreprise',
    text: 'professionnel'
  },
  {
    value: 'collectivite',
    text: 'collectivité'
  },
  {
    value: 'exploitation',
    text: 'exploitation agricole'
  }
];

const zoneTypeEau = computed(() => {
  return zones.value.find(z => z.type === typeEau.value);
});

const usagesByProfile = computed(() => {
  return zoneTypeEau.value.usages.filter(u => {
    switch (profile.value) {
      case 'particulier':
        return u.concerneParticulier;
      case 'entreprise':
        return u.concerneEntreprise;
      case 'collectivite':
        return u.concerneCollectivite;
      case 'exploitation':
        return u.concerneExploitation;
    }
  });
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
      <h6 class="fr-mr-1w fr-mb-0">Vous avez choisi d’afficher les restrictions sur l’eau provenant </h6>
      <DsfrSelect id="type_eau"
                  v-model="typeEau"
                  :options="typesEauOptions" />
      <h6 class="fr-mx-1w fr-mb-0">en tant que</h6>
      <DsfrSelect id="profile"
                  v-model="profile"
                  :options="profileOptions" />
    </div>
    <SituationHeader :address="addressToUse"
                     :typeEau="typeEau"
                     :zone="zoneTypeEau" />
    <template v-if="utils.showRestrictions(zoneTypeEau)">
      <SituationRestrictions :profile="profile"
                             :zone="zoneTypeEau"
                             :usages="usagesByProfile" />
    </template>
    <template v-else>
      <div class="fr-col-12">
        <div class="fr-grid-row fr-grid-row--center">
          <DsfrHighlight class="fr-my-2w">
            <b>Besoin de précision sur les restrictions ?</b>
            <br/>
            Votre mairie a pu renforcer ces restrictions, pensez à la consulter.
          </DsfrHighlight>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.situation-status {
  .fr-select {
    width: fit-content;

    &-group {
      margin-bottom: 0;
    }
  }

  h6 {
    font-size: 1rem;
  }
}
</style>
