# Intelligence Layer — outdoorgearaff

## Messy Input → Structured Output
Owner pastes rough notes about a gear item; AI returns structured draft:

```json
{
  "name": "Black Diamond Spot 400 Headlamp",
  "category": "Lighting",
  "features": ["400-lumen output", "IP67 waterproof", "red night-vision mode"],
  "benefits": ["See the trail clearly", "Stays on in rain", "Preserve night vision at camp"],
  "ai_summary": "A powerful, waterproof headlamp built for serious hikers.",
  "ai_summary_source": "openai/gpt-4o",
  "ai_summary_confidence": 0.88,
  "ai_summary_review_status": "unreviewed"
}
```

## Events to Track
- Post published
- Page viewed
- CTA clicked
- Affiliate URL redirected

## Scoring Rules (rule-based v1)
- **CTR** = click_events / page_views (per post)
- **Hot post** = CTR > 15% in last 7 days → flag in dashboard
- **Cold post** = published > 14 days, 0 clicks → flag for refresh

## What Gets Ranked
- Posts sorted by CTR descending on dashboard
- Gear categories sorted by total clicks

## v1 vs Later
- **v1:** Rule-based CTR flags, manual copy
- **Next:** AI drafts features/benefits from product URL
- **Later:** Auto SEO scoring, headline A/B suggestions