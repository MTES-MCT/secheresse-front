import { defineNuxtConfig } from 'nuxt/config'
import istanbul from "vite-plugin-istanbul";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  app: {
    head: {
      title: 'Sécheresse',
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {hid: 'descriptionn', name: 'description', content: 'Sécheresse'},
        {name: 'format-detection', content: 'telephone=no'}
      ],
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
      ],
      htmlAttrs: {
        lang: 'fr'
      }
    }
  },
  css: [
    '@gouvfr/dsfr/dist/dsfr.min.css',
    '@gouvfr/dsfr/dist/utility/icons/icons.min.css',
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
        exclude: ['node_modules', 'test/', 'coverage/'],
        extension: [ '.js', '.ts', '.vue' ],
        cypress: true
      }),
    ]
  },
})
