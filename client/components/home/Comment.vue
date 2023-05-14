<script setup lang="ts">
const steps = [
  {
    title: '1.',
    description: 'Entrez votre adresse afin que nous puissions récupérer les données de votre territoire'
  },
  {
    title: '2.',
    description: 'Accédez aux restrictions qui vous concernent et aux bons gestes à adopter'
  }
]
</script>

<template>
  <div class="comment fr-grid-row fr-grid-row--center fr-mt-8w">
    <div class="section-title fr-mb-8w">
      <h1>Comment ça marche ?</h1>
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-6 fr-grid-row"
           v-for="step in steps">
        <DsfrCard altImg="icone"
                  noArrow
                  link=""
                  detail=""
                  imgSrc="/card_bg.svg"
                  :title="step.title"
                  :description="step.description"
        />
      </div>
    </div>
  </div>
</template>