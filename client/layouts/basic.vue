<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'

const logoText: string[] = ['République', 'Française']
const serviceTitle: string = 'Alerte sécheresse'

const a11yCompliance: string = 'Non conforme'
const descText: string = 'Alerte sécheresse'

const preferences = reactive({
  theme: undefined,
  scheme: undefined,
})

onMounted(() => {
  const { theme, scheme, setScheme } = useScheme()
  // preferences.scheme = scheme.value
  preferences.scheme = 'light';

  watchEffect(() => { preferences.theme = theme.value })

  watchEffect(() => setScheme(preferences.scheme))
})
</script>

<template>
  <DsfrHeader :logo-text="logoText"
              :serviceTitle="serviceTitle"
  />
  <div class="fr-container fr-mb-8w">
    <slot/>
  </div>
  <DsfrFooter :logo-text="logoText"
              :a11yCompliance="a11yCompliance"
              :descText="descText"
  />
</template>
