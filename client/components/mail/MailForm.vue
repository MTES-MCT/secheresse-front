<script setup lang="ts">

import { Address } from '~/client/dto/address.dto';
import { Geo } from '~/client/dto/geo.dto';
import { email, helpers, required, requiredIf, sameAs } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useAddressStore } from '../../store/address';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue/dist/vue';
import utils from '../../utils';

const props = defineProps({
  subscribing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  subscribe: any;
}>();

const addressStore = useAddressStore();
const { address, geo, profile }: Ref<string> = storeToRefs(addressStore);
const { adressString } = addressStore;

const formData = reactive({
  profil: ref(profile.value),
  email: null,
  idAdresse: null,
  lon: null,
  lat: null,
  commune: null,
  confirmSubscription: false,
  typesEau: ['AEP', 'SUP', 'SOU'],
});
const errorMessage = ref('');
const typesEauOptions = [
  {
    label: 'L\'eau potable',
    name: 'AEP',
    value: 'AEP',
  },
  {
    label: 'L\'eau superficielle',
    name: 'SUP',
    value: 'SUP',
  },
  {
    label: 'L\'eau souterraine',
    name: 'SOU',
    value: 'SOU',
  },
];

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage(`L'email est obligatoire.`, required),
      email: helpers.withMessage(`L'email n'est pas valide.`, email),
    },
    profil: {
      required: helpers.withMessage('Le profil est obligatoire.', required),
    },
    confirmSubscription: {
      checked: helpers.withMessage('Le consentement est obligatoire.', sameAs(true)),
    },
    lon: {
      requiredIf: helpers.withMessage('L\'adresse est obligatoire.', requiredIf(!formData.communes)),
    },
    lat: {
      requiredIf: requiredIf(!formData.commune),
    },
    commune: {
      requiredIf: requiredIf(!formData.lon && !formData.lat),
    },
    idAdresse: {
      requiredIf: requiredIf(!formData.commune),
    },
    typesEau: {
      required: helpers.withMessage('Le type d\'eau est obligatoire.', required),
    },
  };
});

const v$ = useVuelidate(rules, formData);

const setAddress = (address: Address | null, geo: Geo | null) => {
  if (!address || ['municipality'].includes(address.properties.type)) {
    formData.idAdresse = null;
    formData.commune = null;
    formData.lon = null;
    formData.lat = null;
    return;
  }
  formData.idAdresse = address.properties.id;
  formData.commune = null;
  formData.lon = address.geometry.coordinates[0];
  formData.lat = address.geometry.coordinates[1];
};

const selectPointOnMap = (event: any) => {
  formData.idAdresse = null;
  formData.commune = event.commune;
  formData.lon = event.lng;
  formData.lat = event.lat;
};

const submitForm = async () => {
  await v$.value.$validate();
  if (!v$.value.$error && !props.subscribing) {
    emit('subscribe', formData);
  }
};
</script>

<template>
  <form @submit.prevent="" class="mail-form">
    <DsfrInputGroup :error-message="utils.showInputError(v$, 'profil')">
      <MixinsProfile :profile="formData.profil"
                     class="fr-mb-2w"
                     :required="true"
                     :aria-invalid="v$.profil.$errors.length > 0"
                     @profileUpdate="formData.profil = $event;"
      />
    </DsfrInputGroup>

    <DsfrInputGroup :error-message="utils.showInputError(v$, 'typesEau')">
      <DsfrCheckboxSet
        legend="Je souhaite être informé par mail des changements de restrictions me concernant et portant sur :"
        v-model="formData.typesEau"
        required
        :aria-invalid="v$.typesEau.$errors.length > 0"
        :options="typesEauOptions" />
    </DsfrInputGroup>

    <DsfrInputGroup :error-message="utils.showInputError(v$, 'lon')">
      <MixinsSearchAddress :profile="formData.profil"
                           :query="adressString()"
                           :address="address"
                           :geo="geo"
                           :light="true"
                           :disabled="subscribing"
                           :exactAddress="true"
                           :aria-invalid="v$.lon.$errors.length > 0"
                           @search="setAddress($event.address, $event.geo)"
      />
    </DsfrInputGroup>

    <div class="divider">ou</div>

    <span>Sélectionnez un point sur la carte</span>
    <MixinsMapPoint class="fr-mb-2w" @selectPoint="selectPointOnMap($event)" />

    <DsfrInputGroup class="fr-mt-2w"
                    :error-message="utils.showInputError(v$, 'email')">
      <DsfrInput placeholder="Ex: test@exemple.com"
                 label="Entrez votre email"
                 label-visible
                 v-model="formData.email"
                 type="text"
                 id="email"
                 name="email"
                 autocomplete="email"
                 required
                 :aria-invalid="v$.email.$errors.length > 0"
                 :disabled="subscribing"
      />
    </DsfrInputGroup>

    <DsfrInputGroup class="fr-mt-3w" :error-message="utils.showInputError(v$, 'confirmSubscription')">
      <DsfrCheckbox
        label="J'accepte de recevoir vos e-mails et confirme avoir pris connaissance de votre politique de confidentialité et mentions légales."
        name="confirmSubscription"
        :disabled="subscribing"
        required
        :aria-invalid="v$.confirmSubscription.$errors.length > 0"
        v-model="formData.confirmSubscription"
      />
    </DsfrInputGroup>

    <p>Les
      <router-link to="/donnees-personnelles" target="_blank" title="Données collectées - nouvelle fenêtre">données collectées</router-link>
      lors de votre inscription sont utilisées dans le cadre d’une mission de
      service public dont les responsables de traitement sont la Direction générale de l’Aménagement, du Logement et de
      la Nature (DGALN).
      Vous pouvez à tout moment vous opposer à ces traitements en vous désinscrivant en cliquant sur le lien présent
      dans nos emails.
    </p>

    <div class="text-align-right">
      <DsfrButton @click="submitForm()"
                  :disabled="subscribing">
        Valider
        <Loader class="adresse-loader fr-ml-1w" :show="subscribing" />
      </DsfrButton>
    </div>
  </form>
</template>