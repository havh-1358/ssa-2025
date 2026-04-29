# Implementation Plan: Sun* Kudos — Live Board

**Frame**: `MaZUn5xHXZ-sun-kudos`
**Date**: 2026-04-29
**Spec**: `specs/MaZUn5xHXZ-sun-kudos/spec.md`

---

## Summary

The Sun* Kudos page (`/kudos`) is a live recognition board where SSA 2025 participants send and receive appreciation messages. The page is **already partially implemented** (UI scaffolding, routing, mock data mode). This plan covers remaining work: API integration, Spotlight Board D3 word cloud, Like/Unlike optimistic updates, Secret Box dialog, filter wiring, and full design-pixel compliance.

**Current state (codebase analysis 2026-04-29):**
- ✅ Route `app/kudos/page.tsx` — mock-data mode, auth bypassed
- ✅ Core components: `KudosPage`, `KudosCard` (highlight + feed variants), `HighlightKudos` (carousel + filter buttons), `KudosFeed`, `StatsPanel`, `WriteKudosButton`, `SearchSunnerInput`, `LikeButton`, `CopyLinkButton`, `SpotlightBoards` (stub)
- ✅ Custom hooks: `useKudosFeed` (SSR-skip + polling), `useLike`, `useKudosForm`
- ✅ API routes scaffolded: all 13 endpoints
- ✅ Types: `types/kudos.ts`
- ✅ Keyvisual + logo assets in `public/assets/kudos/`
- ❌ SpotlightBoards — D3 word cloud not implemented (stub only)
- ❌ Supabase repository layer — queries not implemented
- ❌ Auth guard bypassed in `proxy.ts`
- ❌ Personal stats + recent gifts — mock data only
- ❌ Secret Box dialog (`1466:7676`) — not implemented
- ❌ `isSpecialDay` — hardcoded `false`

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

### Phase 2: Core Feed + Like (US1, US3, US4) — P1
1. Wire `KudosFeed` → `/api/kudos` with real pagination + filter
2. Wire `HighlightKudos` → `/api/kudos/highlights`
3. Wire `useLike` → `POST/DELETE /api/kudos/:id/like` end-to-end
4. Verify optimistic update + rollback
5. Wire `isSpecialDay` → `GET /api/admin/special-days` → `SpecialDayProvider`

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

### Phase 5: Filters + Polish (US5) — P2
1. Wire Hashtag + Phòng ban dropdowns → filter state → URL params
2. `filterSynced` state: sync URL params on mount
3. 60s polling pause/resume on `visibilitychange`
4. Deep-link scroll: `/kudos#{kudosId}`

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

---

## Open Questions

- [ ] **Q1**: C3 "10 Sunner Nhận Quà Mới Nhất" — ordered by gift recency or kudos count? (Spec assumes gift recency — confirm)
- [ ] **Q2**: Profile page route? (`/profile/{userId}`?) — needed for kudos card avatar clicks
- [ ] **Q3**: Secret Box dialog frame `1466:7676` — needs `/momorph.specify` before Phase 4
- [ ] **Q4**: What triggers a "special day"? Admin UI or seed only?
- [ ] **Q5**: Kudos detail page route? (`/kudos/{id}`?) — needed for Spotlight Board click + CopyLink

---

## Next Steps

1. Answer open questions Q1–Q5
2. Run `/momorph.tasks MaZUn5xHXZ` to generate task breakdown
3. Verify `database-schema.sql` has all required tables (`kudos`, `likes`, `secret_boxes`, `special_days`)
4. Install D3 before starting Phase 3
