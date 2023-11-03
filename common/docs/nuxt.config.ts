// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    'nuxt-quasar-ui',
    '@pinia/nuxt',
    'nuxt-simple-sitemap',
  ],
  devtools: { enabled: true },
  extends: '@nuxt-themes/docus',
  typescript: {
    tsConfig: {
      compilerOptions: {
        verbatimModuleSyntax: false
      }
    }
  },
  // app: {
  //   head: {
  //     link: [
  //       { rel: "icon", type: "image/png", href: "/favicon.ico" }
  //     ]
  // }
})
