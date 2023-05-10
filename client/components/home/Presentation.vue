<script setup lang="ts">
import { Ref } from "vue";
import utils from "../../utils";
import { DsfrNotice } from "@gouvminint/vue-dsfr";
import api from "../../api";

const emit = defineEmits(['address'])

const addressQuery: Ref<string> = ref('');
const addresses: Ref<any[]> = ref([]);
const loadAddresses: Ref<boolean> = ref(true);

const selectAddress = (address: string | any) => {
  if (typeof address === 'string') {
    addressQuery.value = address;
    if (address === '') {
      emit('address', null);
    }
    return;
  }
  loadAddresses.value = false;
  addressQuery.value = address.properties.label;
  emit('address', address);
}

watch(addressQuery, utils.debounce(async () => {
  if (!addressQuery.value || !loadAddresses.value) {
    loadAddresses.value = true;
    addresses.value = [];
    return;
  }
  const result: any = await api.searchAddresses(addressQuery.value);
  addresses.value = result.features;
}, 500));
</script>

<template>
  <div class="presentation fr-grid-row fr-grid-row--center fr-mt-8w fr-pb-4w">
    <div class="presentation-title">
      <h1> Restez informé en temps réel des <span class="keyword-highlight">restrictions</span> d'eau en France</h1>
      <div>La sécheresse sévit en France. Les préfectures ont mis en place des mesures afin de préserver au maximum les réserves d'eau et
        éviter les pénuries.
      </div>
      <div>
        <b>Vérifiez si vous êtes concerné et comment agir !</b>
      </div>
    </div>

    <div class="search-card fr-col-12 fr-p-6w fr-mt-4w">
      <div class="search-card-wrapper">
        <h2>Je vérifie si je suis concerné par les restrictions</h2>
        <div class="fr-mb-1w">Où habitez-vous ? (Adresse complète ou préfecture)</div>
        <FdrAutoComplete placeholder="Ex: 20 avenue de Ségur, 75007, Paris"
                         :model-value="addressQuery"
                         :options="addresses"
                         display-key="properties.label"
                         data-cy="AddressSearchInput"
                         @update:modelValue="selectAddress($event)"/>
        <DsfrNotice title="Nous ne conservons pas vos données et votre adresse"
                    class="notice-light fr-mt-1w"
        />
      </div>
    </div>

    <DsfrModal
      :opened="false"
      title="Titre de la modale"
      icon="ri-arrow-right-line"
      :actions='[{"label":"Valider"},{"label":"Annuler","secondary":true}]'>
      Lorem ipsum
    </DsfrModal>
  </div>
</template>

<style lang="scss">
.presentation {
  position: relative;

  //&:before {
  //  content: "";
  //  position: absolute;
  //  width: 100vw;
  //  height: 100%;
  //  background-image: url("/presentation_bg.png");
  //  background-repeat: no-repeat;
  //  background-position: bottom;
  //  background-size: 100vw auto;
  //  z-index: -1;
  //}

  &-title {
    text-align: center;
    width: 70%;
    margin-left: auto;
    margin-right: auto;
  }
}

.search-card {
  background-color: var(--blue-france-975-75);
  box-shadow: var(--raised-shadow);

  &-wrapper {
    max-width: 650px;
    margin: auto;
    text-align: left;

    h2 {
      text-align: center;
    }

    .fr-notice {
      margin: auto
    }
  }
}
</style>