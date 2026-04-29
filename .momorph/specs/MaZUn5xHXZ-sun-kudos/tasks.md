# Tasks: Sun* Kudos — Live Board

**Frame**: `MaZUn5xHXZ-sun-kudos`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅

> **Context**: Page scaffolding, UI components, and API route handlers are **already implemented**.
> Tasks focus on: Supabase repository wiring, D3 Spotlight Board, Like/Unlike end-to-end, filters, sidebar stats, Secret Box dialog, auth re-enable, and tests.

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Parallelizable (different files, no blocking dependencies)
- **[Story]**: User story label (US1–US7b)

---

## Phase 1: Setup

**Purpose**: Re-enable auth, install new dependencies, verify CSS tokens

- [x] T001 Re-enable `/kudos` auth guard (un-comment block) | `proxy.ts`
- [x] T002 Install D3 dependencies: `npm install d3 d3-cloud` | `package.json`
- [x] T003 [P] Verify CSS tokens in globals.css match design-style.md (add missing if any) | `app/globals.css`
- [x] T004 [P] Add `SpotlightNode` type to kudos types | `types/kudos.ts`

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Supabase repository layer — blocks ALL user stories that need real data

**⚠️ CRITICAL**: No story API wiring can begin until this phase is complete

- [ ] T005 Implement `findKudosFeed()` Supabase query with pagination + hashtag/department filter | `lib/kudos-repository.ts`
- [ ] T006 Implement `findKudosHighlights()` — top 5 by heartCount | `lib/kudos-repository.ts`
- [ ] T007 [P] Implement `findKudosStats()` — totalKudosSent, totalHeartsGiven, totalParticipants | `lib/kudos-repository.ts`
- [ ] T008 [P] Implement `findTopSunners(limit)` | `lib/kudos-repository.ts`
- [ ] T009 [P] Implement `findHashtags()` | `lib/kudos-repository.ts`
- [ ] T010 Implement `insertLike()`, `deleteLike()`, `findUserLike()` | `lib/kudos-repository.ts`
- [ ] T011 [P] Implement `insertKudos()` | `lib/kudos-repository.ts`
- [ ] T012 [P] Implement `findSpotlightData()` — recipient names + counts for word cloud | `lib/kudos-repository.ts`
- [ ] T013 Add `getUserStats(userId)` to service — kudos sent/received, hearts, secret box counts | `lib/kudos-service.ts`
- [ ] T014 [P] Add `getRecentGifts(limit)` to service — 10 most recent gift recipients | `lib/kudos-service.ts`
- [ ] T015 Replace mock data imports with real service calls in page route | `app/kudos/page.tsx`

**Checkpoint**: Foundation ready — real data flows through the page

---

## Phase 3: User Story 1 — View Highlight Kudos (P1) 🎯

**Goal**: Highlight carousel shows real top-5 most-liked kudos from Supabase

**Independent Test**: Navigate to `/kudos` → Highlight section shows up to 5 kudos cards from DB → carousel prev/next works → dot/number indicator updates

- [ ] T016 [US1] Wire `getHighlights()` result into `KudosPage` highlights prop (verify after T015) | `app/kudos/page.tsx`
- [ ] T017 [US1] Verify `HighlightKudos` carousel renders real data — prev/next cycle through 5 cards | `components/kudos/HighlightKudos.tsx`
- [ ] T018 [P] [US1] Verify highlight Kudos card renders with `variant="highlight"` styling (528px, 4px gold border, radius 16px) | `components/kudos/KudosCard.tsx`

**Checkpoint**: Highlight Kudos shows real data from Supabase ✓

---

## Phase 4: User Story 3 — Browse Recent Kudos Feed (P1)

**Goal**: All Kudos feed shows real paginated data; load-more and 60s polling work

**Independent Test**: Scroll "All Kudos" section → cards show real sender/recipient/message → scroll to bottom → "Load more" fetches next page → wait 60s → new kudos appear without reload

- [ ] T019 [US3] Verify `/api/kudos` route handler returns paginated Supabase data | `app/api/kudos/route.ts`
- [ ] T020 [US3] Test `useKudosFeed` — verify SSR skip works correctly, filter re-fetch calls API | `hooks/useKudosFeed.ts`
- [ ] T021 [P] [US3] Verify `KudosFeed` pagination ("Load more") against real API | `components/kudos/KudosFeed.tsx`
- [ ] T022 [P] [US3] Verify 60s polling — tab hidden pauses, tab focus resumes | `hooks/useKudosFeed.ts`
- [ ] T023 [US3] Verify anonymous kudos: sender name/avatar hidden when `isAnonymous=true` | `components/kudos/KudosCard.tsx`
- [ ] T024 [P] [US3] Verify long message line-clamp + "Xem thêm" expand | `components/kudos/KudosCard.tsx`
- [ ] T025 [P] [US3] Verify image gallery renders up to 5 thumbnails; empty array = no gallery | `components/kudos/ImageGallery.tsx`
- [ ] T026 [US3] Deep-link: `/kudos#{kudosId}` scrolls to correct card on load | `components/kudos/KudosFeed.tsx`

**Checkpoint**: Kudos feed shows real paginated data from Supabase ✓

---

## Phase 5: User Story 4 — Like a Kudos (P1)

**Goal**: Heart button likes/unlikes with optimistic UI; special day doubles hearts; own kudos disabled

**Independent Test**: Login as USER_A → find KUDOS_1 (sent by USER_B) → click heart → count +1 → click again → count -1 → find own kudos (KUDOS_2) → heart disabled. On special day: click → count +2.

- [ ] T027 [US4] Verify `POST /api/kudos/:id/like` server-side: auth 401, own-kudos 400, duplicate no-op | `app/api/kudos/[id]/like/route.ts`
- [ ] T028 [US4] Verify `DELETE /api/kudos/:id/like` server-side: auth 401, like-not-found 404 | `app/api/kudos/[id]/like/route.ts`
- [ ] T029 [US4] Wire `GET /api/admin/special-days` into `app/kudos/page.tsx` → `SpecialDayProvider` | `app/kudos/page.tsx`
- [ ] T030 [US4] Verify `useLike` optimistic update: count +delta immediately, server confirms | `hooks/useLike.ts`
- [x] T031 [US4] Fix `useLike` rollback — add error callback/toast on API failure (spec Scenario 6: "Failed to like — please try again"); currently silent | `hooks/useLike.ts`
- [x] T031b [US4] Expose rollback error from `useLike` and show toast in `LikeButton` on like/unlike API failure | `components/kudos/LikeButton.tsx`
- [x] T032 [P] [US4] Verify `LikeButton` own-kudos disabled: `opacity: 0.4`, `cursor: not-allowed`, `aria-disabled` | `components/kudos/LikeButton.tsx`
- [x] T033 [P] [US4] Verify special day visual: "x2" badge renders when `isSpecialDay=true` and `likedByMe=true` | `components/kudos/LikeButton.tsx`
- [ ] T034 [P] [US4] Verify unauthenticated like attempt: API returns 401, client redirects to `/login` | `app/api/kudos/[id]/like/route.ts`
- [x] T035 [US4] Fix `likedByMeInitial` — include `likedByMe: boolean` per authenticated user in `GET /api/kudos` feed response; pass to `LikeButton` from `KudosCard` | `app/api/kudos/route.ts`
- [x] T035b [US4] Pass `likedByMeInitial` from kudos feed data through `KudosFeed` → `KudosCard` → `LikeButton` | `components/kudos/KudosFeed.tsx`
- [x] T036 [US4] Like in Highlight carousel updates count in both Highlight and Feed via `LikeStateContext` | `components/shared/LikeStateContext.tsx`

**Checkpoint**: Like/unlike works end-to-end with optimistic UI ✓

---

## Phase 6: User Story 2 — Spotlight Board Word Cloud (P1)

**Goal**: D3 word cloud renders recipient names; hover tooltip; click opens kudos detail; pan/zoom toggle; search filters

**Independent Test**: Scroll to Spotlight Board → word cloud renders → hover a name → tooltip shows name + time → click → navigate to kudos detail → click B7.2 → pan/zoom toggles → type in B7.3 search → matching nodes highlighted

- [ ] T039 [US2] Create `hooks/useSpotlight.ts` — fetch `/api/kudos/spotlight`, loading/error state | `hooks/useSpotlight.ts`
- [ ] T040 [US2] Implement `/api/kudos/spotlight` route using `findSpotlightData()` | `app/api/kudos/spotlight/route.ts`
- [ ] T041 [US2] Create `components/kudos/SpotlightBoard.tsx` — D3 word cloud layout via `d3-cloud` | `components/kudos/SpotlightBoard.tsx`
- [ ] T042 [US2] Add `d3-zoom` pan/zoom to SpotlightBoard canvas | `components/kudos/SpotlightBoard.tsx`
- [ ] T043 [US2] Add hover tooltip overlay (name + latest kudos time) | `components/kudos/SpotlightBoard.tsx`
- [ ] T044 [US2] Add click handler → navigate to kudos detail (pending Q5 — stub href for now) | `components/kudos/SpotlightBoard.tsx`
- [ ] T045 [P] [US2] Add B7.2 pan/zoom toggle button with `aria-pressed` | `components/kudos/SpotlightBoard.tsx`
- [ ] T046 [P] [US2] Add B7.3 search input — filter/highlight matching nodes; dim non-matching | `components/kudos/SpotlightBoard.tsx`
- [ ] T047 [US2] Add empty ("Chưa có dữ liệu") and loading skeleton states | `components/kudos/SpotlightBoard.tsx`
- [ ] T048 [US2] Replace stub `SpotlightBoards.tsx` with real `SpotlightBoard` component | `components/kudos/SpotlightBoards.tsx`
- [ ] T049 [P] [US2] Cleanup: `useEffect` removes all D3 event listeners on unmount | `components/kudos/SpotlightBoard.tsx`

**Checkpoint**: Spotlight Board word cloud renders with D3, pan/zoom, tooltip, search ✓

---

## Phase 7: User Story 5 — Filter Kudos (P2)

**Goal**: Hashtag + Phòng ban dropdowns filter both Highlight carousel and All Kudos feed simultaneously

**Independent Test**: Click "Hashtag" filter → select "#teamwork" → feed shows only matching kudos → Highlight section also filters → pagination resets to 1 → clear filter → all kudos return

> **Codebase status (2026-04-29)**: Infrastructure is partially done — 4 gaps remain. See plan.md Phase 5.

- [x] T050 [US5] `FilterDropdown` component — keyboard nav, ARIA, open/close ✅ | `components/kudos/FilterDropdown.tsx`
- [x] T052 [US5] Phòng ban dropdown options (CEVC1–4, OPD, Infra) wired ✅ | `components/kudos/KudosPage.tsx`
- [x] T053 [US5] Filter state lifted to `KudosPage`; passed to `HighlightKudos` + `KudosFeed` ✅ | `components/kudos/KudosPage.tsx`
- [x] T054 [US5] Pagination resets to page 1 on filter change in `useKudosFeed` ✅ | `hooks/useKudosFeed.ts`

**Gap 3 — `#` prefix wrong for Phòng ban options (plan.md KUDOS_FILTER_PREFIX_01)**

- [x] T050a [US5] Add `prefix?: string` prop to `FilterDropdown`; replace hardcoded `#${value}` trigger text and option labels with `${prefix}${value}` | `components/kudos/FilterDropdown.tsx`
- [x] T050b [US5] Pass `prefix="#"` to Hashtag dropdown and `prefix=""` to Phòng ban dropdown in `KudosPage` | `components/kudos/KudosPage.tsx`

**Gap 1 — Hashtag list is hardcoded (plan.md KUDOS_HASHTAGS_01)**

- [x] T051a [US5] Create `hooks/useHashtagOptions.ts` — fetch `GET /api/kudos/hashtags` on mount; fallback to static list while loading | `hooks/useHashtagOptions.ts`
- [x] T051b [US5] Wire `useHashtagOptions` in `KudosPage`; replace `DEFAULT_HASHTAG_OPTIONS` constant | `components/kudos/KudosPage.tsx`

**Gap 2a — `HighlightKudos` dept filter is a no-op (plan.md KUDOS_HIGHLIGHT_DEPT_01)**

- [x] T055 [US5] Fix `HighlightKudos` client-side dept filter: replace `void filterDepartment` with `k.recipientDepartment !== filterDepartment && k.senderDepartment !== filterDepartment` guard | `components/kudos/HighlightKudos.tsx`

**Gap 2b — Feed dept filter ignored at DB level (plan.md KUDOS_FEED_DEPT_01)**

- [x] T056 [US5] Fix `findKudosFeed` dept filter in repository: add subquery `departments → user IDs → .or(recipient_id.in, sender_id.in)` so pagination counts are accurate | `lib/kudos-repository.ts`

**Gap 4 — URL param sync missing (plan.md KUDOS_FILTER_URL_01)**

- [x] T057a [P] [US5] Read initial filter values from `useSearchParams()` on mount in `KudosPage` (`?hashtag=` / `?department=`) | `components/kudos/KudosPage.tsx`
- [x] T057b [P] [US5] Write filter changes to URL via `router.replace` (shallow, no scroll) when `filterHashtag` or `filterDepartment` changes | `components/kudos/KudosPage.tsx`
- [x] T057c [P] [US5] Pass pre-filtered `initialFeed` from SSR: read `searchParams` in `app/kudos/page.tsx` and forward `hashtag`/`department` to `getKudosFeed()` | `app/kudos/page.tsx`

**Checkpoint**: Hashtag and department filters update feed + highlights simultaneously; URL reflects filter state; dept filtering accurate at DB level ✓

---

## Phase 8: User Story 6 — View Statistics (P2)

**Goal**: Sidebar stats panel shows real total counts from Supabase

**Independent Test**: Navigate to `/kudos` → right sidebar shows accurate totalKudosSent, totalHeartsGiven, totalParticipants from DB

- [ ] T057 [US6] Verify `/api/kudos/stats` returns real Supabase aggregates | `app/api/kudos/stats/route.ts`
- [ ] T058 [P] [US6] Wire `KudosPage` to pass real `stats` to `StatsPanel` (already in page.tsx — verify after T015) | `app/kudos/page.tsx`

**Checkpoint**: Sidebar stats show real DB totals ✓

---

## Phase 9: User Story 7b — Open Secret Box (P2)

**Goal**: "Mở quà" button opens Secret Box dialog; after opening, unopened count decreases

**Independent Test**: Have ≥1 unopened box → "Mở quà" button enabled → click → dialog opens → open box → count decreases → if 0 boxes → button disabled

- [ ] T059 [US7b] Create `/api/secret-boxes/route.ts` — `POST /open` opens one secret box | `app/api/secret-boxes/route.ts`
- [ ] T060 [US7b] Wire user stats panel: fetch `/api/kudos/user-stats` for authenticated user | `app/kudos/page.tsx`
- [ ] T061 [US7b] Add `app/api/kudos/user-stats/route.ts` route handler | `app/api/kudos/user-stats/route.ts`
- [ ] T062 [US7b] Create `components/kudos/SecretBoxDialog.tsx` (frame `1466:7676`) | `components/kudos/SecretBoxDialog.tsx`
- [ ] T063 [US7b] Wire "Mở quà" button → open `SecretBoxDialog` → on success: decrement `secretBoxesUnopened` count | `components/kudos/StatsPanel.tsx`

**Checkpoint**: Secret Box flow works end-to-end ✓

---

## Phase 10: User Story 7 — View Top 10 Sunners / Recent Gift Recipients (P2)

**Goal**: C3 list shows 10 most recent Secret Box gift recipients with name + gift description

**Independent Test**: View right sidebar → list shows up to 10 names each with gift description → empty state if no gifts yet

- [ ] T064 [US7] Add `/api/kudos/recent-gifts/route.ts` route handler | `app/api/kudos/recent-gifts/route.ts`
- [ ] T065 [P] [US7] Wire `KudosPage` to fetch recent gifts and pass to `StatsPanel` | `app/kudos/page.tsx`
- [ ] T066 [P] [US7] Verify C3 list renders gift descriptions; "Chưa có dữ liệu" when empty | `components/kudos/StatsPanel.tsx`

**Checkpoint**: Recent gift recipients list shows real data ✓

---

## Phase 11: User Story 3 (cont.) — Write + Prepend Kudos

**Goal**: Viet Kudos modal submits real kudos; new kudos prepends to feed

**Independent Test**: Login → click Write Kudos button → modal opens → fill form → submit → new kudos appears at top of feed without page reload

- [ ] T067 [US3] Verify `WriteKudosModal` POST to `/api/kudos` with auth | `app/api/kudos/route.ts`
- [ ] T068 [US3] Verify `handleKudosSuccess` prepends new kudos via `prependFnRef` | `components/kudos/KudosPage.tsx`
- [ ] T069 [P] [US3] Verify CopyLink copies `{origin}/kudos#{kudosId}` to clipboard | `components/kudos/CopyLinkButton.tsx`

**Checkpoint**: Write kudos flow works end-to-end ✓

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, security hardening, tests, performance

- [ ] T070 [P] Accessibility audit: verify all ARIA labels from spec (heart `aria-pressed`, carousel `aria-label`, filter `aria-haspopup`) | `components/kudos/`
- [ ] T071 [P] Security review: verify RLS policies on `kudos` + `likes` tables; own-kudos server check | `lib/kudos-repository.ts`
- [ ] T072 Write unit tests for `useLike` hook — optimistic update + rollback scenarios | `hooks/useLike.ts`
- [ ] T073 [P] Write unit tests for `useKudosFeed` — SSR skip, filter change, pagination | `hooks/useKudosFeed.ts`
- [ ] T074 [P] Write unit tests for `KudosCard` — anonymous, long message, image gallery | `components/kudos/KudosCard.tsx`
- [ ] T075 Write integration test: like/unlike with real Supabase (USER_A likes KUDOS_1) | `tests/integration/kudos-like.spec.ts`
- [ ] T076 [P] Write E2E Playwright: like flow, write kudos flow, filter flow | `tests/e2e/kudos.spec.ts`
- [ ] T077 Performance: cap SpotlightBoard max rendered nodes; add min font-size threshold | `components/kudos/SpotlightBoard.tsx`
- [ ] T078 [P] Error states: feed fetch fail → retry button; like fail → toast; polling fail → silent | `components/kudos/KudosFeed.tsx`
- [ ] T079 Code cleanup: remove `data/kudos-mock.ts` and all mock imports | `data/kudos-mock.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundation) → Phases 3–11 (User Stories) → Phase 12 (Polish)
```

- **Phase 1**: No dependencies — start immediately
- **Phase 2**: Depends on Phase 1 — BLOCKS all API-wired stories
- **Phases 3–5** (US1, US3, US4): Depend on Phase 2; can run in parallel after T015
- **Phase 6** (US2 Spotlight): Depends on T039–T040; D3 work is independent of feed
- **Phases 7–11** (P2 stories): Depend on Phase 2; can start after foundation
- **Phase 12**: Depends on all desired stories being complete

### Parallel Opportunities Per Phase

| Phase | Parallelizable Tasks |
|-------|---------------------|
| Phase 2 | T007, T008, T009, T010, T011, T012 in parallel after T005–T006 |
| Phase 3 | T017, T018 in parallel |
| Phase 4 | T021, T022, T024, T025, T026 in parallel after T019–T020 |
| Phase 5 | T030, T032, T033, T034 in parallel after T027–T029 |
| Phase 6 | T041–T049 after T039–T040; T045, T046, T049 in parallel |
| Phase 7 | T050a+T050b in parallel; T051a→T051b sequential; T055+T056 independent; T057a+T057b+T057c in parallel |
| Phase 12 | T070–T074, T077, T078 all in parallel |

---

## Implementation Strategy

### MVP Scope (P1 only — Phases 1–6)

1. Complete Phase 1 + 2 (auth + repository)
2. Complete Phase 3 (Highlight Kudos with real data)
3. Complete Phase 4 (Kudos Feed with pagination + polling)
4. Complete Phase 5 (Like/Unlike end-to-end)
5. Complete Phase 6 (Spotlight Board D3)
6. **STOP and VALIDATE**: all P1 stories working

### Full Delivery (add P2 — Phases 7–11)

7. Phases 7–11 in priority order
8. Phase 12 (polish + tests)

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 82 |
| Phase 1 Setup | 4 |
| Phase 2 Foundation | 11 |
| US1 Highlight | 3 |
| US3 Feed + Write | 11 |
| US4 Like | 12 (+3 new tasks for like gaps from spec review) |
| US2 Spotlight | 11 |
| US5 Filter | 4 done ✅ + 9 remaining |
| US6 Stats | 2 |
| US7b Secret Box | 5 |
| US7 Recent Gifts | 3 |
| Polish | 10 |
| Parallel tasks | ~38 |

**MVP (P1 only)**: T001–T049 (49 tasks, includes all P1 like feature fixes)
**Full delivery**: T001–T079 + T031b + T035b (82 tasks)

**New tasks added (like feature — from spec/plan review)**:
- T031b: Show error toast in `LikeButton` when rollback triggered (spec US4 Scenario 6)
- T035 + T035b: Server-side `likedByMeInitial` per authenticated user in feed response

---

## Notes

- Resolve open questions Q1–Q5 (in plan.md) before starting Phase 6 (Spotlight click) and Phase 9 (SecretBox)
- Profile page route (Q2) needed for Spotlight Board click nav — stub href until confirmed
- `data/kudos-mock.ts` removed in T079 (Polish phase) — do NOT remove earlier
- Run `npm run build` after T002 (D3 install) to verify no type errors
- Mark tasks `[x]` as you complete them
