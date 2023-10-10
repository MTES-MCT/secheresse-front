<script setup lang="ts">
import { Ref } from "vue";

definePageMeta({
  layout: 'basic',
})

const appName = useRuntimeConfig().public.appName;
useHead({
  title: `Cookies - ${useRuntimeConfig().public.appName}`
})

const links: Ref<any[]> = ref([{"to": "/", "text": "Accueil"}, {"text": "Cookies"}])
</script>

<template>
  <DsfrBreadcrumb :links='links'/>
  <div>
    <h1>Cookies et mesure d'audience</h1>
    <h2>Cookies</h2>
    <p>{{ appName }} dépose un petit fichier texte (un « cookie ») sur votre ordinateur lorsque vous le consultez. Cela nous permet de
      mesurer le nombre de visites et de comprendre quelles sont les pages les plus consultées.<br/><br/>

      Nous n'affichons pas de banière de consentement aux cookies car nos outils de suivi d'audience sont correctement configurés pour
      respecter la vie privée des utilisateurs. Certains cookies sont dispensés du recueil préalable de votre consentement dans la mesure où
      ils sont strictement nécessaires à la fourniture du service. Les traceurs ont vocation à être conservés sur le poste informatique de
      l'internaute pour une durée allant jusqu'à 13 mois.</p>
    <h2>Mesure d'audience</h2>
    <p>
      Certains cookies permettent d’établir des mesures statistiques de fréquentation et d’utilisation du site pouvant être utilisées à des
      fins de suivi et d’amélioration du service:
      <ul>
        <li>
          Les données collectées ne sont pas recoupées avec d’autres traitements.
        </li>
        <li>
          Le cookie déposé sert uniquement à la production de statistiques anonymes.
        </li>
        <li>
          Le cookie ne permet pas de suivre la navigation de l’internaute sur d’autres sites.
        </li>
      </ul>
      La mesure d’audience (nombre de visites, pages consultées) est réalisée via un outil libre intitulé <a href="https://matomo.org/"
                                                                                                             target="_blank" rel="external">Matomo</a>
      spécifiquement paramétré,
      respectant les conditions d’exemption du consentement de l’internaute définies par la recommandation « Cookies » de la Commission
      nationale informatique et libertés (CNIL). Cela signifie que votre adresse IP, par exemple, est anonymisée avant d’être enregistrée.
      Il est donc impossible d’associer les visites sur ce site à une personne.
    </p>
  </div>
</template>