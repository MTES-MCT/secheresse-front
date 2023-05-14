import { defineNuxtConfig } from 'nuxt/config'
import istanbul from "vite-plugin-istanbul";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      title: 'Eau sécheresse',
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {hid: 'descriptionn', name: 'description', content: 'Eau sécheresse'},
        {name: 'format-detection', content: 'telephone=no'}
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
    // '@gouvfr/dsfr/dist/utility/icons/icons.min.css',
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
    '@vite-pwa/nuxt'
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
      name: 'Eau sécheresse',
      short_name: 'EauSecheresse',
      description: 'Eau sécheresse',
      theme_color: '#ffffff',
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
      navigateFallback: '/index.html',
      cleanupOutdatedCaches: true,
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
