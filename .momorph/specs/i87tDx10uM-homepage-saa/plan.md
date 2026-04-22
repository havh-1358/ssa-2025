# Implementation Plan: Homepage SAA

**Frame**: `i87tDx10uM-homepage-saa`
**Date**: 2026-04-22
**Spec**: `specs/i87tDx10uM-homepage-saa/spec.md`

---

## Summary

The Homepage is rendered at `/` after the pre-launch countdown ends (`isPrelaunch = false`). It is a public, server-side rendered marketing page comprising four sections: (1) key visual + countdown + CTA buttons, (2) award system summary grid, (3) Sun* Kudos promo block, and (4) footer. Award categories are loaded from a shared static JSON file. The countdown section reuses `<CountdownTimer />` from the Countdown Prelaunch screen. CTA "About SAA 2025" smooth-scrolls to the `#award-system` section; "Sun* Kudos" navigates to `/kudos`.

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js App Router
**Primary Dependencies**: React 19, Tailwind CSS 4, next-intl
**Database**: N/A (award data: static JSON)
**Testing**: Vitest + React Testing Library; Playwright E2E
**State Management**: `useState` for countdown; `useEffect` for scroll CTA; static props for awards
**API Style**: REST (optional `GET /api/awards/categories`); static JSON preferred for MVP

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Requirement | Constitution Rule | Status |
|-------------|-------------------|--------|
| I. Type Safety | Strict TS; `AwardCategory` type from shared `types/awards.ts` | ✅ Planned |
| II. Design Fidelity | All hex tokens → CSS vars in `globals.css`; no raw hex in components | ✅ Planned |
| II. Responsive | 320/768/1280 breakpoints; hamburger nav on mobile; logo scales | ✅ Planned |
| II. WCAG 2.1 AA | Skip-to-content link; countdown `aria-live`; nav keyboard accessible | ✅ Planned |
| III. Test-First | Tests before components | ✅ Planned |
| IV. Layered Arch | Page (Server) → Section components → `<CountdownTimer />` (Client island) | ✅ Planned |
| IV. Clean Code | Award data from `data/awards.ts` not hardcoded per component | ✅ Planned |
| V. Doc-Driven | spec.md + plan.md exist | ✅ Met |
| VI. Security | Public page; no user data; no auth required | ✅ Compliant |

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure** (Server Components unless noted):
  - `app/page.tsx` — Reads `isPrelaunch`; renders `<CountdownPage />` or `<HomePage />`
  - `<HomePage />` — Server Component; loads award data; composes all sections
  - `<Header />` — Server Component with `<LanguageSelector />` Client island
  - `<KeyvisualSection />` — Server Component; background image + gradient overlay
  - `<HeroSection />` — Server Component shell + `<CountdownTimer />` Client island + CTA buttons
  - `<CTAButtons />` — Client Component (smooth-scroll behavior requires `onClick`)
  - `<AwardSummarySection />` — Server Component; renders award grid from static data
  - `<AwardCategoryCard />` — Presentational card; shared with `/awards` page
  - `<KudosPromoSection />` — Server Component; static promo block
  - `<Footer />` — Shared Server Component
- **Styling Strategy**: Tailwind CSS 4 + CSS custom properties. Background gradient applied via inline style only for the LCP image overlay (exception to no-inline-styles rule, justified by dynamic gradient values).
- **Data Fetching**: Award categories from `data/awards.ts` (static import at build time). No `useEffect` / client fetch. If API is chosen later, switch to `fetch()` in Server Component with `revalidate`.

### Backend Approach

- **No backend changes required for MVP** — award data is static JSON.
- **Optional future**: `GET /api/awards/categories` — returns same JSON via API route if CMS integration is needed.

### Integration Points

- **`<CountdownTimer />`**: Imported from `components/countdown/CountdownTimer.tsx` (Countdown Prelaunch plan). Must be built first.
- **`<LanguageSelector />`**: Imported from `components/shared/LanguageSelector.tsx` (Language Selector plan).
- **`data/awards.ts`**: Shared with Award System page (`/awards`). Define once, import in both.
- **`<AwardCategoryCard />`**: Shared with `/awards` page — build as reusable component.

---

## Project Structure

### Documentation

```text
.momorph/specs/i87tDx10uM-homepage-saa/
├── spec.md
├── design-style.md
└── plan.md   ← this file
```

### Source Code

```text
app/
├── page.tsx                              # Server Component: isPrelaunch → CountdownPage | HomePage

components/
├── homepage/
│   ├── HomePage.tsx                      # Page root: header + keyvisual + hero + awards + kudos + footer
│   ├── KeyvisualSection.tsx              # Full-bleed background image + gradient overlay
│   ├── HeroSection.tsx                   # Brand logo + countdown + event tagline + CTA buttons
│   ├── CTAButtons.tsx                    # Client Component: smooth-scroll + /kudos navigation
│   ├── AwardSummarySection.tsx           # Award category cards grid (section with id="award-system")
│   ├── AwardCategoryCard.tsx             # Shared presentational card (homepage + awards page)
│   └── KudosPromoSection.tsx             # Sun* Kudos promo block with CTA to /kudos
├── shared/
│   ├── Header.tsx                        # Shared sticky header (Server Component + Client islands)
│   ├── Footer.tsx                        # Shared footer
│   └── LanguageSelector.tsx             # (from Language Selector plan)
└── countdown/
    └── CountdownTimer.tsx                # (from Countdown Prelaunch plan — reused here)

data/
└── awards.ts                             # Static award category data (shared with /awards page)

types/
└── awards.ts                             # AwardCategory, AwardPrize TypeScript types

public/
└── assets/
    └── homepage/
        ├── saa-2025-logo.png             # SAA 2025 brand logo (451×200px)
        └── keyvisual.jpg                 # Homepage background key visual
```

### Modified Files

| File | Change |
|------|--------|
| `app/globals.css` | Add homepage-specific tokens: `--color-header-bg`, `--color-btn-secondary-bg`, `--color-btn-secondary-border`, `--header-height`, `--header-padding-x`, `--content-padding-x`, `--btn-padding`, `--radius-btn` |
| `app/page.tsx` | Add `<HomePage />` branch to the existing `isPrelaunch` conditional |

### Dependencies

No new npm packages. `next/image` is built-in to Next.js.

---

## Implementation Strategy

### Phase 0: Asset Preparation

- Export SAA 2025 brand logo → `public/assets/homepage/saa-2025-logo.png` (451×200px)
- Export homepage keyvisual → `public/assets/homepage/keyvisual.jpg`
- Add homepage CSS tokens to `app/globals.css`
- Create `data/awards.ts` with all 6 categories and prize amounts (static, matches spec data table)

### Phase 1: Foundation (TDD)

1. Define `types/awards.ts` (AwardCategory, AwardPrize interfaces)
2. Populate `data/awards.ts` with static data — write type-check tests
3. Write tests for `<AwardCategoryCard />` (renders name, prize, recipient count)
4. Implement `<AwardCategoryCard />`
5. Write tests for `<CTAButtons />` (scroll to `#award-system`; navigate to `/kudos`)
6. Implement `<CTAButtons />`

### Phase 2: Core Layout (US1 — View Event Info)

1. Write E2E test: navigate to `/` (post-launch) → verify key visual, countdown, CTA buttons render
2. Implement `<KeyvisualSection />` (LCP background image with `<Image priority fill />`)
3. Implement `<HeroSection />` (brand logo + `<CountdownTimer />` + event tagline + `<CTAButtons />`)
4. Implement `<HomePage />` shell composing all sections
5. Wire into `app/page.tsx` — verify both branches (pre-launch and post-launch) work

### Phase 3: Navigation & Header (US2)

1. Write tests for `<Header />`: sticky behavior, active nav link highlighting
2. Implement shared `<Header />` with `activeNav` prop
3. Verify "About SAA 2025" is active on homepage; nav links navigate correctly

### Phase 4: Award Section + Kudos Promo (US3 + US4)

1. Implement `<AwardSummarySection />` (grid of `<AwardCategoryCard />`, `id="award-system"`)
2. Verify CTA smooth-scroll lands at `#award-system`
3. Implement `<KudosPromoSection />` with CTA to `/kudos`
4. Implement `<Footer />`

### Phase 5: Polish

- Responsive: hamburger menu on mobile; logo scales; digit blocks scale
- `awardsError` fallback: if award data fails (future API path), show empty state
- `aria-live` on countdown; skip-to-content link
- LCP optimization: verify keyvisual image scores in Lighthouse ≥ 90

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| LCP too slow (large keyvisual image) | Medium | Medium | Use `<Image priority fill />` + WebP format + proper sizing |
| `<CountdownTimer />` not yet built | High (dependency) | High | Plan Countdown Prelaunch first; this plan depends on it |
| `isPrelaunch` check timing race | Low | Low | Server-side check; no client race condition |
| Mobile hamburger nav scope | Medium | Low | De-scope to P3; implement basic responsive collapse first |

### Estimated Complexity

- **Frontend**: Medium (multiple sections; SSR + Client island mixing; LCP optimization)
- **Backend**: Low (static data only)
- **Testing**: Medium (LCP; scroll behavior; section rendering)

---

## Integration Testing Strategy

### Test Scope

- [x] **Section rendering**: All 4 sections visible on desktop and mobile
- [x] **CTA scroll**: "About SAA 2025" → smooth-scroll to `#award-system`
- [x] **Navigation**: Header nav links route correctly
- [x] **Countdown reuse**: `<CountdownTimer />` ticks correctly on homepage
- [ ] **Data layer**: Static JSON — no integration test needed

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | CTA scroll; countdown tick |
| App ↔ Data Layer | No | Static JSON (no async) |
| Cross-platform | Yes | Responsive layout at 320/768/1280 |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| `Date.now()` | Mock | Control countdown value |
| `NEXT_PUBLIC_LAUNCH_DATETIME` | Env override | Test post-launch state |
| `next/image` | Real | Verify LCP image renders |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] `/` renders Homepage (not Countdown) when `LAUNCH_DATETIME` is in the past
   - [ ] All 4 sections visible without scrolling limitation
   - [ ] CTA "About SAA 2025" smooth-scrolls to `#award-system`
   - [ ] CTA "Sun* Kudos" navigates to `/kudos`

2. **Error Handling**
   - [ ] Award data missing → empty state shown, no crash
   - [ ] Keyvisual image fails → `#00101A` background visible; content readable

3. **Edge Cases**
   - [ ] Countdown expires while on homepage → shows `00 00 00`, no negative values
   - [ ] `isPrelaunch` flips to true mid-session → middleware redirects on next navigation

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `data/awards.ts` types | 100% | High |
| `<AwardCategoryCard />` | 90%+ | High |
| `<CTAButtons />` scroll behavior | 85%+ | High |
| E2E homepage render | Key flow | High |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved
- [ ] Language Selector component built (`hUyaaugye2` plan)
- [ ] `<CountdownTimer />` component built (`8PJQswPZmU` plan)
- [ ] SAA 2025 logo exported to `public/assets/homepage/`
- [ ] Homepage keyvisual image available

### External Dependencies

- None (static data; no third-party APIs)

---

## Next Steps

1. Ensure `hUyaaugye2` (Language Selector) and `8PJQswPZmU` (Countdown) plans are executed first
2. Run `/momorph.tasks` to generate the task breakdown
3. Create `data/awards.ts` (Phase 0) — shared with Award System page

---

## Notes

- `data/awards.ts` is a **shared data file** — create it as part of this plan and import it in the Award System page as well. Do not duplicate data.
- The `<Header />` component must support an `activeNav` prop so each page can highlight the correct nav link. Design this interface during Phase 3 so it works for Homepage, Awards, and Kudos pages.
- "About SAA 2025" nav link = active on this page; "Award Information" = navigates to `/awards`. These are different nav items with different labels.
