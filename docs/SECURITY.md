# Security — outdoorgearaff

## Secret Handling
- `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` live in Vercel env vars only — never in client bundles.
- All AI and tracking calls go through Next.js API routes (`/api/*`); frontend never calls OpenAI or Supabase service-role directly.

## Permission Model (end state, reached at lock-down sprint)
- **Visitor (anon):** read published posts + gear items; write click_events + page_views only.
- **Owner (auth.uid = user_id):** full CRUD on posts, gear_items, own analytics.
- **Agent:** inherits owner session — cannot exceed owner permissions; only named tools.
- **v1 (demo):** permissive RLS policies — open read + write on all tables. Replace before real users.

## Approved-Tools Rule
Agent may only call tools in the named list in `AGENTIC_LAYER.md`. No `run_any`, no raw SQL execution, no direct Supabase admin calls from agent context.

## Audit Principle
Every meaningful write (publish, URL change, AI field update, delete) inserts a row into `audit_logs` with actor, tool, target, and timestamp. Logs are append-only; no UI delete for audit rows.