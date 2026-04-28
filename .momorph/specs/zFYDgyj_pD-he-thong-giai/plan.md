# Implementation Plan: Award System (He Thong Giai)

**Frame**: `zFYDgyj_pD-he-thong-giai`
**Date**: 2026-04-22 | **Updated**: 2026-04-29 (scroll layout confirmed; FR-013/014/015 added)
**Spec**: `specs/zFYDgyj_pD-he-thong-giai/spec.md`

---

## Summary

The Award System page (`/awards`) is a public, server-side rendered read-only page. All 6 SSA 2025 award categories are displayed simultaneously as a vertically-scrolling list. A sticky left navigation bar (178px) lists all 6 categories and highlights whichever section is currently in the viewport via `IntersectionObserver` scroll-spy. Clicking a nav item is an anchor link that smooth-scrolls to the target section and updates the URL hash via browser-native behavior. Award data is sourced from the shared static `data/awards.ts`.

**FR-011**: Award sections alternate image position — D.1/D.3/D.5 image LEFT, D.2/D.4/D.6 image RIGHT. Driven by `imagePosition: "left" | "right"` on `AwardCategory`.

**FR-012**: D.5 Signature 2025 has a dual-prize layout (5M individual + 8M team) separated by an "Hoặc" divider. Driven by optional `subLabel` on `AwardPrize`.

**FR-013**: Section title renders TWO lines — subtitle "Sun* Annual Awards 2025" (24px white) + main heading "Hệ thống giải thưởng SAA 2025" (48px gold).

**FR-014**: Each award category section uses 3 MM_MEDIA icons — Target (category name row), Diamond (recipient count row), License (prize value row).

**FR-015**: Award images use `mix-blend-mode: screen` — they are pre-designed circular badge PNGs for screen blend on `#00101A` background.

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js App Router
**Primary Dependencies**: React 19, Tailwind CSS 4, next-intl
**Database**: N/A (award data: static JSON, shared with Homepage)
**Testing**: Vitest + React Testing Library; Playwright E2E
**State Management**: `useState` for `activeSlug` only — driven by `IntersectionObserver` scroll-spy in a `useEffect`; no `isLoading`/`error` component state (data is statically imported at build time)
**API Style**: Static JSON (MVP); optional `GET /api/awards` future path

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Requirement | Constitution Rule | Status |
|-------------|-------------------|--------|
| I. Type Safety | Strict TS; `AwardCategory` (with `imagePosition`) and `AwardPrize` (with `subLabel?`) from `types/awards.ts` | ✅ Done |
| I. Immutability | `AWARD_CATEGORIES` array frozen; no mutation of props or state | ✅ Planned |
| II. Design Fidelity | All hex tokens → CSS vars in `globals.css`; no raw hex in components; `mix-blend-mode: screen` on images per FR-015 | ✅ Planned |
| II. Responsive | 320/768/1280 breakpoints; left nav → horizontal scrollable row on tablet/mobile | ✅ Planned |
| II. WCAG 2.1 AA | `role="navigation"` + anchor links + `aria-current`; `role="region"` + `aria-labelledby` on sections; `scroll-margin-top: 80px` for header offset | ✅ Planned |
| III. Test-First | Tests written alongside components | ✅ Planned |
| IV. Layered Arch | `app/awards/page.tsx` (Server) → `<AwardsPage />` (Client) → `<AwardNavMenu />` + `<AwardCategorySection />` | ✅ Planned |
| IV. Clean Code | Award data from `data/awards.ts`; no hardcoded strings in components; i18n for all user-visible text | ✅ Planned |
| IV. No Magic Values | All slugs from `AWARD_CATEGORIES`; all colors from CSS vars; no hardcoded px in components | ✅ Planned |
| V. Doc-Driven | spec.md + plan.md + design-style.md exist and are consistent | ✅ Met |
| VI. Security | Public read-only page; no auth required; no user data | ✅ Compliant |

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

**Component Structure** (current state + Phase 8 targets):

| Component | Type | Responsibility |
|-----------|------|----------------|
| `app/awards/page.tsx` | Server Component | Import `AWARD_CATEGORIES`; auth check; render `<AwardsPage />` |
| `<AwardsPage />` | Client Component | `activeSlug` state; `IntersectionObserver` setup; two-column layout |
| `<Header activeNav="awards" />` | Shared Server Component | Fixed nav; "Award Information" active state |
| `<AwardKeyvisual />` | Server Component | 1440×547px banner + gradient overlay |
| `<SectionTitle subtitle mainHeading />` | Server Component | Updated shared component; `subtitle` prop (24px white) + `mainHeading` prop (48px gold) + divider; existing callers not affected (both props optional) |
| `<AwardNavMenu />` | Client Component | `role="navigation"`; 6 `<a href="#slug">` anchors; `aria-current` driven by `activeSlug` prop; sticky position |
| `<AwardNavItem />` | Presentational | `<a href="#slug">` anchor; active/hover/focus styles; `aria-current` |
| `<AwardCategorySection />` | Presentational (Server-compatible) | Full detail view: icon+title row, description, icon+recipient row, icon+prize row; `id={slug}`; `scroll-margin-top`; `imagePosition` prop; D.5 "Hoặc" separator |
| `<KudosPromoSection />` | Shared Server Component | Imported from `components/homepage/KudosPromoSection.tsx` |
| `<Footer />` | Shared Server Component | Shared footer |

> **`<AwardDetailPanel />` is REMOVED** — not needed in scroll layout. All `<AwardCategorySection />` components are rendered directly by `<AwardsPage />` in a `flex flex-col gap-[80px]` wrapper.

**Styling Strategy**: Tailwind CSS 4 + CSS custom properties. `mix-blend-mode: screen` and `backdrop-filter: blur(32px)` on `<AwardCategorySection />` applied via inline `style` prop (not Tailwind class — Tailwind v4 cannot scan `.momorph` docs).

**Scroll-spy Strategy**: `IntersectionObserver` watches each section element with `rootMargin: "-20% 0px -60% 0px"` (triggers when section enters the upper 40% of viewport). On intersection, `setActiveSlug(slug)`. Cleanup in `useEffect` return. Server renders `activeSlug = AWARD_CATEGORIES[0].slug` as default.

**URL Hash Strategy**: Pure anchor links (`<a href="#top-talent">`). Browser handles scroll + hash update natively. No `router.replace()` needed. `scroll-margin-top: var(--header-height)` (80px) on each section ensures correct scroll position below fixed header.

**IntersectionObserver Fallback**: If `IntersectionObserver` is unavailable (rare), `activeSlug` stays at its initial value (`"top-talent"`). Nav still works; only the visual highlight is affected. No error thrown.

### Backend Approach

- **No backend changes required** — award data is static JSON.
- **Optional future**: `GET /api/awards` API route if CMS integration is needed.

### Integration Points

| Dependency | Location | Notes |
|------------|----------|-------|
| `data/awards.ts` | Created by Homepage plan | Import directly; `AWARD_CATEGORIES` array + `VALID_AWARD_HASHES` |
| `types/awards.ts` | Created by Homepage plan | `AwardCategory` (with `imagePosition`) + `AwardPrize` (with `subLabel?`) — both updated |
| `<KudosPromoSection />` | `components/homepage/` | Shared; import and reuse as-is |
| `<Header />` | `components/shared/` | Pass `activeNav="awards"`; nav font-size 16px override |
| Award images | `public/assets/awards/award-{slug}.png` | Pre-designed badge PNGs for screen blend mode; exist |
| Keyvisual | `public/assets/awards/keyvisual.jpg` | Exists |
| MM_MEDIA icons | Figma media library | Target, Diamond, License — 24×24px SVGs; download via MoMorph or use equivalent SVG fallback in `public/assets/awards/icons/` |

---

## Project Structure

### Documentation

```text
.momorph/specs/zFYDgyj_pD-he-thong-giai/
├── spec.md
├── design-style.md
├── plan.md   ← this file
└── tasks.md
```

### Source Code (target state after Phase 8)

```text
app/
└── awards/
    └── page.tsx                          # Server Component: load data, auth check → <AwardsPage />

components/
├── awards/
│   ├── AwardsPage.tsx                    # Client Component: activeSlug state + IntersectionObserver + layout
│   ├── AwardKeyvisual.tsx                # Server Component: 1440×547px banner + gradient overlay
│   ├── AwardNavMenu.tsx                  # Client Component: role="navigation"; sticky; 6 anchor links
│   ├── AwardNavItem.tsx                  # Presentational: <a href="#slug"> + aria-current + active styles
│   └── AwardCategorySection.tsx          # Presentational: icon+title, description, icon+recipients, icon+prize(s)
└── shared/
    └── SectionTitle.tsx                  # Updated: accepts subtitle + mainHeading; renders both with divider
```

> `AwardDetailPanel.tsx` is **deleted** in Phase 8 (was tab-panel; no longer needed).

### Modified Files

| File | Change |
|------|--------|
| `app/globals.css` | Add `html { scroll-behavior: smooth; }` + `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }` to enable smooth anchor scrolling with accessibility override |
| `types/awards.ts` | Already updated: `imagePosition` on `AwardCategory`, `subLabel?` on `AwardPrize` ✅ |
| `data/awards.ts` | Already updated: `imagePosition` per category, `subLabel` on D.5 prizes ✅ |
| `i18n/messages/vi.json` | Already updated: `perIndividualPrize`, `perTeamPrize`, `orSeparator` ✅ |
| `i18n/messages/en.json` | Already updated ✅ |
| `components/awards/AwardsPage.tsx` | Phase 8: replace tab state with IntersectionObserver scroll-spy |
| `components/awards/AwardNavMenu.tsx` | Phase 8: replace tablist with `role="navigation"`; anchors |
| `components/awards/AwardNavItem.tsx` | Phase 8: replace `<button role="tab">` with `<a href="#">` |
| `components/awards/AwardCategorySection.tsx` | Phase 8: add `id`, `scroll-margin-top`, icons, fix typography, backdrop-filter |
| `components/shared/SectionTitle.tsx` | Phase 8: add `mainHeading` prop for 48px gold heading |

### New Files

| File | Purpose |
|------|---------|
| `public/assets/awards/icons/icon-target.svg` | MM_MEDIA_Target icon (category name row) |
| `public/assets/awards/icons/icon-diamond.svg` | MM_MEDIA_Diamond icon (recipient count row) |
| `public/assets/awards/icons/icon-license.svg` | MM_MEDIA_License icon (prize value row) |

### Dependencies

No new npm packages. `IntersectionObserver` is built into all modern browsers; no polyfill needed for SSA 2025 target audience.

---

## Implementation Strategy

### Current State (2026-04-29)

**Phases 0–6 complete** ✅ — types, data, alternating layout, dual-prize, i18n all done.

**Phase 7 (in progress)**: Revert T061 (restore `mix-blend-mode: screen` on images).

**Phase 8 (pending)**: Full scroll-layout refactor — 14 tasks (T063–T076) in `tasks.md`.

### Phase 0: Asset Preparation & Type Updates ✅ COMPLETE

All shared dependencies verified; `imagePosition` and `subLabel` fields added to types and data.

### Phase 1: Foundation Components ✅ COMPLETE

`<AwardNavItem />`, `<AwardCategorySection />`, `<SectionTitle />` created. Note: nav item and section need Phase 8 updates (anchor links, icons, typography).

### Phase 2: Core Layout ✅ COMPLETE

`<AwardKeyvisual />`, `<AwardsPage />`, `app/awards/page.tsx` created. Note: `<AwardDetailPanel />` was created but will be removed in Phase 8.

### Phase 3: Hash Routing ✅ COMPLETE (to be replaced in Phase 8)

`router.replace()` + `useEffect` hash logic present. Phase 8 replaces with anchor links + `IntersectionObserver`.

### Phase 4: Navigation + Polish ✅ COMPLETE

Header active state, `<KudosPromoSection />`, `<Footer />`, responsive nav, i18n all wired.

### Phase 5: Polish ✅ COMPLETE

Console.log audit, hex audit, file size checks, presentational audits done.

### Phase 6: FR-011 + FR-012 ✅ COMPLETE

`imagePosition` and `subLabel` implemented; "Hoặc" separator; i18n keys added.

### Phase 7: Image Display Fix (in progress)

- Revert T061: restore `mixBlendMode: "screen"` to `<AwardCategorySection>` image style.
- Verify images render as glowing golden badges.

### Phase 8: Scroll Layout Refactor (pending)

Full replacement of tab-panel architecture with scroll layout. Execute in order:

1. **T063** — `AwardNavMenu`: `role="tablist"` → `role="navigation"`; sticky positioning
2. **T064** — `AwardNavItem`: `<button role="tab">` → `<a href="#slug">` anchor; `aria-current`
3. **T065** — Delete `AwardDetailPanel`; render all sections directly in `AwardsPage` wrapper
4. **T066** — `AwardCategorySection`: add `id={slug}`, `scroll-margin-top: 80px`, `role="region"`, `aria-labelledby`
5. **T067** — `AwardsPage`: remove tab state; add `IntersectionObserver` `useEffect` for scroll-spy
6. **T068** — `SectionTitle`: add `mainHeading` prop; render subtitle (24px white) + main heading (48px gold `#FFEA9E`) + divider
7. **T069** — `AwardCategorySection`: restore `mixBlendMode: "screen"` on image
8. **T070** — `AwardCategorySection`: add `backdropFilter: "blur(32px)"` + `borderRadius: "16px"` to content block
9. **T071** — `AwardCategorySection`: restructure D.x.2.a — icon (Target) + category name (24px gold) in flex-row; description paragraph below (16px white bold, text-justify)
10. **T072–T074** — Cleanup: remove old tab ARIA, `panelHeadingRef`, `focusedIndex`, unused props
11. **globals.css** — Add `html { scroll-behavior: smooth; }` with `prefers-reduced-motion: reduce` override to `auto` (enables smooth anchor scrolling natively; works with all anchor `<a href="#slug">` links without JS)
12. **T075** — `npx tsc --noEmit` zero errors
13. **T076** — Browser verification: scroll, nav highlight, URL hash, mobile tabs

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| `IntersectionObserver` scroll-spy accuracy | Low | Low | Use `rootMargin: "-20% 0px -60% 0px"` to activate when section is well into view; tunable via constant |
| `scroll-margin-top` not respected on mobile | Low | Medium | Apply `scroll-margin-top` to section wrapper AND test on real device at 375px; fallback: `padding-top` on sections |
| Icons (MM_MEDIA_Target/Diamond/License) unavailable via API | Medium | Low | Download during Phase 8 via MoMorph `get_media_file`; fallback: use equivalent open-source SVG icons (crosshair, gem, certificate) |
| `SectionTitle` change breaks other pages using it | Low | Medium | Add new optional `mainHeading` prop with no default; existing callers pass `title` only → unchanged behavior |
| `AwardDetailPanel` removal breaks types | Low | Low | TypeScript strict mode catches all missing imports at compile time (T075) |
| D.5 "Hoặc" separator spacing | Low | Low | Current `gap-4` baseline; refine visually after Phase 8 |
| FR-011: Missing `imagePosition` on `AwardCategory` | None | — | Already implemented and type-safe ✅ |
| FR-012: Signature dual prize | None | — | Already implemented ✅ |

### Estimated Complexity

- **Frontend**: Low (scroll layout simpler than tab-panel; IntersectionObserver is standard)
- **Backend**: None
- **Testing**: Low (fewer interactive behaviors than tab-panel)

---

## Integration Testing Strategy

### Test Scope

- [x] **Section rendering**: All 6 award categories render simultaneously
- [x] **Alternating layout**: FR-011 image positions correct
- [x] **Dual prize**: FR-012 Signature 2025 "Hoặc" separator renders
- [ ] **Scroll-spy**: Nav highlight updates as sections enter viewport
- [ ] **Anchor navigation**: Clicking nav items smooth-scrolls; URL hash updates
- [ ] **Deep link**: `/awards#mvp` loads with MVP section at top of viewport
- [ ] **Header nav**: "Award Information" is gold + underlined
- [ ] **Section title**: Both "Sun* Annual Awards 2025" and "Hệ thống giải thưởng SAA 2025" render
- [ ] **Images**: Award badge images render as golden glowing circles (screen blend mode)
- [ ] **Responsive**: Left nav collapses to horizontal scroll row at 768px / 320px
- [ ] **Data layer**: Static JSON — no integration test needed

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Scroll → nav highlight; nav click → scroll + hash |
| App ↔ Data Layer | No | Static JSON (no async) |
| Cross-platform | Yes | Left nav → horizontal tabs at 320/768 |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| `IntersectionObserver` | Mock in jsdom | jsdom doesn't implement IntersectionObserver; mock with jest.fn() or vitest |
| Award data | Real static import | No mocking needed |
| `next/navigation` | Not needed | Anchor links use browser native; no `router.replace()` |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] `/awards` loads with all 6 sections visible; "Top Talent" nav item highlighted
   - [ ] Scroll to "Best Manager" → nav item switches to "Best Manager"
   - [ ] Click "MVP" nav → page scrolls to MVP section; URL becomes `/awards#mvp`
   - [ ] `/awards#top-project` loads with Top Project section in view
   - [ ] "Award Information" header nav is gold + underlined

2. **Content Verification**
   - [ ] Each section shows: target icon + category name (24px gold) + description + diamond icon + count + license icon + amount
   - [ ] Section title shows both lines: "Sun* Annual Awards 2025" (24px) + "Hệ thống giải thưởng SAA 2025" (48px gold)
   - [ ] All 6 award images render as glowing golden badges (not invisible/opaque photo)
   - [ ] FR-011: Odd sections (Top Talent, Top Project Leader, Signature 2025) have image on LEFT
   - [ ] FR-012: Signature 2025 shows two prize blocks with "Hoặc" separator

3. **Edge Cases**
   - [ ] `/awards#invalid` → page renders normally; first section (Top Talent) in view
   - [ ] Scroll to very bottom → "MVP" remains active nav item
   - [ ] Mobile (375px): left nav collapses to horizontal scroll row; all 6 items reachable
   - [ ] `prefers-reduced-motion: reduce` → no scroll animation

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `<AwardCategorySection />` rendering (icons, title, description, prizes) | 90%+ | High |
| `IntersectionObserver` scroll-spy logic in `<AwardsPage />` | 80%+ | High |
| `<AwardNavMenu />` anchor links + `aria-current` | 85%+ | High |
| `<SectionTitle />` two-line render | 80%+ | High |
| FR-011 alternating layout | 90%+ | High |
| FR-012 Signature 2025 dual-prize | 90%+ | High |
| E2E scroll + nav highlight + URL hash | Key flow | High |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` reviewed and updated (scroll layout confirmed 2026-04-29)
- [x] `data/awards.ts` — exists with `imagePosition` + D.5 `subLabel`
- [x] `types/awards.ts` — exists with `imagePosition: "left" | "right"` + `subLabel?`
- [x] Awards keyvisual: `public/assets/awards/keyvisual.jpg`
- [x] Award category images: `public/assets/awards/award-{slug}.png` (6 files)
- [x] `<Header />` supports `activeNav` prop
- [x] `<KudosPromoSection />` built
- [x] `<Footer />` built
- [ ] MM_MEDIA icon SVGs downloaded to `public/assets/awards/icons/` (Phase 8 T071)
- [ ] Phase 8 refactor complete (T063–T076)

### External Dependencies

- None (static data; no third-party APIs; `IntersectionObserver` is browser-native)

---

## Next Steps

1. Execute Phase 7 (T061 — restore `mix-blend-mode: screen`)
2. Execute Phase 8 (T063–T076 — full scroll layout refactor)
3. Download MM_MEDIA icons during T071

---

## Notes

- **Scroll layout confirmed 2026-04-29**: All 6 sections always visible. Left nav is sticky anchor links with IntersectionObserver scroll-spy. NOT a tab-panel swap.
- **`<AwardDetailPanel />` is removed in Phase 8** — was the tab-panel container; no longer needed.
- **Awards nav font-size is 16px** — pass via `navFontSize` or Tailwind override on `<Header />`.
- **`<AwardCategorySection />` is DISTINCT from `<AwardCategoryCard />`** (Homepage): card is compact grid tile; section is full detail view.
- **`mix-blend-mode: screen` is REQUIRED on images** — do not remove. Images are pre-designed for screen blend on dark background.
- **`scroll-margin-top: 80px`** on each section is critical — without it, anchor navigation hides the section heading under the fixed header.
- **`IntersectionObserver` rootMargin** of `-20% 0px -60% 0px` means the observer fires when the section top is between 20% and 80% of the viewport height. This gives a natural "section in view" feel. Tune if needed.
