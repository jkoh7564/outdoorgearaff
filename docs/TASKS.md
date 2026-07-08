# Tasks — outdoorgearaff

## Sprint 1 — DB + Core Engine (Post → Publish → Click Track)
**Goal:** Owner publishes a post; visitor views it and clicks CTA; click is stored. App works without login.
- [ ] Run migration SQL: create posts, gear_items, click_events, page_views + seed data
- [ ] Public post list page `/` — shows published posts (loading / empty / error states)
- [ ] Public post detail page `/posts/[slug]` — renders body + GearItem cards + "Shop Now" CTA
- [ ] `POST /api/track/view` — inserts page_view row on page load
- [ ] `POST /api/track/click` — inserts click_event, returns affiliate_url; browser redirects
- [ ] Admin post editor `/admin/posts/new` + `/admin/posts/[id]/edit` — create/edit/publish/unpublish (no login gate yet)
- [ ] GearItem form inside post editor — add/edit name, features, benefits, affiliate URL
- [ ] All forms persist to DB; no dead buttons; empty + error states handled

**Definition of Done:** End-to-end scenario in PRD passes manually. ✅ **v1 functional milestone**

---

## Sprint 2 — Owner Dashboard + Analytics
**Goal:** Owner sees CTR, views, clicks per post.
- [ ] `/admin/dashboard` — table: post title, views, clicks, CTR; sorted by CTR desc
- [ ] "Hot" (CTR > 15%) and "Cold" (14d, 0 clicks) flags on post rows
- [ ] Post list in admin with status badges (draft / published)
- [ ] Delete post + gear item (with confirmation modal — critical action)

**Definition of Done:** Dashboard reflects real click_events and page_views; seeded rows show realistic numbers.

---

## Sprint 3 — Lock It Down (Auth + Per-User RLS)
**Goal:** Only the owner can write; visitors stay read-only on published content.
- [ ] Supabase Auth email/password for owner login
- [ ] `/admin` routes redirect to `/login` if not authenticated
- [ ] Replace v1 permissive RLS with owner-scoped write policies
- [ ] Visitor anon policy: read published posts + gear items; write click_events + page_views only
- [ ] Smoke-test: anon cannot POST to posts table directly

**Definition of Done:** Unauthenticated user cannot create/edit/delete posts; owner login works; public site still loads without login.

---

## Sprint 4 — AI Assist (Copy Drafting)
**Goal:** AI helps owner write gear features/benefits and post summaries.
- [ ] `POST /api/ai/summarise-post` — calls OpenAI, writes ai_summary + source + confidence + review_status
- [ ] "Suggest features & benefits" button in GearItem form → shows diff, owner accepts/rejects
- [ ] Review_status badge in admin (unreviewed / approved / rejected)
- [ ] Audit log table + insert on every AI write

**Definition of Done:** AI fields saved with source + confidence; owner can approve or reject; audit log row created.

---

## Gantt (sprint → feature)
```
Sprint 1 | DB schema · public pages · click tracking · post editor
Sprint 2 | Analytics dashboard · CTR flags · admin post list
Sprint 3 | Auth · RLS lock-down · permission smoke tests
Sprint 4 | AI summarise · AI gear features · audit log
```