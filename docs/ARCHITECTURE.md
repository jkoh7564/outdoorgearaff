# Architecture — outdoorgearaff

## Stack
- **Frontend:** Next.js 14 (App Router) on Vercel
- **Database + Auth:** Supabase (Postgres + RLS)
- **Styling:** Tailwind CSS
- **AI (later):** OpenAI via server-side API route only

## Now vs Later
**Now:** Post CRUD, GearItem linking, CTA click tracking, public post pages, owner analytics dashboard.
**Later:** AI-drafted post copy, SEO scoring, conversion/revenue import, email capture.

## Key User Action — Visitor Clicks a CTA
1. Visitor opens `/posts/[slug]` — Next.js fetches published Post + GearItems from Supabase.
2. Page renders; a `PageView` row is inserted via a lightweight API route (`/api/track/view`).
3. Visitor clicks "Shop Now" — fires `POST /api/track/click` (post_id, gear_item_id, referrer).
4. API route inserts a `ClickEvent` row, returns the affiliate URL.
5. Browser redirects to the affiliate URL.
6. Owner opens `/admin/dashboard` — sees aggregated views + clicks per post (server-rendered from Supabase).

## Layer Plan
1. **Data first** — tables, RLS, seed rows; site renders without AI.
2. **App logic** — Post editor, public pages, click-tracking routes, dashboard aggregates.
3. **Smart features** — AI copy suggestions, SEO score, auto-tagging (never blocks core).

## Core Without AI
All publishing, tracking, and analytics work purely on Postgres aggregates. AI is additive only.