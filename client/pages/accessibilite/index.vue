<script setup lang="ts">
import { Ref } from 'vue';

definePageMeta({
  layout: 'basic',
});

const appName = useRuntimeConfig().public.appName;
const email = useRuntimeConfig().public.email;
const telephone = useRuntimeConfig().public.telephone;
useHead({
  title: `Accessibilité - ${useRuntimeConfig().public.appName}`,
});

const domainName = useRuntimeConfig().public.domainName;
const links: Ref<any[]> = ref([{ 'to': '/', 'text': 'Accueil' }, { 'text': 'Accessibilité' }]);
</script>

<template>
  <div class="fr-container">
    <DsfrBreadcrumb :links='links' />
    <div>
      <h1>Déclaration d’accessibilité</h1>
      <p>Établie le <span>22 mai 2024</span>.</p>
      <p>Le <span>Ministère de la Transition écologique et de la Cohésion des territoires</span> s’engage à rendre son
        service accessible, conformément à l’article 47 de la loi n° 2005-102 du 11 février 2005.</p>
      <p>À cette fin, nous mettons en œuvre la stratégie et les actions suivantes&nbsp;: <a
        href="https://beta.gouv.fr/accessibilite/schema-pluriannuel" target="_blank" rel="external">https://beta.gouv.fr/accessibilite/schema-pluriannuel</a>.
      </p>
      <p>Cette déclaration d’accessibilité s’applique à <strong>{{ appName }}</strong><span> (<span>{{ domainName
        }}</span>)</span>.</p>
      <h2>État de conformité</h2>
      <p>
        <strong>{{ appName }}</strong> est
        <strong><span data-printfilter="lowercase">non conforme</span></strong> avec le <abbr
        title="Référentiel général d’amélioration de l’accessibilité">RGAA</abbr>. <span>Le site n’a encore pas été audité.</span>
      </p>
      <h2>Contenus non accessibles</h2>
      <h2>Amélioration et contact</h2>
      <p>
        Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
        responsable de Potentiel pour être orienté vers une alternative accessible ou obtenir le
        contenu sous une autre forme.
      </p>
      <ul>
        <li>E-mail : {{ email }}</li>
        <li>Téléphone : {{ telephone }}</li>
      </ul>
      <h2>Voie de recours</h2>
      <p>Cette procédure est à utiliser dans le cas suivant&nbsp;: vous avez signalé au responsable du site internet un
        défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un des services du portail et vous n’avez
        pas obtenu de réponse satisfaisante.</p>
      <p>Vous pouvez&nbsp;:</p>
      <ul>
        <li>Écrire un message au <a href="https://formulaire.defenseurdesdroits.fr/" target="_blank" rel="external">Défenseur
          des droits</a>
        </li>
        <li>Contacter <a href="https://www.defenseurdesdroits.fr/saisir/delegues" target="_blank" rel="external">le
          délégué du Défenseur des droits dans votre région</a>
        </li>
        <li>Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre)&nbsp;:<br>
          Défenseur des droits<br>
          Libre réponse 71120 75342 Paris CEDEX 07
        </li>
      </ul>
      <hr>
      <p>
        Cette déclaration d’accessibilité a été créé le <span>10 mai 2023</span> grâce au <a
        href="https://betagouv.github.io/a11y-generateur-declaration/" target="_blank" rel="external">Générateur de
        Déclaration d’Accessibilité de BetaGouv</a>.
      </p>
    </div>
  </div>
</template>