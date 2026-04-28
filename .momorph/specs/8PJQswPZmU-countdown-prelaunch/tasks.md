# Tasks: Countdown Prelaunch

**Frame**: `8PJQswPZmU-countdown-prelaunch`
**Prerequisites**: plan.md (required), spec.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2)
- **|**: File path affected by this task

---

## Phase 0: Asset Preparation

**Purpose**: Download and place all static assets before any code is written

- [x] T001 Download "Digital Numbers" `.woff2` font file and place at `public/fonts/DigitalNumbers.woff2` | public/fonts/DigitalNumbers.woff2
- [x] T002 [P] Download countdown keyvisual image and place at `public/assets/countdown/keyvisual.jpg` | public/assets/countdown/keyvisual.jpg
- [x] T003 [P] Define `NEXT_PUBLIC_LAUNCH_DATETIME` and `LAUNCH_DATETIME` env vars in `.env.local` | .env.local

---

## Phase 1: Foundation (Blocking Prerequisites)

**Purpose**: Core utilities required by ALL components — middleware and UI cannot proceed until complete

**CRITICAL**: No user story implementation can begin until this phase is complete

- [x] T004 Implement `parseAndValidateLaunchDatetime(env)` using Zod (valid ISO8601 → Date; invalid/missing → throws ZodError) and `isPrelaunch(now: Date): boolean` | lib/launch.ts
- [x] T005 [P] Add `@font-face` declaration for "Digital Numbers" with `font-display: swap` and `monospace` fallback | app/globals.css
- [x] T006 [P] Add all countdown CSS custom property tokens: `--color-bg-base`, `--color-text-primary`, `--color-accent-gold`, `--color-card-bg`, `--border-card`, `--radius-card`, `--blur-card`, `--gap-digit-blocks`, `--gap-digit-cards`, `--gap-digit-label`, `--gap-title-blocks` | app/globals.css
- [x] T007 Implement `useCountdown(launchAt: Date)` hook returning `{ days, hours, minutes, isExpired }`: on mount check `Date.now() >= launchAt.getTime()` and set `isExpired = true` synchronously if already past (FR-005a); otherwise start 60-second `setInterval` recalculating from `launchAt` each tick; clamp all values to `Math.max(0, value)`; clear interval on unmount | hooks/useCountdown.ts

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 2: Middleware — US1 (Redirect All Routes While Pre-launch)

**Goal**: Every route other than `/` is rewritten to `/` while `isPrelaunch = true`; fail-open if env var is missing or invalid

**Independent Test**: Navigate to `/kudos` with `LAUNCH_DATETIME` in the future → browser lands on `/`; navigate with `LAUNCH_DATETIME` in the past → no redirect

- [x] T008 [US1] Add pre-launch redirect logic to `middleware.ts`: read `process.env.LAUNCH_DATETIME`, call `parseAndValidateLaunchDatetime` inside try/catch (fail-open on error — log and skip redirect), call `isPrelaunch(new Date())`, if true rewrite all non-`/` pathnames to `/`; preserve existing locale cookie handling | middleware.ts
- [x] T009 [US1] Verify middleware preserves locale cookie during redirect (do not clobber `NEXT_LOCALE` or equivalent cookie on rewrite) | middleware.ts

**Checkpoint**: Middleware redirect complete and independently verifiable

---

## Phase 3: UI Components — US1 + US2

**Goal**: Full countdown page rendered with live ticking timer (US1) and branded key-visual background (US2)

**Independent Test**: Load `/` with future `LAUNCH_DATETIME` → countdown digits display; wait for tick → minutes decrement; `LAUNCH_DATETIME` already past → immediate redirect to `/login`

### DigitCard Component (US1 + US2)

- [x] T010 [P] [US1] Implement `<DigitCard />` presentational component: renders a single digit character inside a glassmorphism card using CSS vars (`--color-card-bg`, `--border-card`, `--radius-card`, `--blur-card`); add `aria-hidden="true"` on the card wrapper (block-level aria-label on `<DigitBlock />` provides the accessible name); add `@supports (backdrop-filter: blur())` check with opaque fallback | components/countdown/DigitCard.tsx

### DigitBlock Component (US1)

- [x] T011 [US1] Implement `<DigitBlock />` presentational component: accepts `value: number` and `unit: string` props; zero-pads single-digit values (`05`); renders a row of `<DigitCard />` instances (supports 2-digit and 3-digit values for days > 99); renders the unit label below the cards; add `aria-label={\`${value} ${unit}\`}` on the block wrapper | components/countdown/DigitBlock.tsx

### CountdownTimer Client Component (US1)

- [x] T012 [US1] Implement `<CountdownTimer />` Client Component (`"use client"`): accepts `launchAt: Date` prop; calls `useCountdown(launchAt)` to get `{ days, hours, minutes, isExpired }`; add `useEffect` watching `isExpired` — when `true` call `router.push('/login')` immediately (no additional delay); render `<DigitBlock />` for days, hours, minutes; add `aria-label="Countdown timer"` on the outer container `<div>`; wrap digit group in `<div aria-live="polite">` | components/countdown/CountdownTimer.tsx

### CountdownPage Server Component (US1 + US2)

- [x] T013 [US1] [US2] Implement `<CountdownPage />` Server Component shell: renders full-screen keyvisual background image (`public/assets/countdown/keyvisual.jpg`) with gradient overlay and `#00101A` fallback background color; centers content vertically and horizontally; accepts `launchAt: Date` prop and renders `<CountdownTimer launchAt={launchAt} />` | components/countdown/CountdownPage.tsx

### Root Page (US1)

- [x] T014 [US1] Update `app/page.tsx` Server Component: call `parseAndValidateLaunchDatetime(process.env.LAUNCH_DATETIME)` inside try/catch; call `isPrelaunch(new Date())`; if `true` render `<CountdownPage launchAt={launchAt} />`; otherwise render existing `<HomePage />` | app/page.tsx

**Checkpoint**: Full countdown page renders and live timer works end-to-end

---

## Phase 4: Polish and Cross-Cutting Concerns

**Purpose**: i18n, accessibility, motion safety, responsive scaling, and background fallback — affecting both US1 and US2

### i18n (US1 + US2)

- [x] T015 [P] [US1] Add `countdown` namespace keys to Vietnamese locale file: `"title"` → `"Sự kiện sẽ bắt đầu sau"`, `"days"` → `"NGÀY"`, `"hours"` → `"GIỜ"`, `"minutes"` → `"PHÚT"`, `"ariaLabel"` → `"Đếm ngược"` | i18n/messages/vi.json
- [x] T016 [P] [US1] Add `countdown` namespace keys to English locale file: `"title"` → `"Event starts in"`, `"days"` → `"DAYS"`, `"hours"` → `"HOURS"`, `"minutes"` → `"MINUTES"`, `"ariaLabel"` → `"Countdown timer"` | i18n/messages/en.json
- [x] T017 [US1] Wire `useTranslations('countdown')` in `<CountdownPage />`: render `t('title')` as the countdown headline; pass `t('days')`, `t('hours')`, `t('minutes')` as `unit` props to each `<DigitBlock />` | components/countdown/CountdownPage.tsx
- [x] T018 [US1] Wire `useTranslations('countdown')` in `<CountdownTimer />`: use `t('ariaLabel')` for the container `aria-label` attribute | components/countdown/CountdownTimer.tsx

### Accessibility (US1)

- [x] T019 [P] [US1] Confirm `aria-label="Countdown timer"` (or translated equivalent) is on the outer container `<div>` in `<CountdownTimer />`; confirm `<div aria-live="polite">` wraps the digit group; confirm no `tabIndex` is set on `<DigitCard />` or `<DigitBlock />` elements (no artificial tab stops) | components/countdown/CountdownTimer.tsx
- [x] T020 [P] [US1] Confirm each `<DigitBlock />` wrapper has `aria-label` combining numeric value and translated unit (e.g., `"5 days"`); confirm `<DigitCard />` wrappers have `aria-hidden="true"` | components/countdown/DigitBlock.tsx

### Motion Safety (US1 + US2)

- [x] T021 [P] Add `@media (prefers-reduced-motion: reduce)` rule suppressing `<DigitCard />` CSS transition/animation; ensure digit values still update but without animated transitions | app/globals.css

### Responsive Scaling (US1 + US2)

- [x] T022 [P] [US1] Add responsive digit card scaling breakpoints at 768px (tablet) and 320px (mobile) — adjust font-size and card dimensions via Tailwind responsive variants or CSS custom properties | components/countdown/DigitCard.tsx
- [x] T023 [P] [US2] Confirm `#00101A` background-color is set as CSS fallback on the keyvisual container in `<CountdownPage />` so the screen is branded even if `keyvisual.jpg` fails to load | components/countdown/CountdownPage.tsx

### Edge Cases (US1)

- [x] T024 [US1] Verify 3-digit day rendering in `<DigitBlock />`: when `days > 99`, render three `<DigitCard />` instances without overflow; confirm layout does not break at 320px viewport | components/countdown/DigitBlock.tsx

**Checkpoint**: All user stories complete with polish

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0 (Assets)**: No dependencies — can start immediately; T001, T002, T003 are parallel
- **Phase 1 (Foundation)**: Requires Phase 0 complete; T005 and T006 are parallel with each other; T004 must precede T007 (hook depends on `lib/launch.ts` types)
- **Phase 2 (Middleware)**: Requires T004 (`lib/launch.ts`) — cannot import `parseAndValidateLaunchDatetime` or `isPrelaunch` until T004 is done
- **Phase 3 (UI Components)**: Requires T007 (`useCountdown`) and T005/T006 (CSS tokens and font); execute T010 → T011 → T012 → T013 → T014 in order (each builds on the previous)
- **Phase 4 (Polish)**: Requires Phase 3 complete; most tasks are independent and marked [P]

### Critical Path

```
T001 (font) → T005 (@font-face)
T003 (env)  → T004 (lib/launch.ts) → T007 (useCountdown) → T012 (CountdownTimer) → T014 (page.tsx)
T006 (CSS vars)                     → T010 (DigitCard)    → T011 (DigitBlock)    → T012
T004        → T008 (middleware)
```

### Parallel Opportunities

- T001, T002, T003 (Phase 0) — all parallel
- T005, T006 (CSS globals) — parallel with each other, after Phase 0
- T015, T016 (i18n files) — parallel with each other
- T019, T020, T021, T022, T023 (polish) — all parallel once Phase 3 is complete

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 0 + Phase 1
2. Complete Phase 2 (middleware redirect)
3. Complete Phase 3 (full countdown UI)
4. **STOP and VALIDATE**: test in browser with future and past `LAUNCH_DATETIME`
5. Complete Phase 4 (polish)

### Key Implementation Details

- **FR-005a**: `useCountdown` MUST check `Date.now() >= launchAt.getTime()` synchronously on mount and set `isExpired = true` before the first `setInterval` fires — prevents any flash of `00/00/00`
- **Expiry redirect**: `<CountdownTimer />` `useEffect` watching `isExpired` calls `router.push('/login')` with no delay — do NOT wait for the next tick
- **Fail-open middleware**: If `LAUNCH_DATETIME` is missing or Zod validation throws, log the error and skip the redirect so the site remains accessible
- **Timer drift prevention**: Each `setInterval` tick recalculates from `launchAt` (not cumulative decrement) to avoid drift over long sessions
- **Font safety**: `font-display: swap` + `monospace` fallback ensures digits are readable even if Digital Numbers font fails to load

---

## Notes

- Mark tasks complete as you go: `[x]`
- Commit after each phase or logical group
- `app/page.tsx` serves BOTH Countdown and Homepage — the `isPrelaunch` check is server-side only
- The countdown shows only DAYS / HOURS / MINUTES — no SECONDS (intentional per design)
- Middleware must not clobber the locale cookie during pre-launch rewrites
