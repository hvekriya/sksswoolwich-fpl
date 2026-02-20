<template>
  <div v-if="player">
    <button
      class="mb-6 inline-flex items-center gap-2 text-slate-400 transition hover:text-white"
      @click="router.back()"
    >
      ← Back
    </button>
    <div class="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      <PlayerAvatar :avatar-url="player.avatarUrl" :name="player.name" size="lg" />
      <div class="flex-1">
        <h1 v-if="!editing" class="text-3xl font-bold text-white">
          {{ player.name }}
          <span v-if="player.number" class="ml-2 text-slate-500">#{{ player.number }}</span>
        </h1>
        <div v-else class="flex flex-wrap items-end gap-4">
          <div>
            <label class="mb-1 block text-sm text-slate-400">Name</label>
            <input
              v-model="editName"
              type="text"
              class="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm text-slate-400">Number</label>
            <input
              v-model.number="editNumber"
              type="number"
              min="0"
              placeholder="—"
              class="w-20 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm text-slate-400">Position</label>
            <select
              v-model="editPosition"
              class="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="GK">Goalkeeper</option>
              <option value="DEF">Defender</option>
              <option value="MID">Midfielder</option>
              <option value="FWD">Forward</option>
            </select>
          </div>
          <button
            class="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 transition hover:bg-amber-400"
            @click="saveEdit"
          >
            Save
          </button>
          <button
            class="rounded-lg border border-slate-600 px-4 py-2 text-slate-400 transition hover:text-white"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
        <span class="mt-2 inline-block rounded bg-slate-700 px-2 py-1 text-sm text-slate-300">
          {{ player.position }}
        </span>
        <button
          v-if="user && !editing"
          class="ml-4 text-sm text-amber-400 transition hover:text-amber-300"
          @click="startEdit"
        >
          Edit
        </button>
      </div>
    </div>
    <div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
      <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div class="mb-2">
          <AnimatedEmoji type="trophy" :size="36" />
        </div>
        <div class="text-2xl font-bold text-amber-400">{{ totalPoints }}</div>
        <div class="text-sm text-slate-400">Total points</div>
      </div>
      <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div class="mb-2">
          <AnimatedEmoji type="goals" :size="36" />
        </div>
        <div class="text-2xl font-bold text-white">{{ totals.goals }}</div>
        <div class="text-sm text-slate-400">Goals</div>
      </div>
      <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div class="mb-2">
          <AnimatedEmoji type="assists" :size="36" />
        </div>
        <div class="text-2xl font-bold text-white">{{ totals.assists }}</div>
        <div class="text-sm text-slate-400">Assists</div>
      </div>
      <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div class="mb-2 text-2xl">🧤</div>
        <div class="text-2xl font-bold text-white">{{ totals.saves }}</div>
        <div class="text-sm text-slate-400">Saves</div>
      </div>
      <div class="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div class="mb-2">
          <AnimatedEmoji type="medal" :size="36" />
        </div>
        <div class="text-2xl font-bold text-white">{{ totals.mvpCount }}</div>
        <div class="text-sm text-slate-400">MVP awards</div>
      </div>
    </div>
    <h2 class="mb-4 text-xl font-semibold text-white">Weekly history</h2>
    <div v-if="weeklyHistory.length" class="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <!-- Mobile: cards -->
      <div class="divide-y divide-slate-800 md:hidden">
        <div
          v-for="h in weeklyHistory"
          :key="h.weekId"
          class="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        >
          <div>
            <div class="font-medium text-white">{{ h.weekLabel }} ({{ formatDate(h.weekDate) }})</div>
            <div class="text-xs" :class="h.didntPlay ? 'text-rose-400' : 'text-emerald-400'">
              {{ h.didntPlay ? "Didn't play ✗" : 'Played ✓' }}
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-4 text-sm">
            <span><span class="text-slate-500">G</span> {{ h.didntPlay ? '—' : `${h.goals} (${goalPoints(h.goals)} pts)` }}</span>
            <span><span class="text-slate-500">A</span> {{ h.didntPlay ? '—' : `${h.assists} (${assistPoints(h.assists)} pts)` }}</span>
            <span><span class="text-slate-500">S</span> {{ h.didntPlay ? '—' : `${h.saves} (${savePoints(h.saves)} pts)` }}</span>
            <span>
              <AnimatedEmoji v-if="h.isMvp" type="medal" :size="20" />
              <span v-else class="text-slate-600">—</span>
            </span>
            <span :class="h.didntPlay ? 'text-slate-500' : 'font-mono text-amber-400'">
              {{ h.didntPlay ? "Didn't play" : `${h.points} pts` }}
            </span>
          </div>
        </div>
      </div>
      <!-- Desktop: table -->
      <div class="hidden overflow-x-auto md:block">
        <table class="w-full min-w-[32rem]">
          <thead>
            <tr class="border-b border-slate-700 bg-slate-800/50">
              <th class="px-6 py-3 text-left text-sm font-medium text-slate-400">Week</th>
              <th class="px-6 py-3 text-center text-sm font-medium text-slate-400">Goals</th>
              <th class="px-6 py-3 text-center text-sm font-medium text-slate-400">Assists</th>
              <th class="px-6 py-3 text-center text-sm font-medium text-slate-400">Saves</th>
              <th class="px-6 py-3 text-center text-sm font-medium text-slate-400">MVP</th>
              <th class="px-6 py-3 text-right text-sm font-medium text-slate-400">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="h in weeklyHistory"
              :key="h.weekId"
              class="border-b border-slate-800 transition hover:bg-slate-800/20"
            >
              <td class="px-6 py-3 font-medium text-white">
                {{ h.weekLabel }} ({{ formatDate(h.weekDate) }})
                <div class="text-xs font-normal" :class="h.didntPlay ? 'text-rose-400' : 'text-emerald-400'">
                  {{ h.didntPlay ? "Didn't play ✗" : 'Played ✓' }}
                </div>
              </td>
              <td class="px-6 py-3 text-center text-slate-300">{{ h.didntPlay ? '—' : `${h.goals} (${goalPoints(h.goals)} pts)` }}</td>
              <td class="px-6 py-3 text-center text-slate-300">{{ h.didntPlay ? '—' : `${h.assists} (${assistPoints(h.assists)} pts)` }}</td>
              <td class="px-6 py-3 text-center text-slate-300">{{ h.didntPlay ? '—' : `${h.saves} (${savePoints(h.saves)} pts)` }}</td>
              <td class="px-6 py-3 text-center">
                <AnimatedEmoji v-if="h.isMvp" type="medal" :size="28" />
                <span v-else class="text-slate-600">—</span>
              </td>
              <td class="px-6 py-3 text-right" :class="h.didntPlay ? 'text-slate-500' : 'font-mono text-amber-400'">
                {{ h.didntPlay ? "Didn't play" : h.points }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p v-else class="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500">
      No weekly performance yet.
    </p>
  </div>
  <div v-else class="py-12 text-center text-slate-500">
    Player not found.
    <NuxtLink to="/rankings" class="ml-2 text-amber-400 hover:underline">View Rankings</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { POINTS } from '~/stores/weeklyPoints'

const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()
const playersStore = usePlayersStore()
const weeklyStore = useWeeklyPointsStore()

const editing = ref(false)
const editName = ref('')
const editNumber = ref<number | undefined>(undefined)
const editPosition = ref<'GK' | 'DEF' | 'MID' | 'FWD'>('GK')

const playerId = computed(() => route.params.id as string)
const player = computed(() => playersStore.getPlayer(playerId.value))

function startEdit() {
  if (player.value) {
    editName.value = player.value.name
    editNumber.value = player.value.number
    editPosition.value = player.value.position
    editing.value = true
  }
}

watch(
  [() => route.query.edit, player],
  ([edit, p]) => {
    if (edit === '1' && user.value && p) {
      startEdit()
      router.replace({ query: {} })
    }
  },
  { immediate: true }
)

function cancelEdit() {
  editing.value = false
}

function saveEdit() {
  if (!player.value || !editName.value.trim()) return
  playersStore.updatePlayer(player.value.id, {
    name: editName.value.trim(),
    number: editNumber.value,
    position: editPosition.value,
  })
  editing.value = false
}

const totalPoints = computed(() =>
  player.value ? weeklyStore.totalPointsForPlayer(player.value.id) : 0
)

const totals = computed(() => {
  if (!player.value) return { goals: 0, assists: 0, saves: 0, mvpCount: 0 }
  let goals = 0
  let assists = 0
  let saves = 0
  let mvpCount = 0
  for (const w of weeklyStore.weeks) {
    const p = w.performances.find((x) => x.playerId === player.value!.id)
    if (p && !p.didntPlay) {
      goals += p.goals
      assists += p.assists
      saves += p.saves
      if (p.isMvp) mvpCount++
    }
  }
  return { goals, assists, saves, mvpCount }
})

const weeklyHistory = computed(() => {
  if (!player.value) return []
  const out: Array<{
    weekId: string
    weekLabel: string
    weekDate: string
    goals: number
    assists: number
    saves: number
    isMvp: boolean
    points: number
    didntPlay: boolean
  }> = []
  for (const w of weeklyStore.allWeeks) {
    const p = weeklyStore.getPlayerPerformance(player.value!.id, w.id)
    if (p) {
      out.push({
        weekId: w.id,
        weekLabel: w.label,
        weekDate: w.date,
        goals: p.goals,
        assists: p.assists,
        saves: p.saves,
        isMvp: p.isMvp,
        points: weeklyStore.getPointsForPerformance(p),
        didntPlay: p.didntPlay ?? false,
      })
    }
  }
  return out
})

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function goalPoints(goals: number) {
  const position = (player.value?.position ?? 'FWD') as keyof typeof POINTS.goalByPosition
  return goals * POINTS.goalByPosition[position]
}

function assistPoints(assists: number) {
  return assists * POINTS.assist
}

function savePoints(saves: number) {
  return Math.floor(saves / POINTS.savesPerPoint)
}
</script>
