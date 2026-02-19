import type { Player } from '~/stores/players'
import type { Week, WeekPerformance } from '~/stores/weeklyPoints'

export async function syncPlayersToSupabase(supabase: any, players: Player[]) {
  if (!players.length) return
  const rows = players.map((p) => ({
    id: p.id,
    name: p.name,
    position: p.position,
    number: p.number ?? null,
    avatar_url: p.avatarUrl ?? null,
    created_at: p.createdAt,
  }))
  await supabase.from('players').upsert(rows, { onConflict: 'id' })
}

export async function syncPlayersFromSupabase(supabase: any): Promise<Player[]> {
  const { data } = await supabase.from('players').select('*').order('created_at', { ascending: true })
  return (data ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    position: r.position,
    number: r.number,
    avatarUrl: r.avatar_url,
    createdAt: r.created_at,
  }))
}

export async function syncWeeksToSupabase(supabase: any, weeks: Week[]) {
  for (const w of weeks) {
    await supabase.from('weeks').upsert({
      id: w.id,
      label: w.label,
      date: w.date,
      created_at: w.createdAt,
    }, { onConflict: 'id' })
    for (const p of w.performances) {
      await supabase.from('performances').upsert({
        week_id: w.id,
        player_id: p.playerId,
        goals: p.goals,
        assists: p.assists,
        saves: p.saves,
        is_mvp: p.isMvp,
        didnt_play: p.didntPlay ?? false,
      }, { onConflict: 'week_id,player_id' })
    }
  }
}

export async function syncWeeksFromSupabase(supabase: any): Promise<Week[]> {
  const { data: weeksData } = await supabase.from('weeks').select('*').order('date', { ascending: true })
  const weeks = weeksData ?? []
  const result: Week[] = []
  for (const w of weeks) {
    const { data: perfData } = await supabase
      .from('performances')
      .select('*')
      .eq('week_id', w.id)
    const performances: WeekPerformance[] = (perfData ?? []).map((p: any) => ({
      weekId: p.week_id,
      playerId: p.player_id,
      goals: p.goals,
      assists: p.assists,
      saves: p.saves,
      isMvp: p.is_mvp,
      didntPlay: p.didnt_play ?? false,
    }))
    result.push({
      id: w.id,
      label: w.label,
      date: w.date,
      performances,
      createdAt: w.created_at,
    })
  }
  return result
}
