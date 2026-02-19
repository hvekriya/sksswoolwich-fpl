-- Run this in your Supabase project: SQL Editor > New query > paste and run
-- https://supabase.com/dashboard/project/_/sql

-- Players
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null check (position in ('GK', 'DEF', 'MID', 'FWD')),
  number integer,
  created_at timestamptz default now()
);

-- Weeks
create table if not exists weeks (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  date timestamptz not null,
  created_at timestamptz default now()
);

-- Week performances (goals, assists, saves, mvp per player per week)
create table if not exists performances (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references weeks(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  goals integer not null default 0,
  assists integer not null default 0,
  saves integer not null default 0,
  is_mvp boolean not null default false,
  unique(week_id, player_id)
);

-- FPL teams
create table if not exists fpl_teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- FPL team players (lineup)
create table if not exists fpl_team_players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references fpl_teams(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  position text default '',
  is_captain boolean default false,
  unique(team_id, player_id)
);

-- Allow public read and write (for shared league - add auth later if needed)
alter table players enable row level security;
alter table weeks enable row level security;
alter table performances enable row level security;
alter table fpl_teams enable row level security;
alter table fpl_team_players enable row level security;

create policy "Allow all for players" on players for all using (true) with check (true);
create policy "Allow all for weeks" on weeks for all using (true) with check (true);
create policy "Allow all for performances" on performances for all using (true) with check (true);
create policy "Allow all for fpl_teams" on fpl_teams for all using (true) with check (true);
create policy "Allow all for fpl_team_players" on fpl_team_players for all using (true) with check (true);
