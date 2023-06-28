<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'

const logoText: string[] = ['Gouvernement']
const operatorImgSrc: string = '/logo_vigie_eau.svg'
const operatorImgAlt: string = `Logo du produit ${useRuntimeConfig().public.appName}`
const operatorImgStyle: any = {
  'max-width': '150px'
};
const a11yCompliance: string = 'Non conforme';
const descText: string = useRuntimeConfig().public.appName;
const quickLinks: any[] = [];
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

const preferences = reactive({
  theme: undefined,
  scheme: undefined,
})
const runTimeConfig = useRuntimeConfig().public;

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
  <DsfrNotice v-if="runTimeConfig.domainName !== 'vigieau.gouv.fr' || runTimeConfig.domainProdNotActivated === 'true'" title="Version beta en cours de conception" />
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
