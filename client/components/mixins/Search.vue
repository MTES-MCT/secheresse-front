<script setup lang="ts">
import { Ref } from "vue";
import utils from "../../utils";
import { Address } from "../../dto/address.dto";
import { Geo } from "~/client/dto/geo.dto";
import { storeToRefs } from 'pinia';
import { useAddressStore } from '../../store/address';
import { helpers, required, requiredIf } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

const addressStore = useAddressStore();
const router = useRouter();
const route = useRoute();
const {profile, typeEau} = storeToRefs(addressStore);
const profileOptions = [
  {
    value: 'particulier',
    text: 'Un particulier'
  },
  {
    value: 'entreprise',
    text: 'Un professionnel'
  },
  {
    value: 'collectivite',
    text: 'Une collectivité'
  },
  {
    value: 'exploitation',
    text: 'Une exploitation agricole'
  }
];
const typeEauOptions = [
  {
    text: 'Du robinet',
    value: 'AEP',
  },
  {
    text: `D'un cours d'eau, d'une rivière`,
    value: 'SUP',
  }, {
    text: `Des nappes (puit ou forage)`,
    value: 'SOU',
  },
];

const modalOpened: Ref<boolean> = ref(false);
const modalTitle: Ref<string> = ref('');
const modalText: Ref<string> = ref('');
const modalIcon: Ref<string> = ref('');
const modalActions: Ref<any[]> = ref([]);
const loading = ref(false);
const query = ref('');
let address: string | null = route.query.adresse ? route.query.adresse : null;
if (address) {
  query.value = address ? address : '';
}

const formData = reactive({
  profil: ref(profile.value),
  address: null,
  geo: null,
  typeEau:  ref(typeEau.value),
});
const rules = computed(() => {
  return {
    profil: {
      required: helpers.withMessage('Le profil est obligatoire.', required)
    },
    typeEau: {
      required: helpers.withMessage('Le type d\'eau est obligatoire.', required)
    },
    address: {
      requiredIf: requiredIf(!formData.geo)
    },
    geo: {
      requiredIf: requiredIf(!formData.address)
    },
  }
});

const v$ = useVuelidate(rules, formData);

const searchZone = () => {
  if (!formData.address && !formData.geo) {
    return;
  }
  utils.searchZones(formData.address, formData.geo, formData.profil, formData.typeEau, router, modalTitle, modalText, modalIcon, modalActions, modalOpened, loading.value);
}

const setAddress = (address: Address | null, geo: Geo | null) => {
  formData.address = address;
  formData.geo = geo;
}

const closeModal = (): void => {
  modalOpened.value = false;
};
</script>

<template>
  <div class="search fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <DsfrInputGroup>
        <DsfrSelect
          label="Choisissez votre profil de consommateur d’eau"
          :options="profileOptions"
          v-model="formData.profil"
        />
      </DsfrInputGroup>
    </div>
    <div class="fr-col-12">
      <MixinsSearchAddress @search="setAddress($event.address, $event.geo)"
                           :query="query"
                           :light="true"
                           :showGeoloc="true"
                           :loading="loading" />
    </div>
    <div class="fr-col-12">
      <DsfrInputGroup>
        <DsfrSelect
          label="Choisissez le type d’eau d’eau que vous consommez"
          :options="typeEauOptions"
          v-model="formData.typeEau"
        />
      </DsfrInputGroup>
    </div>
    <div class="fr-col-12">
      <DsfrButton @click="searchZone()"
                  :disabled="loading || v$.$invalid">
        Je consulte les restrictions
      </DsfrButton>
    </div>
  </div>

  <DsfrModal :opened="modalOpened"
             :title="modalTitle"
             :icon="modalIcon"
             :actions=modalActions
             @close="closeModal">
    <div v-html="modalText"></div>
  </DsfrModal>
</template>

<style lang="scss">
.search {
  .fr-select {
    width: fit-content;
  }
}
</style>