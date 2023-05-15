<script setup lang="ts">
definePageMeta({
  layout: 'basic',
  middleware: 'situation-address'
})
</script>

<template>
  <div>
    <SituationStatus/>
    <HomeGestes/>
    <HomeFaq />
  </div>
</template>
