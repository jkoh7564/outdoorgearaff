# PRD — outdoorgearaff

## Problem
The owner needs a controlled place to publish gear-focused content that promotes outdoor products, explains features/benefits, and drives visitors to buy. There is no single tool that combines content publishing, affiliate link management, and click/conversion tracking in one lightweight personal site.

## Target User
Site owner (solo): writes posts, manages links, reads analytics.
Visitors: outdoor enthusiasts, campers, hikers — read content and click through to shop.

## Core Objects
- **Post** — gear article with title, body, gear highlights, CTA button + affiliate link
- **GearItem** — product referenced in a post (name, category, features, benefits, affiliate URL)
- **ClickEvent** — one record per CTA click (post, gear item, timestamp, referrer)
- **PageView** — one record per post visit

## MVP Must-Haves
- [ ] Owner can create, edit, publish, and unpublish a Post
- [ ] Each Post has at least one GearItem with an affiliate link and a "Shop Now" CTA
- [ ] Visitors can browse published posts and click through (click is logged)
- [ ] Owner dashboard shows: views, clicks, CTR per post
- [ ] Seed data makes the site look alive on first load — no login required to view

## Non-Goals (v1)
- Multi-author / team features
- Email capture or newsletter
- Automated AI post generation (drafted later)
- Revenue / conversion tracking beyond click count
- Comments or social features

## Definition of Done
**Pass:** Owner publishes a new post with a GearItem and affiliate link; a visitor opens the post, sees the CTA, clicks it, is redirected to the affiliate URL; owner dashboard shows +1 view and +1 click for that post — all without any login on the visitor side.
**Fail:** Any of those steps is missing, dead, or only seeded data.