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
                class="grid grid-cols-2 gap-4 px-6 py-4 md:grid-cols-6"
              >
                <div class="col-span-2 font-medium text-white">
                  {{ player.name }}
                  <span class="ml-2 text-slate-500">({{ player.position }})</span>
                </div>
                <div>
                  <label class="mb-1 block text-xs text-slate-500">Goals</label>
                  <input
                    :value="getPerf(player.id).goals"
                    type="number"
                    min="0"
                    class="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    @input="updatePerf(player.id, 'goals', +($event.target as HTMLInputElement).value)"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs text-slate-500">Assists</label>
                  <input
                    :value="getPerf(player.id).assists"
                    type="number"
                    min="0"
                    class="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    @input="updatePerf(player.id, 'assists', +($event.target as HTMLInputElement).value)"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs text-slate-500">Saves</label>
                  <input
                    :value="getPerf(player.id).saves"
                    type="number"
                    min="0"
                    class="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    @input="updatePerf(player.id, 'saves', +($event.target as HTMLInputElement).value)"
                  />
                </div>
                <div class="flex items-end">
                  <label class="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      :checked="getPerf(player.id).isMvp"
                      class="rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-amber-500"
                      @change="updatePerf(player.id, 'isMvp', ($event.target as HTMLInputElement).checked)"
                    />
                    <span class="text-sm text-slate-300">MVP</span>
                  </label>
                </div>
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
definePageMeta({ layout: 'admin' })

const playersStore = usePlayersStore()
const weeklyStore = useWeeklyPointsStore()
const selectedWeekId = ref(weeklyStore.allWeeks[0]?.id ?? '')

const selectedWeek = computed(() =>
  selectedWeekId.value ? weeklyStore.getWeek(selectedWeekId.value) : null
)

watch(
  () => weeklyStore.allWeeks,
  (weeks) => {
    if (weeks.length && !selectedWeekId.value) {
      selectedWeekId.value = weeks[0].id
    }
  },
  { immediate: true }
)

function getPerf(playerId: string) {
  if (!selectedWeekId.value) return { goals: 0, assists: 0, saves: 0, isMvp: false }
  const p = weeklyStore.getPlayerPerformance(playerId, selectedWeekId.value)
  return p ?? { goals: 0, assists: 0, saves: 0, isMvp: false }
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

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
</script>
