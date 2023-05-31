<script setup lang="ts">
import { Ref } from "vue";

definePageMeta({
  layout: 'basic',
})

useHead({
  title: `Préservons l'eau - Mentions légales`
})

const domainName = useRuntimeConfig().public.domainName;
const links: Ref<any[]> = ref([{"to": "/", "text": "Accueil"}, {"text": "Mentions légales"}])
</script>

<template>
  <DsfrBreadcrumb :links='links'/>
  <div class="fr-mt-8w">
    <h1>Mentions légales</h1>
    <h2>Éditeur</h2>
    <p>Préservons l'eau est édité par la Fabrique Numérique du Ministère de la Transition écologique et solidaire et du Ministère de la Cohésion
      des territoires et des Relations avec les collectivités territoriales (Grande Arche de la Défense, 92055 La Défense CEDEX), avec
      l’appui de <a href="https://beta.gouv.fr/" target="_blank" rel="noopener">l’incubateur de services numériques beta.gouv.fr</a> de la
      direction interministérielle du numérique (DINUM).</p>
    <h2>Directeur de la publication</h2>
    <p></p>
    <h2>Hébergement</h2>
    <p>
      Le site Préservons l'eau ({{ domainName }}) est hébergé par la société Scalingo SAS,
      inscrite au RCS (Strasbourg B 808 665 483) et dont les serveurs se situent en France.
      <br/>
      SIREN : 808665483
      <br/>
      Siège social :15 avenue du Rhin, 67100 Strasbourg, France.
    </p>
    <h2>Accessibilité</h2>
    <p>Voir la page <router-link to="/accessibilite">Déclaration d'accessibilité</router-link></p>
  </div>
</template>