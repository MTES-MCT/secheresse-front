import { defineNuxtConfig } from 'nuxt/config'
import istanbul from "vite-plugin-istanbul";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    '/situation/adresse': {ssr: false},
    '/': {ssr: false}
  },
  app: {
    head: {
      title: `Préservons l'eau`,
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {
          name: 'description',
          content: `Avec ${process.env.DOMAIN_NAME}, nous vous permettons de rester informé sur votre situation locale tout en vous partageant les conseils les plus appropriés.`
        },
        {name: 'format-detection', content: 'telephone=no'},
        {property: 'og:title', content: `Préservons l'eau`},
        {
          property: 'og:description',
          content: `Avec ${process.env.DOMAIN_NAME}, nous vous permettons de rester informé sur votre situation locale tout en vous partageant les conseils les plus appropriés.`
        },
        {property: 'og:type', content: 'website'},
        {property: 'og:url', content: `https://${process.env.DOMAIN_NAME}`},
        {property: 'og:locale', content: 'fr_FR'},
        {property: 'og:image', content: `https://${process.env.DOMAIN_NAME}/favicon.svg`},
      ],
      link: [
        {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'}
      ],
      htmlAttrs: {
        lang: 'fr'
      }
    }
  },
  css: [
    '@gouvfr/dsfr/dist/dsfr.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons-map/icons-map.min.css',
    '@gouvminint/vue-dsfr/styles',
    'assets/main.scss',
  ],
  ignore: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.cy.*',
  ],
  srcDir: 'client/',
  imports: {
    autoImport: true
  },
  modules: [
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    process.env.APP_ENV !== 'local' ? '@nuxtjs/robots' : '',
    'nuxt-simple-sitemap',
    // [
    //   '@nuxtjs/i18n',
    //   {
    //     vueI18n: './i18n.config.ts'
    //   }
    // ]
  ],
  runtimeConfig: {
    public: {
      apiAdresseUrl: process.env.API_ADRESSE_URL,
      apiGeoUrl: process.env.API_GEO_URL,
      apiSecheresseUrl: process.env.API_SECHERESSE_URL,
      domainName: process.env.DOMAIN_NAME
    }
  },
  vite: {
    build: {
      target: 'es2019'
    },
    plugins: [
      istanbul({
        include: 'client/*',
        exclude: ['node_modules', 'test/'],
        extension: ['.js', '.ts', '.vue'],
        requireEnv: false
      }),
    ]
  },
  //@ts-ignore
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: `Préservons l'eau`,
      short_name: `Préservons l'eau`,
      description: `Avec preservonsleau.gouv.fr, nous vous permettons de rester informé sur votre situation locale tout en vous partageant les conseils les plus appropriés.`,
      theme_color: '#ffffff',
      background_color: '#ffffff',
      lang: "fr",
      start_url: "./?utm_source=web_app_manifest",
      icons: [
        {
          src: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any maskable"
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      cleanupOutdatedCaches: true,
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      importScripts: ['/inject-sw.js']
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
      type: 'module',
    },
  },
  robots: {
    rules: {
      UserAgent: '*',
      Disallow: process.env.APP_ENV === 'prod' ? '' : '/'
    }
  },
  sitemap: {
    siteUrl: `https://${process.env.DOMAIN_NAME}`,
  },
})
