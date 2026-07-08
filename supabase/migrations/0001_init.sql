create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  slug text unique not null,
  title text not null,
  body text,
  status text not null default 'draft',
  hero_image_url text,
  seo_title text,
  seo_description text,
  ai_summary text,
  ai_summary_source text,
  ai_summary_confidence numeric,
  ai_summary_review_status text default 'unreviewed',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;
drop policy if exists "posts_v1_read" on posts;
create policy "posts_v1_read" on posts for select using (true);
drop policy if exists "posts_v1_write" on posts;
create policy "posts_v1_write" on posts for all using (true) with check (true);

create table if not exists gear_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  post_id uuid not null references posts(id) on delete cascade,
  name text not null,
  category text,
  features text[],
  benefits text[],
  affiliate_url text not null,
  price_display text,
  image_url text,
  created_at timestamptz not null default now()
);

alter table gear_items enable row level security;
drop policy if exists "gear_items_v1_read" on gear_items;
create policy "gear_items_v1_read" on gear_items for select using (true);
drop policy if exists "gear_items_v1_write" on gear_items;
create policy "gear_items_v1_write" on gear_items for all using (true) with check (true);

create table if not exists click_events (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  gear_item_id uuid references gear_items(id) on delete set null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table click_events enable row level security;
drop policy if exists "click_events_v1_read" on click_events;
create policy "click_events_v1_read" on click_events for select using (true);
drop policy if exists "click_events_v1_write" on click_events;
create policy "click_events_v1_write" on click_events for all using (true) with check (true);

create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  referrer text,
  created_at timestamptz not null default now()
);

alter table page_views enable row level security;
drop policy if exists "page_views_v1_read" on page_views;
create policy "page_views_v1_read" on page_views for select using (true);
drop policy if exists "page_views_v1_write" on page_views;
create policy "page_views_v1_write" on page_views for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text,
  tool_name text,
  target_table text,
  target_id uuid,
  payload_json jsonb,
  outcome text,
  created_at timestamptz not null default now()
);

alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into posts (id, slug, title, body, status, hero_image_url, seo_title, seo_description, published_at)
values
  ('a1b2c3d4-0001-0001-0001-000000000001', 'best-hiking-boots-2024', 'Best Hiking Boots for 2024: Conquer Any Trail', 'Whether you are tackling rocky ridgelines or muddy forest paths, the right hiking boot makes all the difference. We tested the top picks so you do not have to...', 'published', 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', 'Best Hiking Boots 2024 | OutdoorGearAff', 'Our top picks for hiking boots that handle any terrain — reviewed and ranked.', now() - interval '10 days'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'ultralight-backpacking-tents', 'Ultralight Backpacking Tents That Do Not Sacrifice Shelter', 'Going ultralight does not mean going unprotected. These tents weigh under 2 lbs and still hold up in serious mountain weather...', 'published', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', 'Best Ultralight Tents 2024 | OutdoorGearAff', 'Top ultralight tents for backpackers who want to go fast without getting soaked.', now() - interval '5 days'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'headlamps-for-camping', 'Top Headlamps for Camping and Night Hiking', 'A reliable headlamp is non-negotiable on the trail. We break down lumen output, battery life, and waterproofing across five top models...', 'published', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', 'Best Camping Headlamps 2024 | OutdoorGearAff', 'Five headlamps tested for brightness, battery life, and weather resistance.', now() - interval '2 days')
on conflict (id) do nothing;

insert into gear_items (id, post_id, name, category, features, benefits, affiliate_url, price_display, image_url)
values
  ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Salomon X Ultra 4 GTX', 'Boots', ARRAY['Gore-Tex waterproof lining','Vibram Contagrip sole','Advanced Chassis stability frame'], ARRAY['Keeps feet dry crossing streams','Grips slippery rocks with confidence','Reduces ankle fatigue on long days'], 'https://example.com/salomon-x-ultra-4', '$180', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
  ('b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0002-0002-0002-000000000002', 'Big Agnes Copper Spur HV UL2', 'Tent', ARRAY['1.8 lb total weight','Double-wall construction','DAC Featherlight NSL poles'], ARRAY['Barely notice it in your pack','Handles rain without condensation drips','Sets up in under 5 minutes'], 'https://example.com/big-agnes-copper-spur', '$550', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400'),
  ('b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0003-0003-0003-000000000003', 'Black Diamond Spot 400', 'Lighting', ARRAY['400-lumen max output','IP67 waterproof rating','Red night-vision mode'], ARRAY['Lights up the full trail ahead','Stays on through downpours','Preserves your night vision at camp'], 'https://example.com/bd-spot-400', '$50', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400')
on conflict (id) do nothing;

insert into page_views (post_id, created_at)
values
  ('a1b2c3d4-0001-0001-0001-000000000001', now() - interval '9 days'),
  ('a1b2c3d4-0001-0001-0001-000000000001', now() - interval '8 days'),
  ('a1b2c3d4-0001-0001-0001-000000000001', now() - interval '7 days'),
  ('a1b2c3d4-0002-0002-0002-000000000002', now() - interval '4 days'),
  ('a1b2c3d4-0002-0002-0002-000000000002', now() - interval '3 days'),
  ('a1b2c3d4-0003-0003-0003-000000000003', now() - interval '1 day');

insert into click_events (post_id, gear_item_id, referrer, created_at)
values
  ('a1b2c3d4-0001-0001-0001-000000000001', 'b1b2c3d4-0001-0001-0001-000000000001', 'https://google.com', now() - interval '9 days'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 'b1b2c3d4-0001-0001-0001-000000000001', 'direct', now() - interval '7 days'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'b1b2c3d4-0002-0002-0002-000000000002', 'https://reddit.com', now() - interval '3 days');