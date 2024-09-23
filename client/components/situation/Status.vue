<script setup lang="ts">
import { useAddressStore } from '../../store/address';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue';
import { useZoneStore } from '../../store/zone';
import utils from '../../utils';

const addressStore = useAddressStore();
const zoneStore = useZoneStore();
const { profile, typeEau } = storeToRefs(addressStore);
const { zones } = storeToRefs(zoneStore);
const { resetAddress, adressString, getCodeDepartement } = addressStore;
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

const showPacaMessage = computed(() => {
  return profile.value !== 'particulier' && ['04', '05', '06', '13', '83', '84'].includes(getCodeDepartement());
});

const situationLabel = computed<string>(() => {
  return utils.getShortSituationLabel(utils.getRestrictionRank(zoneTypeEau.value?.niveauGravite));
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
    <fieldset class="fr-col-12  fr-container fr-grid-row fr-grid-row--center fr-grid-row--middle fr-mb-1w">
      <legend>
        <p class="fr-mr-1w fr-mb-0">Les restrictions concernent l'eau</p>
      </legend>
      <DsfrSelect id="type_eau"
                  titile="Choisissez le type d’eau que vous consommez"
                  v-model="typeEau"
                  :options="typesEauOptions" />
    </fieldset>

    <!-- TMP PACA -->
    <template v-if="showPacaMessage">
      <div class="fr-container">
        <DsfrAlert
          description="Les ressources stockées ne sont pas représentées sur Vigieau. Si vous consommez de l’eau issue des systèmes Serre-Ponçon, Sainte-Croix/Castillon ou Saint-Cassien veuillez vous rapprocher de votre fournisseur d’eau pour connaître les restrictions en vigueur."
          type="warning"
          class="fr-my-2w"
          :closeable="false"
        />
      </div>
    </template>

    <SituationHeader :address="addressToUse"
                     :typeEau="typeEau"
                     :zone="zoneTypeEau" />

    <template v-if="utils.showRestrictions(zoneTypeEau)">
      <SituationRestrictions :profile="profile"
                             :zone="zoneTypeEau"
                             :usages="usagesByProfile" />
    </template>
    <template v-else-if="!zoneTypeEau || !zoneTypeEau.arreteMunicipalCheminFichier">
      <div class="fr-col-12">
        <div class="fr-grid-row fr-grid-row--center">
          <DsfrHighlight class="fr-my-2w">
            <b>Besoin de précision sur les restrictions ?</b>
            <br />
            Votre mairie a pu renforcer ces restrictions, pensez à la consulter.
          </DsfrHighlight>
        </div>
      </div>
    </template>
    <div class="fr-container fr-grid-row fr-grid-row--center fr-mt-2w">
      <MixinsShare :situationLabel="situationLabel" :address="addressToUse" />
    </div>
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
}
</style>
