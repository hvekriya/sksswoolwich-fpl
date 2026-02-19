<template>
  <div>
    <h1 class="mb-8 text-3xl font-bold text-white">Weekly Performance</h1>
    <div class="mb-6">
      <label class="mb-2 block text-sm text-slate-400">Select week</label>
      <select
        v-model="selectedWeekId"
        class="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
      >
        <option value="">All weeks</option>
        <option v-for="w in weeklyStore.allWeeks" :key="w.id" :value="w.id">
          {{ w.label }} ({{ formatDate(w.date) }})
        </option>
      </select>
    </div>
    <div v-if="weekPerformances.length" class="space-y-6">
      <div
        v-for="week in displayWeeks"
        :key="week.id"
        class="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden"
      >
        <h2 class="border-b border-slate-800 bg-slate-800/50 px-6 py-3 font-medium text-white">
          {{ week.label }} — {{ formatDate(week.date) }}
        </h2>
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-700">
              <th class="px-6 py-3 text-left text-sm font-medium text-slate-400">Player</th>
              <th class="px-6 py-3 text-center text-sm font-medium text-slate-400">Goals</th>
              <th class="px-6 py-3 text-center text-sm font-medium text-slate-400">Assists</th>
              <th class="px-6 py-3 text-center text-sm font-medium text-slate-400">Saves</th>
              <th class="px-6 py-3 text-center text-sm font-medium text-slate-400">MVP</th>
              <th class="px-6 py-3 text-right text-sm font-medium text-slate-400">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in week.performances"
              :key="p.playerId"
              class="border-b border-slate-800/50 transition hover:bg-slate-800/20"
            >
              <td class="px-6 py-3 font-medium text-white">
                {{ getPlayerName(p.playerId) }}
              </td>
              <td class="px-6 py-3 text-center text-slate-300">{{ p.goals }}</td>
              <td class="px-6 py-3 text-center text-slate-300">{{ p.assists }}</td>
              <td class="px-6 py-3 text-center text-slate-300">{{ p.saves }}</td>
              <td class="px-6 py-3 text-center">
                <span v-if="p.isMvp" class="text-amber-400">★</span>
                <span v-else class="text-slate-600">—</span>
              </td>
              <td class="px-6 py-3 text-right font-mono text-amber-400">
                {{ weeklyStore.getPointsForPerformance(p) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p v-else class="py-12 text-center text-slate-500">
      No weekly data yet. Add performance in Admin.
    </p>
  </div>
</template>

<script setup lang="ts">
const playersStore = usePlayersStore()
const weeklyStore = useWeeklyPointsStore()
const selectedWeekId = ref('')

function getPlayerName(id: string) {
  return playersStore.getPlayer(id)?.name ?? 'Unknown'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

const weekPerformances = computed(() => weeklyStore.weeks)

const displayWeeks = computed(() => {
  if (selectedWeekId.value) {
    const w = weeklyStore.getWeek(selectedWeekId.value)
    return w ? [w] : []
  }
  return weeklyStore.allWeeks
})
</script>
