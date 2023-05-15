<script setup lang="ts">
import situations from '../../data/situations.json'
</script>

<template>
  <div class="situation fr-grid-row fr-grid-row--center fr-mt-4w fr-mb-4w">
    <div class="section-title fr-mb-8w">
      <h1>La situation en temps réel</h1>
      <span>Les départements signalés comme en “Alerte”, “Alerte renforcée“ et “Crise” sont ceux qui subissent actuellement des pénuries d’eau. Ils sont soumis à des mesures à respecter.</span>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-3"
           v-for="situation in situations.data">
        <SituationCard :situation="situation"
        />
      </div>
    </div>
    <div class="full-width fr-mt-2w">
      Source: <a class="fr-link fr-fi-arrow-right-line fr-link--icon-right"
                 href="http://propluvia.developpement-durable.gouv.fr/"
                 target="_blank"
                 rel="noopener">
      Propluvia
    </a>
    </div>
  </div>
</template>