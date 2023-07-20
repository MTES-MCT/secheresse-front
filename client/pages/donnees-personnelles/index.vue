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
    <h1>Gestion des données personnelles</h1>
    <h2>Responsables de traitement</h2>
    <p>
      La Fabrique Numérique du Ministère de la Transition écologique et solidaire et du Ministère de la Cohésion des territoires et des
      Relations avec les collectivités territoriales est la responsable du traitement de vos données à caractère personnel.<br/><br/>

      Les coordonnées de la Fabrique Numérique du Ministère de la Transition écologique et solidaire et du Ministère de la Cohésion des
      territoires et des Relations avec les collectivités territoriales sont: Grande Arche de la Défense, 92055 La Défense CEDEX
    </p>
    <h2>Destinataires et sous-traitants</h2>
    <p>
      La Direction interministérielle du numérique (DINUM) assure, pour le compte de la DGS et de la DGPR, la supervision de l’équipe
      produit (produit «{{ appName }}» conçu selon l'approche Startup d’Etat dans le cadre du programme beta.gouv.fr) qui gère et déploie
      le
      service.<br/><br/>

      Les sociétés Scalingo (hébergeur), Brevo et Tally interviennent également en tant que sous-traitants. {{ appName }} s’est
      assurée de la mise en œuvre par ses sous-traitants de garanties adéquates et du respect de conditions strictes de confidentialité,
      d’usage et de protection des données.
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
    <h2>Données collectées</h2>
    <p>
      Les données personnelles traitées sont:
      <ul>
        <li>
          Identification: adresse mail, commune de résidence
        </li>
        <li>
          Inscription à la lettre d'information
        </li>
        <li>
          Inscription aux notifications de changement d'état d'alerte
        </li>
      </ul>

      A noter: les données sont collectées sur un mode binaire (case cochée ou non) et non détaillées selon la personne. Aucun justificatif
      n’est collecté ni stocké sur la plateforme.<br/><br/>

      Les données collectées lors de l’inscription sont utilisées exclusivement pour envoyer les informations souhaitées par l'utilisateur.
    </p>
    <h2>Base légale du traitement</h2>
    <p>
      La base légale du traitement est l'exercice d'une mission d'intérêt public, fondée sur:
      <ul>
        <li>
          l’article 7 de la Charte de l’environnement, inscrite dans la Constitution, qui dispose que toute personne a le droit, dans les
          conditions et les limites définies par la loi, d'accéder aux informations relatives à l'environnement détenues par les autorités
          publiques.
        </li>
      </ul>
    </p>
    <h2>Finalité du traitement</h2>
    <p>
      La finalité du traitement de données réalisé par VigiEau est de transmettre des informations et recommandations aux utilisateurs pour
      les aider à mieux comprendre les épisodes de sécheresses et à appliquer les mesures nécessaires.
    </p>
    <h2>Durée de conservation des données</h2>
    <p>
      Les données collectées sont supprimées dès lors que l'utilisateur se désinscrit de la lettre d'information.
    </p>
    <h2>Sécurité et confidentialité</h2>
    <p>
      Les données personnelles sont traitées dans des conditions sécurisées, selon les moyens actuels de la technique, dans le respect des
      dispositions relatives à la protection de la vie privée et notamment au référentiel général de sécurité, prévu à l’article 9 de
      l’ordonnance 2005-1516 du 8 décembre 2005 relative aux échanges électroniques entre les usagers et les autorités administratives et
      entre les autorités administratives.<br/><br/>
    </p>
    <h2>Droits des personnes</h2>
    <p>
      Vous disposez des droits suivants concernant vos données à caractère personnel:
      <ul>
        <li>
          Droit d’information, d’accès et de communication des données;
        </li>
        <li>
          Droit à la limitation;
        </li>
        <li>
          Droit de rectification des données;
        </li>
        <li>
          Droit d'opposition.
        </li>
      </ul>
      Pour toute demande, vous pouvez écrire un email à l’équipe {{ appName }}: {{ email }}<br/><br/>

      Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés ou que le traitement n’est pas conforme à la
      réglementation sur la protection des données à caractère personnel, vous pouvez adresser une réclamation à la CNIL: <a
      href="https://www.cnil.fr"
      target="_blank" rel="external">https://www.cnil.fr</a>.
    </p>
  </div>
</template>