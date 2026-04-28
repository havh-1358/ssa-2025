# Tasks: Homepage SAA

**Frame**: `i87tDx10uM-homepage-saa`
**Prerequisites**: plan.md (required), spec.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4)
- **|**: File path affected by this task

---

## Phase 0: Asset Preparation

**Purpose**: Place static assets, route constants, and CSS tokens before any component work begins

- [x] T000 Add `AWARDS: '/awards'` and `KUDOS: '/kudos'` to the `ROUTES` constant — required by `<CTAButtons />` (T007) and nav links in `<Header />` (T013) | `lib/constants/routes.ts`
- [x] T001 Export SAA 2025 brand logo (451×200px) to public assets | `public/assets/homepage/saa-2025-logo.png`
- [x] T002 Export homepage keyvisual image to public assets | `public/assets/homepage/keyvisual.jpg`
- [x] T003 Add 16 homepage CSS custom properties to globals (note: `--color-divider` already exists; `--color-bg-header` already exists as `rgba(11,15,18,0.8)` — use it for `--color-header-bg` or add alias): `--color-header-bg`, `--color-btn-secondary-bg`, `--color-btn-secondary-border`, `--header-height`, `--header-padding-x`, `--header-padding-y`, `--content-padding-x`, `--content-padding-y`, `--section-gap`, `--countdown-gap`, `--digit-gap`, `--btn-padding`, `--btn-gap`, `--radius-btn`, `--color-nav-active`, `--color-nav-default`, `--border-nav-active` | `app/globals.css`

---

## Phase 1: Foundation (Blocking Prerequisites)

**Purpose**: Core types and shared data required by ALL user stories

**CRITICAL**: No user story component work can begin until this phase is complete

- [x] T004 Define `AwardCategory` and `AwardPrize` TypeScript interfaces with strict typing | `types/awards.ts`
- [x] T005 Populate static award data with all 6 categories, prize amounts, and `VALID_AWARD_HASHES` constant | `data/awards.ts`
- [x] T006 [P] Implement `<AwardCategoryCard />` presentational component rendering category name, prize amount, and recipient count with Tailwind tokens | `components/homepage/AwardCategoryCard.tsx`
- [x] T007 [P] Implement `<CTAButtons />` Client Component: smooth-scroll via `scrollIntoView({ behavior: 'smooth' })` to `#award-system`; `router.push('/kudos')` for Kudos CTA | `components/homepage/CTAButtons.tsx`

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 2: Core Layout — US1 View Event Info and Countdown (Priority: P1) — MVP

**Goal**: Render key visual, brand logo, countdown timer, event tagline, and CTA buttons at `/` when `isPrelaunch = false`

**Independent Test**: Navigate to `/` post-launch — verify keyvisual, countdown, and CTA buttons all render correctly

### Implementation (US1)

- [x] T008 [US1] Implement `<KeyvisualSection />` Server Component with `<Image priority fill />` for LCP, background gradient overlay applied via inline style (justified exception), and `#00101A` fallback background color | `components/homepage/KeyvisualSection.tsx`
- [x] T009 [US1] Implement `<HeroSection />` Server Component composing brand logo (`alt="SAA 2025"`), `<CountdownTimer />` Client island, event tagline, and `<CTAButtons />` | `components/homepage/HeroSection.tsx`
- [x] T010 [US1] Implement `<HomePage />` Server Component shell composing `<Header />`, `<KeyvisualSection />`, `<HeroSection />`, `<AwardSummarySection />`, `<KudosPromoSection />`, and `<Footer />` | `components/homepage/HomePage.tsx`
- [x] T011 [US1] Add `<HomePage />` branch to the `isPrelaunch` conditional — preserve existing `<CountdownPage />` branch untouched | `app/page.tsx`
- [x] T012 [US1] Add `skip-to-content` anchor `<a href="#main-content">` before `<Header />` in `<HomePage />` | `components/homepage/HomePage.tsx`

**Checkpoint**: US1 complete — key visual, countdown, and CTA buttons independently testable

---

## Phase 3: Navigation and Header — US2 Navigate Platform Sections (Priority: P1)

**Goal**: Sticky header with active nav link, hamburger menu on mobile (<768px) with focus trap, Escape-to-close, and resize auto-close

**Independent Test**: Desktop: header sticks on scroll, active link highlighted. Mobile (375px): hamburger opens drawer, Escape closes it, focus returns to button, resize to ≥768px auto-closes drawer

### Header (US2)

- [x] T013 [US2] REPLACE existing login-only `<Header />` with full navigation Header — current `Header.tsx` has only logo + LanguageSelector (no nav links, no hamburger); rewrite as Client Component with `isMenuOpen: boolean` state, `position: fixed; top: 0; z-index: 100` sticky behavior, desktop nav links (About SAA 2025, Award Information, Sun* Kudos) from `ROUTES` constants, and `activeNav: string` prop for per-page active link highlighting | `components/shared/Header.tsx`
- [x] T014 [US2] Add active nav link styles to `<Header />`: gold color (`var(--color-accent-gold)`) + `border-bottom` underline for the active route via `--color-nav-active` and `--border-nav-active` tokens | `components/shared/Header.tsx`
- [x] T015 [US2] Add header logo `<a>` with `aria-label="SSA 2025 — go to homepage"` wrapping `<Image src="saa-2025-logo.png" alt="SAA 2025" />` | `components/shared/Header.tsx`
- [x] T016 [US2] Add hamburger toggle button to `<Header />` (visible only at <768px): renders ☰ icon when `!isMenuOpen` and × icon when `isMenuOpen`; set `aria-label="Open navigation menu"` / `"Close navigation menu"` and `aria-expanded={isMenuOpen}` | `components/shared/Header.tsx`
- [x] T017 [US2] Add `useEffect` in `<Header />` listening to `window.resize` that resets `isMenuOpen = false` when viewport crosses ≥768px breakpoint | `components/shared/Header.tsx`

### Mobile Nav Drawer (US2)

- [x] T018 [US2] Implement `useFocusTrap` wrapper hook using already-installed `focus-trap-react v12` (no installation needed) — accepts `ref` and `isActive: boolean`; calls `createFocusTrap(ref.current).activate()` on open and `.deactivate({ returnFocus: true })` on close | `hooks/useFocusTrap.ts`
- [x] T019 [US2] Implement `<MobileNavDrawer />` component: full-width (`100vw`) drawer with `rgba(16,20,23,0.8)` background, `16px` padding, nav links stacked vertically, and language selector included | `components/shared/MobileNavDrawer.tsx`
- [x] T020 [US2] Wire focus trap into `<MobileNavDrawer />` using `useFocusTrap` (or `focus-trap-react`): activate on open, deactivate and return focus to hamburger button on close | `components/shared/MobileNavDrawer.tsx`
- [x] T021 [US2] Implement three close triggers in `<MobileNavDrawer />`: (a) × close button click, (b) click/tap outside the drawer overlay, (c) `Escape` keydown — all three close drawer and return focus to hamburger button | `components/shared/MobileNavDrawer.tsx`
- [x] T022 [US2] Wire `<MobileNavDrawer />` into `<Header />`: render drawer conditionally on `isMenuOpen`, pass `onClose` callback that sets `isMenuOpen = false` | `components/shared/Header.tsx`
- [x] T023 [US2] Pass `activeNav` prop from `<HomePage />` to `<Header />` and verify "About SAA 2025" renders as the active nav link on homepage | `components/homepage/HomePage.tsx`

**Checkpoint**: US1 + US2 complete — sticky header, active nav, and mobile hamburger independently testable

---

## Phase 4: Award Section and Kudos Promo — US3 + US4 (Priority: P2/P3)

**Goal**: Award grid with loading skeleton and error retry (US3); Kudos promo block with CTA (US4); shared Footer

### Award Summary Section (US3)

- [x] T024 [US3] Implement `<AwardSummarySection />` Server Component with `id="award-system"`, importing award data from `data/awards.ts`, and rendering a responsive grid of `<AwardCategoryCard />` components | `components/homepage/AwardSummarySection.tsx`
- [x] T025 [US3] Add `awardsLoading` skeleton state to `<AwardSummarySection />`: render shimmer placeholder divs matching grid dimensions while data is loading (client-fetch path only; SSR static-import path skips this state) | `components/homepage/AwardSummarySection.tsx`
- [x] T026 [US3] Add `awardsError` state with retry to `<AwardSummarySection />`: render user-facing error block with a "Retry" button that re-triggers data fetch; do not leave grid blank without explanation | `components/homepage/AwardSummarySection.tsx`
- [x] T027 [US3] Verify CTA "About SAA 2025" smooth-scroll in `<CTAButtons />` lands correctly at `#award-system` anchor in `<AwardSummarySection />` | `components/homepage/CTAButtons.tsx`

### Kudos Promo Section (US4)

- [x] T028 [P] [US4] Implement `<KudosPromoSection />` Server Component with static promo content and CTA button navigating to `/kudos` | `components/homepage/KudosPromoSection.tsx`

### Footer

- [x] T029 [P] Verify existing `<Footer />` works for homepage use — currently `"use client"` using `useTranslations("auth")` for copyright text; if homepage footer is identical, no changes needed; if it differs, update to accept an optional `namespace` prop or convert to a Server Component using `getTranslations` | `components/shared/Footer.tsx`

**Checkpoint**: All four user stories complete

---

## Phase 5: Polish and Cross-Cutting Concerns

**Purpose**: Accessibility, responsive refinements, performance, and reduced-motion support

- [x] T030 [P] Add `aria-live="polite"` and per-unit `aria-label` attributes to `<CountdownTimer />` for screen reader announcement of countdown updates — ALREADY DONE: `CountdownTimer` has `aria-live="polite"` on the digit group and `DigitBlock` renders `aria-label="{value} {unit}"` on its wrapper | `components/countdown/CountdownTimer.tsx`
- [x] T031 [P] Ensure `<Image src="saa-2025-logo.png" alt="SAA 2025" />` never uses `alt=""` — logo alt text provides branding context if PNG fails to load; verify across all usages | `components/shared/Header.tsx`
- [x] T032 [P] Add responsive scaling for brand logo in `<HeroSection />`: proportional resize at 320px, 768px, and 1280px breakpoints | `components/homepage/HeroSection.tsx`
- [x] T033 [P] Add responsive scaling for countdown digit blocks at 320px, 768px, and 1280px breakpoints — ALREADY DONE: `DigitCard` uses `w-[44px]/h-[72px]` → `md:w-[60px]/h-[96px]` → `xl:w-[77px]/h-[123px]`; `DigitBlock` unit label scales `text-[18px]` → `md:text-[25px]` → `xl:text-[36px]` | `components/countdown/DigitCard.tsx`
- [x] T034 Add `prefers-reduced-motion` media query to disable countdown tick animation, button hover transitions, and header nav hover transitions | `app/globals.css`
- [x] T035 [P] Verify keyvisual LCP image uses `<Image priority fill />` with correct `sizes` attribute and WebP source; confirm Lighthouse LCP score ≥ 90 | `components/homepage/KeyvisualSection.tsx`
- [x] T036 [P] Verify `#00101A` background color is applied to `<KeyvisualSection />` as CSS fallback so content remains readable if keyvisual image fails to load | `components/homepage/KeyvisualSection.tsx`
- [x] T037 [P] Apply `--content-padding-x` and `--content-padding-y` tokens consistently across all homepage section components; remove any remaining raw spacing values | `components/homepage/HeroSection.tsx`
- [x] T038 [P] Apply `--section-gap` token for vertical spacing between `<KeyvisualSection />`, `<AwardSummarySection />`, `<KudosPromoSection />`, and `<Footer />` in `<HomePage />` | `components/homepage/HomePage.tsx`
- [x] T039 Verify desktop nav is hidden at <768px and hamburger button is hidden at ≥768px using Tailwind responsive utilities | `components/shared/Header.tsx`
- [x] T040 [P] Audit all homepage components for console.log statements and remove any found before final commit | `components/homepage/`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 0 (Asset Prep)**: No dependencies — start immediately
- **Phase 1 (Foundation)**: Depends on Phase 0 CSS tokens; BLOCKS all user story phases
- **Phase 2 (US1)**: Depends on Phase 1 complete; requires `<CountdownTimer />` from `8PJQswPZmU` plan and `<LanguageSelector />` from `hUyaaugye2` plan
- **Phase 3 (US2)**: Depends on Phase 1 complete; `<Header />` integrates into `<HomePage />` from Phase 2
- **Phase 4 (US3 + US4)**: Depends on Phase 1 complete (`AwardCategoryCard`, `data/awards.ts`); `<AwardSummarySection />` integrates into `<HomePage />` from Phase 2
- **Phase 5 (Polish)**: Depends on Phases 2, 3, and 4 complete

### Within Phase Execution Order

- Phase 0: T000 → T001, T002 in parallel → T003
- Phase 1: T004 (types) → T005 (data) → T006, T007 in parallel
- Phase 2: T008, T009 in parallel → T010 → T011 → T012
- Phase 3: T013 → T014, T015, T016 in parallel → T017 → T018 → T019 → T020 → T021 → T022 → T023
- Phase 4: T024 → T025, T026 in parallel → T027; T028, T029 in parallel
- Phase 5: All [P] tasks in parallel → T034, T039, T040

### External Prerequisites

- `<CountdownTimer />` component ALREADY BUILT in `8PJQswPZmU` plan — ready to use
- `<LanguageSelector />` component ALREADY BUILT in `hUyaaugye2` plan — ready to use
- `lib/constants/routes.ts` must have `ROUTES.AWARDS` and `ROUTES.KUDOS` added (T000) before Phase 1 T007 and Phase 3

### Already-Built Shared Components

- `components/shared/Header.tsx` — EXISTS as login-only header; T013 must REPLACE it with full nav header
- `components/shared/Footer.tsx` — EXISTS as copyright footer using `useTranslations("auth")`; T029 verifies/updates
- `hooks/useFocusTrap.ts` — does NOT exist; T018 creates it using installed `focus-trap-react v12`
- `focus-trap-react v12` — already installed; T018 needs no npm install step

### Parallel Opportunities

- T006 and T007 (Phase 1 components) can run in parallel — different files, no cross-dependency
- T008 and T009 (Phase 2 sections) can run in parallel — different files
- T014, T015, T016 (Header sub-tasks) can run in parallel within Phase 3
- T028 (`<KudosPromoSection />`) and T029 (`<Footer />`) can run in parallel — different files, no cross-dependency
- All Phase 5 [P] tasks can run in parallel after all story phases complete

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 0 + Phase 1
2. Complete Phase 2 (US1 only) — key visual, countdown, CTAs
3. **STOP and VALIDATE**: Verify homepage renders at `/` post-launch
4. Complete Phase 3 (US2) — sticky header, hamburger nav
5. Complete Phase 4 (US3 + US4) — award grid, kudos promo
6. Complete Phase 5 — polish and accessibility

### Incremental Delivery

1. Phase 0 + Phase 1 → Foundation validated
2. Phase 2 → US1 testable independently
3. Phase 3 → US2 testable independently
4. Phase 4 → US3 + US4 testable independently
5. Phase 5 → Full polish

---

## Notes

- Mark tasks complete as you go: `[x]`
- `data/awards.ts` is shared with the `/awards` page — do not duplicate data
- `<Header />` must accept an `activeNav` prop so Homepage, Awards, and Kudos pages each highlight the correct nav link
- The inline style exception for the keyvisual gradient overlay is justified per the plan (dynamic gradient values cannot be expressed as static Tailwind utilities)
- `focus-trap-react v12` is already installed — T018 only needs to write `hooks/useFocusTrap.ts`; no `npm install` step
- `<AwardCategoryCard />` is shared with the `/awards` page — build as a reusable presentational component from the start
- **Pre-existing conflicts resolved**: `Header.tsx` (T013 replaces it), `Footer.tsx` (T029 verifies it), `CountdownTimer` a11y (T030 already done), DigitBlock responsive (T033 already done)
- T030 and T033 are marked `[x]` — they were completed as part of the Countdown Prelaunch screen implementation
