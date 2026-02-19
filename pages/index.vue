<template>
  <div>
    <div class="mb-12 text-center">
      <h1 class="mb-2 text-4xl font-bold tracking-tight text-white">
        SKSS Woolwich FPL
      </h1>
      <p class="text-lg text-slate-400">Fantasy football for the squad</p>
    </div>
    <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      <NuxtLink
        to="/players"
        class="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-amber-500/50 hover:bg-slate-900"
      >
        <div class="mb-3 text-3xl">⚽</div>
        <h2 class="mb-1 font-semibold text-white group-hover:text-amber-400">Players</h2>
        <p class="text-sm text-slate-400">View and manage squad players</p>
      </NuxtLink>
      <NuxtLink
        to="/team"
        class="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-amber-500/50 hover:bg-slate-900"
      >
        <div class="mb-3 text-3xl">🏆</div>
        <h2 class="mb-1 font-semibold text-white group-hover:text-amber-400">FPL Team</h2>
        <p class="text-sm text-slate-400">Your fantasy team lineup</p>
      </NuxtLink>
      <NuxtLink
        to="/rankings"
        class="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-amber-500/50 hover:bg-slate-900"
      >
        <div class="mb-3 text-3xl">📊</div>
        <h2 class="mb-1 font-semibold text-white group-hover:text-amber-400">Rankings</h2>
        <p class="text-sm text-slate-400">Yearly leaderboard</p>
      </NuxtLink>
      <NuxtLink
        to="/performance"
        class="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-amber-500/50 hover:bg-slate-900"
      >
        <div class="mb-3 text-3xl">📈</div>
        <h2 class="mb-1 font-semibold text-white group-hover:text-amber-400">Weekly Performance</h2>
        <p class="text-sm text-slate-400">Player stats by week</p>
      </NuxtLink>
    </div>
    <div v-if="topPlayers.length" class="mt-16">
      <h2 class="mb-4 text-xl font-semibold text-white">Current Top 5</h2>
      <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <ol class="space-y-2">
          <li
            v-for="(p, i) in topPlayers"
            :key="p.playerId"
            class="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-3"
          >
            <span class="flex items-center gap-3">
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                :class="i === 0 ? 'bg-amber-500/30 text-amber-400' : 'bg-slate-700 text-slate-300'"
              >
                {{ p.rank }}
              </span>
              {{ p.name }}
            </span>
            <span class="font-mono text-amber-400">{{ p.points }} pts</span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const playersStore = usePlayersStore()
const weeklyStore = useWeeklyPointsStore()

const getPlayerName = (id: string) => playersStore.getPlayer(id)?.name ?? 'Unknown'
const topPlayers = computed(() =>
  weeklyStore.yearlyRanking(getPlayerName).slice(0, 5)
)
</script>
