# Agentic Layer — outdoorgearaff

## Risk Levels & Actions

### Low — Auto (no approval needed)
- `summarise_post(post_id)` → writes `ai_summary` + source + confidence; review_status = 'unreviewed'
- `tag_gear_category(gear_item_id)` → suggests category from name
- `score_ctr(post_id)` → recalculates CTR, updates hot/cold flag

### Medium — Light Approval (owner confirms before apply)
- `draft_gear_features(gear_item_id, product_url)` → proposes features[] + benefits[]; owner reviews diff before save
- `suggest_seo_fields(post_id)` → proposes seo_title + seo_description

### High — Always Approval
- `publish_post(post_id)` → sets status = 'published', published_at = now() — owner must confirm
- `update_affiliate_url(gear_item_id, new_url)` → live link change; must confirm

### Critical — Human Only
- Deleting a post or gear item (irreversible)
- Any bulk-delete or data export

## Named Tools (approved list)
`summarise_post` · `tag_gear_category` · `score_ctr` · `draft_gear_features` · `suggest_seo_fields` · `publish_post` · `update_affiliate_url`

## Audit Log Fields
`id, actor (user_id or 'agent'), tool_name, target_table, target_id, payload_json, outcome, created_at`

## v1
Only `summarise_post` and `score_ctr` are wired; everything else is Later.