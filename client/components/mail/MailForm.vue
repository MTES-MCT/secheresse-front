<script setup lang="ts">

import { Address } from "~/client/dto/address.dto";
import { Geo } from "~/client/dto/geo.dto";
import { email, helpers, required, requiredIf, sameAs } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { useAddressStore } from "../../store/address";
import { storeToRefs } from "pinia";
import { Ref } from "vue/dist/vue";

const props = defineProps({
  subscribing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  subscribe: any;
  close: any
}>();

const addressStore = useAddressStore();
const {profile}: Ref<string> = storeToRefs(addressStore);
const {adressString} = addressStore;

const formData = reactive({
  profile: profile,
  email: null,
  lon: null,
  lat: null,
  citycode: null,
  confirmSubscription: false,
});
const errorMessage = ref('');

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage(`L'email est obligatoire.`, required),
      email: helpers.withMessage(`L'email n'est pas valide.`, email),
      $autoDirty: true
    },
    profile: {
      required: helpers.withMessage('Le profil est obligatoire.', required)
    },
    confirmSubscription: {
      checked: helpers.withMessage('Le consentement est obligatoire.', sameAs(true)),
      $autoDirty: true
    },
    lon: {
      requiredIf: requiredIf(!formData.citycode)
    },
    lat: {
      requiredIf: requiredIf(!formData.citycode)
    },
    citycode: {
      requiredIf: requiredIf(!formData.lon && !formData.lat)
    }
  };
});

const v$ = useVuelidate(rules, formData);

const setAddress = (address: Address | null, geo: Geo | null) => {
  if (!address && !geo) {
    formData.citycode = null;
    formData.lon = null;
    formData.lat = null;
    return;
  }
  if (geo || ['municipality'].includes(address.properties.type)) {
    formData.citycode = geo ? geo.code : address.properties.citycode;
    formData.lon = null;
    formData.lat = null;
  } else {
    formData.citycode = null;
    formData.lon = address.geometry.coordinates[0];
    formData.lat = address.geometry.coordinates[1];
  }
}

const submitForm = async () => {
  await v$.value.$validate();
  if (!v$.value.$error && !props.subscribing) {
    emit('subscribe', formData)
  }
};

const showErrorMessage = () => {
  if (v$.value.$errors?.findIndex(e => e.$property === 'email' && e.$validator === 'email') >= 0) {
    errorMessage.value = `L'email n'est pas valide.`;
  } else {
    errorMessage.value = '';
  }
}

watch(v$, () => {
  if (!v$.value.$invalid) {
    errorMessage.value = '';
  }
})
</script>

<template>
  <form @submit.prevent="submitForm" class="mail-form">
    <DsfrInputGroup :error-message="errorMessage" :valid-message="''">
      <MixinsProfile :profile="formData.profile"
                     class="fr-mb-2w"
                     @profileUpdate="formData.profile = $event"
      />
      <MixinsSearch :profile="formData.profile"
                    :query="adressString()"
                    :light="true"
                    :disabled="subscribing"
                    @search="setAddress($event.address, $event.geo)"
      />

      <div class="fr-mt-2w text-align-center">
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

    <p>Vous pouvez vous désinscrire à tout moment en cliquant sur le lien présent dans nos emails.</p>

    <DsfrButton type="submit"
                class="full-width fr-grid-row--center"
                :disabled="v$.$invalid || subscribing">
      <div class="fr-grid-row fr-grid-row--center">
        Valider
        <Loader class="adresse-loader fr-ml-1w" :show="subscribing"/>
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