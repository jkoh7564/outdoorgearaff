# Data Model — outdoorgearaff

## posts
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | owner scoping (lock-down sprint) |
| slug | text unique not null | URL-safe identifier |
| title | text not null | |
| body | text | markdown/rich text |
| status | text | 'draft' \| 'published' |
| hero_image_url | text | |
| seo_title | text | |
| seo_description | text | |
| ai_summary | text | AI field |
| ai_summary_source | text | e.g. 'openai/gpt-4o' |
| ai_summary_confidence | numeric | 0–1 |
| ai_summary_review_status | text | default 'unreviewed' |
| created_at | timestamptz | |
| published_at | timestamptz | |

## gear_items
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| post_id | uuid | FK → posts.id |
| name | text not null | |
| category | text | e.g. 'Tent', 'Boot' |
| features | text[] | bullet list |
| benefits | text[] | bullet list |
| affiliate_url | text not null | destination on click |
| price_display | text | e.g. '$129' |
| image_url | text | |
| created_at | timestamptz | |

## click_events
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| post_id | uuid | FK → posts.id |
| gear_item_id | uuid | FK → gear_items.id |
| referrer | text | |
| user_agent | text | |
| created_at | timestamptz | timestamp = click time |

## page_views
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| post_id | uuid | FK → posts.id |
| referrer | text | |
| created_at | timestamptz | |

## RLS
- All tables: v1 permissive read + write for demo.
- Lock-down sprint: restrict writes to `auth.uid() = user_id`; reads on posts/gear_items filtered to `status = 'published'` for anon.