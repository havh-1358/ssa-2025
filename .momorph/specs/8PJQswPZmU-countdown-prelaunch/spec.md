# Feature Specification: Countdown Prelaunch

**Frame ID**: `8PJQswPZmU`
**Frame Name**: `Countdown Prelaunch`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU
**Created**: 2026-04-22
**Status**: Draft

---

## Overview

The Countdown Prelaunch screen is a full-screen holding page displayed before the SSA 2025 platform officially opens. It shows a live countdown timer (Days / Hours / Minutes) counting down to the event launch datetime. The system MUST always redirect all visitors to this screen while the platform has not yet opened, regardless of authentication state.

**Target users**: Any visitor (authenticated or not) accessing the SSA 2025 platform before the official launch date.

**Business context**: SSA 2025 needs a branded pre-launch gate to build anticipation and prevent early access to features that are not yet live. The launch datetime is managed via a **Campaign** record in the database (fields: `campaign_name`, `start_date`, `end_date`). The countdown counts down to `start_date`. Once `start_date` is reached, this screen is no longer shown. The `end_date` marks when the campaign (event) closes; it is stored for future use by other screens and is not rendered on this screen.

---

## User Scenarios & Testing

### US1: View Countdown Timer [P1]

**As a** visitor arriving before the platform opens  
**I want to** see a live countdown showing how long until the SSA 2025 event begins  
**So that** I know exactly when I can access the platform

**Why this priority**: Core purpose of the screen — the countdown is the entire UX.

**Independent Test**: Navigate to `/` before the configured launch datetime → verify the countdown screen renders with correct Days / Hours / Minutes values that tick down every minute.

#### Acceptance Scenarios

**Scenario 1: Countdown displays correct time remaining**
- Given: the current time is before the configured launch datetime
- When: any visitor navigates to the platform
- Then: the countdown screen renders with three digit blocks — DAYS, HOURS, MINUTES — each showing the correct remaining value; values update every 60 seconds without a full page reload

**Scenario 2: Redirect to countdown for all routes**
- Given: the platform is in pre-launch state
- When: a visitor navigates to any route (`/login`, `/dashboard`, `/kudos`, etc.)
- Then: Next.js middleware intercepts and redirects to the countdown page (`/`)

**Scenario 3: Redirect ends when platform opens**
- Given: the configured launch datetime has passed (or admin toggles platform open)
- When: a visitor navigates to any route
- Then: the countdown redirect is lifted; `/login` or the normal routing takes over

**Scenario 4: Countdown reaches zero**
- Given: the countdown timer ticks down to 00 days / 00 hours / 00 minutes
- When: the final timer tick fires and `isExpired` becomes `true` (or admin opens platform)
- Then: the client immediately redirects to `/login` (unauthenticated) or `/` (already authenticated) without waiting for the next timer tick; no negative countdown values are shown at any point

**Scenario 5: Minutes rollover**
- Given: the countdown shows X days, Y hours, 00 minutes
- When: the timer ticks
- Then: minutes resets to 59, hours decrements by 1; values never go below 0

---

### US2: View Branded Background [P2]

**As a** visitor on the countdown screen  
**I want to** see the SAA 2025 key visual background  
**So that** the platform feels polished and branded even before launch

**Why this priority**: Visual/brand requirement; no user interaction needed.

**Independent Test**: Render `/` in pre-launch state → verify key visual background image is present with gradient overlay; fallback to `#00101A` when image fails to load.

#### Acceptance Scenarios

**Scenario 1: Background renders correctly**
- Given: user is on the countdown screen
- When: page loads
- Then: full-screen key visual background image renders with gradient overlay (18deg angle); `#00101A` is the base background color

**Scenario 2: Background image fails to load**
- Given: the key visual image asset cannot be fetched
- When: the browser fails to load the image
- Then: the page remains fully functional with `#00101A` solid background; digit cards and title remain visible

---

### Edge Cases

- **No active campaign**: If `GET /api/campaigns/active` returns no record (no campaign exists or none is currently active), the countdown MUST render a safe fallback showing `--` for each digit block and log the misconfiguration server-side. Do NOT crash.
- **Campaign `start_date` null or invalid**: If the API returns a campaign record but `start_date` is null, malformed, or fails Zod validation, treat the same as "no active campaign" — show `--` fallback and log server-side.
- **JavaScript disabled**: The countdown screen MUST be server-side rendered so the static structure (title, digit blocks) is visible without JS; live ticking requires JS.
- **Very large countdown (>999 days)**: Digit blocks MUST accommodate 3+ digit values without overflow; use responsive font sizing.
- **Background image too slow (LCP)**: Background key visual MUST use `<Image priority />` for LCP optimization.
- **Browser tab backgrounded**: The browser throttles `setInterval` when a tab is not visible. On `document.visibilitychange` (tab becomes active again), the component MUST recalculate `timeRemaining` immediately from `Date.now()` vs `campaign.start_date` to correct any accumulated drift before the next scheduled tick.

---

## UI/UX Requirements

### Screen Components

| ID | Component | Node ID | Kind | Description |
|----|-----------|---------|------|-------------|
| C | Background Key Visual | `2268:35127` | image | Full-bleed background photo with 18-degree gradient overlay |
| B.1 | Countdown Title | `2268:35131` | label | "Sự kiện sẽ bắt đầu sau" — centered, Montserrat 700 36px white |
| B.2 | Days Block | `2268:35139` | compound | Digit card(s) + "NGÀY" / "DAYS" label |
| B.3 | Hours Block | `2268:35144` | compound | Digit card(s) + "GIỜ" / "HOURS" label |
| B.4 | Minutes Block | `2268:35149` | compound | Digit card(s) + "PHÚT" / "MINUTES" label |

**Visual specs**: See [`design-style.md`](./design-style.md) for exact pixel values, colors, typography, and component states.

### Navigation Flow

- **From**: Any route while platform is in pre-launch state (middleware redirect) → `/`
- **To**: `/login` — when platform opens (redirect lifted or countdown reaches 0)

Source of truth: `.momorph/contexts/SCREENFLOW.md`

### Visual Requirements

- **Full-screen layout**: The countdown screen covers the entire viewport (100vw × 100vh)
- **Responsive breakpoints**: mobile ≥ 320px, tablet ≥ 768px, desktop ≥ 1280px (digit blocks scale down on smaller screens)
- **Background fallback**: `#00101A` solid color when image fails
- **Digit card style**: Glassmorphism — frosted-glass blur backdrop, golden (`#FFEA9E`) border
- **Font**: "Digital Numbers" for digit numerals; Montserrat 700 for labels
- **Next.js Image**: Background MUST use `<Image priority fill />` for LCP

### Accessibility Requirements

- **WCAG 2.1 AA**: White text on dark background must pass ≥ 4.5:1 contrast
- **Screen reader**: Countdown values MUST be announced — use `aria-live="polite"` on digit blocks so updates are announced
- **Container ARIA label**: The countdown container MUST have `aria-label="Countdown timer"` (or equivalent i18n string) so screen readers identify the landmark
- **Unit label association**: Each digit block MUST use `aria-label` on its wrapper combining value and unit (e.g., `aria-label="5 days"`) for concise screen reader output; do NOT rely solely on visual layout to convey the unit
- **Semantic markup**: Time values SHOULD use `<time>` element where applicable
- **Keyboard navigation**: This screen has no interactive elements; the tab order is empty (or skips directly to any footer/skip-link target). Do NOT add artificial tab stops to the digit display elements
- **Reduced motion**: If `prefers-reduced-motion: reduce`, suppress any CSS animation on digit transitions

---

## Data Requirements

### Input Fields

No manual input fields. Countdown is purely computed from server-provided launch datetime.

### Display Fields

| Field | Source | Notes |
|-------|--------|-------|
| Days remaining | `campaign.start_date` fetched from `GET /api/campaigns/active`, computed client-side | Integer, 0–999 |
| Hours remaining | Same | Integer, 0–23 |
| Minutes remaining | Same | Integer, 0–59 |
| Title text | i18n | "Sự kiện sẽ bắt đầu sau" (VN) / "Event starts in" (EN) |
| Unit labels | i18n | NGÀY/DAYS, GIỜ/HOURS, PHÚT/MINUTES |

---

## API Requirements

| Endpoint / Method | Purpose | Auth | Trigger |
|-------------------|---------|------|---------|
| `GET /api/campaigns/active` | Return the active campaign record `{ id, campaignName, startDate, endDate }` | Public (no auth) | Page Server Component on every request (cached, see TR-003) |

**Response schema** (Zod-validated):
```ts
const ActiveCampaignSchema = z.object({
  id:           z.string().uuid(),
  campaignName: z.string(),
  startDate:    z.string().datetime(),   // ISO 8601
  endDate:      z.string().datetime(),   // ISO 8601
})
```

**"Active" definition**: A campaign is active when `now()` is before its `start_date` **or** the campaign is the most recently created one with a future `start_date`. If no matching record exists, the endpoint returns `null` (HTTP 200 with `data: null`) — the client shows the `--` fallback.

> **Rationale**: The launch datetime is managed via a Campaign database record, enabling admins to update `start_date` / `end_date` without a redeploy. The countdown page fetches this endpoint server-side at page render; the response is cached (see TR-003) so middleware stays fast.

---

## State Management

### Local Component State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `isLoading` | `boolean` | `true` | True during SSR hydration; set to `false` once `timeRemaining` is computed client-side and the interval is started |
| `campaign` | `ActiveCampaign \| null` | `null` (resolved SSR) | Campaign record fetched server-side; passed as prop to the client component |
| `timeRemaining` | `{ days: number; hours: number; minutes: number }` | computed | Computed from `campaign.startDate` on mount; re-computed on every `setInterval` tick and on `visibilitychange` (tab re-focus) |
| `isExpired` | `boolean` | `false` | True when `Date.now() >= campaign.startDate`; triggers redirect per FR-005 |

### Global State

| State | Source | Notes |
|-------|--------|-------|
| `isPrelaunch` | Server-side: compare `Date.now()` vs `campaign.startDate` fetched from `GET /api/campaigns/active` (cached — see TR-003) | Determines whether countdown redirect is active; evaluated in middleware via cache, not a live DB query |

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST display the countdown screen at `/` when `Date.now() < campaign.startDate` (`isPrelaunch = true`).
- **FR-002**: Middleware MUST redirect all routes to `/` while `isPrelaunch` is true; the `isPrelaunch` check MUST use a cached Campaign value (see TR-003), not a live DB query per request.
- **FR-003**: Countdown MUST show DAYS, HOURS, MINUTES remaining until `campaign.startDate`.
- **FR-004**: Digit values MUST update every 60 seconds without a full page reload.
- **FR-005**: When countdown reaches zero (`Date.now() >= campaign.startDate`), system MUST stop showing 0/0/0 and redirect: to `/` (homepage) if the user has a valid session, or to `/login` if unauthenticated; do NOT show negative values.
- **FR-005a**: If `campaign.startDate` is already in the past when page first loads, render 00/00/00 and immediately apply the FR-005 redirect — do not flash the countdown.
- **FR-006**: Title and unit labels MUST respect the active locale (VN / EN).
- **FR-007**: Background MUST degrade gracefully to `#00101A` if image fails to load.
- **FR-008**: If `GET /api/campaigns/active` returns `null` (no active campaign configured), display `--` for all digit blocks and log the misconfiguration server-side.

### Technical Requirements

- **TR-001**: Launch datetime MUST be stored in the `campaigns` database table (`start_date` column) — not hardcoded or in env vars. Admins update it via direct DB access or an admin UI (out of scope for this screen).
- **TR-002**: Countdown computation MUST be client-side after receiving `campaign.startDate` from the server; do NOT poll the API on every timer tick — fetch once on page load, then compute client-side.
- **TR-003**: Middleware redirect logic MUST be efficient (< 5ms per request). Because middleware cannot query the DB directly, the active campaign's `startDate` MUST be cached server-side using Next.js `unstable_cache` (or equivalent) with a **60-second TTL**. The cache is populated by the `GET /api/campaigns/active` route handler; middleware reads from this cache, not Supabase directly.
- **TR-004**: Screen MUST be server-side rendered (Next.js App Router) for initial paint; hydration adds live ticking.
- **TR-005**: All design token values (colors, spacing) MUST be referenced via CSS variables defined in `app/globals.css`, NOT hardcoded in component files (Constitution Principle II).
- **TR-006**: The `ActiveCampaignSchema` Zod schema MUST validate the API response on the server; invalid or missing `startDate` MUST log a structured error and trigger the `--` fallback (FR-008). Never surface raw validation errors to the client.

---

## Success Criteria

- **SC-001**: Countdown displays correct remaining Days/Hours/Minutes within ±60s of actual remaining time.
- **SC-002**: All routes redirect to countdown screen while `isPrelaunch = true`; redirect stops immediately when flag flips.
- **SC-003**: Page renders (SSR) with valid digit values before hydration.
- **SC-004**: WCAG 2.1 AA contrast check passes for all text elements.

---

## Out of Scope

- Seconds digit block (design shows only Days / Hours / Minutes).
- Admin UI for managing Campaign records (campaigns table is managed via direct DB / future admin panel — out of scope for this screen's implementation).
- Displaying `end_date` on the countdown screen (stored in campaigns table for use by other screens, not rendered here).
- User authentication on this screen (redirect happens before any auth check).
- Any social-sharing or "notify me" functionality.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)
- [ ] `campaigns` database table created with migration (`id`, `campaign_name`, `start_date`, `end_date`, timestamps)
- [ ] `GET /api/campaigns/active` route handler implemented and cached (`unstable_cache`, 60s TTL)
- [ ] Middleware updated to read `isPrelaunch` from the cached campaign value
- [ ] "Digital Numbers" font imported or self-hosted in the project
- [ ] At least one Campaign seed record inserted for local development

---

## Notes

- Unit labels use Vietnamese in default locale: NGÀY (days), GIỜ (hours), PHÚT (minutes). In EN locale: DAYS, HOURS, MINUTES.
- No seconds block is shown — design intentionally shows only three time units.
- Digit cards use glassmorphism style (frosted blur + golden border); see `design-style.md` for exact CSS.
- The `campaigns` table `end_date` column is **not rendered** on this screen. It is stored alongside `start_date` for use by other screens (e.g., showing an "event ended" state on the homepage after the campaign closes).
- Campaign data model (Supabase table `campaigns`):

  | Column | Type | Notes |
  |--------|------|-------|
  | `id` | `uuid` (PK) | auto-generated |
  | `campaign_name` | `text NOT NULL` | e.g., "SSA 2025" |
  | `start_date` | `timestamptz NOT NULL` | countdown target; platform opens at this time |
  | `end_date` | `timestamptz NOT NULL` | event close time; used by other screens |
  | `created_at` | `timestamptz` | auto |
  | `updated_at` | `timestamptz` | auto |

  RLS: table is **publicly readable** (no auth required to fetch the active campaign). Write access restricted to admin role only.
