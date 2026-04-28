# Tasks: Countdown Prelaunch — Campaign Table Migration

**Frame**: `8PJQswPZmU-countdown-prelaunch`
**Prerequisites**: plan.md ✅ spec.md ✅ design-style.md ✅
**Scope**: Migrate `LAUNCH_DATETIME` env-var to `campaigns` database table. UI already implemented and visually correct. All previous tasks (T001–T024) are complete.

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Maps to spec.md user story ([US1] = View Countdown Timer)
- **|**: File path affected

---

## Phase 1: Database Migration

**Purpose**: Create `campaigns` table — foundation for all subsequent phases

**⚠️ CRITICAL**: Phases 3, 4, 5 cannot begin until this migration is applied locally

- [ ] T025 Create Supabase migrations directory if absent and write `campaigns` table DDL: `id uuid PK`, `campaign_name text NOT NULL`, `start_date timestamptz NOT NULL`, `end_date timestamptz NOT NULL`, `created_at`, `updated_at`, `CHECK (end_date > start_date)` | supabase/migrations/YYYYMMDD_create_campaigns.sql
- [ ] T026 Add RLS to migration: `ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY` + public SELECT policy `USING (TRUE)` (no INSERT/UPDATE/DELETE policies — service_role only) | supabase/migrations/YYYYMMDD_create_campaigns.sql
- [ ] T027 Add dev seed record to migration: `INSERT INTO campaigns (campaign_name, start_date, end_date) VALUES ('SSA 2025', '2025-12-26T18:00:00+07:00', '2025-12-27T23:00:00+07:00')` | supabase/migrations/YYYYMMDD_create_campaigns.sql
- [ ] T028 Apply migration to local Supabase dev instance (`supabase db reset`) and verify seed record is visible in Supabase Studio | supabase/migrations/YYYYMMDD_create_campaigns.sql
- [ ] T029 Update `.momorph/contexts/database-schema.sql` to include `campaigns` table DDL and update the screen comment from `(no DB entities)` to `(campaigns table)` | .momorph/contexts/database-schema.sql

**Checkpoint**: `campaigns` table exists in local Supabase with seed record

---

## Phase 2: Foundation — Constants & Types

**Purpose**: Shared primitives consumed by repository, route handler, and middleware

- [ ] T030 [P] Create `lib/constants/campaign.ts` exporting `CAMPAIGN_CACHE_REVALIDATE_SECONDS = 60` as a named const (importable in both Edge and Node.js runtimes) | lib/constants/campaign.ts
- [ ] T031 [P] Create `types/campaign.ts` exporting `ActiveCampaign` TypeScript type — will be inferred from `ActiveCampaignSchema` once T033 is done; placeholder with manual type first, then update after T033 | types/campaign.ts

**Checkpoint**: Constants and types files exist; no import errors

---

## Phase 3: Backend — Repository & API Route (US1)

**Goal**: `GET /api/campaigns/active` returns `{ data: ActiveCampaign | null }` from DB

**Independent Test**: `curl http://localhost:3000/api/campaigns/active` → `{ "data": { "id": "...", "campaignName": "SSA 2025", "startDate": "...", "endDate": "..." } }`

### Repository (US1)

- [ ] T032 [US1] Write failing Vitest unit tests for `lib/campaign-repository.ts`: test `getActiveCampaign()` returns `ActiveCampaign` when seed row exists; returns `null` when table empty; returns `null` and logs error when DB call fails; Zod schema rejects row with null `start_date` | lib/campaign-repository.test.ts
- [ ] T033 [US1] Implement `lib/campaign-repository.ts`: define `ActiveCampaignSchema` with Zod (`id: uuid, campaignName: string, startDate: datetime, endDate: datetime`); implement `getActiveCampaign(): Promise<ActiveCampaign | null>` — query `SELECT id, campaign_name, start_date, end_date FROM campaigns ORDER BY created_at DESC LIMIT 1` via `createClient()`, validate with Zod, map snake_case → camelCase, return `null` on empty result or validation error | lib/campaign-repository.ts
- [ ] T034 [US1] Implement `getActiveCampaignCached()` inside `lib/campaign-repository.ts`: wrap `getActiveCampaign()` with `unstable_cache` from `next/cache`, `revalidate: CAMPAIGN_CACHE_REVALIDATE_SECONDS`, tag `['campaigns']` — Node.js runtime only (page Server Component use) | lib/campaign-repository.ts
- [ ] T035 [US1] Update `types/campaign.ts` to infer `ActiveCampaign` from `ActiveCampaignSchema` via `z.infer<typeof ActiveCampaignSchema>` (replace placeholder type from T031) | types/campaign.ts

### API Route (US1)

- [ ] T036 [P] [US1] Write failing Vitest tests for `GET /api/campaigns/active`: `200 { data: {...} }` when campaign exists; `200 { data: null }` when campaigns table empty | app/api/campaigns/active/route.test.ts
- [ ] T037 [US1] Implement `app/api/campaigns/active/route.ts`: `export const revalidate = CAMPAIGN_CACHE_REVALIDATE_SECONDS`; `GET` handler calls `getActiveCampaign()` (not cached version — route-level revalidation handles caching) and returns `Response.json({ data: campaign })` | app/api/campaigns/active/route.ts

**Checkpoint**: `GET /api/campaigns/active` responds correctly with and without seed record

---

## Phase 4: Middleware Integration (US1)

**Goal**: `proxy.ts` uses cached Supabase REST fetch instead of `LAUNCH_DATETIME` env var

**Independent Test**: With seed `start_date` in future — navigate to `/kudos` → redirects to `/`; remove seed record → navigate to `/kudos` → no redirect

- [ ] T038 [US1] Write failing Vitest tests for middleware campaign check (mock global `fetch`): future `start_date` + non-root path → `302` redirect to `/`; empty campaigns response → no redirect; `fetch` throws → no redirect (fail-open); root path `/` → never redirects | proxy.test.ts
- [ ] T039 [US1] Update `proxy.ts`: replace `parseAndValidateLaunchDatetime(process.env.LAUNCH_DATETIME)` block with async Supabase REST fetch (`${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/campaigns?select=start_date&order=created_at.desc&limit=1`, headers with `apikey` + `Authorization`, `next: { revalidate: CAMPAIGN_CACHE_REVALIDATE_SECONDS }`); parse `rows[0]?.start_date`; call `isPrelaunch(new Date(), startDate)`; wrap entire block in try/catch (fail-open on any error) | proxy.ts

**Checkpoint**: Middleware redirects on future campaign `start_date`; fails-open on empty table or error

---

## Phase 5: Page Integration (US1)

**Goal**: `app/page.tsx` reads launch time from Campaign table instead of env var

**Independent Test**: Remove `LAUNCH_DATETIME` from `.env.local`; start dev server; navigate to `/` → countdown still renders (using Campaign DB record)

- [ ] T040 [US1] Update `app/page.tsx`: replace `parseAndValidateLaunchDatetime(process.env.LAUNCH_DATETIME)` call with `getActiveCampaignCached()` from `lib/campaign-repository`; derive `launchAt = campaign ? new Date(campaign.startDate) : null`; pass to `<CountdownPage launchAt={launchAt} />` — fail-open (null campaign → render `<HomePage />`) | app/page.tsx
- [ ] T041 [US1] Delete `parseAndValidateLaunchDatetime()` function from `lib/launch.ts` (keep `isPrelaunch()`); verify no remaining imports of `parseAndValidateLaunchDatetime` across the codebase | lib/launch.ts

**Checkpoint**: Page reads campaign from DB; countdown renders without `LAUNCH_DATETIME` env var

---

## Phase 6: Client-Side Fixes (US1)

**Goal**: Hook corrects drift on tab re-focus; timer redirects auth-aware on expiry

**Independent Test (visibilitychange)**: Open countdown in browser tab, background it for > 1 minute, re-focus → timer shows recalculated value immediately.  
**Independent Test (auth redirect)**: Set `start_date` to 1 second in the future; when it expires while logged in → lands on `/`; when not logged in → lands on `/login`

### useCountdown visibilitychange (US1)

- [ ] T042 [US1] Write failing Vitest tests for `visibilitychange` behavior: mock `document.visibilityState`; simulate tab hidden 5 minutes (advance `vi.setSystemTime()`); fire `visibilitychange` visible → `timeRemaining` recalculates immediately from `Date.now()` vs `launchAt` | hooks/useCountdown.test.ts
- [ ] T043 [US1] Add `visibilitychange` listener to `hooks/useCountdown.ts`: register `document.addEventListener('visibilitychange', onVisible)` inside a `useEffect([launchAt])`; `onVisible` calls `setState(computeRemaining(launchAt))` when `document.visibilityState === 'visible'`; clean up listener on unmount | hooks/useCountdown.ts

### CountdownTimer auth-aware redirect (US1)

- [ ] T044 [P] [US1] Write failing Vitest tests for `CountdownTimer` expiry redirect: `vi.mock('@/lib/supabase/client')` and mock `supabase.auth.getUser()`; when `isExpired=true` + user authenticated → `router.push(ROUTES.HOME)` called; when `isExpired=true` + no user → `router.push(ROUTES.LOGIN)` called; when `getUser()` throws → `router.push(ROUTES.LOGIN)` called (safe fallback) | components/countdown/CountdownTimer.test.tsx
- [ ] T045 [US1] Update `components/countdown/CountdownTimer.tsx`: replace existing `useEffect` redirect (currently always pushes `ROUTES.LOGIN`) with auth-aware check — `import { createClient } from '@/lib/supabase/client'`; call `supabase.auth.getUser()` inside try/catch; redirect to `ROUTES.HOME` if user exists, `ROUTES.LOGIN` otherwise (including on error) | components/countdown/CountdownTimer.tsx

**Checkpoint**: Hook corrects drift; timer redirects to correct destination based on auth state

---

## Phase 7: Cleanup & Documentation

**Purpose**: Remove all env-var references; keep codebase clean and documentation current

- [ ] T046 [P] Update `.env.example` (or `.env.local.example`): remove `LAUNCH_DATETIME` variable; add comment `# Launch datetime is now managed via the 'campaigns' table in Supabase` | .env.example
- [ ] T047 [P] Verify `LAUNCH_DATETIME` is fully unused: run `grep -r "LAUNCH_DATETIME" . --include="*.ts" --include="*.tsx" --include="*.env*"` — must return 0 results (excluding this tasks.md and any `.env.local` backup) | (verify step)
- [ ] T048 [P] Add `GET /api/campaigns/active` test cases to `BACKEND_API_TESTCASES.md`: positive (campaign exists), null (empty table), schema validation, caching header presence | .momorph/contexts/BACKEND_API_TESTCASES.md
- [ ] T049 Run full Vitest suite (`npm run test`) — all tests green; run `npm run lint` — zero lint errors | (verify step)

**Checkpoint**: No `LAUNCH_DATETIME` references; all tests pass; documentation updated

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (DB)           → Phase 3 (Backend needs campaigns table)
Phase 2 (Constants)    → Phase 3 (Repository uses CAMPAIGN_CACHE_REVALIDATE_SECONDS)
                       → Phase 4 (Middleware uses CAMPAIGN_CACHE_REVALIDATE_SECONDS)
Phase 3 (Repository)   → Phase 5 (Page uses getActiveCampaignCached)
Phase 4 (Middleware)   → Phase 7 (Cleanup verifies LAUNCH_DATETIME removed from proxy.ts)
Phase 5 (Page)         → Phase 7 (Cleanup verifies LAUNCH_DATETIME removed from page.tsx)
Phase 6 (Client fixes) → Phase 7 (Cleanup verifies all changes green)
```

### Critical Path

```
T025-T028 (migration apply)
    → T030 (constants)
    → T032 (repo tests) → T033 (repo impl) → T034 (cached) → T035 (types update)
        → T036 (route tests) → T037 (route impl)
        → T040 (page.tsx) → T041 (delete parse fn)
    → T038 (middleware tests) → T039 (middleware impl)
T042 (hook tests) → T043 (visibilitychange impl)    ← independent of migration
T044 (timer tests) → T045 (auth redirect impl)      ← independent of migration
T046-T049 (cleanup) ← all phases complete
```

### Parallel Opportunities

| Group | Tasks | Can run in parallel |
|-------|-------|-------------------|
| Phase 1 | T025, T026, T027 are sequential (same file); T029 is independent | T028 + T029 |
| Phase 2 | T030, T031 | Both parallel — different files |
| Phase 3 | Tests before impl | T032 and T036 parallel (different test files) |
| Phase 6 | Hook fix and timer fix | T042→T043 and T044→T045 parallel (different files) |
| Phase 7 | T046, T047, T048, T049 | All parallel |

---

## Implementation Strategy

### MVP First (Recommended)

1. **Phase 1** → apply DB migration (T025–T028)
2. **Phase 2** → constants + types (T030–T031)
3. **Phase 3** → repository + API route (T032–T037)
4. **STOP AND TEST**: `curl /api/campaigns/active` returns campaign data
5. **Phase 5** → update `app/page.tsx` (T040–T041)
6. **STOP AND TEST**: dev server shows countdown without `LAUNCH_DATETIME` env var
7. **Phase 4** → middleware update (T038–T039)
8. **STOP AND TEST**: navigate to `/kudos` → redirects to `/`
9. **Phase 6** → client fixes (T042–T045)
10. **Phase 7** → cleanup (T046–T049)

### Key Implementation Details

- **Edge runtime constraint**: `proxy.ts` middleware cannot use `unstable_cache` (Node.js API). Use `fetch()` with `next: { revalidate: 60 }` directly to Supabase REST API — this is the recommended Edge-compatible cache pattern.
- **Fail-open everywhere**: Both middleware AND `app/page.tsx` must not throw when `getActiveCampaign()` returns `null`. No campaign = skip redirect / render homepage.
- **Do NOT make internal fetch from middleware**: Calling `/api/campaigns/active` from `proxy.ts` creates a circular dependency. Always fetch Supabase REST directly.
- **`isPrelaunch()` stays in `lib/launch.ts`**: Only `parseAndValidateLaunchDatetime()` is deleted. The `isPrelaunch(now, launchAt)` utility is still used by both `proxy.ts` and `app/page.tsx`.
- **Auth-aware redirect order**: `router.push()` must fire inside `useEffect` (not during render); the Supabase browser client is created once per expiry event via dynamic import to avoid loading it on every render.
- **Cache tag `'campaigns'`**: If admin updates `start_date` in future, they can call `revalidateTag('campaigns')` from a server action or API route to invalidate instantly without waiting 60s.

---

## Notes

- Mark tasks complete as you go: `[x]`
- Commit after each phase: `git commit -m "feat(countdown): <phase description>"`
- T028 (apply migration) is a one-time destructive-ish action on local dev — verify migration SQL before running `supabase db reset`
- The old `LAUNCH_DATETIME` env var can remain in `.env.local` during migration for safety; T046–T047 handle the final cleanup verification
- US2 (View Branded Background) is already complete — no tasks required in this migration
- Total new tasks this migration: **25** (T025–T049)
