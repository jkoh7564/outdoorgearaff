alter table posts
  add column if not exists scheduled_at timestamptz,
  add column if not exists seo_score integer,
  add column if not exists seo_score_notes text,
  add column if not exists headline_suggestions text[];

create table if not exists affiliate_conversions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  post_id uuid references posts(id) on delete set null,
  gear_item_id uuid references gear_items(id) on delete set null,
  network text not null,
  order_id text,
  sale_amount numeric not null default 0,
  commission_amount numeric not null default 0,
  currency text not null default 'USD',
  occurred_at timestamptz not null,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

alter table affiliate_conversions enable row level security;
drop policy if exists "affiliate_conversions_owner_read" on affiliate_conversions;
drop policy if exists "affiliate_conversions_owner_insert" on affiliate_conversions;
drop policy if exists "affiliate_conversions_owner_delete" on affiliate_conversions;
create policy "affiliate_conversions_owner_read" on affiliate_conversions
  for select
  using (auth.role() = 'authenticated');
create policy "affiliate_conversions_owner_insert" on affiliate_conversions
  for insert
  with check (auth.uid() = user_id);
create policy "affiliate_conversions_owner_delete" on affiliate_conversions
  for delete
  using (auth.uid() = user_id);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;
drop policy if exists "newsletter_subscribers_public_insert" on newsletter_subscribers;
drop policy if exists "newsletter_subscribers_owner_read" on newsletter_subscribers;
drop policy if exists "newsletter_subscribers_owner_update" on newsletter_subscribers;
create policy "newsletter_subscribers_public_insert" on newsletter_subscribers
  for insert
  with check (true);
create policy "newsletter_subscribers_owner_read" on newsletter_subscribers
  for select
  using (auth.role() = 'authenticated');
create policy "newsletter_subscribers_owner_update" on newsletter_subscribers
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
