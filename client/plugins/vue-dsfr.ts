import VueDsfr from '@gouvminint/vue-dsfr'
import { EauMaison, EauSoleil } from "../assets/icons";

const icons = [
  EauMaison,
  EauSoleil
]

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDsfr, {icons})
})
