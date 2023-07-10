<script setup lang="ts">
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
    image: '/metropole.png',
    large: true
  },
  {
    name: 'Mayotte',
    image: '/mayotte.png'
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
    name: 'Martinique',
    image: '/martinique.png'
  },
  {
    name: 'Guyane',
    image: '/guyane.png'
  },
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
      <h2>La situation de la sécheresse en France aujourd'hui</h2>
      <span>{{ date }}</span>
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
               class="fr-col-6">
            <h3 class="h6 text-align-center">{{ territoire.name }}</h3>
            <img :src="territoire.image"
                 style="max-width: 100%"
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
  }
}
</style>