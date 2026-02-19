# Player avatar storage

1. Go to **Storage** → **New bucket**
2. Name: `player-avatars`, enable **Public bucket**, create it
3. Add these policies (Storage → player-avatars → Policies → New policy):

**Allow public read (SELECT):**
```
(bucket_id = 'player-avatars'::text)
```

**Allow upload (INSERT):**
```
(bucket_id = 'player-avatars'::text)
```

**Allow update (UPDATE) – for upsert:**
```
(bucket_id = 'player-avatars'::text)
```

Files are stored at `{playerId}.jpg` (bucket root). Avoid policies that restrict by folder or require `auth.role() = 'anon'` only – use `(bucket_id = 'player-avatars')` so uploads work.
