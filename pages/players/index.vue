<template>
  <div>
    <h1 class="mb-8 text-3xl font-bold text-white">Players</h1>
    <div class="mb-8 flex flex-wrap gap-4">
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
        class="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4"
      >
        <div class="relative flex-shrink-0">
          <NuxtLink
            :to="`/players/${player.id}`"
            class="block h-14 w-14 overflow-hidden rounded-full bg-slate-700 transition hover:ring-2 hover:ring-amber-500"
            :class="{ 'ring-2 ring-amber-500': player.avatarUrl }"
          >
            <img
              v-if="player.avatarUrl"
              :src="player.avatarUrl"
              :alt="player.name"
              class="h-full w-full object-cover"
            />
            <span
              v-else
              class="flex h-full w-full items-center justify-center text-xl font-bold text-slate-500"
            >
              {{ (player.name || '?')[0] }}
            </span>
          </NuxtLink>
          <label
            class="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-amber-500 text-slate-900 transition hover:bg-amber-400"
            :class="{ 'opacity-50': uploading === player.id }"
          >
            <input
              type="file"
              accept="image/*"
              class="hidden"
              :disabled="uploading === player.id"
              @change="onAvatarChange(player.id, $event)"
            />
            {{ uploading === player.id ? '…' : '+' }}
          </label>
        </div>
        <NuxtLink
          :to="`/players/${player.id}`"
          class="min-w-0 flex-1 transition hover:text-amber-400"
        >
          <span v-if="player.number" class="mr-2 text-slate-500">#{{ player.number }}</span>
          <span class="font-medium text-white">{{ player.name }}</span>
          <span class="ml-2 rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
            {{ player.position }}
          </span>
        </NuxtLink>
        <div class="flex gap-1">
          <NuxtLink
            :to="`/players/${player.id}?edit=1`"
            class="rounded p-2 text-slate-400 transition hover:bg-amber-500/20 hover:text-amber-400"
          >
            Edit
          </NuxtLink>
          <button
            class="rounded p-2 text-slate-400 transition hover:bg-red-500/20 hover:text-red-400"
            @click="confirmRemovePlayer(player)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
    <p v-if="!playersStore.allPlayers.length" class="text-slate-500">
      No players yet. Add your squad above.
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const playersStore = usePlayersStore()
const { uploadAvatar } = usePlayerAvatar()
const uploading = ref<string | null>(null)
const newName = ref('')
const newPosition = ref<'GK' | 'DEF' | 'MID' | 'FWD'>('MID')
const newNumber = ref<number | undefined>(undefined)

async function onAvatarChange(playerId: string, e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  uploading.value = playerId
  input.value = ''
  try {
    const url = await uploadAvatar(playerId, file)
    playersStore.updatePlayer(playerId, { avatarUrl: url })
  } catch (err) {
    console.error('Upload failed:', err)
  } finally {
    uploading.value = null
  }
}

function confirmRemovePlayer(player: { id: string; name: string }) {
  if (
    !confirm(
      `Are you sure you want to remove ${player.name}?\n\nTheir record, photo and all weekly stats will be permanently deleted.`
    )
  ) return
  playersStore.removePlayer(player.id)
}

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
