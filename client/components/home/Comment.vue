<script setup lang="ts">
const steps = [
  {
    title: '1.',
    description: 'Entrez votre adresse afin que nous puissions récupérer les données de votre territoire',
    altImg: `Image illustrative de recherche d'adresse`
  },
  {
    title: '2.',
    description: 'Accédez aux restrictions qui vous concernent et aux bons gestes à adopter',
    altImg: `Image illustrative du résultat des restrictions`
  }
]
</script>

<template>
  <div class="comment fr-grid-row fr-grid-row--center fr-mt-8w fr-pb-4w">
    <div class="section-title fr-mb-4w">
      <h1>Comment ça marche ?</h1>
    </div>
    <div class="comment-wrapper fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-6"
           v-for="step in steps">
        <DsfrCard :altImg="step.altImg"
                  noArrow
                  link="/"
                  detail=""
                  imgSrc="/card_bg.svg"
                  :title="step.title"
                  :description="step.description"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.comment {
  position: relative;
  
  &:before {
    content: "";
    position: absolute;
    width: 100vw;
    height: calc(100% + 4rem);
    top: -4rem;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    background: var(--blue-france-975-75);
    z-index: -1;
  }
  
  &-wrapper {
    max-width: 800px;
  }
}
</style>