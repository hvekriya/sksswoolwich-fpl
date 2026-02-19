import {
  syncPlayersFromSupabase,
  syncPlayersToSupabase,
  syncWeeksFromSupabase,
  syncWeeksToSupabase,
} from '~/lib/supabase-sync'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  if (!config.public.supabase?.url) return

  const supabase = useSupabaseClient()

  const pinia = nuxtApp.$pinia
  const playersStore = usePlayersStore(pinia)
  const weeklyStore = useWeeklyPointsStore(pinia)

  // Load from Supabase on startup
  try {
    const [players, weeks] = await Promise.all([
      syncPlayersFromSupabase(supabase),
      syncWeeksFromSupabase(supabase),
    ])
    playersStore.$patch({ players })
    weeklyStore.$patch({ weeks })
  } catch (e) {
    console.warn('Failed to load from Supabase:', e)
  }

  // Persist to Supabase on store changes (debounced)
  let saveTimeout: ReturnType<typeof setTimeout> | null = null
  const scheduleSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(async () => {
      saveTimeout = null
      try {
        await Promise.all([
          syncPlayersToSupabase(supabase, playersStore.players),
          syncWeeksToSupabase(supabase, weeklyStore.weeks),
        ])
      } catch (e) {
        console.warn('Failed to save to Supabase:', e)
      }
    }, 500)
  }

  playersStore.$subscribe(scheduleSave)
  weeklyStore.$subscribe(scheduleSave)
})
