alter table posts
  add column if not exists is_featured boolean not null default false,
  add column if not exists hero_priority integer not null default 100;

create index if not exists posts_featured_homepage_idx
  on posts (status, is_featured desc, hero_priority asc, published_at desc);
