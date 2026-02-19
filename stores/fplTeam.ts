import { defineStore } from 'pinia'

export interface FplTeamPlayer {
  playerId: string
  position: string // e.g. 'GK', 'DEF1', 'DEF2', ...
  isCaptain?: boolean
}

export interface FplTeam {
  id: string
  name: string
  players: FplTeamPlayer[]
  createdAt: string
}

export const useFplTeamStore = defineStore('fplTeam', {
  state: () => ({
    teams: [] as FplTeam[],
    activeTeamId: null as string | null,
  }),
  getters: {
    activeTeam: (state) =>
      state.teams.find((t) => t.id === state.activeTeamId) ?? null,
    allTeams: (state) => state.teams,
  },
  actions: {
    addTeam(name: string) {
      const t: FplTeam = {
        id: crypto.randomUUID(),
        name,
        players: [],
        createdAt: new Date().toISOString(),
      }
      this.teams.push(t)
      this.activeTeamId = this.activeTeamId ?? t.id
      return t
    },
    setActiveTeam(id: string) {
      this.activeTeamId = id
    },
    addPlayerToTeam(teamId: string, playerId: string, position: string) {
      const team = this.teams.find((t) => t.id === teamId)
      if (!team) return
      if (team.players.some((p) => p.playerId === playerId)) return
      team.players.push({ playerId, position })
    },
    removePlayerFromTeam(teamId: string, playerId: string) {
      const team = this.teams.find((t) => t.id === teamId)
      if (!team) return
      team.players = team.players.filter((p) => p.playerId !== playerId)
    },
    setCaptain(teamId: string, playerId: string) {
      const team = this.teams.find((t) => t.id === teamId)
      if (!team) return
      team.players.forEach((p) => {
        p.isCaptain = p.playerId === playerId
      })
    },
  },
  persist: true,
})
