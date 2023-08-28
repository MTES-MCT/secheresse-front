<script setup lang="ts">
import { Ref } from "vue";

definePageMeta({
  layout: 'basic',
})

const appName = useRuntimeConfig().public.appName;
const email = useRuntimeConfig().public.email;
useHead({
  title: `Données personnelles - ${useRuntimeConfig().public.appName}`
})

const links: Ref<any[]> = ref([{"to": "/", "text": "Accueil"}, {"text": "Données personnelles"}])
</script>

<template>
  <DsfrBreadcrumb :links='links'/>
  <div class="fr-mt-8w">
    <h1>Politique de confidentialité</h1>
    <h2>Qui est responsable ?</h2>
    <p>
      {{ appName }} est un service numérique développé au sein de la Direction générale de l’Aménagement, du Logement et de la Nature. Ce
      service permet d’informer les personnes sur les restrictions de l’usage de l’eau en vigueur localement en France.<br/><br/>
      Le responsable de l’utilisation des données est la DGALN, représentée par M. Philippe Mazenc, directeur général de l’aménagement, du
      logement et de la nature.
    </p>
    <h2>Pourquoi traitons-nous ces données ?</h2>
    <p>
      {{ appName }} traite des données à caractère personnel pour :<br/>
      <ul>
        <li>Mettre en place un système d’alerte par mail des restrictions d’eau.</li>
      </ul>
    </p>
    <h2>Quelles sont les données que nous traitons ?</h2>
    <p>
      {{ appName }} traite les données à caractère personnel suivantes :<br/>
      <ul>
        <li>Adresse e-mail</li>
        <li>Adresse postale</li>
        <li>Type de profil : particulier, collectivité, entreprise, agriculteur</li>
      </ul>
    </p>
    <h2>Qu’est-ce qui nous autorise à traiter ces données ?</h2>
    <p>
      {{ appName }} traite des données à caractère personnel en se basant sur :<br/>
      <ul>
        <li>
          L’exécution d’une mission d’intérêt public ou relevant de l’exercice de l’autorité publique dont est investi le responsable de
          traitement au sens de l’article 6-1 e) du RPGD.
        </li>
      </ul>
      Cette mission d’intérêt public ou relevant de l’exercice de l’autorité publique se traduit par :<br/>
      <ul>
        <li>
          L’article 7 de la Charte de l’environnement, ayant valeur constitutionnelle, qui dispose que « toute personne a le droit, dans
          les conditions et les limites définies par la loi, d’accéder aux informations relatives à l’environnement détenues par les
          autorités publiques »
        </li>
        <li>
          L’article 7 du décret n° 2008-680 du 9 juillet 2008 portant organisation de l’administration centrale des ministères chargés de la
          transition écologique, de la cohésion des territoires et de la mer.
        </li>
      </ul>
    </p>
    <h2>Pendant combien de temps conservons-nous ces données ?</h2>
    <p>
      <div class="fr-table">
        <table>
          <thead>
          <tr>
            <th scope="col">Type de données</th>
            <th scope="col">Durée de la conservation</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Données de contact : adresse e-mail</td>
            <td>Jusqu’à ce que l’utilisateur se désinscrit de la lettre d’information</td>
          </tr>
          <tr>
            <td>Adresse postale</td>
            <td>2 ans à compter du dernier contact avec l’utilisateur</td>
          </tr>
          </tbody>
        </table>
      </div>
    </p>
    <h2>Quels droits avez-vous ?</h2>
    <p>
      Vous disposez :<br/>
      <ul>
        <li>D’un droit d’information et d’un droit d’accès à vos données</li>
        <li>D’un droit de rectification</li>
        <li>D’un droit d’opposition</li>
        <li>D’un droit à la limitation du traitement</li>
      </ul>
      Pour les exercer, contactez-nous à : <a class="fr-link"
                                              :title="email"
                                              :href="`mailto:${email}`">
      {{ email }}
    </a><br/><br/>
      Puisque ce sont des droits personnels, nous ne traiterons votre demande que si nous sommes en mesure de vous identifier. Dans le cas
      où nous ne parvenons pas à vous identifier, nous pouvons être amenés à vous demander une preuve de votre identité.}<br/><br/>
      Pour vous aider dans votre démarche, vous trouverez un modèle de courrier élaboré par la CNIL ici :
      <a href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces" target="_blank"
         rel="external">https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces</a><br/><br/>
      Nous nous engageons à vous répondre dans un délai raisonnable qui ne saurait dépasser 1 mois à compter de la réception de votre
      demande.

    </p>
    <h2>Qui va avoir accès à ces données ?</h2>
    <p>
      Les accès aux données sont strictement encadrés et juridiquement justifiés. Les personnes suivantes vont avoir accès aux données
      :<br/>
      <ul>
        <li>
          Les membres du service numérique {{ appName }} qui ont besoin des données dans leurs missions ou qui y ont accès de fait
          (développeur, etc.).
        </li>
      </ul>
    </p>
    <h2>
      Quelles mesures de sécurité mettons-nous en place ?
    </h2>
    <p>
      Nous mettons en place plusieurs mesures pour sécuriser les données :<br/>
      <ul>
        <li>Stockage des données en base de données</li>
        <li>Cloisonnement des données</li>
        <li>Mesures de traçabilité</li>
        <li>Surveillance</li>
        <li>Protection contre les virus, malwares et logiciels espions</li>
        <li>Protection des réseaux</li>
        <li>Sauvegarde</li>
        <li>Mesures restrictives limitant l’accès physiques aux données à caractère personnel</li>
      </ul>
    </p>
    <h2>Qui nous aide à traiter les données ?</h2>
    <p>
      Certaines des données sont envoyées à d’autres acteurs, appelés “sous-traitants de données”, pour qu’ils nous aident à les manipuler.
      Nous nous assurons qu’ils respectent strictement le RGPD et qu’ils apportent des garanties suffisantes en matière de
      sécurité.
      <div class="fr-table">
        <table>
          <thead>
          <tr>
            <th scope="col">Partenaire</th>
            <th scope="col">Pays destinataire</th>
            <th scope="col">Traitement réalisé</th>
            <th scope="col">Garanties</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Scalingo</td>
            <td>France</td>
            <td>Hébergement du site</td>
            <td><a href="https://scalingo.com/fr/contrat-gestion-traitements-donnees-personnelles" target="_blank" rel="external">https://scalingo.com/fr/contrat-gestion-traitements-donnees-personnelles</a>
            </td>
          </tr>
          <tr>
            <td>Brevo</td>
            <td>France</td>
            <td>Envoi des lettres d'information aux utilisateurs</td>
            <td><a href="https://www.brevo.com/fr/legal/privacypolicy/" target="_blank" rel="external">https://www.brevo.com/fr/legal/privacypolicy/</a>
            </td>
          </tr>
          <tr>
            <td>Tally</td>
            <td>Belgique</td>
            <td>Formulaire de retours utilisateurs</td>
            <td><a href="https://tally.so/help/privacy-policy" target="_blank" rel="external">https://tally.so/help/privacy-policy</a></td>
          </tr>
          </tbody>
        </table>
      </div>
    </p>
  </div>
</template>