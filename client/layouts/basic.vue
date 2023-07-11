<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'

const logoText: string[] = ['Gouvernement']
const operatorImgSrc: string = '/logo_vigie_eau.svg'
const operatorImgAlt: string = `Logo du produit ${useRuntimeConfig().public.appName}`
const operatorImgStyle: any = {
  'max-width': '150px'
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
}];
const ecosystemLinks: any[] = [
  {
    "label": "beta.gouv.fr",
    "href": "https://beta.gouv.fr"
  },
  {
    "label": "gouvernement.fr",
    "href": "https://gouvernement.fr"
  },
  {
    "label": "data.gouv.fr",
    "href": "https://data.gouv.fr"
  }
];
const key = ref(0);

const preferences = reactive({
  theme: undefined,
  scheme: undefined,
})
const runTimeConfig = useRuntimeConfig().public;
const route = useRoute();

onMounted(() => {
  const {theme, scheme, setScheme} = useScheme()
  // preferences.scheme = 'dark';
  preferences.scheme = 'light';

  watchEffect(() => {
    preferences.theme = theme.value
  })

  watchEffect(() => setScheme(preferences.scheme))

  watch(() => route.path, newPath => {
    quickLinks = newPath === '/situation' ? [{
      label: 'Effectuer une nouvelle recherche',
      icon: 'ri-search-line',
      iconRight: true,
      to: '/'
    }, {
      label: 'Donner mon avis',
      icon: 'ri-survey-line',
      iconRight: true,
      button: true,
      onclick: utils.openTally
    }] : [];
    key.value ++;
    }, { immediate: true }
  )
})
</script>

<template>
  <DsfrHeader :logo-text="logoText"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
              :quickLinks="quickLinks"
              :key="key"
              serviceTitle=" "
  />
  <DsfrNotice v-if="runTimeConfig.domainName !== 'vigieau.gouv.fr' || runTimeConfig.domainProdNotActivated === 'true'"
              title="Version beta en cours de conception"/>
  <div class="fr-container fr-mb-8w">
    <slot/>
  </div>
  <DsfrFooter :logo-text="logoText"
              :mandatoryLinks="mandatoryLinks"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
              :ecosystemLinks="ecosystemLinks">
  </DsfrFooter>
</template>
