# Implementation Plan: Countdown Prelaunch — Campaign Table Migration

**Frame**: `8PJQswPZmU-countdown-prelaunch`
**Date**: 2026-04-28
**Spec**: `specs/8PJQswPZmU-countdown-prelaunch/spec.md`

---

## Summary

Migrate the Countdown Prelaunch feature from a static `LAUNCH_DATETIME` environment variable to a
**`campaigns` database table** (`campaign_name`, `start_date`, `end_date`). The countdown UI
components (`CountdownPage`, `CountdownTimer`, `DigitBlock`, `DigitCard`, `useCountdown`) are
already implemented and visually correct. This plan covers:

1. **Database** — new `campaigns` table migration + seed record
2. **Backend** — `GET /api/campaigns/active` route + `lib/campaign-repository.ts`
3. **Middleware** — replace synchronous env-var check with cached Supabase REST fetch
4. **Page** — replace `parseAndValidateLaunchDatetime()` with `getActiveCampaignCached()`
5. **Client fixes** — `visibilitychange` drift correction in `useCountdown`; auth-aware redirect in `CountdownTimer`

**Current state**: `lib/launch.ts` reads `process.env.LAUNCH_DATETIME`; `proxy.ts` and
`app/page.tsx` both call `parseAndValidateLaunchDatetime()` synchronously.

**Target state**: `campaigns` table is the authoritative source. Middleware and page both use a
60-second cached fetch. No env var is needed for launch datetime.

---

## Technical Context

| Item | Value |
|------|-------|
| Language / Framework | TypeScript 5 strict / Next.js 16.2 App Router |
| Primary Dependencies | React 19, Tailwind CSS 4, Zod 4, next-intl 4, `@supabase/ssr` 0.10 |
| Database | Supabase PostgreSQL (RLS enabled) |
| Auth | Supabase Auth (Google OAuth) |
| Testing | Vitest 4 (unit/integration) + Playwright 1.59 (E2E) |
| State Management | React local state (`useState`, `useEffect`) |
| API Style | Next.js Route Handlers (REST, JSON) |

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Requirement | Rule | Status |
|-------------|------|--------|
| TypeScript strict, no `any` | Principle I | ✅ All new code typed; Zod infers `ActiveCampaign` type |
| Zod validation at system boundary | Principle I | ✅ `ActiveCampaignSchema` validates API response in repository |
| CSS variables, no raw hex | Principle II | ✅ Countdown UI already compliant; no new design tokens needed |
| Responsive design + WCAG 2.1 AA | Principle II | ✅ Already implemented in existing components |
| Test-first (80%+ unit/integration) | Principle III | 📋 Planned for all new files |
| Route → Repository layering (no business logic in route handler) | Principle IV | ✅ `route.ts` calls `getActiveCampaign()`; no logic in handler |
| Function size ≤ 50 lines | Principle IV | ✅ Each function is single-purpose and small |
| No magic values (60s TTL as named constant) | Principle IV | ✅ `CAMPAIGN_CACHE_REVALIDATE_SECONDS = 60` |
| RLS on `campaigns` table | Principle VI | ✅ Public SELECT; no INSERT/UPDATE/DELETE policies → anon/auth denied |
| Secrets in env vars only | Principle VI | ✅ Supabase keys via `process.env.*` |
| Middleware ≤ 5ms per request (TR-003) | TR-003 | ✅ `next: { revalidate: 60 }` on fetch — DB hit ≤ once per 60s |

**Violations**: None. No deliberate deviations from the constitution.

---

## Architecture Decisions

### Frontend

- **No new components.** Modify `CountdownTimer.tsx` (auth-aware redirect on expiry) and
  `useCountdown.ts` (`visibilitychange` handler for tab-focus drift).
- **Data flow**: `app/page.tsx` (Server Component) → `getActiveCampaignCached()` →
  passes `launchAt: Date` prop down to `<CountdownPage />` → `<CountdownTimer />`.
  Client components do NOT fetch campaign data directly.
- **Auth check on expiry** (FR-005): In `CountdownTimer.tsx`, when `isExpired=true`,
  call `supabase.auth.getUser()` (browser client, one-time) → redirect to `/` if
  authenticated, `/login` if not.

### Backend

- **Repository** (`lib/campaign-repository.ts`): mirrors `lib/kudos-repository.ts` pattern.
  Defines `ActiveCampaignSchema` (Zod), queries Supabase via `createClient()` from
  `lib/supabase/server.ts`, maps snake_case → camelCase, returns `ActiveCampaign | null`.
- **API route** (`app/api/campaigns/active/route.ts`): thin handler, `export const revalidate = 60`,
  calls `getActiveCampaign()`, returns `Response.json({ data: campaign })`.
- **Page cache** (`app/page.tsx`): wraps `getActiveCampaign()` with `unstable_cache`
  (Node.js runtime, 60s TTL, cache tag `['campaigns']`) → `getActiveCampaignCached()`.
  *Alternative (Next.js 15+ preferred)*: add `export const revalidate = 60` to `app/page.tsx`
  and drop `unstable_cache` — simpler and avoids the "unstable" API entirely.
- **Cache invalidation**: When an admin updates `start_date` in the `campaigns` table,
  call `revalidateTag('campaigns')` from a server action or admin API route to invalidate
  both the page cache and the repository cache instantly (no 60s wait needed).

### Middleware Caching Strategy (TR-003 — Edge Runtime)

`unstable_cache` requires Node.js runtime and **cannot be used in Edge middleware**.
Instead, `proxy.ts` queries Supabase REST directly via `fetch()` with
`next: { revalidate: 60 }`. Next.js data cache handles the 60-second TTL across Edge
invocations — the database is hit at most once per 60 seconds per CDN edge node.

```
proxy.ts (Edge) → fetch(SUPABASE_REST_URL + /campaigns, { next: { revalidate: 60 } })
                              ↑ cached by Next.js data cache
```

**Why not internal fetch to `/api/campaigns/active` from middleware?**
This creates a circular dependency (middleware → app routing → middleware). Direct
Supabase REST fetch avoids this and is the recommended pattern for Edge middleware.

### Integration Points

| File | Change |
|------|--------|
| `proxy.ts` | Replace `parseAndValidateLaunchDatetime(env)` with Supabase REST fetch |
| `app/page.tsx` | Replace env-var call with `getActiveCampaignCached()` |
| `lib/launch.ts` | `isPrelaunch()` kept; `parseAndValidateLaunchDatetime()` deleted |
| `lib/supabase/client.ts` | **Read-only** — existing `createClient()` browser helper imported in `CountdownTimer`; no changes needed |

---

## Project Structure

### Documentation

```
.momorph/specs/8PJQswPZmU-countdown-prelaunch/
├── spec.md           ✅ Updated (Campaign table, FR-005 auth redirect, edge cases)
├── design-style.md   ✅ Updated (objectFit fix, blur rounding, responsive unit labels)
├── plan.md           ← This file
└── tasks.md          ✅ Generated (T025–T049, Campaign migration tasks)
```

### New Files

| File | Purpose |
|------|---------|
| `supabase/migrations/YYYYMMDD_create_campaigns.sql` | DDL: `campaigns` table, RLS, dev seed record |
| `lib/campaign-repository.ts` | `ActiveCampaignSchema` (Zod), `getActiveCampaign()`, `getActiveCampaignCached()` |
| `types/campaign.ts` | `ActiveCampaign` TypeScript type (inferred from Zod schema) |
| `app/api/campaigns/active/route.ts` | `GET /api/campaigns/active` — returns `{ data: ActiveCampaign \| null }` |

### Modified Files

| File | What Changes |
|------|-------------|
| `proxy.ts` | Replace `parseAndValidateLaunchDatetime(process.env.LAUNCH_DATETIME)` with cached Supabase REST fetch |
| `app/page.tsx` | Replace env-var launch check with `getActiveCampaignCached()` |
| `components/countdown/CountdownTimer.tsx` | Auth-aware redirect on `isExpired` (FR-005): `/` if auth, `/login` if not; import `createClient` from `@/lib/supabase/client` |
| `hooks/useCountdown.ts` | Add `visibilitychange` listener to recalculate `timeRemaining` on tab re-focus |
| `lib/launch.ts` | Delete `parseAndValidateLaunchDatetime()`; keep `isPrelaunch()` |
| `.momorph/contexts/database-schema.sql` | Append `campaigns` table DDL; update screen comment for `8PJQswPZmU` from `(no DB entities)` to `(campaigns table)` |
| `.env.example` | Remove `LAUNCH_DATETIME` variable; add comment pointing to `campaigns` table |
| `.momorph/contexts/BACKEND_API_TESTCASES.md` | Add `GET /api/campaigns/active` test cases (positive, null, schema validation, revalidate header) |

### No New npm Dependencies

All required packages are already installed: `@supabase/ssr`, `@supabase/supabase-js`, `zod`, `next`.

---

## Implementation Strategy

### Phase 0: Database Migration

Create `supabase/migrations/YYYYMMDD_create_campaigns.sql`:

```sql
CREATE TABLE campaigns (
  id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_name TEXT         NOT NULL,
  start_date    TIMESTAMPTZ  NOT NULL,
  end_date      TIMESTAMPTZ  NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT campaigns_end_after_start CHECK (end_date > start_date)
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Public read: required for countdown page and middleware (no auth)
CREATE POLICY "campaigns: public read"
  ON campaigns FOR SELECT USING (TRUE);
-- No INSERT/UPDATE/DELETE policies → only service_role can write

-- Dev seed (adjust dates before applying to production)
INSERT INTO campaigns (campaign_name, start_date, end_date) VALUES
  ('SSA 2025', '2025-12-26T18:00:00+07:00', '2025-12-27T23:00:00+07:00');
```

Steps:
1. Run `supabase migration new create_campaigns` → paste DDL
2. `supabase db reset` (local) to verify migration applies cleanly
3. Confirm seed record visible in Supabase Studio table editor

### Phase 1: Backend — Types, Repository, API Route (TDD)

**1a. Write tests first** (`lib/campaign-repository.test.ts`):
- `getActiveCampaign()` returns `ActiveCampaign` when seed row exists
- Returns `null` when campaigns table is empty
- Returns `null` and logs error when DB call fails
- Zod schema rejects row with null `start_date`

**1b. Implement `types/campaign.ts`**:
```ts
import type { z } from 'zod';
import { ActiveCampaignSchema } from '@/lib/campaign-repository';
export type ActiveCampaign = z.infer<typeof ActiveCampaignSchema>;
```

**1c. Implement `lib/campaign-repository.ts`**:
- `ActiveCampaignSchema`: `{ id: uuid, campaignName: string, startDate: datetime, endDate: datetime }`
- `getActiveCampaign(): Promise<ActiveCampaign | null>` — queries
  `SELECT id, campaign_name, start_date, end_date FROM campaigns ORDER BY created_at DESC LIMIT 1`,
  validates with Zod, maps snake_case → camelCase
- `getActiveCampaignCached()` — wraps `getActiveCampaign()` with `unstable_cache`,
  `revalidate: CAMPAIGN_CACHE_REVALIDATE_SECONDS` (60), tag: `['campaigns']`

**1d. Write tests first** (`app/api/campaigns/active/route.test.ts`):
- Returns `200 { data: { ... } }` when campaign exists
- Returns `200 { data: null }` when no campaign

**1e. Implement `app/api/campaigns/active/route.ts`**:
```ts
export const revalidate = CAMPAIGN_CACHE_REVALIDATE_SECONDS;

export async function GET(): Promise<Response> {
  const campaign = await getActiveCampaign();
  return Response.json({ data: campaign });
}
```

### Phase 2: Middleware Integration (TDD)

**2a. Write tests first** (middleware redirect with mocked fetch):
- Active campaign (`start_date` in future) → redirect `302` to `/` for all non-root routes
- No campaign (fetch returns `[]`) → no redirect; normal routing
- Fetch throws error → no redirect (fail-open)
- Root path `/` → never redirects regardless of campaign state

**2b. Modify `proxy.ts`**:

Replace the current `try { const launchAt = parseAndValidateLaunchDatetime(...) }` block with:

```ts
const CAMPAIGN_REST_URL =
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/campaigns` +
  `?select=start_date&order=created_at.desc&limit=1`;

if (pathname !== '/') {
  try {
    const res = await fetch(CAMPAIGN_REST_URL, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      next: { revalidate: CAMPAIGN_CACHE_REVALIDATE_SECONDS },
    });
    const rows: Array<{ start_date: string }> = await res.json();
    const startDate = rows[0]?.start_date ? new Date(rows[0].start_date) : null;
    if (startDate && isPrelaunch(new Date(), startDate)) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      return NextResponse.redirect(url);
    }
  } catch {
    // Fail-open: Supabase unreachable → skip pre-launch redirect
  }
}
```

Move `CAMPAIGN_CACHE_REVALIDATE_SECONDS = 60` to a shared constants file
(`lib/constants/campaign.ts`) usable in both Edge and Node.js runtimes.

### Phase 3: Page Integration

**3a. Modify `app/page.tsx`**:

```ts
import { getActiveCampaignCached } from '@/lib/campaign-repository';
import { isPrelaunch } from '@/lib/launch';

export default async function RootPage() {
  const campaign = await getActiveCampaignCached();
  const launchAt = campaign ? new Date(campaign.startDate) : null;

  if (launchAt && isPrelaunch(new Date(), launchAt)) {
    return <CountdownPage launchAt={launchAt} />;
  }
  return <HomePage launchAtISO={(launchAt ?? new Date()).toISOString()} />;
}
```

**3b. Delete `parseAndValidateLaunchDatetime()` from `lib/launch.ts`** (keep `isPrelaunch()`).

### Phase 4: Client-Side Fixes (TDD)

**4a. `hooks/useCountdown.ts` — `visibilitychange` handler**:

Write test first (mock `document.visibilityState`, `vi.setSystemTime()`):
- Tab hidden for 5 minutes → tab re-shown → `timeRemaining` recalculates from `Date.now()` immediately

Implementation — add inside `useCountdown`:
```ts
useEffect(() => {
  const onVisible = () => {
    if (document.visibilityState === 'visible') {
      setState(computeRemaining(launchAt));
    }
  };
  document.addEventListener('visibilitychange', onVisible);
  return () => document.removeEventListener('visibilitychange', onVisible);
}, [launchAt]);
```

**4b. `components/countdown/CountdownTimer.tsx` — auth-aware redirect**:

Write test first (mock `@/lib/supabase/client` module, mock `router.push`):
- `isExpired=true` + `getUser()` returns a user → `router.push(ROUTES.HOME)`
- `isExpired=true` + `getUser()` returns no user → `router.push(ROUTES.LOGIN)`
- `isExpired=true` + `getUser()` throws → defaults to `router.push(ROUTES.LOGIN)` (safe fallback)

Replace existing `useEffect` redirect block. **Use the existing `createClient()` helper from
`lib/supabase/client.ts`** (same pattern as `LoginButton.tsx`) — no dynamic import needed:

```ts
import { createClient } from '@/lib/supabase/client';

// inside CountdownTimer component:
useEffect(() => {
  if (!isExpired) return;
  void (async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      router.push(user ? ROUTES.HOME : ROUTES.LOGIN);
    } catch {
      // Auth check failed — fail-safe to login
      router.push(ROUTES.LOGIN);
    }
  })();
}, [isExpired, router]);
```

### Phase 5: Cleanup

- Remove `process.env.LAUNCH_DATETIME` from `.env.example` (add comment: "Launch datetime now managed via `campaigns` table")
- Update `.momorph/contexts/database-schema.sql` to include `campaigns` table DDL
- Delete `parseAndValidateLaunchDatetime` from `lib/launch.ts`
- Verify `LAUNCH_DATETIME` is unused across the entire codebase: `grep -r LAUNCH_DATETIME .`

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Edge middleware `fetch` adds latency when cache is cold (first request per edge node) | Medium | Low | Cold-cache hit is ~50ms; acceptable for pre-launch redirect. After first request, cache handles it in <1ms. |
| 60-second cache lag after admin updates `start_date` | Low | Low | Acceptable tradeoff — documented in TR-003. Admin has visibility into the delay. |
| `unstable_cache` API changes (marked "unstable") | Low | Medium | Preferred fallback: replace with `'use cache'` directive (stable since Next.js 15) on `getActiveCampaignCached()`. Simpler fallback: add `export const revalidate = 60` to `app/page.tsx` and remove the cached wrapper entirely |
| `visibilitychange` not fired in some iOS Safari versions | Low | Low | `setInterval` is the primary 60s tick; `visibilitychange` is best-effort drift correction |
| Breaking `app/page.tsx` (both countdown and homepage use it) | Low | High | Covered by existing E2E tests + new unit tests for the migration |

### Estimated Complexity

- **Backend** (migration + repository + route): Low–Medium
- **Middleware** (fetch + cache pattern): Medium (Edge runtime constraints)
- **Client fixes** (visibilitychange + auth redirect): Low
- **Testing**: Low–Medium

---

## Integration Testing Strategy

### Test Scope

- [x] **Data layer**: `campaigns` table — migration correctness, RLS policies
- [x] **API route**: `GET /api/campaigns/active` — response shape, null case, `revalidate` header
- [x] **Middleware**: pre-launch redirect fires/doesn't fire based on campaign state
- [x] **Client hook**: `useCountdown` drift correction on `visibilitychange`
- [x] **E2E**: navigate to any route while pre-launch → redirects to `/` → countdown renders

### Test Categories

| Category | Applicable | Key Scenarios |
|----------|-----------|---------------|
| UI ↔ Logic | Yes | `useCountdown` visibilitychange; `CountdownTimer` auth-aware redirect |
| App ↔ Data Layer | Yes | `getActiveCampaign()` with and without seed record |
| App ↔ External API | Yes | `GET /api/campaigns/active` — 200 with data, 200 with null |
| Middleware | Yes | redirect fires with future `start_date`; fails-open on empty table/error |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| Supabase client in repository | Real (local Supabase instance) | Constitution III: avoid mock/prod divergence |
| `Date.now()` in `useCountdown` | `vi.setSystemTime()` | Deterministic time without real waits |
| `document.visibilityState` | JSDOM property override in Vitest | Browser API not available in Node test env |
| Supabase REST in middleware | `vi.fn()` mock on global `fetch` | Middleware unit-tested in isolation |
| `supabase.auth.getUser()` in `CountdownTimer` | `vi.mock('@/lib/supabase/client')` — mock `createClient()` to return a fake `auth.getUser()` | Matches the actual import used in `CountdownTimer`; avoids mocking internal `@supabase/ssr` |

### Test Scenarios Outline

**1. Happy Path**
- [ ] `GET /api/campaigns/active` → `{ data: { id, campaignName, startDate, endDate } }` when seed record exists
- [ ] `app/page.tsx` renders `<CountdownPage />` when `startDate` is in the future
- [ ] `app/page.tsx` renders `<HomePage />` when `startDate` is in the past
- [ ] All non-root routes redirect to `/` while campaign `startDate > Date.now()`

**2. Error Handling**
- [ ] `GET /api/campaigns/active` → `{ data: null }` when `campaigns` table is empty
- [ ] `app/page.tsx` renders `<HomePage />` when no active campaign (fail-open)
- [ ] Middleware continues normal routing when Supabase REST call throws (fail-open)
- [ ] `useCountdown` shows `00/00/00` and triggers redirect immediately when `startDate` already past on mount

**3. Edge Cases**
- [ ] `useCountdown`: recalculates `timeRemaining` immediately on `visibilitychange` visible
- [ ] `CountdownTimer`: redirects to `/` (not `/login`) when `isExpired=true` and user is authenticated
- [ ] `CountdownTimer`: redirects to `/login` when `isExpired=true` and user is not authenticated
- [ ] No negative countdown values — `Math.max(0, ...)` clamp preserved

### Tooling

- **Test framework**: Vitest 4 (unit/integration)
- **Browser API mocks**: JSDOM (bundled with Vitest)
- **E2E**: Playwright 1.59
- **CI**: `npm run test` must be green before merge

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `lib/campaign-repository.ts` | 90%+ | High |
| `app/api/campaigns/active/route.ts` | 85%+ | High |
| `hooks/useCountdown.ts` | 90%+ | High |
| `components/countdown/CountdownTimer.tsx` | 80%+ | Medium |
| Middleware campaign check (`proxy.ts`) | 80%+ | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (Campaign table decision confirmed)
- [x] Existing countdown UI components implemented and visually correct
- [ ] Local Supabase dev instance running (`supabase start`)
- [ ] `supabase/migrations/` directory exists (create if absent)
- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Vitest config set up (check `vitest.config.ts` or `vite.config.ts`)

### External Dependencies

- Supabase local dev instance for migration testing
- Production Supabase project for applying migration before go-live

---

## Next Steps

Plan reviewed and approved. Tasks generated in `tasks.md` (T025–T049):

1. **Apply** database migration to local Supabase dev (`supabase db reset`) — T025–T028
2. **Implement** in Phase order: DB → Backend → Middleware → Page → Client fixes → Cleanup
3. **Run tests** after each phase before proceeding
4. **Run** `/momorph.implement` to begin implementation

---

## Notes

- `lib/launch.ts → isPrelaunch(now, launchAt)` is preserved and reused by both `proxy.ts` (middleware) and `app/page.tsx` after the migration. Only `parseAndValidateLaunchDatetime()` is deleted.
- `BACKEND_API_TESTCASES.md` must be updated as part of this feature (new endpoint `GET /api/campaigns/active`). It is listed in Modified Files and covered by task T048.
- The pre-launch redirect in `proxy.ts` currently applies to ALL routes except `/`. The existing auth guard for `/kudos` is a separate `if` block below and must **not** be touched during this implementation.
- `proxy.ts` is the actual middleware file (renamed from `middleware.ts` per git history). The `config.matcher` is already correct — no changes needed.
- Vertical positioning fix (`pt-[27vh]`) and unit label responsive size fix (`text-[20px] md:text-[28px]`) were applied in a prior session — **not** part of this plan.
- The `CAMPAIGN_CACHE_REVALIDATE_SECONDS = 60` constant should live in `lib/constants/campaign.ts` so it is importable in both Edge (`proxy.ts`) and Node.js (`campaign-repository.ts`, `route.ts`) runtimes without tree-shaking issues.
