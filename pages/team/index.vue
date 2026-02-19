<template>
  <div>
    <h1 class="mb-8 text-3xl font-bold text-white">FPL Team</h1>
    <div v-if="!fplStore.teams.length" class="mb-8">
      <div class="flex gap-4">
        <input
          v-model="teamName"
          type="text"
          placeholder="Team name"
          class="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
        />
        <button
          class="rounded-lg bg-amber-500 px-6 py-2 font-medium text-slate-900 transition hover:bg-amber-400"
          @click="createTeam"
        >
          Create Team
        </button>
      </div>
    </div>
    <div v-else>
      <div class="mb-6 flex flex-wrap gap-4">
        <button
          v-for="t in fplStore.teams"
          :key="t.id"
          class="rounded-lg px-4 py-2 transition"
          :class="
            fplStore.activeTeamId === t.id
              ? 'bg-amber-500 text-slate-900'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          "
          @click="fplStore.setActiveTeam(t.id)"
        >
          {{ t.name }}
        </button>
      </div>
      <div v-if="fplStore.activeTeam" class="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <p class="mb-4 text-slate-400">Add players from your squad:</p>
        <div class="mb-6 flex flex-wrap gap-2">
          <button
            v-for="p in availablePlayers"
            :key="p.id"
            class="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white transition hover:border-amber-500/50"
            @click="addToTeam(p.id)"
          >
            {{ p.name }} ({{ p.position }})
          </button>
        </div>
        <div v-if="teamPlayers.length" class="space-y-3">
          <h3 class="font-medium text-white">Lineup</h3>
          <div
            v-for="tp in teamPlayers"
            :key="tp.playerId"
            class="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-3"
          >
            <span>
              {{ getPlayerName(tp.playerId) }}
              <span v-if="tp.isCaptain" class="ml-2 text-amber-400">© Captain</span>
            </span>
            <div class="flex gap-2">
              <button
                v-if="!tp.isCaptain"
                class="text-sm text-amber-400 hover:underline"
                @click="setCaptain(tp.playerId)"
              >
                Set captain
              </button>
              <button
                class="text-sm text-red-400 hover:underline"
                @click="removeFromTeam(tp.playerId)"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const fplStore = useFplTeamStore()
const playersStore = usePlayersStore()
const teamName = ref('')

const activeTeam = computed(() => fplStore.activeTeam)

const teamPlayers = computed(() => activeTeam.value?.players ?? [])

const availablePlayers = computed(() => {
  const inTeam = new Set((activeTeam.value?.players ?? []).map((p) => p.playerId))
  return playersStore.allPlayers.filter((p) => !inTeam.has(p.id))
})

function getPlayerName(id: string) {
  return playersStore.getPlayer(id)?.name ?? 'Unknown'
}

function createTeam() {
  if (!teamName.value.trim()) return
  fplStore.addTeam(teamName.value.trim())
  teamName.value = ''
}

function addToTeam(playerId: string) {
  if (!activeTeam.value) return
  fplStore.addPlayerToTeam(activeTeam.value.id, playerId, '')
}

function removeFromTeam(playerId: string) {
  if (!activeTeam.value) return
  fplStore.removePlayerFromTeam(activeTeam.value.id, playerId)
}

function setCaptain(playerId: string) {
  if (!activeTeam.value) return
  fplStore.setCaptain(activeTeam.value.id, playerId)
}
</script>
