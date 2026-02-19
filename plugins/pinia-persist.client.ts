import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin(({ $pinia }) => {
  const config = useRuntimeConfig()
  // Skip localStorage when Supabase is configured – Supabase is the source of truth
  if (config.public.supabase?.url) return
  $pinia.use(piniaPluginPersistedstate)
})
