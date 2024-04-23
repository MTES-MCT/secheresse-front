<script setup lang="ts">
const appName = useRuntimeConfig().public.appName;
useHead({
  title: `Carte des restrictions - ${useRuntimeConfig().public.appName}`,
});
</script>

<template>
  <CarteWrapper :embedded="true" />
</template>