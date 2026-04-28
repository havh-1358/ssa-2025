# Tasks: Sun* Kudos Live Board

**Frame**: `MaZUn5xHXZ-sun-kudos`
**Prerequisites**: plan.md (required), spec.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1–US7)
- **|**: File path affected by this task

---

## Phase 0: Asset Preparation

**Purpose**: Prepare all static assets, environment config, and database schema before any code is written

- [x] T001 Add Kudos CSS tokens to globals.css (`--color-kudos-card-bg`, `--color-kudos-msg-bg`, `--color-kudos-text`, `--color-hashtag`, `--color-timestamp`, `--radius-kudos-card`, `--feed-gap`, `--sidebar-gap`, `--highlight-gap`) | app/globals.css
- [x] T002 [P] Place Kudos page banner (1440×512px) exported from Figma | public/assets/kudos/keyvisual.jpg
- [x] T003 [P] Verify `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [x] T004 Write Supabase migration: create `kudos` table (`id`, `senderId`, `recipientId`, `title`, `message`, `hashtags`, `imageUrls text[]`, `heartCount`, `isAnonymous`, `createdAt`); `imageUrls` is non-nullable text array
- [x] T005 Write Supabase migration: create `likes` table (`kudosId`, `userId`, `heartsGiven`, `createdAt`); add unique constraint on `(kudosId, userId)`
- [x] T006 [P] Write Supabase RLS policies: `kudos` public SELECT; `kudos` INSERT requires auth; `likes` SELECT own rows only; `likes` INSERT/DELETE requires auth + ownership
- [x] T007 [P] Install dependencies: `@supabase/ssr`, `@supabase/supabase-js`, `dompurify`, `@types/dompurify`

**Checkpoint**: Assets, env vars, DB schema, and RLS all ready — foundation work can begin

---

## Phase 1: Foundation — Types, Repository, Service, Contexts, Hooks

**Purpose**: Core infrastructure required by ALL user stories

**CRITICAL**: No user story UI work can begin until this phase is complete

- [x] T008 Define TypeScript interfaces: `Kudos` (`imageUrls: string[]`, `isAnonymous: boolean`), `Like`, `User`, `KudosLocalState` — fields must match spec Data Requirements exactly | types/kudos.ts
- [x] T009 Implement Zod schemas for DB response validation (`kudosRowSchema`, `likeRowSchema`, `userRowSchema`) | lib/kudos-repository.ts
- [x] T010 Implement repository functions: `findKudosFeed`, `findKudosHighlights`, `findSpotlightBoards`, `findKudosStats`, `findTopSunners`, `findHashtags`, `insertLike`, `deleteLike` using Supabase client | lib/kudos-repository.ts
- [x] T011 Implement service layer: `getKudosFeed`, `getHighlights`, `getSpotlightBoards`, `getStats`, `getTopSunners`, `getHashtags`; anonymous redaction (`senderId`/`senderName`/`senderAvatar` omitted when `isAnonymous=true`); `imageUrls` always returned as `string[]` (never null) | lib/kudos-service.ts
- [x] T012 Implement like validation in service: auth check, not-own-kudos guard, not-already-liked guard; `unlikeKudos` validation: auth + like exists; hearts-given = 1 normally, 2 on special day | lib/kudos-service.ts
- [x] T013 [P] Implement `LikeStateContext`: provides `Map<kudosId, KudosLocalState>` (heartCount, likedByMe, isLiking) and dispatch to update individual entries; shared between `HighlightKudos` and `KudosFeed` | components/shared/LikeStateContext.tsx
- [x] T014 [P] Implement `SpecialDayContext`: provides `isSpecialDay: boolean`; fetched once at page mount via SSR, passed as initial value | components/shared/SpecialDayContext.tsx
- [x] T015 Implement `useLike` hook: reads/writes `LikeStateContext`; on click — optimistic update Map entry → call `POST /api/kudos/:id/like` or `DELETE /api/kudos/:id/like` → sync confirmed count; rollback Map entry on failure; blocks second click while `isLiking=true`; does nothing when kudos is own | hooks/useLike.ts
- [x] T016 Implement `useKudosFeed` hook: fetches paginated feed; `loadMore` appends next page; `setInterval(60000)` polling — on poll fetch page 1 and merge with existing list (dedup by `id`, do NOT reset `currentPage`); pause polling on `visibilitychange` hidden; resume on visible; expose `isRefreshing`, `feedError`, `kudosList`, `loadMore`, `setFilterHashtag`, `setFilterDepartment` | hooks/useKudosFeed.ts
- [x] T017 [P] Add `/kudos` route auth guard to middleware: unauthenticated requests redirect to login path from SCREENFLOW.md | middleware.ts

**Checkpoint**: Foundation complete — all user story phases can now begin

---

## Phase 2: API Routes

**Purpose**: REST endpoints that serve all user story data; route handlers must be thin (delegate to service layer)

- [x] T018 Implement `GET /api/kudos`: paginated feed; query params `limit`, `page`, `hashtag`, `department`; Zod input validation; delegates to `kudos-service.getKudosFeed`; returns `ApiResponse<Kudos[]>` with `meta` (total, page, limit) | app/api/kudos/route.ts
- [x] T019 [P] Implement `GET /api/kudos/hashtags`: returns full hashtag list; delegates to `kudos-service.getHashtags`; shared with Viet Kudos modal | app/api/kudos/hashtags/route.ts
- [x] T020 Implement `POST /api/kudos/[id]/like`: auth required; delegates like validation + hearts-given to `kudos-service.likeKudos`; returns updated `heartCount`; returns 409 if already liked; returns 403 if own kudos | app/api/kudos/[id]/like/route.ts
- [x] T021 Implement `DELETE /api/kudos/[id]/like`: auth required; delegates to `kudos-service.unlikeKudos`; returns updated `heartCount`; returns 404 if like not found | app/api/kudos/[id]/like/route.ts
- [x] T022 [P] Implement `GET /api/kudos/highlights`: returns top 5 kudos by `heartCount DESC`; delegates to `kudos-service.getHighlights` | app/api/kudos/highlights/route.ts
- [x] T023 [P] Implement `GET /api/kudos/spotlight`: returns spotlight boards; delegates to `kudos-service.getSpotlightBoards` | app/api/kudos/spotlight/route.ts
- [x] T024 [P] Implement `GET /api/kudos/stats`: returns total kudos sent, total hearts given, total participants; delegates to `kudos-service.getStats` | app/api/kudos/stats/route.ts
- [x] T025 [P] Implement `GET /api/kudos/top-sunners`: returns top 10 recipients by hearts received; delegates to `kudos-service.getTopSunners` | app/api/kudos/top-sunners/route.ts
- [x] T026 [P] Implement `GET /api/admin/special-days`: returns `{ isSpecialDay: boolean }` for today's date; auth required (admin or service role) | app/api/admin/special-days/route.ts

**Checkpoint**: All API routes implemented and returning correct shapes

---

## Phase 3: Core UI — Kudos Feed + Like (US3 + US4)

**Goal**: Paginated Kudos feed with load more, 60s polling, message truncation, image gallery, anonymous display, and optimistic like/unlike

**Independent Test**: Navigate to `/kudos`; feed renders cards; like button increments count; unlike decrements; own kudos button is disabled

### Presentational Components (US3)

- [x] T027 [US3] Implement `<KudosMessage />`: wraps message content with `DOMPurify.sanitize` before `dangerouslySetInnerHTML`; no raw HTML ever rendered without sanitization | components/kudos/KudosMessage.tsx
- [x] T028 [US3] Implement `<HashtagList />`: renders red hashtag chip list; each chip is clickable and calls `onHashtagClick(tag)` callback; active chip highlighted | components/kudos/HashtagList.tsx
- [x] T029 [US3] Implement `<ImageGallery />`: accepts `imageUrls: string[]`; renders up to 5 thumbnails at 88×88px; renders nothing (no wrapper) when array is empty | components/kudos/ImageGallery.tsx
- [x] T030 [US3] Implement `<KudosCard />`: cream bg (`var(--color-kudos-card-bg)`); renders sender/recipient names and avatars; when `isAnonymous=true` — derive display object with `senderName='Ẩn danh'` and placeholder avatar (immutable, no mutation of prop); actual `senderId`/`senderName` must NOT appear in DOM; renders `<KudosMessage />`; CSS `line-clamp: 3` truncation with "Xem thêm" toggle that expands to full message in-place; renders `<HashtagList />` with click callback; renders `<ImageGallery imageUrls={kudos.imageUrls} />`; renders `<LikeButton />` and `<CopyLinkButton />` | components/kudos/KudosCard.tsx
- [x] T031 [P] [US4] Implement `<CopyLinkButton />`: writes `{origin}/kudos#{kudosId}` to clipboard; `aria-label` toggles to confirm after copy; on page load if `window.location.hash` matches kudosId, scrolls card into view | components/kudos/CopyLinkButton.tsx

### Like Button (US4)

- [x] T032 [US4] Implement `<LikeButton />`: uses `useLike` hook; reads heart count and `likedByMe` from `LikeStateContext`; `aria-pressed` reflects `likedByMe`; `aria-live="polite"` on count span; `min-height: 44px` via padding; disabled when `isOwnKudos=true` or `isLiking=true`; shows "x2" badge when `isSpecialDay=true` (from `SpecialDayContext`); heart bounce animation (scale 1→1.3→1, 300ms); respects `prefers-reduced-motion`; formats count via `Intl.NumberFormat('vi-VN')` | components/kudos/LikeButton.tsx

### Feed (US3)

- [x] T033 [US3] Implement `<KudosFeed />`: uses `useKudosFeed` hook; renders list of `<KudosCard />`; "Load more" button appends next page; renders empty state "Be the first to send a Kudos!" with Write Kudos CTA when `kudosList` is empty; shows `isRefreshing` indicator; shows error state with retry when `feedError` is non-null | components/kudos/KudosFeed.tsx

**Checkpoint**: US3 and US4 complete — feed renders, like/unlike works optimistically

---

## Phase 4: Highlight Kudos + Spotlight Boards (US1 + US2)

**Goal**: Top-5 liked kudos carousel with shared like state; spotlight boards with 4 UI states

**Independent Test**: Carousel renders top 5; like in feed reflects in carousel; spotlight shows boards or appropriate empty/error/loading state

### Highlight Kudos (US1)

- [x] T034 [US1] Implement `<HighlightKudos />`: carousel of top 5 kudos by heartCount; owns `activeSlide` state; dot indicators; renders `<KudosCard />` inside carousel; `<LikeButton />` inside carousel reads `LikeStateContext` so like count stays in sync with feed; renders empty state "No highlighted Kudos yet" when `highlights.length === 0` (no crash); carousel slide animation disabled when `prefers-reduced-motion` is set | components/kudos/HighlightKudos.tsx

### Spotlight Boards (US2)

- [x] T035 [US2] Implement `<SpotlightBoards />`: manages `isLoadingSpotlight: boolean` and `spotlightError: string | null` local state; four states — loading: skeleton placeholder; error: non-sensitive message + retry button (no stack trace exposed); empty: "No spotlights yet" message (no blank gap in layout); populated: board list; retry handler calls `GET /api/kudos/spotlight` | components/kudos/SpotlightBoards.tsx

### Page Assembly (US1 + US2)

- [x] T036 [US1] [US2] Implement `app/kudos/page.tsx` Server Component: auth check (redirect to login if unauthenticated); fetch `highlights`, first feed page, stats, top-10, and `isSpecialDay` in parallel via `Promise.all`; catch spotlight fetch failure and surface as `spotlightError` prop (do NOT crash page); wrap content in `<SpecialDayContext.Provider>` and `<LikeStateContext.Provider initialState={initialLikeMap}>` | app/kudos/page.tsx
- [x] T037 [US1] [US2] Implement `<WriteKudosButton />`: Client Component; opens Viet Kudos modal (or renders placeholder button if modal not yet available); accepts `onSuccess` callback to prepend new Kudos to feed | components/kudos/WriteKudosButton.tsx
- [x] T038 [US1] [US2] Implement `<KudosPage />` Client Component: composes `<HighlightKudos />`, `<SpotlightBoards />`, `<KudosFeed />`, `<StatsPanel />`; receives SSR initial data as props; renders `<WriteKudosButton onSuccess={prependKudos} />`; owns `<SearchSunnerInput />` | components/kudos/KudosPage.tsx

**Checkpoint**: US1 and US2 complete — carousel and spotlight boards render with correct states

---

## Phase 5: Filters + Stats (US5 + US6 + US7)

**Goal**: Hashtag and department filters wire to feed; stats panel with Top 10 Sunners

**Independent Test**: Click hashtag chip → feed narrows; clear → all kudos return; stats panel shows correct totals and leaderboard

### Filters (US5 + US6)

- [x] T039 [US5] Implement hashtag filter: clicking a hashtag chip in `<HashtagList />` calls `setFilterHashtag(tag)` from `useKudosFeed`; active chip displayed in filter bar with clear button that calls `setFilterHashtag(null)`; triggers page-1 refetch with `hashtag` param | components/kudos/KudosFeed.tsx
- [x] T040 [US6] Implement `<SearchSunnerInput />`: renders search bar UI; includes department filter — dropdown or button group; calls `setFilterDepartment(dept)` from `useKudosFeed`; triggers page-1 refetch with `department` param; clear button resets to all kudos | components/kudos/SearchSunnerInput.tsx
- [x] T041 [US5] [US6] Connect both hashtag and department filters to `useKudosFeed`: when either filter changes reset to page 1 and refetch; preserve other filter when one changes | hooks/useKudosFeed.ts

### Stats (US7)

- [x] T042 [US7] Implement `<StatsPanel />`: displays total kudos sent, total hearts given, total participants using data from `GET /api/kudos/stats`; renders Top 10 Sunners leaderboard using data from `GET /api/kudos/top-sunners`; formats numbers with `Intl.NumberFormat('vi-VN')` | components/kudos/StatsPanel.tsx

**Checkpoint**: US5, US6, and US7 complete — filters and stats sidebar fully functional

---

## Phase 6: Polish and Cross-Cutting Concerns

**Purpose**: Responsive layout, accessibility, animations, toast notifications, and final wiring

- [x] T043 [P] Responsive layout: sidebar (`<StatsPanel />`) moves below feed on tablet (768px) and mobile (320px); feed and sidebar stack vertically; verify at 320/768/1280 breakpoints | components/kudos/KudosPage.tsx
- [x] T044 [P] Toast notifications: show error toast on like failure (after rollback); show success toast on copy link; use project toast utility (or implement minimal toast) | components/kudos/LikeButton.tsx
- [x] T045 [P] Deep-link scroll: on page load, if `window.location.hash` matches a Kudos `id`, scroll that card into view via `scrollIntoView({ behavior: 'smooth' })` after feed renders | components/kudos/KudosFeed.tsx
- [x] T046 [P] `isSpecialDay` visual: render "x2" badge on `<LikeButton />` when `isSpecialDay=true`; badge must be visible and accessible (`aria-label` includes "x2 hearts") | components/kudos/LikeButton.tsx
- [x] T047 [P] Verify all `href` navigation values (login redirect, etc.) are sourced from `.momorph/contexts/SCREENFLOW.md` — no hardcoded paths | middleware.ts
- [x] T048 [P] Confirm Viet Kudos modal `onSuccess` callback wires into `<KudosFeed />` to prepend newly submitted Kudos to list | components/kudos/WriteKudosButton.tsx

**Checkpoint**: All user stories polished — responsive, accessible, toasts, deep-link, special-day badge

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0 (Asset Prep)**: No dependencies — start immediately
- **Phase 1 (Foundation)**: Depends on Phase 0 (env vars, DB tables, CSS tokens) — BLOCKS all phases
- **Phase 2 (API Routes)**: Depends on Phase 1 (types, repository, service) — BLOCKS UI phases
- **Phase 3 (Feed + Like)**: Depends on Phase 2 (API routes) and Phase 1 (hooks, contexts)
- **Phase 4 (Highlight + Spotlight)**: Depends on Phase 3 (`<KudosCard />`, `<LikeButton />`, `LikeStateContext`)
- **Phase 5 (Filters + Stats)**: Depends on Phase 3 (`useKudosFeed`) and Phase 4 (`<KudosPage />`)
- **Phase 6 (Polish)**: Depends on all prior phases complete

### Within Each Phase

- Types before repository schemas
- Repository before service layer
- Service layer before API routes
- API routes before UI components
- Contexts before hooks that read them
- Hooks before components that use them
- `<KudosCard />` + `<LikeButton />` before `<KudosFeed />` and `<HighlightKudos />`
- `<KudosFeed />` before filter wiring

### Parallel Opportunities (within phases)

- T004 + T005 + T006 + T007 (Phase 0 migrations and installs)
- T013 + T014 (LikeStateContext and SpecialDayContext are independent)
- T018–T026 (all API routes are independent once service is ready)
- T027 + T028 + T029 (KudosMessage, HashtagList, ImageGallery are independent leaf components)
- T031 (CopyLinkButton) parallel with T030 (KudosCard)
- T022–T026 (highlight, spotlight, stats, top-sunners, special-days routes)
- T043–T048 (all polish tasks target different concerns)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 0 + 1 + 2
2. Complete Phase 3 (US3 + US4 — Feed + Like)
3. **STOP and VALIDATE**: feed renders, like works optimistically
4. Complete Phase 4 (US1 + US2 — Highlight + Spotlight)
5. Complete Phase 5 (US5 + US6 + US7 — Filters + Stats)
6. Complete Phase 6 (Polish)

### Key Invariants to Enforce Throughout

- Route handlers in `route.ts` MUST delegate to `kudos-service.ts` — never call Supabase directly from routes
- `imageUrls` is always `string[]`, never `string | null`; `<ImageGallery />` renders nothing on empty array
- Anonymous kudos: derive immutable display object; actual sender data must not appear in DOM
- DOMPurify is mandatory in `<KudosMessage />` — no exceptions
- `LikeStateContext` is the single source of truth for heart state across `<HighlightKudos />` and `<KudosFeed />`
- 60s polling uses `setInterval`, NOT Supabase Realtime; polling pauses on `visibilitychange` hidden
- Heart count formatted with `Intl.NumberFormat('vi-VN')`

---

## Notes

- Mark tasks complete as you go: `[x]`
- Commit after each phase checkpoint
- If Viet Kudos modal is not yet available, `<WriteKudosButton />` renders a placeholder; wire modal in Phase 6
- Spotlight fetch failure on SSR must be caught and surfaced as `spotlightError` prop — the page must NOT crash
- All navigation paths (login redirect) must come from `.momorph/contexts/SCREENFLOW.md`
