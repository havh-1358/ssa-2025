# Implementation Plan: Countdown Prelaunch

**Frame**: `8PJQswPZmU-countdown-prelaunch`
**Date**: 2026-04-22
**Spec**: `specs/8PJQswPZmU-countdown-prelaunch/spec.md`

---

## Summary

A full-screen pre-launch gate rendered at `/`. Next.js middleware redirects all routes to `/` while `isPrelaunch = true` (derived from `LAUNCH_DATETIME` env var). The page is server-side rendered with initial digit values; a Client Component adds live 60-second ticking. When the countdown expires, the page redirects to `/login`. Key visual challenge: "Digital Numbers" custom font (self-hosted) and glassmorphism digit cards.

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js App Router
**Primary Dependencies**: React 19, Tailwind CSS 4, next-intl
**Database**: N/A (env var only)
**Testing**: Vitest + React Testing Library; Playwright E2E
**State Management**: React `useState` + `useEffect` (local); env var (global `isPrelaunch`)
**API Style**: N/A (no backend API; optional `GET /api/launch-status` for admin override)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Requirement | Constitution Rule | Status |
|-------------|-------------------|--------|
| I. Type Safety | Strict TS; Zod validates `LAUNCH_DATETIME` env var at startup | ✅ Planned |
| II. Design Fidelity | All tokens (colors, blur, radii) as CSS vars in `globals.css` | ✅ Planned |
| II. Responsive | Digit blocks scale at 768px and 320px breakpoints | ✅ Planned |
| II. WCAG 2.1 AA | `aria-live="polite"` on digit blocks; `<time>` element for countdown | ✅ Planned |
| III. Test-First | Tests written before implementation | ✅ Planned |
| IV. Layered Arch | Page → `<CountdownTimer />` Client Component → `useCountdown` hook | ✅ Planned |
| IV. Clean Code | No magic values; `LAUNCH_DATETIME` extracted to named constant | ✅ Planned |
| V. Doc-Driven | spec.md + plan.md exist | ✅ Met |
| VI. Security | No user data; `LAUNCH_DATETIME` is not a secret; Zod validates on startup | ✅ Planned |

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**:
  - `app/page.tsx` — Server Component; reads `isPrelaunch` flag; renders `<CountdownPage />` or `<HomePage />`
  - `<CountdownPage />` — Server Component shell; passes initial `timeRemaining` and `launchAt` as props to client
  - `<CountdownTimer />` — Client Component; receives `launchAt: Date`; owns `setInterval` + `useState`
  - `<DigitBlock />` — Pure presentational component (days/hours/minutes)
  - `<DigitCard />` — Single digit card with glassmorphism styling
- **Styling Strategy**: Tailwind CSS 4 + CSS custom properties for glassmorphism (`backdrop-blur`, `border: var(--border-card)`, etc.)
- **Data Fetching**: `NEXT_PUBLIC_LAUNCH_DATETIME` env var — no API call for countdown. Middleware reads `LAUNCH_DATETIME` (server-only) for redirect logic.

### Backend Approach

- **Middleware** (`middleware.ts`): On every request, compare `Date.now()` vs `process.env.LAUNCH_DATETIME`. If pre-launch, rewrite all non-`/` routes to `/`. Must be O(1) — no DB query.
- **Validation**: Zod validates `LAUNCH_DATETIME` at middleware initialization. If invalid/missing, middleware logs error and does NOT redirect (fail-open to avoid locking out the site).
- **Optional API** (`app/api/launch-status/route.ts`): If admin real-time date override is required in future, this endpoint returns `{ launchAt, isOpen }`. Not required for MVP.

### Integration Points

- **Shared Components**: `<LanguageSelector />` (rendered in header if header is shown; Countdown screen may have minimal or no header — check design)
- **Shared CSS**: `app/globals.css` — "Digital Numbers" font declared via `@font-face`
- **Middleware**: Same `middleware.ts` that handles locale cookie also handles pre-launch redirect

---

## Project Structure

### Documentation

```text
.momorph/specs/8PJQswPZmU-countdown-prelaunch/
├── spec.md
├── design-style.md
└── plan.md   ← this file
```

### Source Code

```text
app/
├── page.tsx                              # Server Component: isPrelaunch check → render Countdown or Homepage
├── globals.css                           # @font-face Digital Numbers; CSS vars for countdown tokens
└── layout.tsx                            # No change (font import may go here)

components/
└── countdown/
    ├── CountdownPage.tsx                 # Server Component shell — KeyvisualBg + centered CountdownContent
    ├── CountdownTimer.tsx                # Client Component — owns interval, derives days/hours/minutes
    ├── DigitBlock.tsx                    # Presentational — digit card(s) + unit label
    ├── DigitCard.tsx                     # Glassmorphism card for a single digit character
    └── CountdownTimer.test.tsx           # Unit tests for timer logic

hooks/
└── useCountdown.ts                       # Pure hook: given launchAt → { days, hours, minutes, isExpired }

lib/
└── launch.ts                             # parseAndValidateLaunchDatetime(env) with Zod; isPrelaunch(now)

middleware.ts                             # Pre-launch redirect + locale cookie logic (combined)

public/
└── fonts/
    └── DigitalNumbers.woff2              # Self-hosted "Digital Numbers" font
└── assets/
    └── countdown/
        └── keyvisual.jpg                 # Countdown background image
```

### Modified Files

| File | Change |
|------|--------|
| `app/globals.css` | Add `--color-bg-base`, `--color-text-primary`, `--color-accent-gold`, `--color-card-bg`, `--border-card`, `--radius-card`, `--blur-card`; `@font-face` for Digital Numbers |
| `middleware.ts` | Add pre-launch redirect logic alongside existing locale cookie handling |
| `app/page.tsx` | Add server-side `isPrelaunch` check; import and conditionally render `<CountdownPage />` |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `zod` | `^3.x` | Validate `LAUNCH_DATETIME` env var |

No new npm packages required for countdown itself.

---

## Implementation Strategy

### Phase 0: Asset Preparation

- Self-host "Digital Numbers" font: download `.woff2` → `public/fonts/DigitalNumbers.woff2`
- Declare `@font-face` in `app/globals.css`
- Download countdown keyvisual image → `public/assets/countdown/keyvisual.jpg`
- Add all CSS variable tokens to `app/globals.css`

### Phase 1: Foundation (TDD)

1. Write failing tests for `lib/launch.ts`:
   - Valid ISO8601 → returns Date
   - Invalid string → Zod error thrown
   - Past date → `isPrelaunch()` returns false
   - Future date → `isPrelaunch()` returns true
2. Implement `lib/launch.ts`
3. Write failing tests for `useCountdown` hook:
   - Given a future date → returns correct `{ days, hours, minutes }`
   - After interval tick → values decrement
   - When expired → `isExpired: true`
4. Implement `useCountdown.ts`

### Phase 2: Middleware (US1 — Redirect All Routes)

1. Write E2E test: navigate to `/kudos` before launch → expect redirect to `/`
2. Implement middleware pre-launch redirect in `middleware.ts`
3. Verify redirect is < 5ms (no DB query)
4. Add FR-005a: if `LAUNCH_DATETIME` is in the past on first load → skip countdown, redirect to `/login`

### Phase 3: UI Components (US1 + US2)

1. Write component tests for `<DigitCard />`, `<DigitBlock />`, `<CountdownTimer />`
2. Implement `<DigitCard />` with glassmorphism styles
3. Implement `<DigitBlock />` (digit cards + unit label)
4. Implement `<CountdownTimer />` Client Component (uses `useCountdown` hook)
5. Implement `<CountdownPage />` Server Component shell with keyvisual background
6. Wire into `app/page.tsx` with `isPrelaunch` check

### Phase 4: Polish

- `aria-live="polite"` wrapper for digit announcements
- `prefers-reduced-motion` — suppress digit card CSS animation
- Zero-pad single-digit values (`5` → `05`)
- Verify 3-digit support for days > 99
- Responsive digit card scaling (tablet/mobile breakpoints)
- Background image fallback to `#00101A`

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| "Digital Numbers" font not loading | Medium | High | Use `font-display: swap`; fallback to `monospace`; digits remain readable |
| `backdrop-filter: blur()` unsupported (Safari < 15) | Low | Low | `@supports` check; graceful fallback to opaque background |
| Middleware adds latency to all routes | Low | Medium | Benchmark middleware; `LAUNCH_DATETIME` read from env (not DB) |
| Timer drift over long sessions | Low | Low | Recalculate from `launchAt` on each tick (not cumulative decrement) |

### Estimated Complexity

- **Frontend**: Medium (custom font + glassmorphism + interval timer)
- **Backend**: Low (middleware only)
- **Testing**: Low

---

## Integration Testing Strategy

### Test Scope

- [x] **Middleware redirect**: All routes → `/` while pre-launch
- [x] **Countdown display**: Correct values on page load and after tick
- [x] **Expiry redirect**: Countdown reaches zero → redirect to `/login`
- [ ] **Data layer**: N/A

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | `useCountdown` drives `<CountdownTimer />` display |
| App ↔ Middleware | Yes | Pre-launch redirect for all routes |
| Cross-platform | Yes | Responsive digit scaling; font loading |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| `Date.now()` | Mock/Stub | Control time in tests |
| `process.env.LAUNCH_DATETIME` | Env override | Test valid/invalid/past/future values |
| `router.push` | Mock | Verify redirect on expiry |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] `LAUNCH_DATETIME` = 5 days from now → countdown shows 5 days, correct hours/minutes
   - [ ] After 60s tick → minutes decrements
   - [ ] All routes redirect to `/` while pre-launch

2. **Error Handling**
   - [ ] `LAUNCH_DATETIME` missing → no redirect; server logs error; site accessible
   - [ ] `LAUNCH_DATETIME` invalid string → Zod catches; same fallback

3. **Edge Cases**
   - [ ] `LAUNCH_DATETIME` already past → FR-005a: render `00:00:00`, redirect immediately
   - [ ] Days > 99 → 3-digit display without overflow

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `lib/launch.ts` | 100% | High |
| `useCountdown` hook | 100% | High |
| `<CountdownTimer />` component | 85%+ | High |
| Middleware redirect | E2E covered | High |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved
- [ ] "Digital Numbers" font file obtained (`.woff2`)
- [ ] Keyvisual image asset downloaded
- [ ] `LAUNCH_DATETIME` env var defined in `.env.local`
- [ ] Language Selector component available (if shown on countdown screen)

### External Dependencies

- "Digital Numbers" font (self-hosted; not available on Google Fonts)
- Keyvisual image (from Figma or design team)

---

## Next Steps

1. Run `/momorph.tasks` to generate the task breakdown
2. Download font and image assets (Phase 0)
3. Begin TDD with `lib/launch.ts`

---

## Notes

- The `app/page.tsx` route serves BOTH the Countdown and the Homepage. The `isPrelaunch` check is server-side — no client-side conditional rendering.
- The "Digital Numbers" font MUST be self-hosted in `public/fonts/`. Do NOT use Google Fonts (not available there).
- The countdown shows only DAYS / HOURS / MINUTES — no SECONDS. This is intentional per design.
- Middleware redirect must also preserve the locale cookie — do not clobber it during redirect.
