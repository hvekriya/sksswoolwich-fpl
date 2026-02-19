<template>
  <div>
    <h1 class="mb-8 text-3xl font-bold text-white">Players</h1>
    <div class="mb-8 flex gap-4">
      <input
        v-model="newName"
        type="text"
        placeholder="Player name"
        class="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
      />
      <select
        v-model="newPosition"
        class="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
      >
        <option value="GK">Goalkeeper</option>
        <option value="DEF">Defender</option>
        <option value="MID">Midfielder</option>
        <option value="FWD">Forward</option>
      </select>
      <input
        v-model.number="newNumber"
        type="number"
        placeholder="#"
        min="0"
        class="w-20 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
      />
      <button
        class="rounded-lg bg-amber-500 px-6 py-2 font-medium text-slate-900 transition hover:bg-amber-400"
        :disabled="!newName.trim()"
        @click="addPlayer"
      >
        Add Player
      </button>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="player in playersStore.allPlayers"
        :key="player.id"
        class="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-4"
      >
        <div>
          <span v-if="player.number" class="mr-2 text-slate-500">#{{ player.number }}</span>
          <span class="font-medium text-white">{{ player.name }}</span>
          <span class="ml-2 rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
            {{ player.position }}
          </span>
        </div>
        <button
          class="rounded p-2 text-slate-400 transition hover:bg-red-500/20 hover:text-red-400"
          @click="playersStore.removePlayer(player.id)"
        >
          Remove
        </button>
      </div>
    </div>
    <p v-if="!playersStore.allPlayers.length" class="text-slate-500">
      No players yet. Add your squad above.
    </p>
  </div>
</template>

<script setup lang="ts">
const playersStore = usePlayersStore()
const newName = ref('')
const newPosition = ref<'GK' | 'DEF' | 'MID' | 'FWD'>('MID')
const newNumber = ref<number | undefined>(undefined)

function addPlayer() {
  if (!newName.value.trim()) return
  playersStore.addPlayer({
    name: newName.value.trim(),
    position: newPosition.value,
    number: newNumber.value,
  })
  newName.value = ''
  newNumber.value = undefined
}
</script>
