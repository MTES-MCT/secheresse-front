<script setup lang="ts">
const legends = [
  {
    text: 'En état de vigilance',
    class: 'situation-level-bg-1'
  },
  {
    text: 'En état d\'alerte',
    class: 'situation-level-bg-2'
  },
  {
    text: 'En état d\'alerte renforcée',
    class: 'situation-level-bg-3'
  },
  {
    text: 'En état de crise',
    class: 'situation-level-bg-4'
  }
];

const territoires = [
  {
    name: 'France métropolitaine',
    image: '/metropole.png',
    large: true
  },
  {
    name: 'La Réunion',
    image: '/reunion.png'
  },
  {
    name: 'Guadeloupe',
    image: '/guadeloupe.png'
  },
  {
    name: 'Guyane',
    image: '/guyane.png'
  },
  {
    name: 'Martinique',
    image: '/martinique.png'
  },
  {
    name: 'Mayotte',
    image: '/mayotte.png'
  }
];

const date = computed(() => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return dd + '/' + mm + '/' + yyyy;
});
</script>

<template>
  <div class="carte fr-mb-8w">
    <div class="section-title fr-mb-8w">
      <h2>Carte des niveaux de gravité sécheresse définis par arrêté au {{ date }}</h2>
    </div>
    <div class="legende fr-mb-1w fr-grid-row fr-grid-row--center fr-grid-row--gutters">
      <div v-for="legend in legends" class="fr-grid-row fr-grid-row--center fr-col-lg-3 fr-col-md-6 fr-col-12">
        <div class="legende-carre fr-mr-1w" :class="legend.class">
        </div>
        {{ legend.text }}
      </div>
    </div>
    <div class="fr-grid-row fr-grid-row--top">
      <div class="fr-col-lg-7 fr-col-12">
        <div>
          <h3 class="h6 text-align-center">{{ territoires[0].name }}</h3>
          <img :src="territoires[0].image"
               style="max-width: 100%"
               alt="Chaque geste compte, préservons nos ressources"
               title="Chaque geste compte, préservons nos ressources"
          />
        </div>
      </div>
      <div class="fr-col-lg-5 fr-col-12 fr-grid-row fr-grid-row--center">
        <template v-for="(territoire, index) in territoires">
          <div v-if="index > 0"
               class="fr-col-4">
            <h3 class="h6 text-align-center">{{ territoire.name }}</h3>
            <img :src="territoire.image"
                 style="max-width: 100%"
                 alt="Chaque geste compte, préservons nos ressources"
                 title="Chaque geste compte, préservons nos ressources"
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
  }
}
</style>