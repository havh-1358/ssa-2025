# Implementation Plan: Award System (He Thong Giai)

**Frame**: `zFYDgyj_pD-he-thong-giai`
**Date**: 2026-04-22
**Spec**: `specs/zFYDgyj_pD-he-thong-giai/spec.md`

---

## Summary

The Award System page (`/awards`) is a public, server-side rendered read-only page displaying all 6 SSA 2025 award categories. It uses a two-column layout: a left navigation panel (178px, `role="tablist"`) and a right detail panel (856px, `role="tabpanel"`). Category selection updates the URL hash (`/awards#top-talent`) and switches the visible panel without a page reload. Award data is sourced from the shared static `data/awards.ts` file created in the Homepage plan. The `<AwardCategoryCard />` presentational component is also shared with the Homepage.

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js App Router
**Primary Dependencies**: React 19, Tailwind CSS 4, next-intl
**Database**: N/A (award data: static JSON, shared with Homepage)
**Testing**: Vitest + React Testing Library; Playwright E2E
**State Management**: `useState` for `activeCategory`; `useEffect` for URL hash; static props for awards
**API Style**: Static JSON (MVP); optional `GET /api/awards` future path

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Requirement | Constitution Rule | Status |
|-------------|-------------------|--------|
| I. Type Safety | Strict TS; `AwardCategory` type from shared `types/awards.ts` | ✅ Planned |
| II. Design Fidelity | All hex tokens → CSS vars in `globals.css`; no raw hex in components | ✅ Planned |
| II. Responsive | 320/768/1280 breakpoints; left nav → horizontal tabs on mobile/tablet | ✅ Planned |
| II. WCAG 2.1 AA | `role="tablist"` + `role="tab"` + `role="tabpanel"`; keyboard nav; focus management | ✅ Planned |
| III. Test-First | Tests before components | ✅ Planned |
| IV. Layered Arch | Page (Server) → `<AwardsPage />` → `<AwardNavMenu />` + `<AwardDetailPanel />` | ✅ Planned |
| IV. Clean Code | Award data from `data/awards.ts` — not hardcoded per component | ✅ Planned |
| V. Doc-Driven | spec.md + plan.md exist | ✅ Met |
| VI. Security | Public read-only page; no auth required; no user data | ✅ Compliant |

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**:
  - `app/awards/page.tsx` — Server Component; imports award data; renders `<AwardsPage />`
  - `<AwardsPage />` — Client Component shell (needs `useState` for `activeCategory` and URL hash); loads award data via static import
  - `<Header activeNav="awards" />` — Shared Server Component with `<LanguageSelector />` Client island
  - `<AwardKeyvisual />` — Server Component; 547px background image + gradient overlay
  - `<SectionTitle />` — Server Component; "Sun* Annual Awards 2025" + divider
  - `<AwardNavMenu />` — Client Component; `role="tablist"`; 6 category items; handles active state + URL hash
  - `<AwardNavItem />` — Presentational; `role="tab"` + `aria-selected` + `aria-controls`
  - `<AwardDetailPanel />` — Client Component; `role="tabpanel"`; shows selected category section
  - `<AwardCategorySection />` — Presentational; title + recipient count + prize amount + divider; **shared concept with Homepage `<AwardCategoryCard />`** but this page shows the full detail view
  - `<KudosPromoSection />` — Shared Server Component (imported from `components/homepage/`)
  - `<Footer />` — Shared Server Component

- **Styling Strategy**: Tailwind CSS 4 + CSS custom properties. Nav font-size `16px` (vs `14px` on Homepage) applied via prop or Tailwind override on `<Header />`.

- **Data Fetching**: Award categories from `data/awards.ts` (static import, shared with Homepage). No `useEffect` / client fetch.

- **URL Hash Strategy**: On nav item click → `router.replace(pathname + '#' + slug)` (no new history entry). On mount → read `window.location.hash` to pre-select category; fallback to `"top-talent"` if hash is invalid or absent.

### Backend Approach

- **No backend changes required for MVP** — award data is static JSON shared with Homepage.
- **Optional future**: `GET /api/awards` — returns same JSON via API route if CMS integration is needed.

### Integration Points

- **`data/awards.ts`**: Created in Homepage plan (`i87tDx10uM`). Import directly — do NOT duplicate.
- **`types/awards.ts`**: `AwardCategory`, `AwardPrize` types — created in Homepage plan. Import directly.
- **`<AwardCategoryCard />`**: Homepage plan creates this as a presentational card. The Awards page uses `<AwardCategorySection />` which is a MORE DETAILED view (not the same compact card). Create as a separate component in `components/awards/`.
- **`<KudosPromoSection />`**: Shared from `components/homepage/KudosPromoSection.tsx`. Import and reuse.
- **`<Header />`**: Shared; pass `activeNav="awards"` and `navFontSize="16px"` or equivalent prop.

---

## Project Structure

### Documentation

```text
.momorph/specs/zFYDgyj_pD-he-thong-giai/
├── spec.md
├── design-style.md
└── plan.md   ← this file
```

### Source Code

```text
app/
└── awards/
    └── page.tsx                          # Server Component: load award data → render <AwardsPage />

components/
├── awards/
│   ├── AwardsPage.tsx                    # Client Component: activeCategory state + URL hash + layout
│   ├── AwardNavMenu.tsx                  # Client Component: role="tablist"; 6 nav items
│   ├── AwardNavItem.tsx                  # Presentational: role="tab", aria-selected, aria-controls
│   ├── AwardDetailPanel.tsx              # Client Component: role="tabpanel"; renders selected section
│   └── AwardCategorySection.tsx         # Presentational: full detail view of one award category
└── shared/
    └── SectionTitle.tsx                  # Presentational: section heading + divider line (reusable)
```

### Modified Files

| File | Change |
|------|--------|
| `app/globals.css` | Add awards-specific tokens if not already present from Homepage: `--text-nav-size` override for Awards nav (16px), `--left-nav-gap`, `--left-nav-padding`, `--award-gap` |

### Dependencies

No new npm packages. Award data and types are shared from Homepage plan.

---

## Implementation Strategy

### Phase 0: Asset Preparation

- Verify `data/awards.ts` and `types/awards.ts` exist (created by Homepage plan)
- Export awards keyvisual → `public/assets/awards/keyvisual.jpg` (1440×547px)
- Add any missing CSS tokens to `app/globals.css` (check Homepage plan already added shared tokens)

### Phase 1: Foundation (TDD)

1. Verify `types/awards.ts` has `AwardCategory` and `AwardPrize` interfaces (from Homepage plan)
2. Write tests for `<AwardNavItem />` (renders text, `role="tab"`, `aria-selected`, active styles)
3. Implement `<AwardNavItem />`
4. Write tests for `<AwardNavMenu />` (renders 6 items, keyboard Up/Down navigation, hash update on click)
5. Implement `<AwardNavMenu />`
6. Write tests for `<AwardCategorySection />` (renders award name, recipient count, prize amount)
7. Implement `<AwardCategorySection />`

### Phase 2: Core Layout (US1 — View Category Details)

1. Write E2E test: navigate to `/awards` → default "Top Talent" selected → detail shows correct data → click "Top Project" → panel updates
2. Implement `<AwardDetailPanel />` (shows selected category section; transition 150ms fade)
3. Implement `<AwardsPage />` (state + hash sync + layout composition)
4. Implement `app/awards/page.tsx` (static data import → pass to client component)
5. Wire shared `<Header activeNav="awards" />` and `<Footer />`

### Phase 3: Hash Routing + Keyboard Navigation (US1 + US2)

1. Add URL hash sync to `<AwardNavMenu />` (`router.replace` on click; `useEffect` on mount)
2. Test: navigate to `/awards#top-project` → "Top Project" is pre-selected
3. Test: navigate to `/awards#invalid` → fallback to "Top Talent"
4. Add keyboard navigation: Arrow Up/Down cycles through items; Enter selects; Home/End
5. Add focus management: selection via keyboard moves focus to detail panel heading

### Phase 4: Navigation + Polish (US3)

1. Verify header nav "Award Information" is active state (gold + underline)
2. Add `<SectionTitle />` with "Sun* Annual Awards 2025" heading and `#2E3940` divider
3. Add `<KudosPromoSection />` (shared from Homepage plan)
4. Responsive: at tablet/mobile → left nav becomes horizontal scrollable tab row
5. `prefers-reduced-motion` — disable 150ms fade animation
6. Error state in detail panel if award data fails (future API path)

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| `data/awards.ts` not yet created (Homepage plan dependency) | Medium | High | Create Awards page AFTER Homepage plan Phase 0 is complete |
| Hash sync causing hydration mismatch | Low | Low | Read hash only in `useEffect` (client only); server renders default ("top-talent") |
| Left nav keyboard nav scope | Low | Low | Use standard `role="tablist"` pattern; well-documented |
| Mobile horizontal scroll tabs | Low | Low | Use `overflow-x: auto` + `flex-nowrap` on the nav container |

### Estimated Complexity

- **Frontend**: Low-Medium (static data, tab pattern, hash routing)
- **Backend**: None (static JSON only)
- **Testing**: Low (few interactive behaviors)

---

## Integration Testing Strategy

### Test Scope

- [x] **Section rendering**: All 6 award categories reachable via left nav
- [x] **Hash routing**: `/awards#top-project` pre-selects "Top Project"
- [x] **Navigation**: Header nav "Award Information" is active; other links route correctly
- [x] **Keyboard nav**: Arrow Up/Down cycles; Enter selects; focus moves to panel
- [ ] **Data layer**: Static JSON — no integration test needed

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Nav click → panel switch; hash sync |
| App ↔ Data Layer | No | Static JSON (no async) |
| Cross-platform | Yes | Left nav → tabs at 320/768 |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| `window.location.hash` | jsdom default | Test hash-based pre-selection |
| `next/navigation` (useRouter) | Mock | Verify `router.replace()` calls |
| Award data | Real static import | No mocking needed |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] `/awards` loads with "Top Talent" selected by default
   - [ ] All 6 nav items visible; clicking each shows correct detail panel
   - [ ] `/awards#mvp` pre-selects "MVP" on page load
   - [ ] "Award Information" nav link is gold + underlined

2. **Error Handling**
   - [ ] Invalid hash (`/awards#unknown`) → fallback to "Top Talent"
   - [ ] Award data missing → empty state in detail panel (no crash)

3. **Edge Cases**
   - [ ] Keyboard Up/Down navigates through all 6 items
   - [ ] Escape from nav item returns focus to trigger (if applicable)

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `<AwardNavMenu />` keyboard nav | 90%+ | High |
| `<AwardCategorySection />` rendering | 90%+ | High |
| Hash routing + pre-selection | 85%+ | High |
| E2E category browse | Key flow | High |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved
- [ ] `data/awards.ts` created (from Homepage plan Phase 0)
- [ ] `types/awards.ts` created (from Homepage plan Phase 1)
- [ ] Awards keyvisual image available → `public/assets/awards/keyvisual.jpg`
- [ ] `<Header />` component supports `activeNav` and `navFontSize` props (from Homepage plan Phase 3)
- [ ] `<KudosPromoSection />` built (from Homepage plan Phase 4)
- [ ] `<Footer />` built (from Homepage plan Phase 4)

### External Dependencies

- None (static data; no third-party APIs)

---

## Next Steps

1. Ensure Homepage plan (`i87tDx10uM`) Phase 0 is complete before starting (shared data/types)
2. Run `/momorph.tasks` to generate the task breakdown
3. Begin Phase 0 asset prep (keyvisual image)

---

## Notes

- The `<AwardNavMenu />` uses `role="tablist"` — NOT `role="listbox"` — because the detail panel is shown/hidden (tab pattern), not a form selection control.
- The Awards page left nav uses **16px** nav font, not 14px. The `<Header />` component must accept a prop (e.g., `navFontSize`) to override the default 14px used on the Homepage.
- URL hash updates use `router.replace()` (not `router.push()`) to avoid polluting the browser history on every category click.
- The detail panel shows ALL award sections stacked with dividers (not hidden sections — the "active" state drives which section is scrolled into view or shown). However, per spec, it is a click-to-reveal pattern — only the selected category's panel is displayed; others are hidden.
- `<AwardCategorySection />` is DISTINCT from `<AwardCategoryCard />` (Homepage): the card is a compact grid tile; the section is a full detail view with prize breakdown.
