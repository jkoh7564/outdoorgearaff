alter table posts enable row level security;
drop policy if exists "posts_v1_read" on posts;
drop policy if exists "posts_v1_write" on posts;
drop policy if exists "posts_public_read_published" on posts;
drop policy if exists "posts_owner_select_all" on posts;
drop policy if exists "posts_owner_insert" on posts;
drop policy if exists "posts_owner_update" on posts;
drop policy if exists "posts_owner_delete" on posts;
create policy "posts_public_read_published" on posts
  for select
  using (status = 'published' or auth.role() = 'authenticated');
create policy "posts_owner_insert" on posts
  for insert
  with check (auth.uid() = user_id);
create policy "posts_owner_update" on posts
  for update
  using (auth.role() = 'authenticated' and (user_id is null or user_id = auth.uid()))
  with check (auth.uid() = user_id);
create policy "posts_owner_delete" on posts
  for delete
  using (auth.role() = 'authenticated' and (user_id is null or user_id = auth.uid()));

alter table gear_items enable row level security;
drop policy if exists "gear_items_v1_read" on gear_items;
drop policy if exists "gear_items_v1_write" on gear_items;
drop policy if exists "gear_items_public_read_published_posts" on gear_items;
drop policy if exists "gear_items_owner_insert" on gear_items;
drop policy if exists "gear_items_owner_update" on gear_items;
drop policy if exists "gear_items_owner_delete" on gear_items;
create policy "gear_items_public_read_published_posts" on gear_items
  for select
  using (
    exists (
      select 1 from posts
      where posts.id = gear_items.post_id
      and (posts.status = 'published' or auth.role() = 'authenticated')
    )
  );
create policy "gear_items_owner_insert" on gear_items
  for insert
  with check (auth.uid() = user_id);
create policy "gear_items_owner_update" on gear_items
  for update
  using (auth.role() = 'authenticated' and (user_id is null or user_id = auth.uid()))
  with check (auth.uid() = user_id);
create policy "gear_items_owner_delete" on gear_items
  for delete
  using (auth.role() = 'authenticated' and (user_id is null or user_id = auth.uid()));

alter table click_events enable row level security;
drop policy if exists "click_events_v1_read" on click_events;
drop policy if exists "click_events_v1_write" on click_events;
drop policy if exists "click_events_owner_read" on click_events;
drop policy if exists "click_events_public_insert" on click_events;
create policy "click_events_owner_read" on click_events
  for select
  using (auth.role() = 'authenticated');
create policy "click_events_public_insert" on click_events
  for insert
  with check (true);

alter table page_views enable row level security;
drop policy if exists "page_views_v1_read" on page_views;
drop policy if exists "page_views_v1_write" on page_views;
drop policy if exists "page_views_owner_read" on page_views;
drop policy if exists "page_views_public_insert" on page_views;
create policy "page_views_owner_read" on page_views
  for select
  using (auth.role() = 'authenticated');
create policy "page_views_public_insert" on page_views
  for insert
  with check (true);

alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
drop policy if exists "audit_logs_v1_write" on audit_logs;
drop policy if exists "audit_logs_owner_read" on audit_logs;
drop policy if exists "audit_logs_owner_insert" on audit_logs;
create policy "audit_logs_owner_read" on audit_logs
  for select
  using (auth.role() = 'authenticated');
create policy "audit_logs_owner_insert" on audit_logs
  for insert
  with check (auth.role() = 'authenticated');
