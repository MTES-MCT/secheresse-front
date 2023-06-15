<script setup lang="ts">
import { Ref } from "vue";
import utils from "../../utils";
import api from "../../api";
import { Address } from "../../dto/address.dto";
import { Geo } from "../../dto/geo.dto";
import { Profile } from "../../dto/profile.enum";

const route = useRoute();
const router = useRouter();

const citycode: string | null = route.query.code_insee ? route.query.code_insee : null;
let profile: string | null = route.query.profil ? route.query.profil : null;
const lat: string | null = route.query.lat ? route.query.lat : null;
const lon: string | null = route.query.lon ? route.query.lon : null;

const domainName = useRuntimeConfig().public.domainName;
const modalOpened: Ref<boolean> = ref(false);
const modalTitle: Ref<string> = ref('');
const modalText: Ref<string> = ref('');
const modalIcon: Ref<string> = ref('');
const modalActions: Ref<any[]> = ref([]);
const notice = `${domainName} ne communique pas sur les ruptures d'approvisionnement en eau potable`;
const loadingRestrictions: Ref<boolean> = ref(false);
const adressQuery: Ref<string> = ref('');

const searchRestriction = (address: Address | null, geo: Geo | null, profile: string) => {
  if (!address && !geo) {
    return;
  }
  utils.searchRestriction(address, geo, profile, modalTitle, modalText, modalIcon, modalActions, modalOpened, router, loadingRestrictions);
}

const closeModal = () => {
  modalOpened.value = false;
}
profile = profile && Object.keys(Profile).includes(profile) ? profile : 'particulier';
if (citycode) {
  const {data} = await api.searchGeoByCitycode(citycode);
  adressQuery.value = data.value?.nom ? data.value?.nom : '';
  searchRestriction(null, data.value, profile);
}
if (lat && lon) {
  const {data} = await api.searchAdressByLonLat(lon, lat);
  adressQuery.value = data.value?.features[0] ? data.value?.features[0].properties.label : '';
  searchRestriction(data.value?.features[0], null, profile);
}
</script>

<template>
  <DsfrNotice :title="notice"/>
  <div class="presentation fr-grid-row fr-grid-row--center fr-my-8w">
    <div class="section-title presentation-title">
      <div>
        <b>Citoyens, collectivités, entreprises, agriculteurs</b>
      </div>
      <img src="/logo_chaque_geste_compte.svg"
           style="max-width: 100%"
           width="410" height="180"
           alt="Chaque geste compte, préservons nos ressources"
           title="Chaque geste compte, préservons nos ressources"
      />
      <div>
        Nos nappes phréatiques sont basses, nous devons tous faire attention à notre consommation d’eau. Avec
        <b><i>{{ domainName }}</i></b>, nous
        vous permettons de rester informé sur votre situation locale tout en vous partageant les conseils les plus appropriés.
      </div>
    </div>

    <div class="search-card fr-col-12 fr-p-md-6w fr-p-1w fr-mt-4w">
      <h2 class="text-align-center">Les restrictions me concernent-elles ?</h2>
      <MixinsSearch @search="searchRestriction($event.address, null, $event.type)"
                    :query="adressQuery"
                    :loading="loadingRestrictions"/>
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
  .section-title {
    position: relative;

    &:before {
      content: "";
      position: absolute;
      width: 100vw;
      height: calc(100% + 12rem);
      top: -4rem;
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
  border: 1px var(--blue-france-925-125) solid;
}

.fr-notice {
  width: 100vw;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}
</style>