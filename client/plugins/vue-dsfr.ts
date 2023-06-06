import VueDsfr from '@gouvminint/vue-dsfr'
import { EauMaison, EauSoleil, EauSouterraine, EauSurface } from "../assets/icons";

const icons = [
  EauMaison,
  EauSoleil,
  EauSouterraine,
  EauSurface
]

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDsfr, {icons})
})
