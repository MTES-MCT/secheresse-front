<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'

const logoText: string[] = ['Ministères', 'Transition écologique', 'cohésion des territoires', 'transition énergétique', 'mer']
const operatorImgSrc: string = '/logo_preservons_leau.svg'
const operatorImgAlt: string = 'Logo du produit Préservons l\'eau'
const operatorImgStyle: any = {
  'max-width': '300px'
};
const a11yCompliance: string = 'Non conforme';
const descText: string = `Préservons l'eau`;
const quickLinks: any[] = [{
  label: 'Quelles sont les restrictions qui me concernent ?',
  to: '/situation/recherche',
  class: 'fr-btn--secondary'
}];
const mandatoryLinks: any[] = [{
  label: `Accessibilité : ${a11yCompliance}`,
  to: '/accessibilite',
}, {
  label: 'Mentions légales',
  to: '/mentions-legales',
}];

const preferences = reactive({
  theme: undefined,
  scheme: undefined,
})
const domainName = useRuntimeConfig().public.domainName;

onMounted(() => {
  const {theme, scheme, setScheme} = useScheme()
  // preferences.scheme = 'dark';
  preferences.scheme = 'light';

  watchEffect(() => {
    preferences.theme = theme.value
  })

  watchEffect(() => setScheme(preferences.scheme))
})
</script>

<template>
  <DsfrNotice title="Version beta en cours de conception" />
  <DsfrHeader :logo-text="logoText"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
              :quickLinks="quickLinks"
              serviceTitle=" "
  />
  <div class="fr-container fr-mb-8w">
    <slot/>
  </div>
  <DsfrFooter :logo-text="logoText"
              :mandatoryLinks="mandatoryLinks"
              :descText="descText"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
  />
</template>
