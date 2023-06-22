import {
  DsfrFooter,
  DsfrHeader,
  DsfrBreadcrumb,
  DsfrSearchBar,
  DsfrAccordionsGroup,
  DsfrAccordion,
  DsfrCard,
  DsfrTag,
  DsfrTabs,
  DsfrTabContent,
  DsfrNotice,
  DsfrModal,
  DsfrBadge,
  DsfrButton,
  DsfrCallout,
} from '@gouvminint/vue-dsfr'
import {
  EauArrosoir, EauGoutteArrosoir, EauGoutteDouche, EauGoutteFuite, EauGoutteMachine,
  EauGoutteRobinet, EauGoutteVoiture,
  EauMaison,
  EauPiscine,
  EauRemplissage,
  EauSoleil,
  EauTuyau
} from "../assets/icons";
import { addIcons, OhVueIcon } from 'oh-vue-icons';
import {
  RiArrowRightLine,
  RiCheckboxCircleLine, RiDownload2Line,
  RiInformationFill, RiInformationLine,
  RiMapPinUserLine,
  RiSearchLine,
  RiTimerLine
} from 'oh-vue-icons/icons/ri/index.js';

const icons = [
  EauMaison,
  EauSoleil,
  RiArrowRightLine,
  RiTimerLine,
  RiMapPinUserLine,
  RiSearchLine,
  RiInformationFill,
  RiInformationLine,
  RiCheckboxCircleLine,
  RiDownload2Line,
  EauArrosoir,
  EauPiscine,
  EauTuyau,
  EauRemplissage,
  EauGoutteRobinet,
  EauGoutteDouche,
  EauGoutteMachine,
  EauGoutteFuite,
  EauGoutteArrosoir,
  EauGoutteVoiture,
]

export default defineNuxtPlugin((nuxtApp) => {
  // Ajout des composants un par un pour alléger l'application
  nuxtApp.vueApp.component('DsfrHeader', DsfrHeader);
  nuxtApp.vueApp.component('DsfrFooter', DsfrFooter);
  nuxtApp.vueApp.component('DsfrBreadcrumb', DsfrBreadcrumb);
  nuxtApp.vueApp.component('DsfrSearchBar', DsfrSearchBar);
  nuxtApp.vueApp.component('DsfrAccordionsGroup', DsfrAccordionsGroup);
  nuxtApp.vueApp.component('DsfrAccordion', DsfrAccordion);
  nuxtApp.vueApp.component('DsfrCard', DsfrCard);
  nuxtApp.vueApp.component('DsfrTag', DsfrTag);
  nuxtApp.vueApp.component('DsfrTabs', DsfrTabs);
  nuxtApp.vueApp.component('DsfrTabContent', DsfrTabContent);
  nuxtApp.vueApp.component('DsfrNotice', DsfrNotice);
  nuxtApp.vueApp.component('DsfrModal', DsfrModal);
  nuxtApp.vueApp.component('DsfrBadge', DsfrBadge);
  nuxtApp.vueApp.component('DsfrButton', DsfrButton);
  nuxtApp.vueApp.component('DsfrCallout', DsfrCallout);
  addIcons(...icons);
  nuxtApp.vueApp.component('VIcon', OhVueIcon);
})
