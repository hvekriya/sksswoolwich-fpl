<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <nav class="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight text-amber-400">
          SKSS Woolwich FPL
        </NuxtLink>
        <div class="flex items-center gap-6">
          <span class="text-sm text-amber-400">Admin</span>
          <NuxtLink to="/admin" class="text-slate-300 transition hover:text-white" active-class="text-amber-400">
            Weekly Points
          </NuxtLink>
          <NuxtLink to="/admin/weeks" class="text-slate-300 transition hover:text-white" active-class="text-amber-400">
            Manage Weeks
          </NuxtLink>
          <button
            class="text-slate-400 transition hover:text-white"
            @click="signOut"
          >
            Sign out
          </button>
          <NuxtLink to="/" class="text-slate-400 transition hover:text-white">
            ← Back
          </NuxtLink>
        </div>
      </div>
    </nav>
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()

async function signOut() {
  await supabase.auth.signOut()
  await navigateTo('/')
}
</script>
