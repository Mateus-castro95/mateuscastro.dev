// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@tresjs/nuxt'],
  css: ['~/assets/css/main.css'],
  tres: {
    glsl: true,
  }
})