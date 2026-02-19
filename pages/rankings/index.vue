<template>
  <div>
    <h1 class="mb-8 text-3xl font-bold text-white">Yearly Rankings</h1>
    <div class="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="border-b border-slate-700 bg-slate-800/50">
            <th class="px-6 py-4 text-left font-medium text-slate-300">Rank</th>
            <th class="px-6 py-4 text-left font-medium text-slate-300">Player</th>
            <th class="px-6 py-4 text-right font-medium text-slate-300">Total Points</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(p, i) in rankings"
            :key="p.playerId"
            class="border-b border-slate-800 transition hover:bg-slate-800/30"
          >
            <td class="px-6 py-4">
              <span
                class="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                :class="
                  p.rank === 1
                    ? 'bg-amber-500/30 text-amber-400'
                    : p.rank <= 3
                      ? 'bg-slate-600 text-slate-200'
                      : 'bg-slate-700/50 text-slate-400'
                "
              >
                {{ p.rank }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <PlayerAvatar :avatar-url="p.player?.avatarUrl" :name="p.name" size="md" />
                <span class="font-medium text-white">{{ p.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-right font-mono text-amber-400">{{ p.points }} pts</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!rankings.length" class="py-12 text-center text-slate-500">
      No rankings yet. Add weekly performance in Admin to build the leaderboard.
    </p>
  </div>
</template>

<script setup lang="ts">
const playersStore = usePlayersStore()
const weeklyStore = useWeeklyPointsStore()

const getPlayer = (id: string) => playersStore.getPlayer(id)
const rankings = computed(() =>
  weeklyStore.yearlyRanking((id) => getPlayer(id)?.name ?? 'Unknown').map((r) => ({
    ...r,
    player: getPlayer(r.playerId),
  }))
)
</script>
