<script setup lang="ts">
import liens from '../../data/liens.json'
</script>

<template>
  <div class="liens  fr-container fr-py-4w">
    <div class="section-title fr-mb-4w">
      <h2>Les liens utiles</h2>
      <span>Toutes les ressources officielles sur la gestion de l'eau :</span>
    </div>
    <div>
      <ul>
        <li v-for="lien in liens.data">
          <a :href="lien.link" target="_blank" rel="external" class="fr-link">
            {{ lien.title }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.liens {
  position: relative;

  &:before {
    content: "";
    position: absolute;
    width: 100vw;
    height: 100%;
    left: 50%;
    top: 0;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    background: var(--brown-cafe-creme-975-75);
    opacity: 0.5;
    z-index: -1;
  }
}
</style>