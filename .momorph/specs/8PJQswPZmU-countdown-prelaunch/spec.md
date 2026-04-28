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

**Business context**: SSA 2025 needs a branded pre-launch gate to build anticipation and prevent early access to features that are not yet live. Once the countdown reaches zero (or the admin sets the platform as open), this screen is no longer shown.

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
- Then: the client immediately redirects to `/login` without waiting for the next timer tick; no negative countdown values are shown at any point

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

- **Launch datetime not configured**: If the environment variable for launch datetime is missing/invalid, the countdown MUST render a safe fallback (e.g., show `--` for each digit block) and log the misconfiguration server-side. Do NOT crash.
- **JavaScript disabled**: The countdown screen MUST be server-side rendered so the static structure (title, digit blocks) is visible without JS; live ticking requires JS.
- **Very large countdown (>999 days)**: Digit blocks MUST accommodate 3+ digit values without overflow; use responsive font sizing.
- **Background image too slow (LCP)**: Background key visual MUST use `<Image priority />` for LCP optimization.

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
| Days remaining | Server env `LAUNCH_DATETIME` computed on client | Integer, 0–999 |
| Hours remaining | Same | Integer, 0–23 |
| Minutes remaining | Same | Integer, 0–59 |
| Title text | i18n | "Sự kiện sẽ bắt đầu sau" (VN) / "Event starts in" (EN) |
| Unit labels | i18n | NGÀY/DAYS, GIỜ/HOURS, PHÚT/MINUTES |

---

## API Requirements (Predicted)

| Endpoint / Method | Purpose | Trigger |
|-------------------|---------|---------|
| `GET /api/launch-status` | Return `{ launchAt: ISO8601, isOpen: boolean }` | Page mount to get authoritative launch time |

Alternatively: launch datetime exposed as a public env var (`NEXT_PUBLIC_LAUNCH_DATETIME`) so the countdown can be computed client-side without an API call. Prefer this simpler approach; only add an API endpoint if real-time admin override of launch date is needed.

---

## State Management

### Local Component State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `timeRemaining` | `{ days: number; hours: number; minutes: number }` | computed | Updated every 60s via `setInterval` |
| `isExpired` | `boolean` | `false` | True when countdown reaches zero; triggers redirect or platform-open UI |

### Global State

| State | Source | Notes |
|-------|--------|-------|
| `isPrelaunch` | Middleware (env var / API) | Determines whether countdown redirect is active |

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST display the countdown screen at `/` when platform is in pre-launch state.
- **FR-002**: Middleware MUST redirect all routes to `/` while `isPrelaunch` is true.
- **FR-003**: Countdown MUST show DAYS, HOURS, MINUTES remaining until `LAUNCH_DATETIME`.
- **FR-004**: Digit values MUST update every 60 seconds without a full page reload.
- **FR-005**: When countdown reaches zero, system MUST stop showing 0/0/0 and instead redirect to `/login`; do NOT show negative values.
- **FR-005a**: If `LAUNCH_DATETIME` is in the past when page first loads, render 00/00/00 and immediately redirect to `/login` — do not flash the countdown.
- **FR-006**: Title and unit labels MUST respect the active locale (VN / EN).
- **FR-007**: Background MUST degrade gracefully to `#00101A` if image fails to load.

### Technical Requirements

- **TR-001**: Launch datetime MUST be server-side configurable (env var or database record) — not hardcoded.
- **TR-002**: Countdown computation MUST be client-side after receiving the launch datetime from the server; do NOT poll an API every second.
- **TR-003**: Middleware redirect logic MUST be efficient (< 5ms) — check env var, not a DB query, per request.
- **TR-004**: Screen MUST be server-side rendered (Next.js App Router) for initial paint; hydration adds live ticking.
- **TR-005**: All design token values (colors, spacing) MUST be referenced via CSS variables defined in `app/globals.css`, NOT hardcoded in component files (Constitution Principle II).
- **TR-006**: `LAUNCH_DATETIME` value MUST be validated with Zod at startup; invalid values MUST fail fast with a clear error log (Constitution Principle I).

---

## Success Criteria

- **SC-001**: Countdown displays correct remaining Days/Hours/Minutes within ±60s of actual remaining time.
- **SC-002**: All routes redirect to countdown screen while `isPrelaunch = true`; redirect stops immediately when flag flips.
- **SC-003**: Page renders (SSR) with valid digit values before hydration.
- **SC-004**: WCAG 2.1 AA contrast check passes for all text elements.

---

## Out of Scope

- Seconds digit block (design shows only Days / Hours / Minutes).
- Admin UI for setting launch datetime (backend configuration only).
- User authentication on this screen (redirect happens before any auth check).
- Any social-sharing or "notify me" functionality.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)
- [ ] `LAUNCH_DATETIME` environment variable defined in `.env`
- [ ] "Digital Numbers" font imported or self-hosted in the project
- [ ] Middleware pre-launch check logic implemented

---

## Notes

- Unit labels use Vietnamese in default locale: NGÀY (days), GIỜ (hours), PHÚT (minutes). In EN locale: DAYS, HOURS, MINUTES.
- No seconds block is shown — design intentionally shows only three time units.
- Digit cards use glassmorphism style (frosted blur + golden border); see `design-style.md` for exact CSS.
