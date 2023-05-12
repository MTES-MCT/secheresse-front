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
    <div class="section-title presentation-title">
      <h1>Chaque geste compte, préservons nos ressources</h1>
      <div>
        Nos nappes phréatiques sont basses, nous devons tous faire attention à notre consommation d’eau. Avec eau-sécheresse.gouv.fr, nous
        vous permettons de rester informé sur votre situation locale tout en vous partageant les conseils les plus appropriés.
      </div>
    </div>

    <div class="search-card fr-col-12 fr-p-md-6w fr-p-1w fr-mt-4w">
      <div class="search-card-wrapper">
        <h2>Les restrictions me concernent-elles ?</h2>
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

<style scoped lang="scss">
.presentation {
  .section-title {
    position: relative;

    &:before {
      content: "";
      position: absolute;
      width: 100vw;
      height: calc(100% + 8rem);
      top: -4rem;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      background: linear-gradient(270deg, rgba(202, 202, 251, 0.5) 0%, rgba(254, 246, 227, 0.5) 100%);
      opacity: 0.8;
      z-index: -1;
    }
  }
}

.search-card {
  background-color: var(--background-default-grey);
  border: 1px var(--blue-france-925-125) solid;

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