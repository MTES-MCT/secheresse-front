<script setup lang="ts">

import { Ref } from "vue";

const props = defineProps<{
  situationLabel: string
  address: string
}>();

const socialMediaText: Ref<string> = computed(() => {
  if (!props.situationLabel) {
    return `Situation ${props.address}, pas de restrictions - ${useRuntimeConfig().public.appName}`;
  } else {
    return `Situation ${props.address}, en ${props.situationLabel}, des restrictions sont en cours - ${useRuntimeConfig().public.appName}`;
  }
});
const urlToShare = encodeURIComponent(window.location.href);

const networks = [
  {
    name: "facebook",
    label: "Partager sur Facebook",
    url: `https://www.facebook.com/sharer.php?u=${urlToShare}`
  },
  {
    name: "twitter-x",
    label: "Partager sur X",
    url: `https://twitter.com/intent/tweet?url=${urlToShare}&text=${socialMediaText.value}&hashtags=#VigiEau`
  },
  {
    name: "linkedin",
    label: "Partager sur LinkedIn",
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${urlToShare}`
  }
];
</script>

<template>
  <DsfrShare title="Partagez votre situation - Attention l'adresse utilisée sera visible"
             :networks="networks"/>
</template>