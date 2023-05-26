import { defineNuxtConfig } from 'nuxt/config'
import istanbul from "vite-plugin-istanbul";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      title: `Préservons l'eau`,
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {name: 'description', content: `Avec preservonsleau.gouv.fr, nous vous permettons de rester informé sur votre situation locale tout en vous partageant les conseils les plus appropriés.`},
        {name: 'format-detection', content: 'telephone=no'}
      ],
      link: [
        {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'}
      ],
      htmlAttrs: {
        lang: 'fr'
      },
      script: [
        {
          src: '/matomo.js'
        }
      ]
    }
  },
  css: [
    '@gouvfr/dsfr/dist/dsfr.min.css',
    // '@gouvfr/dsfr/dist/utility/icons/icons.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons-map/icons-map.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.min.css',
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
    // [
    //   '@nuxtjs/i18n',
    //   {
    //     vueI18n: './i18n.config.ts'
    //   }
    // ]
  ],
  vite: {
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
  }
})
