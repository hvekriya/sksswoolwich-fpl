<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <nav class="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="text-xl font-bold tracking-tight text-amber-400">
          SKSS Woolwich FPL
        </NuxtLink>
        <div class="flex gap-6">
          <NuxtLink
            to="/"
            class="text-slate-300 transition hover:text-white"
            active-class="text-amber-400"
          >
            Home
          </NuxtLink>
          <NuxtLink
            to="/players"
            class="text-slate-300 transition hover:text-white"
            active-class="text-amber-400"
          >
            Players
          </NuxtLink>
          <NuxtLink
            to="/team"
            class="text-slate-300 transition hover:text-white"
            active-class="text-amber-400"
          >
            FPL Team
          </NuxtLink>
          <NuxtLink
            to="/rankings"
            class="text-slate-300 transition hover:text-white"
            active-class="text-amber-400"
          >
            Rankings
          </NuxtLink>
          <NuxtLink
            to="/admin"
            class="rounded bg-amber-500/20 px-3 py-1 text-amber-400 transition hover:bg-amber-500/30"
          >
            Admin
          </NuxtLink>
        </div>
      </div>
    </nav>
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
