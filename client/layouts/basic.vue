<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'
import { Profile } from "../dto/profile.enum";
import { useAddressStore } from "../store/address";
import { storeToRefs } from "pinia";

const adressStore = useAddressStore();
const {setProfile} = adressStore;
const {profile} = storeToRefs(adressStore);
const route = useRoute();

const logoText: string[] = ['Gouvernement']
const operatorImgSrc: string = '/logo_vigie_eau.svg'
const operatorImgAlt: string = `Logo du produit ${useRuntimeConfig().public.appName}`
const operatorImgStyle: any = {
  'max-width': '150px'
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
const showNav = ref(true);
const navItems = ref([]);
const key = ref(0);

const preferences = reactive({
  theme: undefined,
  scheme: undefined,
})
const runTimeConfig = useRuntimeConfig().public;

const generateNavItems = () => {
  navItems.value = [];
  for (let profile in Profile) {
    navItems.value.push({
      text: Profile[profile],
      to: {path: '/', query: {profil: profile}},
      class: {'router-link-active-overwrite': route.href === `/?profil=${profile}`}
    })
  }
}

onMounted(() => {
  const {theme, scheme, setScheme} = useScheme()
  // preferences.scheme = 'dark';
  preferences.scheme = 'light';

  window.onscroll = function () {
    isStickyHeader()
  };
  let nav = document.getElementsByTagName('nav')[0];
  const sticky = nav.offsetTop;

  const isStickyHeader = () => {
    const header = document.getElementsByClassName('fr-nav__sticky')[0];
    if(!header) {
      return;
    }
    if (window.scrollY > sticky) {
      header.classList.add('visible');
    } else {
      header.classList.remove('visible');
    }
  }

  watchEffect(() => {
    preferences.theme = theme.value
  })

  watchEffect(() => setScheme(preferences.scheme))

  watch(() => route.path, newPath => {
      quickLinks = newPath === '/situation' ? [{
        label: 'Effectuer une nouvelle recherche',
        icon: 'ri-search-line',
        to: '/'
      }, {
        label: 'Donner mon avis',
        icon: 'ri-survey-line',
        button: true,
        onclick: utils.openTally
      }] : [];
      showNav.value = newPath === '/';
      key.value++;
    }, {immediate: true}
  );
  watch(() => route.query.profil, profileQuery => {
      generateNavItems();
      key.value++;
      setProfile(profileQuery && Object.keys(Profile).includes(profileQuery) ? profileQuery : profile.value);
    }, {immediate: true}
  );
})
</script>

<template>
  <DsfrHeader :logo-text="logoText"
              :operatorImgSrc="operatorImgSrc"
              :operatorImgAlt="operatorImgAlt"
              :operatorImgStyle="operatorImgStyle"
              :quickLinks="quickLinks"
              :key="key"
              :show-beta="runTimeConfig.domainName !== 'vigieau.gouv.fr' || runTimeConfig.domainProdNotActivated === 'true'"
              serviceTitle=" ">
    <DsfrNavigation v-if="showNav"
                    :nav-items="navItems"/>
  </DsfrHeader>
  <div v-if="showNav"
       class="fr-header fr-nav__sticky">
    <DsfrNavigation class="fr-container"
                    :nav-items="navItems"/>
  </div>
  <div class="fr-container fr-mb-8w">
<!--    <DsfrAlert description="Les données affichées sur Vigieau datent du 5 février 2024. Certaines informations peuvent ne pas être à jour."-->
<!--               type="warning"-->
<!--               class="fr-my-2w"-->
<!--               :closeable="false"-->
<!--    />-->
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
.fr-nav {
  .fr-nav__link[aria-current] {
    color: inherit;

    &:before {
      display: none;
    }
  }

  .fr-nav__link.router-link-active-overwrite {
    color: var(--text-active-blue-france);

    &:before {
      display: initial;
    }
  }

  &__sticky {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: var(--grey-1000-50);
    display: none;
    
    &.visible {
      display: block;
    }
  }
  
  &__list {
    justify-content: center;
  }
}

@media (max-width: 991px) {
  .fr-nav__sticky {
    display: none !important;
  }
}
</style>
