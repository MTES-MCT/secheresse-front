<script setup lang="ts">
import { Ref } from 'vue';
import utils from '../../utils';
import { Address } from '../../dto/address.dto';
import { Geo } from '../../dto/geo.dto';
import { requiredIf } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import api from '../../api';

const props = defineProps<{
  departementCode: string,
  typeEau: string;
  profil: string;
  pointSelected: any;
}>();

const emit = defineEmits<{
  return: any;
}>();

const router = useRouter();
const zoneAlerteOptions: Ref<any[]> = ref([]);

const modalOpened: Ref<boolean> = ref(false);
const modalTitle: Ref<string> = ref('');
const modalText: Ref<string> = ref('');
const modalIcon: Ref<string> = ref('');
const modalActions: Ref<any[]> = ref([]);
const loading = ref(false);
const query = ref('');

const formData = reactive({
  address: null,
  geo: null,
  zoneAlerte: null,
  pointSelected: null,
});

const rules = computed(() => {
  return {
    address: {
      requiredIf: requiredIf(!formData.geo && !formData.zoneAlerte && !formData.pointSelected),
    },
    geo: {
      requiredIf: requiredIf(!formData.address && !formData.zoneAlerte && !formData.pointSelected),
    },
    zoneAlerte: {
      requiredIf: requiredIf(!formData.address && !formData.geo && !formData.pointSelected),
    },
    pointSelected: {
      requiredIf: requiredIf(!formData.address && !formData.geo && !formData.zoneAlerte),
    },
  };
});

const v$ = useVuelidate(rules, formData);

const searchZone = async () => {
  await v$.value.$validate();
  if (v$.value.$error) {
    return;
  }
  if (formData.pointSelected) {
    const fakeAdresse = <Address>{
      geometry: {
        coordinates: [formData.pointSelected.lng, formData.pointSelected.lat],
      },
      properties: {
        citycode: formData.pointSelected.commune,
        label: formData.pointSelected.communeNom,
      },
    };
    utils.searchZones(fakeAdresse, null, props.profil, props.typeEau, router, modalTitle, modalText, modalIcon, modalActions, modalOpened, loading.value);
  } else if (formData.address || formData.geo) {
    utils.searchZones(formData.address, formData.geo, props.profil, props.typeEau, router, modalTitle, modalText, modalIcon, modalActions, modalOpened, loading.value);
  } else {
    // SEARCH BY ZA
  }
};

const setAddress = (address: Address | null, geo: Geo | null) => {
  formData.address = address;
  formData.geo = geo;
};

const closeModal = (): void => {
  modalOpened.value = false;
};

const loadZoneAlerte = async () => {
  const { data, error } = await api.getZonesByDepartement(props.departementCode);
  if (data.value) {
    zoneAlerteOptions.value = [];
    let za = data.value
      .filter((zone: any) => zone.type === props.typeEau)
      .sort((a: any, b: any) => a.code?.localeCompare(b.code));
    // On enlève les doublons
    const zaMap = new Map();
    za.forEach((z: any) => {
      const key = `${z.code}_${z.niveauGravite}`;
      if (!zaMap.has(key)) {
        zaMap.set(key, z);
      }
    });
    zaMap.values().forEach((zone: any) => {
      zoneAlerteOptions.value.push({
        text: `${zone.code ? zone.code + ' ' : ''}${zone.nom}`,
        value: zone.id,
      });
    });
  }
};

watch(() => [props.typeEau, props.departementCode], () => {
  loadZoneAlerte();
}, { immediate: true });

watch(() => props.pointSelected, () => {
  if (props.pointSelected && props.pointSelected.lng && props.pointSelected.lat && props.pointSelected.commune) {
    formData.pointSelected = props.pointSelected;
    searchZone();
  }
}, { immediate: true });
</script>

<template>
  <div class="search">
    <div>
      <h3 class="fr-h6">Trois possibilités pour préciser la zone de prélèvement</h3>
      <p>Cliquez sur la carte pour indiquer où se situe votre point de prélèvement</p>
    </div>
    <div class="divider">ou</div>
    <div>
      <DsfrInputGroup>
        <DsfrSelect
          label="Choisissez la zone d'alerte"
          :disabled="zoneAlerteOptions.length <= 0"
          :options="zoneAlerteOptions"
          v-model="formData.zoneAlerte"
        />
      </DsfrInputGroup>
    </div>
    <div class="divider">ou</div>
    <div>
      <MixinsSearchAddress @search="setAddress($event.address, $event.geo)"
                           :required="false"
                           :query="query"
                           :light="true"
                           :showGeoloc="true"
                           :loading="loading" />
    </div>
    <div class="fr-pt-2w text-align-right">
      <DsfrButton @click="emit('return')"
                  class="fr-mr-1w"
                  secondary>
        Précédent
      </DsfrButton>
      <DsfrButton @click="searchZone()"
                  :disabled="loading || v$.$invalid">
        Suivant
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