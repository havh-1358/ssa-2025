# Implementation Plan: Sun* Kudos Live Board

**Frame**: `MaZUn5xHXZ-sun-kudos`
**Date**: 2026-04-22
**Spec**: `specs/MaZUn5xHXZ-sun-kudos/spec.md`

---

## Summary

The Sun* Kudos page (`/kudos`) is an authenticated, live recognition board with 6 major sections: (1) Highlight Kudos carousel (top 5 most-liked), (2) Spotlight Boards, (3) recent Kudos feed, (4) filter bar, (5) Stats sidebar, and (6) Top 10 Sunners. The Like Kudos (heart) feature uses optimistic UI with server-side validation. The feed auto-refreshes every 60 seconds via polling, pausing when the tab is hidden. All Kudos and user data is stored in Supabase with mandatory Row-Level Security (RLS). The "Ghi nhan" button opens the Viet Kudos modal (separate plan).

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js App Router
**Primary Dependencies**: React 19, Tailwind CSS 4, next-intl, Supabase JS client, DOMPurify
**Database**: Supabase (PostgreSQL + Auth + Storage)
**Testing**: Vitest + React Testing Library; Playwright E2E
**State Management**: React `useState` + `useReducer` (per-Kudos state via `Map`); `useEffect` for polling; React Context for `isSpecialDay`
**API Style**: REST (`/api/kudos/*`, `/api/admin/special-days`)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Requirement | Constitution Rule | Status |
|-------------|-------------------|--------|
| I. Type Safety | Strict TS; `Kudos`, `Like`, `User` types from `types/kudos.ts` | ✅ Planned |
| II. Design Fidelity | All hex tokens → CSS vars in `globals.css`; no raw hex in components | ✅ Planned |
| II. Responsive | 320/768/1280 breakpoints; sidebar moves below feed on tablet/mobile | ✅ Planned |
| II. WCAG 2.1 AA | `aria-pressed` on heart; `aria-live` on count; keyboard accessible | ✅ Planned |
| II. Touch target | Heart button `min-height: 44px` via `py-[6px]` padding | ✅ Planned |
| III. Test-First | Tests before components | ✅ Planned |
| IV. Layered Arch | Page → Sections → `useKudosFeed` + `useLike` hooks → API clients | ✅ Planned |
| IV. Clean Code | Polling logic in `useKudosFeed`; like logic in `useLike`; no magic values | ✅ Planned |
| V. Doc-Driven | spec.md + plan.md exist | ✅ Met |
| VI. Security | DOMPurify on Kudos messages; RLS on all tables; server-side like validation | ✅ Planned |

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure** (Client Components unless noted):
  - `app/kudos/page.tsx` — Server Component; validates auth; fetches initial data (SSR); renders `<KudosPage />`
  - `<KudosPage />` — Client Component; composes all sections; owns polling `useEffect`
  - `<Header activeNav="kudos" />` — Shared Server Component with `<LanguageSelector />` island
  - `<KudosKeyvisual />` — Server Component; 512px banner
  - `<WriteKudosButton />` — Client Component; opens Viet Kudos modal
  - `<SearchSunnerInput />` — Client Component; search bar (UI only in MVP; connects to filter)
  - `<HighlightKudos />` — Client Component; carousel of top 5; owns `activeSlide` state
  - `<SpotlightBoards />` — Client Component; fetched spotlight boards
  - `<KudosFeed />` — Client Component; owns `kudosList`, pagination, polling via `useKudosFeed` hook
  - `<KudosCard />` — Presentational; renders one Kudos with sender, recipient, message, hashtags, images, actions
  - `<LikeButton />` — Client Component island; owns `useLike` hook; optimistic update
  - `<CopyLinkButton />` — Client Component; clipboard API
  - `<StatsPanel />` — Client Component; stats + Top 10 Sunners sidebar
  - `<SpecialDayContext />` — React Context Provider; `isSpecialDay` fetched once at page mount
  - `<Footer />` — Shared Server Component

- **Styling Strategy**: Tailwind CSS 4 + CSS custom properties. Kudos card is cream (`#FFF8E1`) on a dark page; all card-internal text is `#00101A`.

- **Data Fetching**:
  - Initial SSR: `app/kudos/page.tsx` fetches highlights + first page of feed + stats + top-10 + `isSpecialDay` in parallel via `Promise.all`
  - Client polling: `useKudosFeed` runs `setInterval(60000)` to refresh feed; pauses on `visibilitychange` hidden
  - Like/unlike: `useLike` calls `POST /api/kudos/:id/like` or `DELETE /api/kudos/:id/like`
  - Hashtag filter: client-side param added to feed fetch

- **Optimistic UI (Like)**:
  - On click → immediately update `Map<kudosId, { heartCount, likedByMe, isLiking }>` state
  - Call API → on success: sync confirmed count from server response
  - On failure: roll back state to pre-click values; show toast error

- **60s Polling**:
  - `useKudosFeed` hook owns `setInterval` + `visibilitychange` listener
  - On poll: set `isRefreshing: true` → fetch new page 1 → merge with existing list (dedup by `id`) → `isRefreshing: false`
  - Do NOT reset `currentPage` on poll (user may be on page 3)

### Backend Approach

- **API Routes** (`app/api/kudos/`):
  - `GET /api/kudos` — paginated feed; params: `limit`, `page`, `hashtag`, `department`
  - `GET /api/kudos/highlights` — top 5 by `heartCount` DESC
  - `GET /api/kudos/spotlight` — spotlight boards
  - `GET /api/kudos/stats` — total counts
  - `GET /api/kudos/top-sunners` — top 10 recipients
  - `POST /api/kudos/:id/like` — add like; validates: auth, not own kudos, not already liked
  - `DELETE /api/kudos/:id/like` — remove like; validates: auth, like exists
  - `GET /api/admin/special-days` — check if today is a special day
- **Middleware**: Auth check via Supabase session cookie; unauthenticated → 401
- **Supabase RLS**: `kudos` table — public SELECT; INSERT requires auth; `likes` table — SELECT requires auth (own rows only visible for like state); INSERT/DELETE requires auth + ownership check

### Integration Points

- **Viet Kudos modal**: `<WriteKudosButton />` opens `<WriteKudosModal />` (from Viet Kudos plan). After successful submission, modal fires `onSuccess` callback → `<KudosFeed />` prepends new Kudos to list.
- **Supabase**: `@supabase/ssr` for server-side session; `@supabase/supabase-js` client for client-side requests
- **DOMPurify**: Applied in `<KudosMessage />` before `dangerouslySetInnerHTML`. Server-side: strip HTML on ingest (store as sanitized HTML or plain text).

---

## Project Structure

### Documentation

```text
.momorph/specs/MaZUn5xHXZ-sun-kudos/
├── spec.md
├── design-style.md
└── plan.md   ← this file
```

### Source Code

```text
app/
├── kudos/
│   └── page.tsx                          # Server Component: auth check + SSR data fetch + SpecialDayContext
└── api/
    └── kudos/
        ├── route.ts                       # GET /api/kudos (feed)
        ├── highlights/route.ts            # GET /api/kudos/highlights
        ├── spotlight/route.ts             # GET /api/kudos/spotlight
        ├── stats/route.ts                 # GET /api/kudos/stats
        ├── top-sunners/route.ts           # GET /api/kudos/top-sunners
        └── [id]/
            └── like/route.ts             # POST + DELETE /api/kudos/:id/like

components/
├── kudos/
│   ├── KudosPage.tsx                     # Client: layout + polling trigger
│   ├── HighlightKudos.tsx                # Client: carousel, activeSlide state
│   ├── SpotlightBoards.tsx               # Client: spotlight boards section
│   ├── KudosFeed.tsx                     # Client: feed list + pagination + polling (useKudosFeed)
│   ├── KudosCard.tsx                     # Presentational: one Kudos card (680px cream)
│   ├── KudosMessage.tsx                  # Presentational: DOMPurify-wrapped message content
│   ├── HashtagList.tsx                   # Presentational: red hashtag chips
│   ├── ImageGallery.tsx                  # Presentational: up to 5 image thumbnails (88×88px)
│   ├── LikeButton.tsx                    # Client: useLike hook; optimistic heart toggle
│   ├── CopyLinkButton.tsx                # Client: clipboard API
│   ├── WriteKudosButton.tsx              # Client: opens Viet Kudos modal
│   ├── SearchSunnerInput.tsx             # Client: search bar UI
│   └── StatsPanel.tsx                    # Client: stats + Top 10 Sunners
└── shared/
    └── SpecialDayContext.tsx             # React Context: isSpecialDay boolean

hooks/
├── useKudosFeed.ts                       # Feed pagination + 60s polling + visibilitychange
└── useLike.ts                            # Optimistic like/unlike; per-kudos Map state

lib/
└── kudos.ts                              # Supabase queries; Zod schemas for API responses

types/
└── kudos.ts                              # Kudos, Like, User TypeScript interfaces

public/
└── assets/
    └── kudos/
        └── keyvisual.jpg                 # Kudos page banner (1440×512px)
```

### Modified Files

| File | Change |
|------|--------|
| `app/globals.css` | Add kudos-specific tokens: `--color-kudos-card-bg`, `--color-kudos-msg-bg`, `--color-kudos-text`, `--color-hashtag`, `--color-timestamp`, `--radius-kudos-card`, `--feed-gap`, `--sidebar-gap`, `--highlight-gap` |
| `middleware.ts` | Ensure `/kudos` route requires auth (redirect to `/login` if unauthenticated) |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@supabase/ssr` | `^0.x` | Server-side Supabase session (App Router) |
| `@supabase/supabase-js` | `^2.x` | Supabase client |
| `dompurify` | `^3.x` | Sanitize Kudos message HTML before render |
| `@types/dompurify` | `^3.x` | TypeScript types for DOMPurify |

---

## Implementation Strategy

### Phase 0: Asset Preparation

- Export Kudos page banner → `public/assets/kudos/keyvisual.jpg` (1440×512px)
- Add kudos CSS tokens to `app/globals.css`
- Verify Supabase is configured; create `.env.local` vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Create Supabase tables + RLS policies (migration):
  - `kudos` (id, senderId, recipientId, title, message, hashtags, imageUrl, heartCount, isAnonymous, createdAt)
  - `likes` (kudosId, userId, heartsGiven, createdAt) — unique constraint on `(kudosId, userId)`
  - RLS: `kudos` public SELECT; `likes` SELECT own rows + INSERT/DELETE auth required

### Phase 1: Foundation (TDD) — Types + Hooks

1. Define `types/kudos.ts` (Kudos, Like, User interfaces)
2. Write Zod schemas in `lib/kudos.ts` for API response validation
3. Write failing tests for `useLike` hook:
   - Optimistic increment on click
   - Roll back on API failure
   - Prevents double-click while `isLiking`
   - Own kudos: `likedByMe` unchanged, no API call
4. Implement `useLike.ts`
5. Write failing tests for `useKudosFeed` hook:
   - Returns first page of kudos
   - `loadMore` appends next page
   - 60s interval fires refresh
   - Polling pauses on hidden tab; resumes on focus
6. Implement `useKudosFeed.ts`

### Phase 2: API Routes (US3 + US4 foundation)

1. Implement `GET /api/kudos` (feed with pagination + filters) — Zod input validation
2. Implement `POST /api/kudos/:id/like` — auth check + not-own-kudos check + unique constraint
3. Implement `DELETE /api/kudos/:id/like` — auth check + ownership check
4. Implement `GET /api/kudos/highlights` (top 5)
5. Implement `GET /api/kudos/stats` + `GET /api/kudos/top-sunners`
6. Implement `GET /api/admin/special-days`
7. Write API tests for each route (auth, validation, RLS enforcement)

### Phase 3: Core UI — Feed + Like (US3 + US4)

1. Write component tests for `<KudosCard />` (renders sender, recipient, message, hashtags)
2. Implement `<KudosCard />` with cream bg, gold dividers, `<KudosMessage />` (DOMPurify)
3. Write component tests for `<LikeButton />` (optimistic UI, `aria-pressed`, `min-height: 44px`)
4. Implement `<LikeButton />` using `useLike` hook
5. Implement `<KudosFeed />` using `useKudosFeed` hook (polling, pagination, load more)
6. Write E2E: like a kudos → count increments → unlike → count decrements

### Phase 4: Highlight + Spotlight (US1 + US2)

1. Write tests for `<HighlightKudos />` (carousel navigation, dot indicators)
2. Implement `<HighlightKudos />` carousel (top 5)
3. Implement `<SpotlightBoards />`
4. Implement `app/kudos/page.tsx` (SSR initial data fetch + `<SpecialDayContext.Provider />`)
5. Wire `<KudosPage />` composing all sections

### Phase 5: Filter + Stats (US5 + US6 + US7)

1. Implement `<SearchSunnerInput />` (filter by hashtag/department)
2. Connect filter to `useKudosFeed` (refetch with filter params)
3. Implement `<StatsPanel />` (total kudos, hearts, participants)
4. Implement Top 10 Sunners widget within `<StatsPanel />`
5. E2E: click hashtag chip → feed filters → clear → all kudos return

### Phase 6: Polish

- Responsive: sidebar (Stats + Top 10) moves below feed on tablet/mobile
- Carousel: `prefers-reduced-motion` — disable slide animation
- Heart animation: bounce scale 1 → 1.3 → 1 (300ms); respect `prefers-reduced-motion`
- `aria-live="polite"` wrapper on heart count
- Toast notifications: like error (roll back), copy link success
- Copy Link button: write `{origin}/kudos#{kudosId}` to clipboard; `aria-label` update
- `isSpecialDay` visual: "x2" badge on heart button when on special day
- Middleware: ensure unauthenticated users on `/kudos` redirect to `/login`

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Optimistic UI race condition (rapid clicks) | Medium | Medium | `isLiking` flag per kudos blocks second click; server enforces unique constraint |
| RLS policy too restrictive (blocks feed) | Medium | High | Test with both anon and auth sessions; `kudos` SELECT is public |
| DOMPurify missing → XSS | Low | High | Enforce via code review + lint rule; always required in `<KudosMessage />` |
| 60s polling hammering server on busy event day | Medium | Medium | Polling fetches diff only (page 1); add `If-None-Match` / ETag caching |
| `isSpecialDay` stale mid-session | Low | Low | Acceptable for MVP per spec; user sees correct state on next reload |
| Supabase not yet configured | High | High | Configure Supabase project before Phase 0; add env vars to `.env.local` |
| Viet Kudos modal not yet built | High | High | Build Kudos feed first; `<WriteKudosButton />` renders without modal initially; wire modal in final phase |

### Estimated Complexity

- **Frontend**: High (7 user stories; optimistic UI; polling; carousel; responsive sidebar)
- **Backend**: Medium (RLS policies; like uniqueness; server-side validation)
- **Testing**: High (optimistic UI rollback; polling pause/resume; auth flows)

---

## Integration Testing Strategy

### Test Scope

- [x] **Feed rendering**: Kudos cards display with correct content and cream bg
- [x] **Like flow**: Optimistic update → server confirm → rollback on error
- [x] **Own Kudos**: Heart button disabled/hidden for sender
- [x] **Polling**: Feed refreshes every 60s; pauses on hidden tab
- [x] **Filter**: Hashtag filter narrows feed; clear filter restores all
- [x] **Auth**: Unauthenticated user action → redirect to `/login`
- [ ] **Special day**: Admin-configured; tested via env override or test fixture

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Like button → optimistic update → server confirm |
| App ↔ Data Layer | Yes | RLS: public read, auth write; unique like constraint |
| Cross-platform | Yes | Sidebar position at 320/768/1280 |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| `Date.now()` | Mock | Control special-day detection |
| Supabase client | Real (test Supabase project) | Verify RLS policies work correctly |
| `setInterval` / `visibilitychange` | Mock in unit tests | Control polling in hook tests |
| `navigator.clipboard` | Mock | Clipboard API not available in jsdom |
| `router.push` | Mock | Verify redirect on 401 |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] `/kudos` renders all sections (highlights, spotlight, feed, stats, top 10)
   - [ ] Like a kudos → heart fills → count increases by 1 (or 2 on special day)
   - [ ] Unlike a kudos → heart hollow → count decreases by same amount
   - [ ] 60s poll fires → new kudos appears at top of feed
   - [ ] Click hashtag → feed filters → clear → all shown

2. **Error Handling**
   - [ ] Like API fails → heart returns to previous state → toast shown
   - [ ] Feed load fails → `feedError` state → retry UI shown
   - [ ] Own kudos → heart button disabled → no API call on click attempt

3. **Edge Cases**
   - [ ] Tab hidden → polling pauses → tab visible → polling resumes
   - [ ] Auth cookie expires mid-session → like returns 401 → toast + redirect to `/login`
   - [ ] Very long kudos message → truncated at 3 lines with "Read more"
   - [ ] Highlight section with 0 liked kudos → empty state (no crash)

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `useLike` hook | 100% | High |
| `useKudosFeed` hook | 95%+ | High |
| `<LikeButton />` component | 90%+ | High |
| `POST /api/kudos/:id/like` route | 100% | High |
| E2E like/unlike flow | Key flow | High |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved
- [ ] Supabase project configured (URL + keys in `.env.local`)
- [ ] Supabase DB tables created with RLS policies (migration)
- [ ] `@supabase/ssr` + `@supabase/supabase-js` installed
- [ ] `dompurify` installed
- [ ] Authentication implemented (Supabase Auth — Google OAuth from Login plan)
- [ ] Kudos page banner exported → `public/assets/kudos/keyvisual.jpg`
- [ ] Viet Kudos modal built (for Write Kudos CTA wiring) — can defer to Phase 6

### External Dependencies

- Supabase project (PostgreSQL + Auth + Storage + RLS)
- DOMPurify (XSS prevention for Kudos messages)

---

## Next Steps

1. Configure Supabase project and create DB migration (Phase 0)
2. Run `/momorph.tasks` to generate task breakdown
3. Begin TDD with `useLike` hook (Phase 1)

---

## Notes

- **DOMPurify is non-negotiable**: Constitution Principle VI. Every Kudos message rendered with `dangerouslySetInnerHTML` MUST pass through DOMPurify. Prefer storing Kudos as sanitized HTML or plain text + markdown to simplify rendering.
- **60s polling is NOT Supabase Realtime**: Realtime is explicitly out of scope for MVP. Use `setInterval(60000)` in `useKudosFeed`. When Supabase Realtime is added later, the hook interface stays the same.
- **`isSpecialDay` is React Context**: Fetched once at page mount in `app/kudos/page.tsx` (SSR); passed via `<SpecialDayContext.Provider value={{ isSpecialDay }}>`. All `<LikeButton />` instances read from context — do NOT re-fetch on every click.
- **Supabase RLS for anonymous kudos**: When `isAnonymous = true`, the `senderId` and `senderName` MUST NOT appear in API responses. Enforce via RLS policy or view that redacts sender fields when `isAnonymous = true`.
- **Per-kudos state via Map**: `Map<string, KudosLocalState>` is used for `useLike` state to avoid O(n) re-renders on the full list. Only the specific card whose state changes re-renders.
- **Heart count format**: Vietnamese locale — use `Intl.NumberFormat('vi-VN')` for display (e.g., 1000 → "1.000"). This is a display-only format; store raw integers in the DB.
