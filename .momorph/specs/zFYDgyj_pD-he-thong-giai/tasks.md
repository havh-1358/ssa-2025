# Tasks: Award System (He Thong Giai)

**Frame**: `zFYDgyj_pD-he-thong-giai`
**Prerequisites**: plan.md (required), spec.md (required)
**Last updated**: 2026-04-29 — Added Phase 6 for FR-011 (alternating image layout) + FR-012 (Signature 2025 dual-prize)

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

## Phase 6: FR-011 Alternating Image Layout + FR-012 Signature Dual Prize ⚠️ NEW

**Purpose**: Implement two spec requirements discovered in the 2026-04-29 review that were absent from the original implementation.

- **FR-011**: D.1/D.3/D.5 render award image LEFT; D.2/D.4/D.6 render image RIGHT. Driven by `imagePosition: "left" | "right"` on `AwardCategory`.
- **FR-012**: D.5 Signature 2025 has two prize tiers (5M individual + 8M team) separated by an "Hoặc" divider. Driven by `subLabel` on `AwardPrize`.

**Goal**: Award sections alternate image side correctly; Signature 2025 shows both prizes with "Hoặc" separator.

**Independent Test**: Open `/awards` → Top Talent image is on LEFT of text → click Top Project → image is on RIGHT → click Signature 2025 → two prize blocks appear with "Hoặc" separator between them

### Type + Data Updates (FR-011 + FR-012)

- [x] T046 Add `imagePosition: "left" | "right"` required field to `AwardCategory` interface in `types/awards.ts` — TypeScript strict mode will catch all call sites missing the field | types/awards.ts
- [x] T047 Add optional `subLabel?: string` field to `AwardPrize` interface in `types/awards.ts` — absent means use default "cho mỗi giải thưởng" | types/awards.ts
- [x] T048 Update `data/awards.ts` — add `imagePosition` to all 6 categories: `"left"` for Top Talent, Top Project Leader, Signature 2025; `"right"` for Top Project, Best Manager, MVP | data/awards.ts
- [x] T049 Update `data/awards.ts` — add `subLabel` to D.5 Signature 2025 prizes: prize 1 `subLabel: "perIndividualPrize"`, prize 2 `subLabel: "perTeamPrize"` (i18n keys resolved in component via `t()`); ensure all other prizes have no `subLabel` | data/awards.ts

### Component Updates (FR-011)

- [x] T050 [US1] Update `AwardCategorySection` props type to include `imagePosition: "left" | "right"` — no default; strict required prop (derived from `category.imagePosition`) | components/awards/AwardCategorySection.tsx
- [x] T051 [US1] Update `AwardCategorySection` render: when `imagePosition === "left"` render `<Image />` before content div; when `imagePosition === "right"` render content div before `<Image />` — both use same `flex-row gap-[40px] items-start` container | components/awards/AwardCategorySection.tsx
- [x] T052 [US1] `AwardDetailPanel` passes full `category` object (including `imagePosition`) to `<AwardCategorySection />` — no additional change needed; field is accessed directly from `AwardCategory` type | components/awards/AwardDetailPanel.tsx

### Component Updates (FR-012)

- [x] T053 [US1] Update `AwardCategorySection` prize rendering: when `prizes.length === 1`, render single prize block; when `prizes.length > 1`, render an interleaved list — each prize block followed by an "Hoặc" separator, except after the last prize | components/awards/AwardCategorySection.tsx
- [x] T054 [US1] Implement "Hoặc" separator element (`<OrSeparator />`) in `AwardCategorySection`: `flex flex-row items-center gap-4` container with two `flex-1 h-px bg-[var(--color-divider)]` lines flanking the "Hoặc" text (Montserrat 400 14px, `#FFFFFF` opacity 70%) | components/awards/AwardCategorySection.tsx
- [x] T055 [US1] Update each prize block (`<PrizeBlock />`) in `AwardCategorySection` to render sub-label below prize amount: if `prize.subLabel` exists, resolve via `t(prize.subLabel)`; otherwise render i18n key `awards.perPrize` | components/awards/AwardCategorySection.tsx

### i18n Updates (FR-011 + FR-012)

- [x] T056 [P] Add i18n keys to `i18n/messages/vi.json` and `i18n/messages/en.json` for new FR-012 strings: `awards.perIndividualPrize`, `awards.perTeamPrize`, `awards.orSeparator` | i18n/messages/vi.json
- [x] T057 [P] D.5 `subLabel` values are i18n keys (`"perIndividualPrize"` / `"perTeamPrize"`); resolved in `<PrizeBlock />` via `t(prize.subLabel)` — consistent pattern across all prize sub-labels | data/awards.ts

### Validation (FR-011 + FR-012)

- [x] T058 [P] TypeScript compiles cleanly after T046–T047 type additions: `npx tsc --noEmit` returns zero errors | —
- [ ] T059 Manually verify in browser: Top Talent (image left) → Top Project (image right) → Top Project Leader (image left) → Best Manager (image right) → Signature 2025 (image left + 2 prizes + "Hoặc") → MVP (image right) | —
- [x] T060 [P] `AwardCategorySection` remains strictly presentational: no `useState`, no `useEffect`, no side effects — pure render from props | components/awards/AwardCategorySection.tsx

**Checkpoint**: FR-011 + FR-012 complete — alternating image positions correct, Signature 2025 dual-prize layout renders correctly

---

## Phase 7: Fix Award Image Display ⚠️ REVISED

**Context (2026-04-29 spec review)**: The award images ARE designed for `mix-blend-mode: screen` (pre-composed circular badge PNGs). T061 incorrectly removed the blend mode. Additionally the images should display correctly once the screen blend mode is applied — spec review confirmed this via FR-015.

**Goal**: Award images render with `mix-blend-mode: screen` + gold glow shadow, appearing as glowing golden badges on the `#00101A` background.

**Independent Test**: Open `/awards` → Top Talent section shows a glowing golden badge image to the left/right of content.

- [ ] T061 [US1] ~~Moved to Phase 8 T069~~ — `mixBlendMode: "screen"` restoration is covered by T069 which restructures the full image block; skip this task and proceed directly to Phase 8 | —
- [ ] T062 [P] Verify all 6 award images render as glowing golden badges in browser — execute AFTER T069 in Phase 8 | —

**Checkpoint**: Covered by Phase 8 T069 + T076 (browser verification)

---

## Phase 8: Scroll Layout Refactor ⚠️ NEW (2026-04-29)

**Context**: Design confirmed as scroll layout (all 6 sections always visible). Current implementation uses tab-panel (hidden attribute, role="tablist"). Full refactor required.

**Goal**: `/awards` is a vertically-scrolling page. Left nav is sticky, uses anchor links, and highlights the section currently in the viewport via `IntersectionObserver` scroll-spy. Tab-panel code removed.

**Independent Test**: Open `/awards` → all 6 category sections visible without clicking → scroll down → left nav item updates automatically → click "Best Manager" in nav → page scrolls to that section, URL becomes `/awards#best-manager`

### Structural Changes

- [x] T063 [US1] Replace `AwardNavMenu` `role="tablist"` container with `role="navigation"` `aria-label="Award categories"` `<nav>` element; make it sticky (`position: sticky; top: var(--header-height)`) | components/awards/AwardNavMenu.tsx
- [x] T064 [US1] Replace each `AwardNavItem` `role="tab"` `<button>` with `<a href="#{slug}">` anchor link; keep existing active/hover/focus styles; add `aria-current="true"` prop when active | components/awards/AwardNavItem.tsx
- [x] T065 [US1] Removed `AwardDetailPanel` component; all 6 `<AwardCategorySection>` elements rendered directly in `AwardsPage` in a `flex flex-col gap-[80px]` wrapper | components/awards/AwardDetailPanel.tsx
- [x] T066 [US1] Added `id={category.slug}`, `scroll-mt-[80px]`, `role="region"`, `aria-labelledby="{slug}-heading"` to `<AwardCategorySection>` outer `<section>` wrapper; `<h2>` has `id="{slug}-heading"` | components/awards/AwardCategorySection.tsx
- [x] T067 [US1] Rewrote `AwardsPage`: removed tab state/hash/isLoading/error/panelHeadingRef/focusedIndex; added `IntersectionObserver` `useEffect` watching all 6 sections with `rootMargin: "-20% 0px -60% 0px"` | components/awards/AwardsPage.tsx

### Section Title Fix (FR-013)

- [x] T068 [US1] Updated `SectionTitle` with optional `mainHeading?: string` prop; renders subtitle (24px white) → main heading (48px gold `#FFEA9E`) → divider when provided; added `awards.mainHeading` i18n key; `AwardsPage` passes both | components/shared/SectionTitle.tsx

### Image + Style Fixes (FR-015, design-style review)

- [x] T069 [US1] Restored `mixBlendMode: "screen"` on award image in `AwardCategorySection` | components/awards/AwardCategorySection.tsx
- [x] T070 [US1] Added `backdropFilter: "blur(32px)"` + `WebkitBackdropFilter` + `borderRadius: "16px"` to content block in `AwardCategorySection` | components/awards/AwardCategorySection.tsx
- [x] T071 [US1] Restructured D.x.2.a: target icon + category name (24px gold `#FFEA9E`) in flex-row; description paragraph (16px white bold, text-justify) below; icons sourced from `public/assets/awards/icons/`; description text preserved from `t('descriptions.{slug}')` | components/awards/AwardCategorySection.tsx

### Smooth Scroll + Reduced Motion (globals.css)

- [x] T077 Add `html { scroll-behavior: smooth; }` to `app/globals.css`; add `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }` override so anchor navigation scrolls smoothly by default but respects the user's motion preference | app/globals.css

### Cleanup

- [x] T072 [P] All tab ARIA removed — `AwardDetailPanel` deleted; `AwardNavItem` rewritten as `<a>` anchor; `AwardNavMenu` rewritten as `<nav role="navigation">`; no `role="tabpanel"` etc. remain | components/awards/
- [x] T073 [P] `panelHeadingRef`, `focusedIndex` removed from `AwardsPage`; `AwardNavMenu` no longer accepts these props | components/awards/AwardsPage.tsx
- [x] T074 [P] `onActivate`, `onFocusChange`, `headingRef` props removed; `AwardNavMenu` now accepts only `categories` + `activeSlug` | components/awards/AwardNavMenu.tsx
- [x] T075 TypeScript check: `npx tsc --noEmit` returns zero errors | —
- [ ] T076 Browser verification: scroll through all 6 sections, confirm nav highlight updates; click each nav item, confirm smooth scroll + URL hash; confirm `prefers-reduced-motion` disables animation; check mobile horizontal tabs still work | —

**Checkpoint**: Full scroll layout — all sections visible, sticky nav with IntersectionObserver scroll-spy, anchor links, smooth scroll with a11y override, section title shows both heading lines, images use screen blend mode

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0**: No external code dependencies — verify assets and shared files exist before writing any component
- **Phase 1**: Depends on Phase 0 completion (types and data files must exist) — BLOCKS Phases 2 and 3
- **Phase 2 (US1)**: Depends on Phase 1 completion; `AwardNavMenu` depends on `AwardNavItem`; `AwardsPage` depends on all Phase 1 + 2 components
- **Phase 3 (US2)**: Depends on Phase 1 completion; hash routing in `AwardsPage` depends on `VALID_AWARD_HASHES` from Phase 0; can run in parallel with Phase 2 on separate files
- **Phase 4 (US3)**: Depends on Phase 2 completion (layout must exist before responsive/i18n work); KudosPromoSection requires Homepage plan Phase 4 to be complete
- **Phase 5**: Depends on all story phases complete
- **Phase 6 (FR-011/FR-012)**: T046–T047 (type changes) must complete before T048–T060; T048–T049 (data) can run in parallel with T050–T055 (components) once types are done

### Within Phase 6

- T046 + T047 (type changes) — sequential, same file; must complete first
- T048 + T049 (data updates) — parallel to T050–T055 once types compile
- T050 + T051 (FR-011 component) — sequential, same file
- T053 + T054 + T055 (FR-012 component) — sequential, same file; can run in parallel with T050–T051 if split across separate PRs
- T052 (AwardDetailPanel prop pass) — depends on T050
- T056 + T057 (i18n) — parallel, can start after T048–T049
- T058 (tsc check) — after T046–T047
- T059 (browser verify) — after T058 + T052 + T055 all complete
- T060 (presentational audit) — after T055

### Parallel Opportunities

- T046 + T047 must be sequential (same file); all others in Phase 6 have parallelism available
- T056 (i18n vi.json) + T057 (i18n en.json) — parallel, different files
- T050–T051 (FR-011) can run alongside T053–T055 (FR-012) on different branches if team allows

---

## Implementation Strategy

### Current State (as of 2026-04-29)

- Phases 0–5: **All tasks complete** ✅
- Phase 6: **14/15 complete** ✅ — T059 (browser verify) pending user action
- Phase 7: **T061 merged into T069** (Phase 8 covers it); T062 deferred to Phase 8 T076
- Phase 8: **0/15 pending** — full scroll layout refactor (T063–T077)

### Phase 8 Execution Order

1. **T077** — `globals.css` smooth scroll (independent; do first as it has no dependencies)
2. **T063** → **T064** — `AwardNavMenu` then `AwardNavItem` (sequential, same feature)
3. **T065** — Delete `AwardDetailPanel` (depends on T063/T064 so nav is already using anchors)
4. **T066** — `AwardCategorySection` id + scroll-margin + region ARIA
5. **T067** — `AwardsPage` `IntersectionObserver` rewrite (depends on T063/T066 for slug sources)
6. **T068** — `SectionTitle` two-line heading (independent; parallel with T063–T067)
7. **T069** + **T070** + **T071** — `AwardCategorySection` image/style/content (sequential, same file; depends on T066)
8. **T072** + **T073** + **T074** — Cleanup (parallel; after T063–T067)
9. **T075** — `npx tsc --noEmit` (after ALL above)
10. **T076** — Browser verification (after T075)

### Phase 6 Execution Order

1. T046 → T047 (update types — blocks everything else)
2. Run `npx tsc --noEmit` to confirm no regressions (T058)
3. T048 + T049 in parallel (data) | T050 + T051 in parallel (FR-011 component)
4. T052 (wire imagePosition into AwardDetailPanel)
5. T053 → T054 → T055 (FR-012 multi-prize)
6. T056 + T057 in parallel (i18n)
7. T059 (browser verification)
8. T060 (presentational audit)

### Key Implementation Notes

- **Scroll layout** (confirmed 2026-04-29): All 6 sections always in DOM and visible. Left nav is sticky anchor links with `IntersectionObserver` scroll-spy — NOT tab-panel.
- `IntersectionObserver` `rootMargin: "-20% 0px -60% 0px"` fires when section top is 20–80% into viewport height — gives natural "active section" feel
- `scroll-behavior: smooth` in `globals.css` handles smooth scrolling; `prefers-reduced-motion` overrides to `auto`
- `scroll-mt-[80px]` on each section prevents the fixed header (80px) from covering the section heading on anchor scroll
- `AwardDetailPanel` is REMOVED in Phase 8 — all sections rendered directly in `AwardsPage`
- `AwardCategorySection` (full detail view) is DISTINCT from `AwardCategoryCard` (Homepage compact grid tile)
- Awards nav font-size is 16px (not 14px as on Homepage)
- **FR-011**: `imagePosition` is a REQUIRED (non-optional) field — TypeScript catches missing values
- **FR-012**: "Hoặc" separator uses `gap-4` as baseline (open Q2 from spec review — refine when confirmed)
- **FR-015**: `mix-blend-mode: screen` on images is REQUIRED — do NOT remove

---

## Notes

- Mark tasks complete as you go: `[x]`
- Commit after each phase or logical group
- If `data/awards.ts` or `types/awards.ts` do not exist, complete Homepage plan Phase 0 first before proceeding
- All href values must be verified against `.momorph/contexts/SCREENFLOW.md` before hardcoding any route paths
- Phase 6 open question: "Hoặc" separator dimensions — use `gap-4` baseline, update when design team confirms (spec review Q2)
