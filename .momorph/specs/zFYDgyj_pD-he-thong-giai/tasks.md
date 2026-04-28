# Tasks: Award System (He Thong Giai)

**Frame**: `zFYDgyj_pD-he-thong-giai`
**Prerequisites**: plan.md (required), spec.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3)
- **|**: File path affected by this task

---

## Phase 0: Asset Preparation

**Purpose**: Verify shared dependencies from Homepage plan and prepare awards-specific static assets

- [x] T001 Verify `data/awards.ts` exists and exports all 6 category slugs plus `VALID_AWARD_HASHES` constant (`['top-talent','top-project','top-project-leader','best-manager','signature-2025','mvp']`); add constant if missing | data/awards.ts
- [x] T002 Verify `types/awards.ts` exports `AwardCategory` and `AwardPrize` interfaces; extend if any required fields are missing | types/awards.ts
- [x] T003 Export awards keyvisual image (1440×547px) to public directory | public/assets/awards/keyvisual.jpg
- [x] T004 Add awards-specific CSS tokens to globals.css if not already present from Homepage plan: `--text-nav-size` (16px override for Awards nav), `--left-nav-gap`, `--left-nav-padding`, `--award-gap` | app/globals.css

---

## Phase 1: Foundation — Atomic Presentational Components

**Purpose**: Build the lowest-level components required by all user stories. No story can start until these are complete.

**CRITICAL**: These components are blocking prerequisites for Phase 2 and Phase 3.

- [x] T005 [P] Create `AwardNavItem` presentational component with `role="tab"`, `aria-selected`, `aria-controls="{panel-id}"`, active/focus styles | components/awards/AwardNavItem.tsx
- [x] T006 [P] Create `AwardCategorySection` presentational component rendering award name, recipient count, prize amount, and divider line (full detail view — DISTINCT from Homepage `AwardCategoryCard`) | components/awards/AwardCategorySection.tsx
- [x] T007 [P] Create `SectionTitle` reusable component rendering section heading ("Sun\* Annual Awards 2025") with `#2E3940` divider line | components/shared/SectionTitle.tsx

**Checkpoint**: Atomic presentational components complete — Phase 2 and Phase 3 can now begin

---

## Phase 2: Core Layout — US1 View Award Category Details (Priority: P1)

**Goal**: User can navigate to `/awards`, see the default "Top Talent" category detail, click any of the 6 nav items, and see the correct detail panel swap in with a 150ms fade. No scroll — pure tab-panel swap.

**Independent Test**: Navigate to `/awards` → "Top Talent" panel visible → click "Top Project" → panel switches, URL hash updates to `#top-project`

### Components (US1)

- [x] T008 [US1] Create `AwardKeyvisual` Server Component: 1440×547px banner with `public/assets/awards/keyvisual.jpg` as background and gradient overlay (`linear-gradient(0deg, #00101A -4.23%, rgba(0,19,32,0) 52.79%)`) | components/awards/AwardKeyvisual.tsx
- [x] T009 [US1] Create `AwardNavMenu` Client Component with `role="tablist"`, renders all 6 `AwardNavItem` children; manages focused index via internal `useState`; calls `router.replace(pathname + '#' + slug)` on item activation (click or Enter key) | components/awards/AwardNavMenu.tsx
- [x] T010 [US1] Add Arrow Down / Arrow Up keyboard handlers to `AwardNavMenu` with wrap-around: Down on last item wraps to first; Up on first item wraps to last | components/awards/AwardNavMenu.tsx
- [x] T011 [US1] Add Home / End keyboard handlers to `AwardNavMenu`: Home moves focus to index 0 (Top Talent); End moves focus to index 5 (MVP) | components/awards/AwardNavMenu.tsx
- [x] T012 [US1] Add Enter key handler to `AwardNavMenu`: selects focused item, updates `activeCategory`, calls `router.replace`, then programmatically moves focus to the `role="tabpanel"` heading inside `AwardDetailPanel` | components/awards/AwardNavMenu.tsx
- [x] T013 [US1] Create `AwardDetailPanel` Client Component with `role="tabpanel"` and `aria-labelledby="{tab-id}"`; renders only the selected `AwardCategorySection`; all non-active panels are `display:none`; applies 150ms fade-in CSS transition on panel switch; disables fade when `prefers-reduced-motion: reduce` | components/awards/AwardDetailPanel.tsx
- [x] T014 [US1] Add loading skeleton state to `AwardDetailPanel`: when `isLoading=true` render a skeleton placeholder matching approximate panel height; left nav remains visible and clickable during loading | components/awards/AwardDetailPanel.tsx
- [x] T015 [US1] Add error state to `AwardDetailPanel`: when `error` is non-null render "Unable to load award information" message with retry CTA | components/awards/AwardDetailPanel.tsx
- [x] T016 [US1] Create `AwardsPage` Client Component: manages `activeCategory` state (default `'top-talent'`), `isLoading` state, `error` state; composes `AwardKeyvisual`, `SectionTitle`, `AwardNavMenu`, and `AwardDetailPanel` in the two-column layout (178px nav + 856px detail) | components/awards/AwardsPage.tsx
- [x] T017 [US1] Create `app/awards/page.tsx` Server Component: statically imports award categories from `data/awards.ts`; passes data as props to `<AwardsPage />`; sets page metadata | app/awards/page.tsx

### Layout & Styling (US1)

- [x] T018 [US1] Implement two-column layout in `AwardsPage`: left nav 178px fixed width, right detail panel 856px; responsive stacking rule applied via Tailwind breakpoint classes | components/awards/AwardsPage.tsx
- [x] T019 [US1] Wire shared `<Header activeNav="awards" />` and `<Footer />` into the Awards page layout (Header navFontSize prop set to 16px for Awards nav override) | components/awards/AwardsPage.tsx

**Checkpoint**: US1 complete — detail panel swap, loading skeleton, and error state all functional

---

## Phase 3: Hash Routing + Keyboard Navigation — US2 Browse All Categories (Priority: P1)

**Goal**: All 6 nav items visible with WAI-ARIA tablist pattern; URL hash (`/awards#top-project`) pre-selects the matching category on page load; keyboard navigation (Arrow Up/Down/Home/End/Enter) is fully functional.

**Independent Test**: Open `/awards#top-project` → "Top Project" panel visible → press Arrow Down → "Top Project Leader" tab focused → press Enter → panel switches + focus moves to panel heading

### Hash Routing (US2)

- [x] T020 [US2] Implement URL hash pre-selection `useEffect` in `AwardsPage`: on mount, read `window.location.hash` (strip `#`); look up against `VALID_AWARD_HASHES`; if valid set `activeCategory` to that slug; if absent or invalid fallback to `'top-talent'`; server renders default to avoid hydration mismatch | components/awards/AwardsPage.tsx
- [x] T021 [US2] Ensure `AwardNavMenu` calls `router.replace(pathname + '#' + slug)` (NOT `router.push`) on item click and Enter key — no new browser history entry | components/awards/AwardNavMenu.tsx
- [x] T022 [US2] Validate that invalid hash (`/awards#unknown`) falls back silently to `'top-talent'` without console errors or crashes | components/awards/AwardsPage.tsx
- [x] T023 [US2] Validate that absent hash (`/awards` with no fragment) defaults to `'top-talent'` | components/awards/AwardsPage.tsx

### WAI-ARIA Compliance (US2)

- [x] T024 [US2] Verify each `AwardNavItem` renders `role="tab"`, `aria-selected="true/false"`, and `aria-controls="{panel-id}"` pointing to its associated tabpanel | components/awards/AwardNavItem.tsx
- [x] T025 [US2] Verify `AwardDetailPanel` heading (`<h2>` or first focusable element) receives programmatic focus after keyboard Enter selection from `AwardNavMenu` | components/awards/AwardDetailPanel.tsx
- [x] T026 [US2] Verify `AwardNavMenu` container has `role="tablist"` and each `AwardNavItem` is a direct child in the tab sequence | components/awards/AwardNavMenu.tsx

**Checkpoint**: US2 complete — all 6 categories browsable via click and keyboard; hash routing pre-selects correctly

---

## Phase 4: Navigation + Polish — US3 Platform Navigation (Priority: P2)

**Goal**: Header "Award Information" link shows active gold + underline state; KudosPromoSection and Footer present; all strings i18n-ready; responsive horizontal tabs on mobile/tablet.

**Independent Test**: View page at 375px width → left nav collapses to horizontal scrollable tab row → all 6 tabs still reachable; change locale → all visible strings update

### Navigation Integration (US3)

- [x] T027 [US3] Verify `<Header activeNav="awards" />` renders "Award Information" nav item in active state (gold color + underline) matching design tokens | components/awards/AwardsPage.tsx
- [x] T028 [US3] Verify all navigation `href` values (Header links, Footer links) reference `.momorph/contexts/SCREENFLOW.md` as source of truth — no hardcoded paths without verification | components/awards/AwardsPage.tsx
- [x] T029 [US3] Add `<KudosPromoSection />` shared component (imported from `components/homepage/KudosPromoSection.tsx`) below `AwardDetailPanel` in `AwardsPage` layout | components/awards/AwardsPage.tsx

### Responsive Layout (US3)

- [x] T030 [US3] Implement responsive left nav → horizontal scrollable tabs at mobile/tablet breakpoints: `overflow-x: auto`, `flex-nowrap` on `AwardNavMenu` container; 320px and 768px breakpoints verified | components/awards/AwardNavMenu.tsx
- [x] T031 [US3] Verify two-column layout stacks vertically at tablet/mobile and transitions back to side-by-side at 1280px | components/awards/AwardsPage.tsx

### i18n (US3)

- [x] T032 [US3] Add i18n translation keys for all award category names in `messages/vi.json` and `messages/en.json` | messages/vi.json
- [x] T033 [US3] Add i18n translation keys for prize labels and section headings in `messages/vi.json` and `messages/en.json` | messages/en.json
- [x] T034 [US3] Replace all hardcoded Vietnamese/English strings in `AwardsPage`, `AwardNavItem`, `AwardCategorySection`, and `SectionTitle` with `useTranslations()` calls — zero hardcoded locale strings in component files | components/awards/AwardsPage.tsx
- [x] T035 [US3] Replace hardcoded strings in `AwardDetailPanel` and `AwardNavMenu` with `useTranslations()` calls | components/awards/AwardDetailPanel.tsx

### Motion Accessibility (US3)

- [x] T036 [US3] Apply `prefers-reduced-motion: reduce` CSS media query to disable the 150ms fade-in transition on `AwardDetailPanel` panel switch | components/awards/AwardDetailPanel.tsx

**Checkpoint**: US3 complete — navigation active state, KudosPromoSection, Footer, responsive tabs, and i18n all functional

---

## Phase 5: Polish + Cross-Cutting Concerns

**Purpose**: Final refinements that span multiple stories and ensure production quality

- [x] T037 [P] Audit all files for console.log statements and remove; replace with proper error boundaries or silent fallbacks where appropriate | components/awards/
- [x] T038 [P] Verify no hardcoded hex color values exist in any awards component; all colors must reference CSS custom properties or Tailwind tokens | components/awards/
- [x] T039 [P] Verify no hardcoded award slug strings exist outside `data/awards.ts`; all slugs must be derived from `VALID_AWARD_HASHES` constant | components/awards/
- [x] T040 [P] Verify `AwardCategorySection` is strictly presentational (no internal state, no side effects) and receives all data via props — no mutation of prop values | components/awards/AwardCategorySection.tsx
- [x] T041 Verify `AwardsPage` `activeCategory` state transitions are immutable: each nav click produces a new state value via `setState`, never mutating the previous value | components/awards/AwardsPage.tsx
- [x] T042 [P] Audit file sizes: each file must be under 400 lines (warn) and strictly under 800 lines (hard limit); extract utilities if any file exceeds threshold | components/awards/
- [x] T043 Verify `app/awards/page.tsx` remains a pure Server Component (no `'use client'` directive, no `useState`, no `useEffect`); only `AwardsPage.tsx` is Client Component | app/awards/page.tsx
- [x] T044 [P] Confirm `AwardKeyvisual` background image uses Next.js `<Image />` with correct `priority`, `alt`, `width=1440`, `height=547` for LCP optimization | components/awards/AwardKeyvisual.tsx
- [x] T045 Verify tablist/tabpanel `id` pairing is consistent: each `AwardNavItem` `aria-controls` value matches the corresponding `AwardDetailPanel` wrapper `id` attribute exactly | components/awards/AwardNavMenu.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0**: No external code dependencies — verify assets and shared files exist before writing any component
- **Phase 1**: Depends on Phase 0 completion (types and data files must exist) — BLOCKS Phases 2 and 3
- **Phase 2 (US1)**: Depends on Phase 1 completion; `AwardNavMenu` depends on `AwardNavItem`; `AwardsPage` depends on all Phase 1 + 2 components
- **Phase 3 (US2)**: Depends on Phase 1 completion; hash routing in `AwardsPage` depends on `VALID_AWARD_HASHES` from Phase 0; can run in parallel with Phase 2 on separate files
- **Phase 4 (US3)**: Depends on Phase 2 completion (layout must exist before responsive/i18n work); KudosPromoSection requires Homepage plan Phase 4 to be complete
- **Phase 5**: Depends on all story phases complete

### Within Phase 2

- T008 (`AwardKeyvisual`) and T009–T012 (`AwardNavMenu`) are independent — run in parallel
- T013–T015 (`AwardDetailPanel`) requires T005 (`AwardNavItem`) and T006 (`AwardCategorySection`) from Phase 1
- T016 (`AwardsPage`) requires T008, T009, T013, T007 all complete
- T017 (`page.tsx`) requires T016 complete

### Parallel Opportunities

- T005, T006, T007 (Phase 1) — fully parallel, different files
- T008 and T009–T012 (Phase 2) — parallel after Phase 1
- T020–T023 (Phase 3 hash routing) can run alongside T018–T019 (Phase 2 layout) since they target different aspects of `AwardsPage`
- T032 and T033 (i18n message files) — parallel, different locale files
- All Phase 5 tasks marked [P] — parallel audit tasks across the directory

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 0 + Phase 1
2. Complete Phase 2 (US1 — View Category Details)
3. **STOP and VALIDATE**: `/awards` loads, default panel shows, clicking switches panels
4. Complete Phase 3 (US2 — keyboard nav + hash routing)
5. **VALIDATE**: All 6 categories reachable via keyboard; hash pre-selection works
6. Complete Phase 4 (US3 — navigation + polish)
7. Complete Phase 5 (cross-cutting)

### Key Implementation Notes

- Tab-panel SWAP (NOT scroll): only the selected panel is visible; all others are `display:none`
- Hash reads happen in `useEffect` only (client-side) to prevent SSR hydration mismatch; server always renders `'top-talent'` as default
- `router.replace` not `router.push` — avoids history pollution on every tab click
- `VALID_AWARD_HASHES` is the single source of truth for all slug values — never hardcode slugs in components
- `AwardCategorySection` (full detail) is DISTINCT from `AwardCategoryCard` (Homepage compact grid tile)
- Awards nav font-size is 16px (not 14px as on Homepage) — pass via `navFontSize` prop to `<Header />`

---

## Notes

- Mark tasks complete as you go: `[x]`
- Commit after each phase or logical group
- If `data/awards.ts` or `types/awards.ts` do not exist, complete Homepage plan Phase 0 first before proceeding
- All href values must be verified against `.momorph/contexts/SCREENFLOW.md` before hardcoding any route paths
