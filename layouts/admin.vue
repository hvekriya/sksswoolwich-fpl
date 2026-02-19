<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <nav class="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <NuxtLink to="/" class="text-xl font-bold tracking-tight text-amber-400">
            SKSS Woolwich FPL
          </NuxtLink>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Toggle menu"
            @click="open = !open"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!open"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div class="hidden items-center gap-4 sm:gap-6 md:flex">
          <NuxtLink
            to="/admin"
            class="rounded bg-amber-500/20 px-3 py-1 text-amber-400 transition hover:bg-amber-500/30"
            active-class="!bg-amber-500/30"
          >
            Admin
          </NuxtLink>
          <NuxtLink to="/" class="text-slate-300 transition hover:text-white" active-class="text-amber-400">
            Home
          </NuxtLink>
          <NuxtLink to="/players" class="text-slate-300 transition hover:text-white" active-class="text-amber-400">
            Players
          </NuxtLink>
          <NuxtLink to="/admin/weeks" class="text-slate-300 transition hover:text-white" active-class="text-amber-400">
            Manage Weeks
          </NuxtLink>
          <NuxtLink to="/admin" class="text-slate-300 transition hover:text-white" active-class="text-amber-400">
            Weekly Points
          </NuxtLink>
          <button
            class="text-slate-400 transition hover:text-white"
            @click="signOut"
          >
            Sign out
          </button>
          </div>
        </div>
        <div
          v-show="open"
          class="border-t border-slate-800 py-3 md:hidden"
        >
          <div class="flex flex-col gap-1">
            <NuxtLink
              to="/admin"
              class="rounded px-3 py-2 text-amber-400 hover:bg-slate-800"
              active-class="bg-amber-500/20"
              @click="open = false"
            >
              Admin
            </NuxtLink>
            <NuxtLink
              to="/"
              class="rounded px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              active-class="text-amber-400"
              @click="open = false"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/players"
              class="rounded px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              active-class="text-amber-400"
              @click="open = false"
            >
              Players
            </NuxtLink>
            <NuxtLink
              to="/admin/weeks"
              class="rounded px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              active-class="text-amber-400"
              @click="open = false"
            >
              Manage Weeks
            </NuxtLink>
            <NuxtLink
              to="/admin"
              class="rounded px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white"
              active-class="text-amber-400"
              @click="open = false"
            >
              Weekly Points
            </NuxtLink>
            <button
              class="rounded px-3 py-2 text-left text-slate-400 hover:bg-slate-800 hover:text-white"
              @click="signOut"
            >
              Sign out
            </button>
          </div>
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
const open = ref(false)

async function signOut() {
  await supabase.auth.signOut()
  await navigateTo('/')
}
</script>
