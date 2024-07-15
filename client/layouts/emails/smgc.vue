<script setup lang="ts">
const logoText = ['Ministère', 'de la transition', 'écologique', 'et de la cohésion', 'des territoires'];
const operatorImgSrc: string = '/logo_smgc_veolia.png'
const operatorImgAlt: string = `Logo SMGC et Veolia`
const operatorImgStyle: any = {
  'max-width': '400px'
};
const a11yCompliance: string = 'Non conforme';
let quickLinks: any[] = [];
const mandatoryLinks: any[] = [{
  label: `Accessibilité : ${a11yCompliance}`,
  to: '/accessibilite',
}, {
  label: 'Mentions légales',
  to: '/mentions-legales',
}, {
  label: 'Données personnelles',
  to: '/donnees-personnelles',
}, {
  label: 'Cookies',
  to: '/cookies',
}];
const ecosystemLinks: any[] = [
  {
    "label": "beta.gouv.fr",
    "href": "https://beta.gouv.fr"
  },
  {
    "label": "gouvernement.fr",
    "href": "https://gouvernement.fr"
  },
  {
    "label": "data.gouv.fr",
    "href": "https://data.gouv.fr"
  }
];
const key = ref(0);
const runTimeConfig = useRuntimeConfig().public;
</script>

<template>
  <DsfrHeader :logo-text="logoText"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
              :quickLinks="quickLinks"
              :key="key"
              :show-beta="runTimeConfig.domainName !== 'vigieau.gouv.fr' || runTimeConfig.domainProdNotActivated === 'true'"
              :serviceTitle="''"
              serviceDescription="''">
  </DsfrHeader>
  <div class="fr-mb-8w">
    <div class="fr-container" v-if="runTimeConfig.appEnv !== 'prod'">
      <DsfrAlert description="Plateforme de développement, les données sont fictives. Si vous souhaitez accéder à la plateforme de production, allez sur https://vigieau.gouv.fr"
                 type="warning"
                 class="fr-my-2w"
                 :closeable="false"
      />
    </div>
    <slot/>
  </div>
  <DsfrFooter :logo-text="logoText"
              :mandatoryLinks="mandatoryLinks"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
              :ecosystemLinks="ecosystemLinks">
  </DsfrFooter>
</template>

<style lang="scss">
</style>
