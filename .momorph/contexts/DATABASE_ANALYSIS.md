# Database Analysis — SSA 2025

**Generated**: 2026-04-28
**Source**: All 7 spec + plan documents (Countdown, Login, Language Selector, Homepage, Award System, Sun* Kudos, Viet Kudos)

---

## Screen Analysis

### Screen 1: Countdown Prelaunch (`/`)

**Entities Identified**: None (config-only)
**Fields**: `LAUNCH_DATETIME` — served from environment variable, not stored in DB
**Notes**: No DB entities. Middleware reads env var on every request. Optional `GET /api/launch-status` for admin override is future-scope.

---

### Screen 2: Login (`/login`)

**Entities Identified**: User (via Supabase Auth)
**Fields**:
- `email` — provided by Google OAuth (Supabase Auth internal)
- `name` — provided by Google profile
- `avatar_url` — provided by Google profile
**Notes**: Supabase Auth owns the `auth.users` table. A `public.users` profile table mirrors identity data for search and display. Profile is created in the OAuth callback handler (no DB trigger — application layer).

---

### Screen 3: Language Selector (shared component)

**Entities Identified**: None
**Fields**: Locale stored in `locale` cookie — no DB persistence required
**Notes**: Cookie-based only. No DB entity.

---

### Screen 4: Homepage SAA (`/`)

**Entities Identified**: AwardCategory (static for MVP)
**Fields**:
- `slug` — URL hash identifier (`top-talent`, `top-project`, etc.)
- `name`, `description`, `prize_amount`, `recipient_count`, `display_order`
**Notes**: Data shipped as static `data/awards.ts` for MVP. Award category table included in schema for future CMS migration. No DB reads on this page for MVP.

---

### Screen 5: Award System (`/awards`)

**Entities Identified**: AwardCategory (same as Homepage — static)
**Fields**: Same as Homepage screen
**Notes**: Static JSON import only. Left-nav hash routing is client-side. No API calls on this page for MVP.

---

### Screen 6: Sun* Kudos (`/kudos`)

**Entities Identified**: Kudos, Like, User, Department, Hashtag, SpotlightBoard, SpecialDay
**Fields**:

**Kudos** (core content):
- `sender_id` (UUID FK → users.id)
- `recipient_id` (UUID FK → users.id)
- `title` (TEXT 1–100 chars)
- `message` (TEXT sanitized HTML, 1–1000 chars readable)
- `hashtags` (TEXT[] — array of selected hashtag strings)
- `image_urls` (TEXT[] — up to 5 CDN URLs from Supabase Storage)
- `heart_count` (INTEGER — denormalized, updated by app on like/unlike)
- `is_anonymous` (BOOLEAN — redacts sender from API response; DB still stores real sender_id)
- `idempotency_key` (UUID UNIQUE — client-generated on modal open, prevents duplicate submission)

**Like** (per-user heart record):
- `kudos_id` (FK → kudos.id)
- `user_id` (UUID FK → users.id)
- `hearts_given` (INTEGER — 1 normally, 2 on special days)
- UNIQUE constraint on `(kudos_id, user_id)` — one record per user per kudos

**Hashtag** (available tags master list):
- `name` (TEXT UNIQUE — e.g. `#thank-you`, `#teamwork`)
- `usage_count` (INTEGER — for ordering popular tags)

**SpotlightBoard** (admin-configured featured sections):
- `title`, `description`, `display_order`
- Junction table `spotlight_board_kudos` maps boards to their featured kudos

**SpecialDay** (x2 hearts multiplier days):
- `date` (DATE UNIQUE)
- `title` (TEXT — label for the special day)
- `multiplier` (INTEGER DEFAULT 2)

**Department** (for recipient department filter):
- `name` (TEXT UNIQUE)

---

### Screen 7: Viet Kudos Modal (overlay on `/kudos`)

**Entities Identified**: Kudos (POST), User (search), Hashtag (selection), UploadedImage (Supabase Storage, URL only in DB)

**Fields** added beyond Sun* Kudos analysis:
- `kudos.idempotency_key` — client UUID generated on modal open; UNIQUE constraint → 409 on resubmission
- `kudos.image_urls` — CDN URL(s) returned by `POST /api/upload`

**API endpoints identified**:
- `POST /api/kudos` — creates kudos record
- `GET /api/users/search?q=` — full-text search on `users.name`
- `GET /api/kudos/hashtags` — returns `hashtags` table
- `POST /api/upload` — uploads image to Supabase Storage; returns CDN URL (stored in `kudos.image_urls`)

---

## Entity Mapping

| Screen | Entities | Key Fields | Relationships |
|--------|----------|------------|---------------|
| Login | User | id, name, avatar_url, department_id | User ↔ Department |
| Homepage | AwardCategory (static MVP) | slug, name, prize_amount | — |
| Award System | AwardCategory (static MVP) | Same | — |
| Sun* Kudos | Kudos, Like, Hashtag, SpotlightBoard, SpecialDay | heartCount, isAnonymous, imageUrls[] | Kudos ↔ User (×2), Kudos ↔ Like, Board ↔ Kudos |
| Viet Kudos | Kudos (POST), User (search), Hashtag | idempotencyKey, imageUrls | Same as above |

---

## Data Flow

```
[Supabase Auth] ─── OAuth ──→ auth.users
                                   │
                                   ▼
                            public.users (profile)
                            name, avatar_url, department_id
                                   │
                        ┌──────────┴──────────┐
                        │                     │
                   sender_id             recipient_id
                        │                     │
                        └──────── kudos ───────┘
                                   │
                      ┌────────────┼────────────┐
                      │            │            │
                    likes      hashtags[]   image_urls[]
                      │          (text[])    (Supabase Storage CDN)
                 kudos_id +
                  user_id
                  hearts_given

[Admin] ──→ special_days (date, multiplier)
[Admin] ──→ spotlight_boards ──→ spotlight_board_kudos ──→ kudos
[Admin] ──→ hashtags (master list for chip selector)
[Admin] ──→ award_categories (future CMS; static JSON for MVP)
```

---

## RLS Policy Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `users` | Auth required | Auth (own row via trigger or app) | Auth (own row) | Auth (own row) |
| `departments` | Public | Admin only | Admin only | Admin only |
| `kudos` | Public | Auth (sender = current user) | Auth (own row) | Auth (own row) |
| `likes` | Auth (own rows) | Auth (user_id = current user) | — | Auth (own rows) |
| `hashtags` | Auth | Admin only | Admin only | Admin only |
| `spotlight_boards` | Auth | Admin only | Admin only | Admin only |
| `spotlight_board_kudos` | Auth | Admin only | Admin only | Admin only |
| `special_days` | Public (cached) | Admin only | Admin only | Admin only |
| `award_categories` | Public | Admin only | Admin only | Admin only |

---

## Open Questions

| # | Question | Blocking? |
|---|----------|-----------|
| OQ-DB-1 | Should `kudos.hashtags TEXT[]` use a GIN index or a full junction table (`kudos_hashtags`)? GIN is simpler; junction is more normalized. | No (GIN recommended for MVP) |
| OQ-DB-2 | Should `users.avatar_url` be stored in DB or always read from Supabase Auth? Storing locally avoids repeated Auth API calls. | No (store locally, sync on login) |
| OQ-DB-3 | Department list source: static seed data or admin-managed table? | No (admin-managed table recommended) |
| OQ-DB-4 | `award_categories` table: include in schema for future CMS or keep static JSON only? | No (include table, seed from static JSON) |
| OQ-DB-5 | Spotlight board kudos: ordered list or unordered? Need `display_order` on junction? | No (add display_order to be safe) |
