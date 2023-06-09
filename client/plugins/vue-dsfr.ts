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
  DsfrStepper,
  DsfrCallout
} from '@gouvminint/vue-dsfr'
import { EauMaison, EauSoleil, EauSouterraine, EauSurface } from "../assets/icons";
import { addIcons, OhVueIcon } from 'oh-vue-icons';
import { RiArrowRightLine } from 'oh-vue-icons/icons/ri/index.js';

const icons = [
  EauMaison,
  EauSoleil,
  EauSouterraine,
  EauSurface,
  RiArrowRightLine
]

export default defineNuxtPlugin((nuxtApp) => {
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
  addIcons(...icons);
  nuxtApp.vueApp.component('VIcon', OhVueIcon);
})
