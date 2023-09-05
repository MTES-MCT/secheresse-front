<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const legends = [
  {
    text: 'Pas de restrictions',
    class: 'situation-level-bg-0'
  },
  {
    text: 'Vigilance',
    class: 'situation-level-bg-1'
  },
  {
    text: 'Alerte',
    class: 'situation-level-bg-2'
  },
  {
    text: 'Alerte renforcée',
    class: 'situation-level-bg-3'
  },
  {
    text: 'Crise',
    class: 'situation-level-bg-4'
  }
];

const territoires = [
  {
    name: 'France métropolitaine',
    image: `${runtimeConfig.public.apiSecheresseUrl}/maps/metropole.png`,
    large: true
  },
  {
    name: 'Mayotte',
    image: `${runtimeConfig.public.apiSecheresseUrl}/maps/mayotte.png`,
  },
  {
    name: 'La Réunion',
    image: `${runtimeConfig.public.apiSecheresseUrl}/maps/reunion.png`,
  },
  {
    name: 'Guadeloupe',
    image: `${runtimeConfig.public.apiSecheresseUrl}/maps/guadeloupe.png`,
  },
  {
    name: 'Martinique',
    image: `${runtimeConfig.public.apiSecheresseUrl}/maps/martinique.png`,
  },
  {
    name: 'Guyane',
    image: `${runtimeConfig.public.apiSecheresseUrl}/maps/guyane.png`,
  },
];

const date = computed(() => {
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return today.toLocaleDateString('fr-FR', options);
});
</script>

<template>
  <div class="carte fr-my-8w">
    <div class="section-title fr-mb-8w">
      <h2 class="fr-mb-0">La situation de la sécheresse en France</h2>
      <span>Arrêtés publiés avant le {{ date }}</span>
      <DsfrNotice title="Carte simplifiée pour les particuliers"
                  class="notice-light fr-mt-1w"/>
    </div>
    <div class="legende fr-mb-1w fr-grid-row fr-grid-row--center fr-grid-row--gutters">
      <div v-for="legend in legends" class="fr-grid-row fr-grid-row--center fr-col-xl-2 fr-col-12">
        <div class="legende-carre fr-mr-1w" :class="legend.class">
        </div>
        {{ legend.text }}
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--top">
      <div class="fr-col-lg-8 fr-col-12">
        <div>
          <h3 class="h6 text-align-center">{{ territoires[0].name }}</h3>
          <img :src="territoires[0].image"
               style="max-width: 100%"
               :alt="territoires[0].name"
               :title="territoires[0].name"
          />
        </div>
      </div>
      <div class="fr-col-lg-4 fr-col-12 fr-grid-row fr-grid-row--center">
        <template v-for="(territoire, index) in territoires">
          <div v-if="index > 0"
               class="fr-col-6 carte-drom text-align-center">
            <h3 class="h6">{{ territoire.name }}</h3>
            <img :src="territoire.image"
                 :alt="territoire.name"
                 :title="territoire.name"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carte {
  .legende {
    display: flex;

    &-carre {
      height: 20px;
      width: 20px;
    }

    .situation-level-bg-1 {
      background-color: #FFEDA0;
    }
  }
  
  &-drom {
    img {
      width: 100%;
      max-width: 150px;
    }
  }
}
</style>