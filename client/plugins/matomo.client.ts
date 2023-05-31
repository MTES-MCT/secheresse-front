import VueMatomo from 'vue-matomo';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMatomo, {
    host: 'https://stats.data.gouv.fr',
    siteId: 285,
    // Enables automatically registering pageviews on the router
    router: nuxtApp.$router,
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    disableCookies: true,
    requireCookieConsent: false,
  })
})