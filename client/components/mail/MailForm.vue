<script setup lang="ts">

import { Address } from '~/client/dto/address.dto';
import { Geo } from '~/client/dto/geo.dto';
import { email, helpers, required, requiredIf, sameAs } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useAddressStore } from '../../store/address';
import { storeToRefs } from 'pinia';
import { Ref } from 'vue/dist/vue';

const props = defineProps({
  subscribing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  subscribe: any;
  close: any
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
  },
  {
    label: 'L\'eau superficielle',
    name: 'SUP',
  },
  {
    label: 'L\'eau souterraine',
    name: 'SOU',
  },
];

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage(`L'email est obligatoire.`, required),
      email: helpers.withMessage(`L'email n'est pas valide.`, email),
      $autoDirty: true,
    },
    profil: {
      required: helpers.withMessage('Le profil est obligatoire.', required),
    },
    confirmSubscription: {
      checked: helpers.withMessage('Le consentement est obligatoire.', sameAs(true)),
      $autoDirty: true,
    },
    lon: {
      requiredIf: requiredIf(!formData.commune),
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

const submitForm = async () => {
  await v$.value.$validate();
  if (!v$.value.$error && !props.subscribing) {
    emit('subscribe', formData);
  }
};

const showErrorMessage = () => {
  if (v$.value.$errors?.findIndex(e => e.$property === 'email' && e.$validator === 'email') >= 0) {
    errorMessage.value = `L'email n'est pas valide.`;
  } else {
    errorMessage.value = '';
  }
};

watch(v$, () => {
  if (!v$.value.$invalid) {
    errorMessage.value = '';
  }
});
</script>

<template>
  <form @submit.prevent="" class="mail-form">
    <DsfrInputGroup :error-message="errorMessage" :valid-message="''">
      <MixinsProfile :profile="formData.profil"
                     class="fr-mb-2w"
                     @profileUpdate="formData.profil = $event;"
      />

      <DsfrCheckboxSet legend="Je souhaite être informé par mail des changements de restrictions me concernant et portant sur :"
                       v-model="formData.typesEau"
                       :options="typesEauOptions" />

      <MixinsSearchAddress :profile="formData.profil"
                           :query="adressString()"
                           :address="address"
                           :geo="geo"
                           :light="true"
                           :disabled="subscribing"
                           :exactAddress="true"
                           @search="setAddress($event.address, $event.geo)"
      />

      <div class="fr-mt-2w">
        <DsfrInput placeholder="Ex: test@exemple.com"
                   label="Entrez votre email"
                   label-visible
                   v-model="formData.email"
                   type="text"
                   id="email"
                   name="email"
                   :disabled="subscribing"
                   @blur="showErrorMessage()"
        />
      </div>

      <DsfrCheckbox class="fr-mt-3w"
                    label="J'accepte de recevoir vos e-mails et confirme avoir pris connaissance de votre politique de confidentialité et mentions légales."
                    name="confirmSubscription"
                    :disabled="subscribing"
                    v-model="formData.confirmSubscription"
      />
    </DsfrInputGroup>

    <p>Les
      <router-link to="/donnees-personnelles" target="_blank">données collectées</router-link>
      lors de votre inscription sont utilisées dans le cadre d’une mission de
      service public dont les responsables de traitement sont la Direction générale de l’Aménagement, du Logement et de la Nature (DGALN).
      Vous pouvez à tout moment vous opposer à ces traitements en vous désinscrivant en cliquant sur le lien présent dans nos emails.
    </p>

    <DsfrButton @click="submitForm()"
                class="full-width fr-grid-row--center"
                :disabled="v$.$invalid || subscribing">
      <div class="fr-grid-row fr-grid-row--center">
        Valider
        <Loader class="adresse-loader fr-ml-1w" :show="subscribing" />
      </div>
    </DsfrButton>
    <DsfrButton class="full-width fr-grid-row--center fr-mt-1w"
                secondary
                :disabled="subscribing"
                @click="emit('close')">
      Annuler
    </DsfrButton>
  </form>
</template>