<script setup lang="ts">
</script>

<template>
  <div class="fr-follow">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <div class="fr-follow__newsletter">
            <div>
              <img src="/accueil_donnees.svg"
                   style="max-width: 100%;"
                   width="296" height="291"
                   title="Image d'illustration ordinateur données"
              />
            </div>
            <div>
              <h2>En savoir plus sur l'évolution des sécheresses</h2>
              <p class="fr-text--sm">
                Retrouvez des cartes et historiques des données sécheresse, ainsi que l’évolution des restrictions dans
                le temps et sur des territoires sélectionnés.
              </p>
              <router-link to="/donnees"
                           class="fr-btn fr-mt-1w"
                           title="Je consulte les données">
                Je consulte les données
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fr-follow {
  background: var(--brown-cafe-creme-975-75);
}

@media screen and (max-width: 767px) {
  .fr-follow {
    text-align: center;
  }
}
</style>