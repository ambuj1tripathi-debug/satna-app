# Satna — अपना शहर, अपनी पहचान

Mobile-first city app for Satna, Madhya Pradesh. Next.js 14 (App Router) + Supabase + Tailwind CSS, in a Nordic blue design language.

**Live:** https://ambuj1tripathi-debug.github.io/satna-app/

## Deploy

Static export to GitHub Pages:

```bash
GITHUB_PAGES=true npm run build && touch out/.nojekyll
cd out && git init -b gh-pages && git add -A && git commit -m deploy \
  && git push -f https://github.com/ambuj1tripathi-debug/satna-app.git gh-pages && rm -rf .git
```

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Works out of the box with bundled seed data. To use a real database:

1. Create a Supabase project.
2. Run `supabase/migrations/0001_init.sql` in the SQL editor (full schema: places, restaurants, community, dine-together, cab-share, quiz/games, moderation, RLS).
3. Run `supabase/seed.sql` (launch content: 10 places, 10 restaurants + menus, 5 events, 3 trails, transport, govt services, emergency contacts, forum boards, badges).
4. `cp .env.local.example .env.local` and fill in the project URL + anon key.

The data layer ([lib/data.ts](lib/data.ts)) automatically prefers Supabase when env vars are set and falls back to [lib/seed-data.ts](lib/seed-data.ts) otherwise.

## Backend (connected)

The live site is wired to a Supabase project (`ap-south-1`): schema + RLS from `supabase/migrations/`, launch content from `seed.sql`. Auth is email magic-link (Supabase built-in SMTP — limited to a few emails/hour until a custom SMTP provider is configured; phone-OTP needs an SMS provider). Signed-in users write posts, dining plans, cab rides, reviews, memories and trivia to the shared database; signed-out users keep device-local persistence. Moderation (pending memories/trivia/edits) is done in the Supabase dashboard until the in-app admin is connected.

## Built so far

- **Database schema** — complete, covering all 5 tabs + admin/moderation (roles, queued edits, RLS policies, rating triggers, profile auto-creation on signup).
- **Home tab** — hero banner carousel, 2×5 quick-action grid, Today in Satna (live weather via Open-Meteo, thought of the day, history fact, city mood vote), featured places, popular restaurants, upcoming events, "Active right now" live pulse.
- **Discover tab** — pill sub-nav; **Places** (category filters, list cards with directions/update-info); **Restaurants** (Zomato-style: veg/cuisine/price filters, rating/distance sort, open-now logic, list cards) and full **restaurant detail** screen (menu by category, reviews, call now, owner claim, Dine Together shortcut).
- **Dine Together** — browse plans with time/meal filters, join flow, 4-field create-plan form (restaurant picker, datetime, group size 2–6, vibe tag, optional note), safety copy, specced empty states.
- **Share a Cab** — route-filtered ride cards with auto cost-per-person (fare ÷ seats), request-to-join, 6-field post-a-ride form, first-use etiquette note (localStorage).
- **Community tab** — Feed (category filters, like, compose with anonymous toggle), Forums (9 boards with threads, pinned badges), Alerts (severity color coding, Admin Verified vs Community Report, still-active/resolved confirmation), Polls (vote → bar-chart results), Lost & Found, and Memories "Satna Yaadein" (era browse, featured "Satna Ka Ek Safha", "I remember this too").
- Hindi/English toggle (persists in localStorage), bottom nav with active pill, Emergency Contacts screen, Events list, PWA manifest.

> Interactive actions (join/vote/like/post) currently run as local demo state; they wire to Supabase once phone-OTP auth lands (schema + RLS already in place).

## Next

Play tab (quiz/leaderboard/city challenge/bingo), Heritage trails, Transport & Govt Services sections, phone-OTP auth + Supabase write paths, admin panel at `/admin`.
