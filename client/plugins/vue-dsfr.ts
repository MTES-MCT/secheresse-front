import VueDsfr from '@gouvminint/vue-dsfr';
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
  EauTuyau,
} from '../assets/icons';
import { addIcon, listIcons } from '@iconify/vue';

const icons = [
  EauMaison,
  EauSoleil,
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
  EauGouttePiscineInterdiction,
];

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDsfr);
  icons.forEach(i => {
    addIcon(`vigieau:${i.name}`, {
      body: i.raw,
      width: i.width,
      height: i.height,
    });
  });
  console.log(listIcons());
});
