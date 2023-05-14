<script setup lang="ts">
const props = defineProps<{
  situation: { rank: number, nbTerritories: number }
  address: any
}>()

</script>

<template>
  <div class="situation-status fr-grid-row fr-grid-row--center fr-mt-4w fr-mb-4w">
    <div class="section-title fr-mb-4w">
      <h1>Votre situation en temps réel</h1>
    </div>
    <SituationStatusHeader :address="address"
                           :situation="situation"
                           class="fr-py-4w"/>
    <SituationStatusLaws/>
    <div class="section-title fr-mt-8w">
      <h2>Il est possible que des exceptions existent pour certaines restrictions.</h2>
      <div class="fr-mb-4w">
        Certaines exceptions peuvent ne pas apparaître ici, pour les connaître vous pouvez télécharger l’arrêté préfectoral ci-dessous.
      </div>
      <DsfrButton label="Télécharger l'arrêté préfectoral"/>
    </div>
  </div>
</template>