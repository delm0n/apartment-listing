// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxt/ui', // ← Добавляем Nuxt UI
  ],



  css: [
    "~/assets/styles/_normalize.scss",
    "~/assets/styles/_fonts.scss",
    "~/assets/styles/main.scss",
    '~/assets/css/main.css'
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/_variables" as *;'
        }
      }
    }
  }
})