<script setup lang="ts">
import { Ref } from 'vue';

definePageMeta({
  layout: 'basic',
});

useHead({
  title: `Données - ${useRuntimeConfig().public.appName}`,
});

const links: Ref<any[]> = ref([{ to: '/', text: 'Accueil' }, { text: 'Données sécheresse' }]);
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <h1>Données sécheresse</h1>
    <DsfrHighlight class="fr-mb-2w">
      Retrouvez les données brutes sur <a href="https://www.data.gouv.fr/fr/datasets/donnee-secheresse-vigieau/"
                                          target="_blank" rel="external" class="fr-link">data.gouv</a><br />
      Si vous avez des besoins spécifiques, envoyez nous un email à contact.vigieau@beta.gouv.fr
    </DsfrHighlight>
  </div>
  <div class="background-blue fr-py-2w">
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-3">
          <DsfrCard
            img-src="/donnee_carte_historique.png"
            link="/donnees/carte-historique"
            alt-img="Image d'illustration de la carte"
            title="Carte et historique des restrictions"
          >
          </DsfrCard>
        </div>
        <div class="fr-col-3">
          <DsfrCard
            img-src="/donnee_graphe_surface.png"
            link="/donnees/surface"
            alt-img="Image d'illustration du graphique"
            title="Évolution journalière du pourcentage de la surface concernée par des niveaux de gravité"
          >
          </DsfrCard>
        </div>
        <div class="fr-col-3">
          <DsfrCard
            img-src="/donnee_graphe_departement.png"
            link="/donnees/departement"
            alt-img="Image d'illustration du graphique"
            title="Évolution journalière du nombre de départements soumis à restriction"
          >
          </DsfrCard>
        </div>
        <div class="fr-col-3">
          <DsfrCard
            img-src="/donnee_carte_commune.png"
            link="/donnees/carte-commune"
            alt-img="Image d'illustration de la carte"
            title="Évolution de la situation de la sécheresse par commune"
          >
          </DsfrCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.background-blue {
  background-color: var(--blue-france-975-75);
}
</style>