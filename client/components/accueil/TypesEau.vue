<script setup lang="ts">
const typesEau = [
  {
    title: 'Eau souterraine',
    description: 'Ce sont toutes les eaux se trouvant sous la surface du sol : les nappes phréatiques, nappes profondes, etc. Vous utilisez cette eau, si vous disposez d’un puit ou d’un forage.',
    img: '/type_eau_sou.svg',
  },
  {
    title: 'Eau superficielle',
    description: ' Il s\'agit pour l\'essentiel des cours d\'eau, des lacs et des eaux de ruissellement. Vous êtes concerné si vous prélevez directement dans un cours d’eau.',
    img: '/type_eau_sup.svg',
  },
  {
    title: 'Eau potable',
    description: 'L’eau potable provient des nappes et des cours d\'eau. Elle est  traitée en plusieurs étapes afin de lui donner la qualité de l’eau potable. Elle est ensuite acheminée jusqu’à votre domicile.',
    img: '/type_eau_aep.svg',
  },
];
</script>

<template>
  <div class="types-eau fr-container fr-grid-row fr-grid-row--center fr-my-4w">
    <div class="section-title">
      <h2>Les restrictions sont appliquées en fonction de l’eau que vous consommez</h2>
    </div>
    <div class="fr-grid-row fr-grid-row fr-grid-row--gutters fr-grid-row--center">
      <div v-for="typeEau of typesEau" class="fr-col-12 fr-col-md-4">
        <DsfrCard 
          :img-src="typeEau.img"
          alt-img="Image d'illustration"
          :title="typeEau.title"
          :description="typeEau.description"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.fr-card {
  &__img {
    img {
      margin-top: 1rem;
      max-height: 100%;
      width: auto;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>