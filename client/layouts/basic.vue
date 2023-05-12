<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'

const logoText: string[] = ['Ministères', 'Transition écologique', 'cohésion des territoires', 'transition énergétique', 'mer']
const operatorImgSrc: string = '/logo_secheresse.svg'
const operatorImgAlt: string = 'Logo eau sécheresse'
const operatorImgStyle: any = {
  'max-width': '300px'
}

const a11yCompliance: string = 'Non conforme'
const descText: string = 'Alerte sécheresse'

const preferences = reactive({
  theme: undefined,
  scheme: undefined,
})

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
  <DsfrHeader :logo-text="logoText"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
  />
  <div class="fr-container fr-mb-8w">
    <slot/>
  </div>
  <DsfrFooter :logo-text="logoText"
              :a11yCompliance="a11yCompliance"
              :descText="descText"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
  />
</template>
