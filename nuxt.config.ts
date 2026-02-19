export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@nuxtjs/supabase', '@pinia/nuxt', '@nuxtjs/tailwindcss'],
  supabase: {
    redirect: false,
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  app: {
    head: {
      title: 'SKSS Woolwich FPL',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
