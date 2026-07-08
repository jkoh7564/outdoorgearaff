# Test Plan — outdoorgearaff

## V1 Success Scenario (manual)
1. Open `/` — post list loads; at least 3 seeded posts visible. ✓
2. Click a post title — detail page loads with body text, GearItem card, "Shop Now" button. ✓
3. Open Supabase → `page_views` table — new row exists for that post. ✓
4. Click "Shop Now" — browser redirects to the affiliate URL. ✓
5. Open Supabase → `click_events` — new row with correct post_id and gear_item_id. ✓
6. Open `/admin/posts/new` — fill title, body, add a GearItem with affiliate URL, click Publish. ✓
7. Open `/` — new post appears in list. ✓
8. Open `/admin/dashboard` — new post row shows 0 views, 0 clicks. ✓
9. Visit new post, click CTA — dashboard now shows 1 view, 1 click, CTR = 100%. ✓

## Empty States
- `/` with no published posts → shows "No posts yet" message, not a blank page.
- Post with no GearItems → CTA section hidden, not broken layout.

## Error States
- `/api/track/click` with invalid post_id → returns 400, no redirect.
- Post editor submit with empty title → inline validation, form does not submit.
- Affiliate URL missing scheme → form rejects (must start with `https://`).

## Loading States
- Post list page shows skeleton cards while fetching.
- Post editor save button shows spinner; disabled during in-flight request.

## Security Smoke Tests (Sprint 3)
- `curl -X POST /api/posts` without auth token → 401.
- Anon Supabase client INSERT into `posts` → RLS rejects.
- `OPENAI_API_KEY` not present in browser network tab. ✓