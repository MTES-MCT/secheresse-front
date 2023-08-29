import VueDsfr from '@gouvminint/vue-dsfr'
import {
  EauArrosoir,
  EauGoutteAbreuvementInterdiction,
  EauGoutteArrosoir,
  EauGoutteArrosoirInterdiction,
  EauGoutteCanauxInterdiction,
  EauGoutteDouche,
  EauGoutteFontaineInterdiction,
  EauGoutteFuite,
  EauGoutteMachine,
  EauGoutteNavigationInterdiction,
  EauGoutteNettoyageInterdiction,
  EauGouttePiscineInterdiction,
  EauGoutteRemplissageInterdiction,
  EauGoutteRobinet,
  EauGoutteRobinetInterdiction,
  EauGoutteTravauxInterdiction,
  EauGoutteVoiture,
  EauMaison,
  EauPiscine,
  EauRemplissage,
  EauSoleil,
  EauTuyau
} from "../assets/icons";
import { addIcons, OhVueIcon } from 'oh-vue-icons';
import {
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiDownload2Line,
  RiInformationFill,
  RiInformationLine,
  RiMapPinUserLine,
  RiQuestionLine,
  RiSearchLine,
  RiSurveyLine,
  RiTimerLine,
  RiMailLine
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
  RiQuestionLine,
  RiSurveyLine,
  RiMapPinUserLine,
  RiMailLine,
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
  EauGoutteArrosoirInterdiction,
  EauGoutteNettoyageInterdiction,
  EauGoutteRemplissageInterdiction,
  EauGoutteRobinetInterdiction,
  EauGoutteFontaineInterdiction,
  EauGoutteTravauxInterdiction,
  EauGoutteAbreuvementInterdiction,
  EauGoutteNavigationInterdiction,
  EauGoutteCanauxInterdiction,
  EauGouttePiscineInterdiction
]

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDsfr);
  addIcons(...icons);
  nuxtApp.vueApp.component('VIcon', OhVueIcon);
})
