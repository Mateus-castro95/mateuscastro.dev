// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@tresjs/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Mateus Castro | Full Stack Developer',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  tres: {
    glsl: true,
  }
})