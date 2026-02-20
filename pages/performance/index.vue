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
        <h2 class="border-b border-slate-800 bg-slate-800/50 px-4 py-3 font-medium text-white md:px-6">
          {{ week.label }} — {{ formatDate(week.date) }}
        </h2>
        <!-- Mobile: cards -->
        <div class="divide-y divide-slate-800 md:hidden">
          <button
            v-for="p in week.performances"
            :key="p.playerId"
            type="button"
            class="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-800/20"
            @click="navigateTo(`/players/${p.playerId}`)"
          >
            <span>
              <span class="font-medium text-white">{{ getPlayerName(p.playerId) }}</span>
              <span class="block text-xs" :class="p.didntPlay ? 'text-rose-400' : 'text-emerald-400'">
                {{ p.didntPlay ? "Didn't play ✗" : 'Played ✓' }}
              </span>
            </span>
            <div class="flex flex-wrap items-center gap-4 text-sm">
              <span><span class="text-slate-500">G</span> {{ p.didntPlay ? '—' : `${p.goals} (${goalPoints(p.playerId, p.goals)} pts)` }}</span>
              <span><span class="text-slate-500">A</span> {{ p.didntPlay ? '—' : `${p.assists} (${assistPoints(p.assists)} pts)` }}</span>
              <span><span class="text-slate-500">S</span> {{ p.didntPlay ? '—' : `${p.saves} (${savePoints(p.saves)} pts)` }}</span>
              <span>
                <AnimatedEmoji v-if="p.isMvp" type="medal" :size="20" />
                <span v-else class="text-slate-600">—</span>
              </span>
              <span :class="p.didntPlay ? 'text-slate-500' : 'font-mono text-amber-400'">
              {{ p.didntPlay ? "Didn't play" : `${weeklyStore.getPointsForPerformance(p)} pts` }}
            </span>
            </div>
          </button>
        </div>
        <!-- Desktop: table -->
        <div class="hidden overflow-x-auto md:block">
          <table class="w-full min-w-[32rem]">
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
                class="cursor-pointer border-b border-slate-800/50 transition hover:bg-slate-800/20"
                @click="navigateTo(`/players/${p.playerId}`)"
              >
                <td class="px-6 py-3 font-medium text-white">
                  {{ getPlayerName(p.playerId) }}
                  <div class="text-xs font-normal" :class="p.didntPlay ? 'text-rose-400' : 'text-emerald-400'">
                    {{ p.didntPlay ? "Didn't play ✗" : 'Played ✓' }}
                  </div>
                </td>
                <td class="px-6 py-3 text-center text-slate-300">{{ p.didntPlay ? '—' : `${p.goals} (${goalPoints(p.playerId, p.goals)} pts)` }}</td>
                <td class="px-6 py-3 text-center text-slate-300">{{ p.didntPlay ? '—' : `${p.assists} (${assistPoints(p.assists)} pts)` }}</td>
                <td class="px-6 py-3 text-center text-slate-300">{{ p.didntPlay ? '—' : `${p.saves} (${savePoints(p.saves)} pts)` }}</td>
                <td class="px-6 py-3 text-center">
                  <AnimatedEmoji v-if="p.isMvp" type="medal" :size="28" />
                  <span v-else class="text-slate-600">—</span>
                </td>
                <td class="px-6 py-3 text-right" :class="p.didntPlay ? 'text-slate-500' : 'font-mono text-amber-400'">
                  {{ p.didntPlay ? "Didn't play" : weeklyStore.getPointsForPerformance(p) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <p v-else class="py-12 text-center text-slate-500">
      No weekly data yet. Add performance in Admin.
    </p>
  </div>
</template>

<script setup lang="ts">
import { POINTS } from '~/stores/weeklyPoints'

const router = useRouter()
const playersStore = usePlayersStore()

function navigateTo(path: string) {
  router.push(path)
}
const weeklyStore = useWeeklyPointsStore()

function getCurrentWeekId() {
  const weeks = weeklyStore.allWeeks
  if (!weeks.length) return ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const current = weeks.find((w) => {
    const wed = new Date(w.date)
    wed.setHours(0, 0, 0, 0)
    const nextTue = new Date(wed)
    nextTue.setDate(nextTue.getDate() + 7)
    return today >= wed && today < nextTue
  })
  if (current) return current.id
  const past = weeks.filter((w) => new Date(w.date) <= today)
  return past.length ? past[past.length - 1].id : weeks[0].id
}

const selectedWeekId = ref(getCurrentWeekId())

watch(
  () => weeklyStore.allWeeks,
  (weeks) => {
    if (weeks.length && !selectedWeekId.value) {
      selectedWeekId.value = getCurrentWeekId()
    }
  },
  { immediate: true }
)

function getPlayerName(id: string) {
  return playersStore.getPlayer(id)?.name ?? 'Unknown'
}

function getPlayerPosition(id: string): keyof typeof POINTS.goalByPosition {
  return (playersStore.getPlayer(id)?.position ?? 'FWD') as keyof typeof POINTS.goalByPosition
}

function goalPoints(playerId: string, goals: number) {
  return goals * POINTS.goalByPosition[getPlayerPosition(playerId)]
}

function assistPoints(assists: number) {
  return assists * POINTS.assist
}

function savePoints(saves: number) {
  return Math.floor(saves / POINTS.savesPerPoint)
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
