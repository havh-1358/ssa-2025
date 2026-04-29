# Implementation Plan: Sun* Kudos — Live Board

**Frame**: `MaZUn5xHXZ-sun-kudos`
**Date**: 2026-04-29
**Spec**: `specs/MaZUn5xHXZ-sun-kudos/spec.md`

---

## Summary

The Sun* Kudos page (`/kudos`) is a live recognition board where SSA 2025 participants send and receive appreciation messages. The page is **already partially implemented** (UI scaffolding, routing, mock data mode). This plan covers remaining work: API integration, Spotlight Board D3 word cloud, Like/Unlike optimistic updates, Secret Box dialog, filter wiring, and full design-pixel compliance.

**Current state (codebase analysis 2026-04-29):**
- ✅ Route `app/kudos/page.tsx` — Supabase data, auth enabled
- ✅ Core components: `KudosPage`, `KudosCard` (highlight + feed variants), `HighlightKudos` (carousel + filter buttons), `KudosFeed`, `StatsPanel`, `WriteKudosButton`, `SearchSunnerInput`, `LikeButton`, `CopyLinkButton`, `SpotlightBoards`
- ✅ Custom hooks: `useKudosFeed` (SSR-skip + polling), `useLike` (optimistic + rollback), `useKudosForm`
- ✅ Like feature: `LikeButton.tsx` + `useLike.ts` + `LikeStateContext` + `SpecialDayContext`
- ✅ API routes: all endpoints implemented
- ✅ Types: `types/kudos.ts`
- ✅ Keyvisual + logo assets in `public/assets/kudos/`
- ⚠️ `likedByMeInitial` always `false` — server-side initial like state not fetched per user
- ⚠️ Like rollback is silent — no error toast shown on API failure (spec Scenario 6)
- ⚠️ "x2" special day visual badge in LikeButton not verified
- ❌ SpotlightBoards — D3 word cloud implemented but may need polish
- ❌ Secret Box dialog (`1466:7676`) — not implemented
- ❌ Personal stats hearts count via recipient kudos — verify matches spec

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js 16.x (App Router)
**Primary Dependencies**: React 19, Tailwind CSS 4, Supabase JS, D3.js (`d3-cloud` + `d3-zoom`)
**Database**: Supabase PostgreSQL with RLS
**Testing**: Vitest (unit) + Playwright (E2E)
**State Management**: React Context (`LikeStateContext`, `SpecialDayContext`) + local `useState`
**API Style**: Next.js Route Handlers (REST)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] TypeScript strict mode — all existing kudos code ✅
- [x] CSS variables only — no hardcoded hex in component files ✅
- [x] Supabase Auth — existing auth pattern followed ✅
- [x] RLS on kudos/likes tables — required by Principle VI ✅
- [x] Optimistic UI for like — TR-001/TR-002 in `useLike.ts` ✅
- [x] No `dangerouslySetInnerHTML` — kudos messages as plain text ✅
- [ ] 80% unit/integration coverage — **📋 Planned** (Phase 6)
- [ ] Playwright E2E for critical flows — **📋 Planned** (Phase 6)

**Violations:**

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| `d3` + `d3-cloud` new packages | Spotlight Board word cloud requires D3; full pan/zoom/hover control needed | `react-d3-cloud`: insufficient API |
| Auth bypass (temporary) | Mock UI development; must be re-enabled before production | N/A |

---

## Architecture Decisions

### Frontend

- **Component Structure**: Feature-based under `components/kudos/`; shared under `components/shared/`
- **Styling**: Tailwind CSS 4 + CSS variables from `app/globals.css` — raw hex forbidden in component files
- **Data Fetching**:
  - SSR: `app/kudos/page.tsx` (Server Component) fetches initial data via `lib/kudos-service.ts`
  - Client polling: `useKudosFeed` polls every 60s; pauses on `visibilitychange`
  - Like mutations: `useLike` + optimistic update via `LikeStateContext`
  - `isSpecialDay`: fetched SSR via `GET /api/admin/special-days` → `SpecialDayProvider`

### Backend

- **API Design**: Next.js Route Handlers under `app/api/kudos/` — already scaffolded
- **Data Access**: `lib/kudos-repository.ts` (Supabase queries) → `lib/kudos-service.ts` (business logic)
- **Validation**: Zod at every route boundary
- **Auth**: Supabase `createClient()` + server-side validation on every mutation

### D3 Spotlight Board

- `<SpotlightBoard />` is a Client Component; D3 owns SVG subtree via `useRef` + `useEffect`
- React does NOT render into the D3 SVG directly
- `useEffect` cleanup removes all D3 listeners on unmount
- Data from `GET /api/kudos/spotlight` → `{ nodes: [{ name, count, kudosId }] }`

---

## Project Structure

### New Files

| File | Purpose |
|------|---------|
| `components/kudos/SpotlightBoard.tsx` | D3 word cloud (replaces `SpotlightBoards.tsx` stub) |
| `hooks/useSpotlight.ts` | Fetch + state for spotlight data |
| `components/kudos/SecretBoxDialog.tsx` | Secret Box opening dialog (frame `1466:7676`) |
| `app/api/kudos/user-stats/route.ts` | `GET` — personal stats for authenticated user |
| `app/api/kudos/recent-gifts/route.ts` | `GET` — 10 most recent gift recipients (C3) |
| `app/api/secret-boxes/route.ts` | `POST /open` — open a secret box |

### Modified Files

| File | Changes |
|------|---------|
| `app/kudos/page.tsx` | Re-enable auth + Supabase fetching; remove mock data |
| `proxy.ts` | Re-enable `/kudos` auth guard |
| `lib/kudos-repository.ts` | Implement all Supabase queries |
| `lib/kudos-service.ts` | Add `getUserStats()`, `getRecentGifts()`, `openSecretBox()` |
| `components/kudos/SpotlightBoards.tsx` | Replace stub with `SpotlightBoard` wrapper |
| `components/kudos/StatsPanel.tsx` | Wire to real API; extract personal stats |
| `components/kudos/LikeButton.tsx` | Add error toast on rollback; verify "x2" badge; verify disabled visual state |
| `hooks/useLike.ts` | Surface rollback error to caller for toast display |
| `app/api/kudos/route.ts` | Include `likedByMe: boolean` per-user field in feed response (requires auth) |
| `app/globals.css` | Add missing CSS tokens if any |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `d3` | `^7.x` | SVG manipulation, zoom |
| `d3-cloud` | `^1.2.x` | Word cloud layout |

---

## Implementation Approach

### Phase 0: Assets ✅ Done
- Keyvisual, logo PNG, inline SVG icons all in place

### Phase 1: Foundation — Auth + Repository
1. Re-enable auth guard in `proxy.ts`
2. Implement `lib/kudos-repository.ts` — Supabase queries for all 13 endpoints
3. Add `getUserStats()`, `getRecentGifts()` to `lib/kudos-service.ts`
4. Replace mock imports in `app/kudos/page.tsx` with real service calls
5. Verify CSS token completeness in `app/globals.css`

### Phase 2: Core Feed + Like (US1, US3, US4) — P1 ⚠️ In Progress
- [x] Wire `KudosFeed` → `/api/kudos` with real pagination + filter
- [x] Wire `HighlightKudos` → `/api/kudos/highlights`
- [x] Wire `useLike` → `POST/DELETE /api/kudos/:id/like` + optimistic update
- [x] Rollback on API failure (silent — state reverted)
- [x] Wire `isSpecialDay` → `SpecialDayProvider`
- [ ] **Fix**: fetch `likedByMeInitial` per user from server — currently always `false`; add `GET /api/kudos/{id}/like` or include `likedByMe` field in kudos feed response
- [ ] **Fix**: add error toast on like/unlike rollback (spec US4 Scenario 6 — "Failed to like — please try again")
- [ ] **Verify**: "x2" special day badge renders correctly in `LikeButton` when `isSpecialDay === true`
- [ ] **Verify**: own-kudos heart button `opacity: 0.4`, `cursor: not-allowed` matching design spec

### Phase 3: Spotlight Board D3 (US2) — P1
1. `npm install d3 d3-cloud`
2. Create `hooks/useSpotlight.ts`
3. Create `components/kudos/SpotlightBoard.tsx`:
   - Word layout (`d3-cloud`)
   - Pan/zoom (`d3-zoom`)
   - Hover tooltip (overlay div)
   - Click → kudos detail
   - Search filter B7.3
   - Empty/loading states

### Phase 4: Sidebar — Stats + Secret Box (US5, US6, US7, US7b) — P2
1. `app/api/kudos/user-stats/route.ts` + `recent-gifts/route.ts`
2. Wire `StatsPanel` to real APIs
3. Implement `SecretBoxDialog.tsx` (requires Q3 resolution)
4. Wire "Mở quà" → Secret Box dialog → `POST /api/secret-boxes/open`

### Phase 5: Filters — Lọc Kudos theo Hashtag & Phòng ban (US5) — P2

**Codebase analysis (2026-04-29):** Filter infrastructure is partially wired but has 4 known gaps.

#### Current state

| Component / File | Status | Notes |
|-----------------|--------|-------|
| `FilterDropdown.tsx` | ✅ Done | Accessible dropdown; keyboard nav; ARIA; open/close |
| `useKudosFeed` filter state | ✅ Done | `filterHashtag` + `filterDepartment` state; re-fetches on change; polling respects filters |
| `KudosFeed` prop sync | ✅ Done | Accepts `activeHashtag` / `activeDepartment` props; `useEffect` syncs to hook |
| `KudosPage` filter state | ✅ Done | `filterHashtag` / `filterDepartment` state; passes to both `HighlightKudos` and `KudosFeed` |
| `GET /api/kudos` | ✅ Done | Supports `hashtag` + `department` query params; Zod-validated |
| `GET /api/kudos/hashtags` | ✅ Done | Returns dynamic hashtag list (requires auth) |
| **Hashtag options in KudosPage** | ❌ Hardcoded | `DEFAULT_HASHTAG_OPTIONS` constant — must fetch from `/api/kudos/hashtags` |
| **HighlightKudos dept filter** | ❌ No-op | `void filterDepartment` — department filter silently skipped for highlights |
| **`FilterDropdown` `#` prefix for dept** | ❌ Wrong | Trigger shows `#CEVC1` instead of `CEVC1` for Phòng ban options |
| **URL param sync** | ❌ Missing | Filter state lost on refresh; no shareable filter URL |

#### Gap 1 — Dynamic hashtag list (KUDOS_HASHTAGS_01)

**File**: `components/kudos/KudosPage.tsx`

`DEFAULT_HASHTAG_OPTIONS` is a hardcoded constant. This violates spec FR-009 (feed must reflect actual hashtags in the system).

**Fix**:
1. Add `useEffect` in `KudosPage` (or a dedicated `useHashtags` hook) to fetch `GET /api/kudos/hashtags` on mount.
2. Store result in `hashtagOptions: string[]` state, initialized with `DEFAULT_HASHTAG_OPTIONS` as fallback while loading.
3. Pass `hashtagOptions` to `<FilterDropdown label="Hashtag" options={hashtagOptions} .../>`.
4. Note: `/api/kudos/hashtags` currently requires auth — confirm if this is intentional or should be public (see Q6).

```typescript
// hooks/useHashtagOptions.ts
export function useHashtagOptions(fallback: string[]): string[] {
  const [options, setOptions] = useState<string[]>(fallback);
  useEffect(() => {
    fetch("/api/kudos/hashtags")
      .then((r) => r.json())
      .then((j) => { if (Array.isArray(j.data)) setOptions(j.data as string[]); })
      .catch(() => {}); // fallback stays
  }, []);
  return options;
}
```

#### Gap 2a — HighlightKudos department filter (KUDOS_HIGHLIGHT_DEPT_01)

**File**: `components/kudos/HighlightKudos.tsx` (lines 41-44)

```typescript
if (filterDepartment) {
  void filterDepartment; // TODO: skip client-side for now
}
```

The comment assumed department was not available client-side. **This is wrong** — `types/kudos.ts` already has `senderDepartment: string | null` and `recipientDepartment: string | null`, and the repository (`findKudosHighlights`) already enriches these fields from the `users` table. Department lives on `users`, not `kudos`, but the enrich step already resolves it.

**Fix**: Simple client-side filter — no server re-fetch needed:

```typescript
const filtered = highlights.filter((k) => {
  if (filterHashtag && !k.hashtags.includes(filterHashtag)) return false;
  if (filterDepartment &&
      k.recipientDepartment !== filterDepartment &&
      k.senderDepartment !== filterDepartment) return false;
  return true;
});
```

#### Gap 2b — Feed department filter not applied at DB level (KUDOS_FEED_DEPT_01)

**File**: `lib/kudos-repository.ts` — `findKudosFeed` (line 88)

The `department` param is accepted but never used in the Supabase query. This means `GET /api/kudos?department=CEVC1` returns ALL kudos regardless. The department is stored on `users`, so DB-level filtering requires a two-step subquery.

**Fix** — subquery approach (accurate pagination counts):

```typescript
if (department) {
  // Step 1: resolve department name → department_id
  const { data: deptRow } = await supabase
    .from("departments")
    .select("id")
    .eq("name", department)
    .single();

  if (!deptRow) {
    return { data: [], total: 0 };
  }

  // Step 2: get user IDs in that department
  const { data: userRows } = await supabase
    .from("users")
    .select("id")
    .eq("department_id", deptRow.id);

  const userIds = (userRows ?? []).map((r: { id: string }) => r.id);
  if (userIds.length === 0) {
    return { data: [], total: 0 };
  }

  // Step 3: filter kudos by recipient OR sender in that department
  query = query.or(
    `recipient_id.in.(${userIds.join(",")}),sender_id.in.(${userIds.join(",")})`
  );
}
```

This keeps pagination counts accurate (total reflects filtered results). The same pattern applies to `findKudosHighlights` if server-side dept filtering is ever needed there.

#### Gap 3 — FilterDropdown `#` prefix for Phòng ban (KUDOS_FILTER_PREFIX_01)

**File**: `components/kudos/FilterDropdown.tsx` (line 116)

```typescript
const triggerText = hasValue ? `#${value}` : label;
```

This hardcodes the `#` prefix, which is correct for hashtags but wrong for department names (`#CEVC1` ≠ `CEVC1`).

**Fix**: Add a `prefix?: string` prop to `FilterDropdown`; default `""`.
```typescript
type FilterDropdownProps = {
  ...
  prefix?: string; // e.g. "#" for hashtags, "" for departments
};
const triggerText = hasValue ? `${prefix ?? ""}${value}` : label;
```

Update `KudosPage`:
```tsx
<FilterDropdown label="Hashtag" prefix="#" options={hashtagOptions} ... />
<FilterDropdown label="Phòng ban" prefix="" options={DEPARTMENT_OPTIONS} ... />
```

Also fix the option item label inside the dropdown:
```tsx
// Currently: `#{opt}` — should use prefix prop too
<span>#{opt}</span>  →  <span>{prefix}{opt}</span>
```

#### Gap 4 — URL param sync (KUDOS_FILTER_URL_01)

**File**: `components/kudos/KudosPage.tsx` and `hooks/useKudosFeed.ts`

Filters are not persisted to the URL. Per spec FR-009 (feed updates without reload), users expect a filter URL to be shareable and survive page refresh.

**Fix**:
1. In `KudosPage`, read initial filter values from `useSearchParams()` on mount:
   ```typescript
   const searchParams = useSearchParams();
   const [filterHashtag, setFilterHashtag] = useState<string | null>(
     searchParams.get("hashtag")
   );
   const [filterDepartment, setFilterDepartment] = useState<string | null>(
     searchParams.get("department")
   );
   ```
2. When filter changes, update URL with `router.replace` (shallow, no scroll):
   ```typescript
   const router = useRouter();
   useEffect(() => {
     const params = new URLSearchParams();
     if (filterHashtag) params.set("hashtag", filterHashtag);
     if (filterDepartment) params.set("department", filterDepartment);
     const qs = params.toString();
     router.replace(qs ? `/kudos?${qs}` : "/kudos", { scroll: false });
   }, [filterHashtag, filterDepartment, router]);
   ```
3. `useKudosFeed` already skips the first fetch when `initialKudos` is provided (`isFirstFilterRun` ref). The SSR page (`app/kudos/page.tsx`) should read `searchParams` and pass pre-filtered `initialFeed` data to avoid a double-fetch on mount.

#### Implementation steps (ordered)

1. **Add `prefix` prop to `FilterDropdown`** — tiny isolated change; no other files affected.
2. **Fix `HighlightKudos` client-side dept filter** — remove `void filterDepartment`; add `recipientDepartment !== filterDepartment && senderDepartment !== filterDepartment` check. No API changes needed — data is already there.
3. **Fix `findKudosFeed` dept filter** — add subquery in `lib/kudos-repository.ts`: departments → user IDs → filter kudos. Pagination counts become accurate.
4. **Create `useHashtagOptions` hook** — fetch `/api/kudos/hashtags` on mount; fallback to hardcoded list while loading.
5. **Wire `useHashtagOptions` in `KudosPage`** — replace `DEFAULT_HASHTAG_OPTIONS`.
6. **URL sync in `KudosPage`** — read from `useSearchParams` on mount; write via `router.replace` on filter change.
7. **SSR pre-filter in `app/kudos/page.tsx`** — read `searchParams`; pass pre-filtered `initialFeed` to avoid double-fetch.
8. **Tests** — unit: `FilterDropdown` (prefix prop), `useHashtagOptions`, `findKudosFeed` dept subquery; integration: filter → feed; E2E: full filter flow.

#### Functional requirements covered

| Req | Description | Fix(es) |
|-----|-------------|---------|
| FR-009 | Filters update feed without full reload | Gap 4 (URL), existing hook |
| FR-014 | Filters update BOTH Highlight AND feed simultaneously | Gap 2 (HighlightKudos dept) |
| US5 Scenario 1 | Filter by hashtag | Gap 1 (dynamic list) + existing |
| US5 Scenario 2 | Clear filter | Existing (`onChange(null)` in dropdown) |
| US5 Scenario 3 | Filter by department | Gap 2 (HighlightKudos) + existing feed |

### Phase 6: Testing + Security — Constitution III + VI
1. Unit: `useLike`, `useKudosFeed`, `KudosCard`, `LikeButton`
2. Integration: like/unlike + Supabase with seeded test data
3. E2E Playwright: like flow, write kudos flow, filter flow
4. Security review: RLS policies, server-side like validation (TR-005/TR-006)

---

## Integration Testing Strategy

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Optimistic like + rollback, feed pagination |
| App ↔ Supabase | Yes | Feed queries, like mutation, RLS enforcement |
| User workflows | Yes | Full like flow, write → prepend, filter → reset |

### Test Environment
- Local Supabase + seeded data (USER_A/B/C, KUDOS_1/2/3 per `BACKEND_API_TESTCASES.md`)
- Isolation: transaction rollback per test

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| Supabase DB | Real (local) | Constitution III — no mock DB |
| `isSpecialDay` | Configurable seed | Need both states |
| D3 render | Unit: mock SVG, E2E: real browser | — |

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `useLike` | 95%+ | High |
| `useKudosFeed` | 90%+ | High |
| `KudosCard` | 85%+ | High |
| API route handlers | 80%+ | High |
| D3 SpotlightBoard | 70%+ | Medium |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| D3 word cloud perf with many nodes | Med | Med | Cap max nodes; min font threshold |
| Supabase RLS misconfiguration | Low | High | Test own-kudos like denial; verify policies |
| Secret Box frame `1466:7676` not yet spec'd | Med | Med | Analyze frame via momorph before Phase 4 |
| `isSpecialDay` stale mid-session | Low | Low | Document as MVP; acceptable per spec |
| Profile page route unknown | Med | Low | Block navigation until Q2 answered; stub href |
| Hashtag list auth gate | Med | Med | `/api/kudos/hashtags` requires auth — dropdown empty for guests; resolve Q6 |
| HighlightKudos dept filter double-fetch | Low | Low | Debounce dept filter change to avoid rapid API calls on quick dropdown selections |

---

## Open Questions

- [ ] **Q1**: C3 "10 Sunner Nhận Quà Mới Nhất" — ordered by gift recency or kudos count? (Spec assumes gift recency — confirm)
- [ ] **Q2**: Profile page route? (`/profile/{userId}`?) — needed for kudos card avatar clicks
- [ ] **Q3**: Secret Box dialog frame `1466:7676` — needs `/momorph.specify` before Phase 4
- [ ] **Q4**: What triggers a "special day"? Admin UI or seed only?
- [ ] **Q5**: Kudos detail page route? (`/kudos/{id}`?) — needed for Spotlight Board click + CopyLink
- [ ] **Q6**: Should `GET /api/kudos/hashtags` be public (no auth)? Currently requires auth — this means the hashtag dropdown is empty for unauthenticated users. Confirm intent.

---

## Next Steps

1. Answer open questions Q1–Q5
2. Run `/momorph.tasks MaZUn5xHXZ` to generate task breakdown
3. Verify `database-schema.sql` has all required tables (`kudos`, `likes`, `secret_boxes`, `special_days`)
4. Install D3 before starting Phase 3
