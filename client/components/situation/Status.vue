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
const zone = ref();
const zoneModal = ref();
const modalOpened: Ref<boolean> = ref(false);

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
    text: 'particulier',
  },
  {
    value: 'entreprise',
    text: 'professionnel',
  },
  {
    value: 'collectivite',
    text: 'collectivité',
  },
  {
    value: 'exploitation',
    text: 'exploitation agricole',
  },
];
const zonesOptions = computed(() => {
  return zones.value.filter(z => z.type === typeEau.value)
    .map(z => {
      return {
        value: z.id,
        text: z.nom,
      };
    });
});

const usagesByProfile = computed(() => {
  return zone.value.usages.filter(u => {
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

const situationLabel = computed<string>(() => {
  return utils.getShortSituationLabel(utils.getRestrictionRank(zone.value?.niveauGravite));
});

const selectZone = () => {
  zone.value = zones.value.find(z => z.id == zoneModal.value);
  zoneModal.value = null;
  modalOpened.value = false;
};

const updateZone = ($event) => {
  zone.value = zones.value.find(z => z.id == $event);
}

const modalActions: Ref<any[]> = ref([{ label: 'Valider', onClick: selectZone }]);

onBeforeUnmount(() => {
  resetAddress();
  resetZones();
});

watch(() => typeEau.value, () => {
  if (zonesOptions.value.length <= 1) {
    zone.value = zones.value.find(z => z.type === typeEau.value);
  } else {
    modalOpened.value = true;
  }
}, { immediate: true });
</script>

<template>
  <div class="situation-status fr-grid-row fr-grid-row--center"
       v-if="addressToUse">
    <div class="fr-col-12 fr-container">
      <DsfrBreadcrumb class="fr-mb-0" :links='links' />
    </div>
    <fieldset class="fr-col-12  fr-container fr-grid-row fr-grid-row--center fr-grid-row--middle fr-mb-1w hide-sm">
      <legend>
        <p class="fr-mr-1w fr-mb-0">Les restrictions concernent l'eau</p>
      </legend>
      <DsfrSelect id="type_eau"
                  titile="Choisissez le type d’eau que vous consommez"
                  v-model="typeEau"
                  :options="typesEauOptions" />
      <template v-if="zonesOptions.length > 1">
        <p class="fr-mx-1w fr-mb-0">issue de</p>
        <DsfrSelect id="profile"
                    title="Choisissez la zone d'alerte"
                    :value="zone?.id"
                    :options="zonesOptions"
                    @update:modelValue="updateZone($event)" />
      </template>
      <p class="fr-mx-1w fr-mb-0">en tant que</p>
      <DsfrSelect id="profile"
                  title="Choisissez votre profil de consommateur d’eau"
                  v-model="profile"
                  :options="profileOptions" />
    </fieldset>

    <SituationHeader :address="addressToUse"
                     :typeEau="typeEau"
                     :zone="zone" />

    <fieldset class="fr-col-12 fr-container fr-grid-row fr-grid-row--center fr-grid-row--middle fr-mt-1w show-sm">
      <legend>
        <p class="fr-mr-1w fr-mb-0">Les restrictions concernent l'eau</p>
      </legend>
      <DsfrSelect id="type_eau"
                  titile="Choisissez le type d’eau que vous consommez"
                  v-model="typeEau"
                  :options="typesEauOptions" />
      <template v-if="zonesOptions.length > 1">
        <p class="fr-mx-1w fr-mb-0">issue de</p>
        <DsfrSelect id="profile"
                    title="Choisissez la zone d'alerte"
                    :value="zone?.id"
                    :options="zonesOptions"
                    @update:modelValue="updateZone($event)" />
      </template>
      <p class="fr-mx-1w fr-mb-0">en tant que</p>
      <DsfrSelect id="profile"
                  title="Choisissez votre profil de consommateur d’eau"
                  v-model="profile"
                  :options="profileOptions" />
    </fieldset>

    <template v-if="utils.showRestrictions(zone)">
      <SituationRestrictions :profile="profile"
                             :zone="zone"
                             :usages="usagesByProfile" />
    </template>
    <template v-else-if="!zone || !zone.arreteMunicipalCheminFichier">
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
  <DsfrModal :opened="modalOpened"
             title="Pour consulter les restrictions, veuillez sélectionner la ressource dans laquelle vous prélevez de l’eau."
             :actions="modalActions">
    <div>
      <p class="fr-mx-1w fr-mb-0">Plusieurs cours d'eau sont référencés à cette adresse.</p>
      <DsfrSelect id="profile"
                  title="Choisissez la zone d'alerte"
                  v-model="zoneModal"
                  :options="zonesOptions" />
    </div>
  </DsfrModal>
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
