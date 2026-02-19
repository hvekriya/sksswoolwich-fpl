import { defineStore } from 'pinia'

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD'

export interface Player {
  id: string
  name: string
  position: Position
  number?: number
  createdAt: string
}

export const usePlayersStore = defineStore('players', {
  state: () => ({
    players: [] as Player[],
  }),
  getters: {
    allPlayers: (state) => state.players,
    byPosition: (state) => (pos: Position) =>
      state.players.filter((p) => p.position === pos),
  },
  actions: {
    addPlayer(player: Omit<Player, 'id' | 'createdAt'>) {
      const p: Player = {
        ...player,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      this.players.push(p)
      return p
    },
    removePlayer(id: string) {
      this.players = this.players.filter((p) => p.id !== id)
    },
    updatePlayer(id: string, updates: Partial<Player>) {
      const idx = this.players.findIndex((p) => p.id === id)
      if (idx !== -1) this.players[idx] = { ...this.players[idx], ...updates }
    },
    getPlayer(id: string) {
      return this.players.find((p) => p.id === id) ?? null
    },
  },
  persist: true,
})
