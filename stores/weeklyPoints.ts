import { defineStore } from 'pinia'

// Points configuration (customizable)
export const POINTS = {
  goal: 3,
  assist: 2,
  save: 1, // goals saved (for GKs)
  mvp: 5,
}

export interface WeekPerformance {
  weekId: string
  playerId: string
  goals: number
  assists: number
  saves: number // goals saved
  isMvp: boolean
}

export interface Week {
  id: string
  label: string // e.g. "Week 1", "GW 1"
  date: string // Wednesday date ISO
  performances: WeekPerformance[]
  createdAt: string
}

export const useWeeklyPointsStore = defineStore('weeklyPoints', {
  state: () => ({
    weeks: [] as Week[],
  }),
  getters: {
    allWeeks: (state) =>
      [...state.weeks].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    getWeek: (state) => (id: string) => state.weeks.find((w) => w.id === id),
    getPlayerPerformance: (state) => (playerId: string, weekId: string) => {
      const week = state.weeks.find((w) => w.id === weekId)
      return week?.performances.find((p) => p.playerId === playerId) ?? null
    },
    totalPointsForPlayer: (state) => (playerId: string) => {
      let total = 0
      for (const week of state.weeks) {
        const perf = week.performances.find((p) => p.playerId === playerId)
        if (perf) {
          total +=
            perf.goals * POINTS.goal +
            perf.assists * POINTS.assist +
            perf.saves * POINTS.save +
            (perf.isMvp ? POINTS.mvp : 0)
        }
      }
      return total
    },
    yearlyRanking:
      (state) =>
      (getPlayerName: (id: string) => string) => {
        const totals = new Map<string, number>()
        for (const week of state.weeks) {
          for (const perf of week.performances) {
            const pts =
              perf.goals * POINTS.goal +
              perf.assists * POINTS.assist +
              perf.saves * POINTS.save +
              (perf.isMvp ? POINTS.mvp : 0)
            totals.set(
              perf.playerId,
              (totals.get(perf.playerId) ?? 0) + pts
            )
          }
        }
        return Array.from(totals.entries())
          .map(([playerId, points]) => ({ playerId, points, name: getPlayerName(playerId) }))
          .sort((a, b) => b.points - a.points)
          .map((r, i) => ({ ...r, rank: i + 1 }))
      },
  },
  actions: {
    createWeek(label: string, date: string) {
      const w: Week = {
        id: crypto.randomUUID(),
        label,
        date,
        performances: [],
        createdAt: new Date().toISOString(),
      }
      this.weeks.push(w)
      return w
    },
    setPerformance(
      weekId: string,
      playerId: string,
      perf: Partial<Omit<WeekPerformance, 'weekId' | 'playerId'>>
    ) {
      const week = this.weeks.find((w) => w.id === weekId)
      if (!week) return
      let p = week.performances.find((x) => x.playerId === playerId)
      if (!p) {
        p = {
          weekId,
          playerId,
          goals: 0,
          assists: 0,
          saves: 0,
          isMvp: false,
        }
        week.performances.push(p)
      }
      Object.assign(p, perf)
      if (perf.isMvp) {
        week.performances.forEach((x) => {
          if (x.playerId !== playerId) x.isMvp = false
        })
      }
    },
    getPointsForPerformance(perf: WeekPerformance) {
      return (
        perf.goals * POINTS.goal +
        perf.assists * POINTS.assist +
        perf.saves * POINTS.save +
        (perf.isMvp ? POINTS.mvp : 0)
      )
    },
  },
  persist: true,
})
