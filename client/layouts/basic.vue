<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr';

const route = useRoute();

const logoText: string[] = ['Gouvernement'];
const operatorImgSrc: string = '/logo_vigie_eau.svg';
const operatorImgAlt: string = `Logo du produit ${useRuntimeConfig().public.appName}`;
const operatorImgStyle: any = {
  'max-width': '150px',
};
const a11yCompliance: string = 'Non conforme';
let quickLinks: any[] = [];
const mandatoryLinks: any[] = [{
  label: `Accessibilité : ${a11yCompliance}`,
  to: '/accessibilite',
}, {
  label: 'Mentions légales',
  to: '/mentions-legales',
}, {
  label: 'Données personnelles',
  to: '/donnees-personnelles',
}, {
  label: 'Cookies',
  to: '/cookies',
}];
const ecosystemLinks: any[] = [
  {
    'label': 'beta.gouv.fr',
    'href': 'https://beta.gouv.fr',
  },
  {
    'label': 'gouvernement.fr',
    'href': 'https://gouvernement.fr',
  },
  {
    'label': 'data.gouv.fr',
    'href': 'https://data.gouv.fr',
  },
];
const key = ref(0);

const preferences = reactive({
  theme: undefined,
  scheme: undefined,
});
const runTimeConfig = useRuntimeConfig().public;

onMounted(() => {
  const { theme, scheme, setScheme } = useScheme();
  // preferences.scheme = 'dark';
  preferences.scheme = 'light';

  watchEffect(() => {
    preferences.theme = theme.value;
  });

  watchEffect(() => setScheme(preferences.scheme));

  watch(() => route.path, newPath => {
      quickLinks = newPath === '/situation' ? [{
        label: 'Effectuer une nouvelle recherche',
        icon: 'ri-search-line',
        to: '/',
      }, {
        label: 'Donner mon avis',
        icon: 'ri-survey-line',
        button: true,
        onclick: utils.openTally,
      }] : [];
      key.value++;
    }, { immediate: true },
  );
});
</script>

<template>
  <DsfrHeader :logo-text="logoText"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
              :quickLinks="quickLinks"
              :key="key"
              :show-beta="runTimeConfig.domainName !== 'vigieau.gouv.fr' || runTimeConfig.domainProdNotActivated === 'true'"
              :serviceTitle="runTimeConfig.domainName"
              serviceDescription="S'informer sur les restrictions d'eau en période de sécheresse">
  </DsfrHeader>
  <div class="fr-mb-8w">
    <div class="fr-container" v-if="runTimeConfig.appEnv !== 'prod'">
      <DsfrAlert
        description="Plateforme de développement, les données sont fictives. Si vous souhaitez accéder à la plateforme de production, allez sur https://vigieau.gouv.fr"
        type="warning"
        class="fr-my-2w"
        :closeable="false"
      />
    </div>
    <slot />
  </div>
  <DsfrFooter :logo-text="logoText"
              :mandatoryLinks="mandatoryLinks"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
              :ecosystemLinks="ecosystemLinks">
  </DsfrFooter>
</template>

<style lang="scss">
</style>
