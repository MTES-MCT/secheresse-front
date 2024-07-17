<script setup lang="ts">
const dateCarte = ref(new Date().toISOString().split('T')[0]);
const currentDate = new Date();
</script>

<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
    <div class="fr-col-4">
      <DsfrInput
        id="dateCarte"
        v-model="dateCarte"
        label="Filtrer par date"
        label-visible
        type="date"
        name="dateCarte"
        min="2012-01-01"
        :max="currentDate.toISOString().split('T')[0]"
      />
    </div>
    <div class="fr-col-4">
      <DsfrInput
        id="dateCarte"
        v-model="dateCarte"
        label="Filtrer par date"
        label-visible
        type="date"
        name="dateCarte"
        min="2012-01-01"
        :max="currentDate.toISOString().split('T')[0]"
      />
    </div>
    <div class="fr-col-4">
      <DsfrInput
        id="dateCarte"
        v-model="dateCarte"
        label="Filtrer par date"
        label-visible
        type="date"
        name="dateCarte"
        min="2012-01-01"
        :max="currentDate.toISOString().split('T')[0]"
      />
    </div>
  </div>
</template>