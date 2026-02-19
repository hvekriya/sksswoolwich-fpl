<template>
  <div>
        <h1 class="mb-2 text-3xl font-bold text-white">Manage Weeks</h1>
        <p class="mb-8 text-slate-400">
          Create new game weeks. Use Wednesday dates for each week.
        </p>
        <div class="mb-8 flex flex-wrap gap-4">
          <input
            v-model="newLabel"
            type="text"
            placeholder="e.g. Week 1, GW 1"
            class="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
          <input
            v-model="newDate"
            type="date"
            class="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
          />
          <button
            class="rounded-lg bg-amber-500 px-6 py-2 font-medium text-slate-900 transition hover:bg-amber-400 disabled:opacity-50"
            :disabled="!newLabel.trim() || !newDate"
            @click="createWeek"
          >
            Add Week
          </button>
        </div>
        <div class="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <!-- Mobile: cards -->
          <div class="divide-y divide-slate-800 md:hidden">
            <div
              v-for="w in weeklyStore.allWeeks"
              :key="w.id"
              class="flex flex-col gap-1 px-4 py-3"
            >
              <span class="font-medium text-white">{{ w.label }}</span>
              <span class="text-sm text-slate-300">{{ formatDate(w.date) }}</span>
              <span class="text-sm text-slate-400">
                {{ w.performances.filter((p) => p.goals || p.assists || p.saves || p.isMvp).length }} players with stats
              </span>
            </div>
          </div>
          <!-- Desktop: table -->
          <div class="hidden md:block">
            <table class="w-full">
              <thead>
                <tr class="border-b border-slate-700 bg-slate-800/50">
                  <th class="px-6 py-4 text-left font-medium text-slate-300">Label</th>
                  <th class="px-6 py-4 text-left font-medium text-slate-300">Date</th>
                  <th class="px-6 py-4 text-left font-medium text-slate-300">Performances</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="w in weeklyStore.allWeeks"
                  :key="w.id"
                  class="border-b border-slate-800 transition hover:bg-slate-800/30"
                >
                  <td class="px-6 py-4 font-medium text-white">{{ w.label }}</td>
                  <td class="px-6 py-4 text-slate-300">{{ formatDate(w.date) }}</td>
                  <td class="px-6 py-4 text-slate-400">
                    {{ w.performances.filter((p) => p.goals || p.assists || p.saves || p.isMvp).length }} players with stats
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const weeklyStore = useWeeklyPointsStore()
const newLabel = ref('')
const newDate = ref('')

function createWeek() {
  if (!newLabel.value.trim() || !newDate.value) return
  weeklyStore.createWeek(newLabel.value.trim(), new Date(newDate.value).toISOString())
  newLabel.value = ''
  newDate.value = ''
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
</script>
