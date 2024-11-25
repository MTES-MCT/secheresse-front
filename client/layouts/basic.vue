<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr';

const route = useRoute();

const logoText: string[] = ['Gouvernement'];
const operatorImgSrc: string = '/logo_vigie_eau.svg';
const operatorImgAlt: string = `${useRuntimeConfig().public.appName}`;
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
    label: 'beta.gouv.fr',
    href: 'https://beta.gouv.fr',
    title: 'beta.gouv.fr (nouvelle fenêtre)'
  },
  {
    label: 'gouvernement.fr',
    href: 'https://gouvernement.fr',
    title: 'gouvernement.fr (nouvelle fenêtre)'
  },
  {
    label: 'data.gouv.fr',
    href: 'https://data.gouv.fr',
    title: 'data.gouv.fr (nouvelle fenêtre)'
  },
];
const key = ref(0);
const skipLink = ref<HTMLElement | null>(null);

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
        label: 'Données sécheresse',
        icon: 'ri-water-percent-line',
        to: '/donnees',
      }, {
        label: 'Effectuer une nouvelle recherche',
        icon: 'ri-search-line',
        to: '/',
      }, {
        label: 'Donner mon avis',
        icon: 'ri-survey-line',
        button: true,
        onclick: utils.openTally,
      }] : [{
        label: 'Données sécheresse',
        icon: 'ri-water-percent-line',
        to: '/donnees',
      }];
      key.value++;
      skipLink.value?.focus();
    }, { immediate: true },
  );
});
</script>

<template>
  <!-- Lien d'évitement -->
  <a href="#main-content" class="skip-link fr-sr-only" ref="skipLink">Passer au contenu principal</a>

  <DsfrHeader :logo-text="logoText"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
              :quickLinks="quickLinks"
              menuModalLabel="Menu"
              :key="key"
              :show-beta="runTimeConfig.domainName !== 'vigieau.gouv.fr' || runTimeConfig.domainProdNotActivated === 'true'"
              :serviceTitle="runTimeConfig.domainName"
              serviceDescription="S'informer sur les restrictions d'eau en période de sécheresse">
  </DsfrHeader>
  <main role="main" id="main-content">
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
  </main>
  <DsfrFooter :logo-text="logoText"
              :mandatoryLinks="mandatoryLinks"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
              :ecosystemLinks="ecosystemLinks"
              homeTitle="Accueil VigiEau">
  </DsfrFooter>
</template>

<style scoped lang="scss">
</style>
