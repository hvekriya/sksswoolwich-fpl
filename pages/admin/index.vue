<template>
  <div>
        <h1 class="mb-2 text-3xl font-bold text-white">Weekly Points</h1>
        <p class="mb-8 text-slate-400">
          Enter player performance for each week. Points: Goals (3), Assists (2), Saves (1), MVP (5).
        </p>
        <div v-if="!weeklyStore.allWeeks.length" class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
          <p class="mb-4 text-amber-400">No weeks yet.</p>
          <NuxtLink
            to="/admin/weeks"
            class="inline-block rounded-lg bg-amber-500 px-6 py-2 font-medium text-slate-900 transition hover:bg-amber-400"
          >
            Create a Week
          </NuxtLink>
        </div>
        <div v-else>
          <div class="mb-6">
            <label class="mb-2 block text-sm text-slate-400">Select week</label>
            <select
              v-model="selectedWeekId"
              class="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
            >
              <option v-for="w in weeklyStore.allWeeks" :key="w.id" :value="w.id">
                {{ w.label }} ({{ formatDate(w.date) }})
              </option>
            </select>
          </div>
          <div v-if="selectedWeek" class="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div class="border-b border-slate-800 bg-slate-800/50 px-6 py-3 font-medium text-white">
              {{ selectedWeek.label }} — Enter performance
            </div>
            <div class="divide-y divide-slate-800">
              <div
                v-for="player in playersStore.allPlayers"
                :key="player.id"
                class="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:flex-wrap sm:items-end"
              >
                <div class="min-w-0 flex-1 font-medium text-white sm:flex-initial">
                  {{ player.name }}
                  <span class="ml-2 text-slate-500">({{ player.position }})</span>
                </div>
                <div class="flex items-center gap-6">
                  <fieldset class="flex gap-4 border-0 p-0">
                    <label class="flex cursor-pointer items-center gap-3">
                      <input
                        type="radio"
                        :name="`played-${player.id}`"
                        :checked="!getPerf(player.id).didntPlay"
                        class="h-6 w-6 shrink-0 border-2 border-slate-500 bg-slate-800 text-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                        @change="setPlayed(player.id, true)"
                      />
                      <span class="text-sm text-slate-300">Played</span>
                    </label>
                    <label class="flex cursor-pointer items-center gap-3">
                      <input
                        type="radio"
                        :name="`played-${player.id}`"
                        :checked="getPerf(player.id).didntPlay"
                        class="h-6 w-6 shrink-0 border-2 border-slate-500 bg-slate-800 text-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                        @change="setPlayed(player.id, false)"
                      />
                      <span class="text-sm text-slate-300">Didn't play</span>
                    </label>
                  </fieldset>
                </div>
                <template v-if="!getPerf(player.id).didntPlay">
                  <div>
                    <label class="mb-1 block text-xs text-slate-500">Goals</label>
                    <input
                      :value="getPerf(player.id).goals"
                      type="number"
                      min="0"
                      class="w-16 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                      @input="updatePerf(player.id, 'goals', +($event.target as HTMLInputElement).value)"
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs text-slate-500">Assists</label>
                    <input
                      :value="getPerf(player.id).assists"
                      type="number"
                      min="0"
                      class="w-16 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                      @input="updatePerf(player.id, 'assists', +($event.target as HTMLInputElement).value)"
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs text-slate-500">Saves</label>
                    <input
                      :value="getPerf(player.id).saves"
                      type="number"
                      min="0"
                      class="w-16 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                      @input="updatePerf(player.id, 'saves', +($event.target as HTMLInputElement).value)"
                    />
                  </div>
                  <label class="flex cursor-pointer items-end gap-3 pb-2">
                    <input
                      type="checkbox"
                      :checked="getPerf(player.id).isMvp"
                      class="h-6 w-6 shrink-0 rounded border-2 border-slate-500 bg-slate-800 text-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                      @change="updatePerf(player.id, 'isMvp', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="text-sm text-slate-300">MVP 🏅</span>
                  </label>
                  <div class="text-sm text-slate-500">
                    = <span class="font-mono text-amber-400">{{ getPointsPreview(player.id) }} pts</span>
                  </div>
                </template>
                <span v-else class="text-sm text-slate-500">0 pts</span>
              </div>
            </div>
            <p v-if="!playersStore.allPlayers.length" class="p-6 text-slate-500">
              Add players first in the Players page.
            </p>
          </div>
        </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const playersStore = usePlayersStore()
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

const selectedWeek = computed(() =>
  selectedWeekId.value ? weeklyStore.getWeek(selectedWeekId.value) : null
)

watch(
  () => weeklyStore.allWeeks,
  (weeks) => {
    if (weeks.length && !selectedWeekId.value) {
      selectedWeekId.value = getCurrentWeekId()
    }
  },
  { immediate: true }
)

function getPerf(playerId: string) {
  if (!selectedWeekId.value) return { goals: 0, assists: 0, saves: 0, isMvp: false, didntPlay: false }
  const p = weeklyStore.getPlayerPerformance(playerId, selectedWeekId.value)
  return p ?? { goals: 0, assists: 0, saves: 0, isMvp: false, didntPlay: false }
}

function updatePerf(
  playerId: string,
  field: 'goals' | 'assists' | 'saves' | 'isMvp',
  value: number | boolean
) {
  if (!selectedWeekId.value) return
  const current = getPerf(playerId)
  weeklyStore.setPerformance(selectedWeekId.value, playerId, {
    ...current,
    [field]: value,
  })
}

function setPlayed(playerId: string, played: boolean) {
  if (!selectedWeekId.value) return
  weeklyStore.setPerformance(selectedWeekId.value, playerId, played
    ? { didntPlay: false }
    : { didntPlay: true, goals: 0, assists: 0, saves: 0, isMvp: false }
  )
}

function getPointsPreview(playerId: string) {
  const p = getPerf(playerId)
  if (p.didntPlay) return 0
  return (
    p.goals * 3 +
    p.assists * 2 +
    p.saves * 1 +
    (p.isMvp ? 5 : 0)
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
</script>
