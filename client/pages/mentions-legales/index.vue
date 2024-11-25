<script setup lang="ts">
import { Ref } from 'vue';

definePageMeta({
  layout: 'basic',
});

const appName = useRuntimeConfig().public.appName;
useHead({
  title: `Mentions légales - ${appName}`,
});

const domainName = useRuntimeConfig().public.domainName;
const links: Ref<any[]> = ref([{ 'to': '/', 'text': 'Accueil' }, { 'text': 'Mentions légales' }]);
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <div>
      <h1>Mentions légales</h1>
      <h2>Éditeur</h2>
      <p>{{ appName }} est édité par la Fabrique Numérique du Ministère de la Transition écologique et de la
        Cohésion des territoires (Grande Arche de la Défense, 92055 La Défense CEDEX),
        avec l’appui de <a href="https://beta.gouv.fr/"
                           title="https://beta.gouv.fr/ (nouvelle fenêtre)"
                           target="_blank"
                           rel="external">
          l’incubateur de services numériques beta.gouv.fr
        </a> de
        la direction interministérielle du numérique (DINUM).</p>
      <h2>Directeur de la publication</h2>
      <ul>
        <li>Monsieur Philippe MAZENC, directeur général par intérim de l'aménagement, du logement et de la nature
          (DGALN)
        </li>
        <li>Adresse : Tour Séquoïa 1, place Carpeaux 92055 La Défense Cedex</li>
      </ul>
      <h2>Hébergement</h2>
      <p>
        Le site {{ appName }} ({{ domainName }}) est hébergé par la société Scalingo SAS,
        inscrite au RCS (Strasbourg B 808 665 483) et dont les serveurs se situent en France.
        <br />
        SIREN : 808665483
        <br />
        Siège social :15 avenue du Rhin, 67100 Strasbourg, France.
      </p>
      <p>
        Le formulaire de retours utilisateurs est géré par la société Tally.
        <br />
        Siège social : Muidepoort 19A, 9000 Gand, Belgique.
      </p>
      <p>
        La newsletter est géré par la société Brevo.
        <br />
        Siège social : 106 boulevard Haussmann, 75008 Paris, France.
      </p>
      <h2>Accessibilité</h2>
      <p>Voir la page
        <router-link to="/accessibilite">Déclaration d'accessibilité</router-link>
      </p>
    </div>
  </div>
</template>