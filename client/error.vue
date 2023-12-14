<script setup lang="ts">
useHead({
  title: `Préservons l'eau - Erreur`
})

const props = defineProps<{
  error: any
}>()
const router = useRouter();

if(props.error.statusCode === 404) {
  navigateTo('/')
}

const title = computed<string>(() => {
  return 'Une erreur est survenue, ne paniquez pas'
});
const subtitle = computed<string>(() => {
  return `Erreur ${props.error.statusCode} !`
});
const buttons = [
  {
    label: 'Page d\'accueil',
    onClick: () => {
      router.push('/');
    }
  },
]
</script>

<template>
  <div>
    <NuxtLayout name="basic">
      <DsfrErrorPage class="fr-mt-8w"
                     :title="title"
                     :subtitle="subtitle"
                     description=""
                     help=""
                     :buttons="buttons"
      />
    </NuxtLayout>
  </div>
</template>