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
        v-if="user"
        to="/players"
        class="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-amber-500/50 hover:bg-slate-900"
      >
        <div class="mb-3 text-3xl">⚽</div>
        <h2 class="mb-1 font-semibold text-white group-hover:text-amber-400">Players</h2>
        <p class="text-sm text-slate-400">View and manage squad players</p>
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
          <NuxtLink
            v-for="(p, i) in topPlayers"
            :key="p.playerId"
            :to="`/players/${p.playerId}`"
            class="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-3 transition hover:bg-slate-800"
          >
            <span class="flex items-center gap-3">
              <span
                class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-slate-300"
              >
                {{ p.rank }}
              </span>
              <PlayerAvatar :avatar-url="p.player?.avatarUrl" :name="p.name" size="sm" />
              {{ p.name }}
              <AnimatedEmoji v-if="i === 0" type="fire" :size="22" />
              <AnimatedEmoji v-else-if="i === 1" type="cold" :size="22" />
              <AnimatedEmoji v-else-if="i === 2" type="love" :size="22" />
            </span>
            <span class="font-mono text-amber-400">{{ p.points }} pts</span>
          </NuxtLink>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const user = useSupabaseUser()

watch(
  user,
  (u) => {
    setPageLayout(u ? 'admin' : 'default')
  },
  { immediate: true }
)
const playersStore = usePlayersStore()
const weeklyStore = useWeeklyPointsStore()

const getPlayer = (id: string) => playersStore.getPlayer(id)
const topPlayers = computed(() =>
  weeklyStore.yearlyRanking((id) => getPlayer(id)?.name ?? 'Unknown').slice(0, 5).map((p) => ({
    ...p,
    player: getPlayer(p.playerId),
  }))
)
</script>
