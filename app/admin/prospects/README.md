# Admin Prospects

Outreach leads imported from Google Maps CSV scrapes. Separate from platform `leads` (form submissions).

## Expected CSV Columns

| Column | Maps to |
|---|---|
| `Google Profile` | `google_profile_url` |
| `Company Name` | `company_name` *(required)* |
| `Rating` | `rating` |
| `Trade` | `trade` |
| `Address` | `address` |
| `Phone` | `phone` |
| `website` | `website` |
| `Reviews_1` | `review_1` |
| `Review Keyword` | `review_keyword` |
| `Reviews_2` | `review_2` |
| `Combined Reviews` | ignored (recomputed) |
| `City` | `city` (defaults to "Houston") |

Extra columns are ignored. Column matching is case-insensitive.

## Scoring Logic

`combined_review` = `review_1` + `review_keyword` + `review_2` joined with spaces.

`communication_issue = true` when `combined_review` contains any of:
`never called`, `no response`, `hard to contact`, `didn't call`, `did not call`, `voicemail`, `call`, `respond`, `reach`, `text`

`priority_score`:
- **3** — communication issue detected
- **2** — rating < 4.5 (no comm issue)
- **1** — standard

## Deduplication

Rows are deduplicated on `lower(company_name) | digits_only(phone) | lower(address)`.
Re-importing the same CSV will update existing rows (upsert), not create duplicates.

## Status Flow

`new` → `contacted` → `replied` → `demo` → `won` / `lost`
