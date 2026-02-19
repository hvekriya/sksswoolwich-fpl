# SKSS Woolwich FPL

Fantasy football league app for tracking player performance and rankings.

## Features

- **Players** – Add and manage squad players (GK, DEF, MID, FWD)
- **FPL Team** – Build your fantasy team lineup with captain selection
- **Admin** – Enter weekly points every Wednesday based on football performance
- **Points system**
  - Goals: 3 pts
  - Assists: 2 pts
  - Goals saved (for keepers): 1 pt
  - MVP: 5 pts bonus
- **Yearly rankings** – Leaderboard for the season
- **Weekly performance** – View each player’s stats by week

## Setup

```bash
npm install
npm run dev
```

## Usage

1. Add players on the **Players** page
2. Build your FPL team on the **Team** page
3. In **Admin → Manage Weeks**, create a new week (use Wednesday dates)
4. In **Admin → Weekly Points**, enter goals, assists, saves, and MVP for each player
5. View **Rankings** for the yearly table and **Weekly Performance** for per-week stats

### Data storage

**Local only:** Data is stored in your browser (localStorage) when Supabase is not configured.

**Shared (Supabase):** To share the leaderboard with friends, use Supabase so everyone sees the same data.

1. Create a free project at [supabase.com](https://supabase.com)
2. In the Supabase dashboard, go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Settings → API** and copy your project URL and anon (public) key
4. Create a `.env` file:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

5. Deploy the app (Vercel, Netlify, etc.) with these env vars
6. Share the link – friends can view rankings and stats
