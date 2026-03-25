# Elena Care — Family Coordination App

Realtime care coordination for Elena Valdez's hip fracture recovery.

No medical interpretation. Only who said what, when, exact words.

---

## Deploy in 10 minutes

### Step 1: Supabase (database + storage + realtime)

1. Go to [supabase.com](https://supabase.com) → sign in → **New Project**
2. Name it `elena-care`, set a database password, pick a region close to your family
3. Wait for the project to spin up (~2 min)

**Run the schema:**
4. Go to **SQL Editor** (left sidebar)
5. Click **New Query**
6. Copy the ENTIRE contents of `supabase-schema.sql` from this repo and paste it in
7. Click **Run**
8. You should see "Success. No rows returned" — that's correct

**Enable Realtime:**
9. Go to **Database** → **Replication** (left sidebar)
10. Under "Supabase Realtime", make sure `messages` and `tasks` tables have realtime enabled
11. If not, toggle them on

**Get your keys:**
12. Go to **Settings** → **API** (left sidebar)
13. Copy:
    - **Project URL** (looks like `https://abcdefg.supabase.co`)
    - **anon public** key (long string starting with `eyJ...`)

### Step 2: Vercel (hosting)

**Option A: GitHub (recommended — auto-deploys on push)**

1. Create a new GitHub repo (private is fine)
2. Push this entire folder to the repo:
   ```bash
   cd elena-care
   git init
   git add .
   git commit -m "initial"
   git remote add origin https://github.com/YOUR_USER/elena-care.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New Project**
4. Import your `elena-care` repo
5. Before clicking Deploy, add **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` → paste your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → paste your Supabase anon key
6. Click **Deploy**
7. Done. You get a URL like `elena-care.vercel.app`

**Option B: CLI (faster if you have Node installed)**

```bash
cd elena-care
npm install
npx vercel
# Follow prompts, say yes to everything
# When asked for environment variables, add:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Step 3: Share

Text the Vercel URL to your family group chat. Everyone opens it on their phone. First visit asks "Who are you?" — they tap their name and they're in.

---

## How it works

### Feed (primary surface)
Realtime updates from everyone. Supports:
- **Text** — type what the doctor said, what you observed
- **Voice** — tap mic, record, it uploads with playback
- **Photos** — tap camera to capture a document, whiteboard, or medication
- **Files** — upload any PDF, photo, document

Every item shows: **who** posted it, **when**, and **exact content**. No interpretation.

### Tasks
Max 5 active tasks. Checkbox + owner. Completed tasks disappear.

### Top Info (tap to expand)
Patient details — hospital, nurse station, case manager (with one-tap call), insurance. Editable by anyone. Also contains **shift handoff** — one tap to log a handoff in the feed.

### Phase Tracker
Manual only: Hospital → Surgery → Mobility → Discharge → Rehab. Tap to advance. No automation.

### Coverage Ping
If no feed update in 2 hours, a banner appears: "No update in 2+ hours. Is someone with Elena?"

---

## Supabase storage note

The `care-files` storage bucket is set to public so uploaded photos/files render in the feed. This is fine for a private family app. If you want to restrict access later, update the storage policies in Supabase.

---

## Cost

- **Supabase free tier**: 500MB database, 1GB storage, 2GB bandwidth. More than enough.
- **Vercel free tier**: unlimited for personal projects. $0.
- **Total: $0**

---

## Local development

```bash
cp .env.local.example .env.local
# Fill in your Supabase URL and key

npm install
npm run dev
# Open http://localhost:3000
```

---

## What this is NOT

- Not a medical app
- Not a dashboard with health claims
- No charts, no summaries, no AI interpretation
- Family coordination only: who said what, when, exact words
