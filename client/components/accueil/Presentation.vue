<script setup lang="ts">
import { Ref } from "vue";
import utils from "../../utils";
import { Address } from "../../dto/address.dto";
import { Geo } from "../../dto/geo.dto";
import { useAddressStore } from "../../store/address";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();

let address: string | null = route.query.adresse ? route.query.adresse : null;

const domainName = useRuntimeConfig().public.domainName;
const modalOpened: Ref<boolean> = ref(false);
const modalTitle: Ref<string> = ref('');
const modalText: Ref<string> = ref('');
const modalIcon: Ref<string> = ref('');
const modalActions: Ref<any[]> = ref([]);
const loadingZones: Ref<boolean> = ref(false);
const adressQuery: Ref<string> = ref('');

const adressStore = useAddressStore();
const {profile} = storeToRefs(adressStore);

const searchZone = (address: Address | null, geo: Geo | null) => {
  if (!address && !geo) {
    return;
  }
  utils.searchZones(address, geo, profile.value, router, modalTitle, modalText, modalIcon, modalActions, modalOpened, loadingZones);
}

const title = computed<string>(() => {
  switch (profile.value) {
    case 'exploitation':
      return `En tant qu'agriculteur, les restrictions d'eau me concernent-elles ?`
    case 'collectivite':
      return `En tant que collectivité, les restrictions d'eau me concernent-elles ?`
    case 'entreprise':
      return `En tant qu'entreprise, les restrictions d'eau me concernent-elles ?`
    case 'particulier':
    default:
      return `En tant que particulier, les restrictions d'eau me concernent-elles ?`
  }
});

const closeModal = () => {
  modalOpened.value = false;
}
if (address) {
  adressQuery.value = address ? address : '';
}
</script>

<template>
  <div class="presentation fr-grid-row fr-grid-row--center fr-mb-8w">
    <div class="section-title presentation-title">
      <img src="/logo_chaque_geste_compte.svg"
           style="max-width: 100%"
           width="410" height="180"
           alt="Chaque geste compte, préservons nos ressources"
           title="Chaque geste compte, préservons nos ressources"
      />
    </div>

    <div class="search-card fr-col-12 fr-p-md-6w fr-p-1w fr-mt-2w">
      <div class="search-card-wrapper">
        <h1 class="text-align-center h2">{{ title }}</h1>
        <MixinsSearch @search="searchZone($event.address, $event.geo)"
                      :query="adressQuery"
                      :loading="loadingZones"/>
      </div>
    </div>

    <div class="section-title fr-mt-4w">
      Nos nappes phréatiques sont basses, nous devons tous faire attention à notre consommation d’eau. Avec
      <b><i>{{ domainName }}</i></b>, nous
      vous permettons de rester informé sur votre situation locale tout en vous partageant les conseils les plus appropriés.
    </div>

    <DsfrModal :opened="modalOpened"
               :title="modalTitle"
               :icon="modalIcon"
               :actions=modalActions
               @close="closeModal">
      <div v-html="modalText"></div>
    </DsfrModal>
  </div>
</template>

<style scoped lang="scss">
.presentation {
  .presentation-title {
    position: relative;

    &:before {
      content: "";
      position: absolute;
      width: 100vw;
      height: calc(100% + 10rem);
      top: 0;
      left: 50%;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      background: linear-gradient(270deg, var(--blue-france-950-100), 70%, var(--yellow-tournesol-975-75));
      opacity: 0.5;
      z-index: -1;
    }
  }
}

.search-card {
  background-color: var(--background-default-grey);
  border: 1px var(--blue-cumulus-main-526) solid;

  &-wrapper {
    max-width: 700px;
    margin: auto;
  }
}

.fr-notice {
  width: 100vw;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}
</style>