# Feature Specification: He Thong Giai (Award System)

**Frame ID**: `zFYDgyj_pD`
**Frame Name**: `He Thong Giai`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
**Created**: 2026-04-22
**Status**: Draft

---

## Overview

The Award System page displays all 6 SSA 2025 award categories simultaneously as a vertically-scrolling page. A sticky left navigation menu lists all 6 categories and highlights whichever section is currently in the viewport (scroll-spy). Clicking a nav item smooth-scrolls to that section. Each section shows the award image, description, recipient count, and prize amount(s).

**Target users**: All SSA 2025 participants wanting to understand the award structure and prize amounts.

**Business context**: Motivates participation by clearly presenting what prizes are available. This is a public-facing read-only page.

---

## User Scenarios & Testing

### US1: View Award Category Details [P1]

**As a** SSA 2025 participant  
**I want to** scroll through all award categories on one page  
**So that** I can quickly compare prizes and criteria across all awards

**Why this priority**: Core content of the page — the award details are the primary reason users visit this page.

**Independent Test**: Navigate to `/awards` → all 6 sections visible → "Top Talent" nav item highlighted → scroll down → nav highlight updates as sections enter viewport → click "Top Project" in nav → page scrolls to Top Project section → URL becomes `/awards#top-project`.

#### Acceptance Scenarios

**Scenario 1: All categories visible on page load**
- Given: user navigates to `/awards`
- When: page renders
- Then: all 6 award category sections are visible and scrollable; "Top Talent" section is at the top; left nav shows all 6 items with "Top Talent" highlighted (first section in viewport)

**Scenario 2: Click nav item scrolls to section**
- Given: user is on `/awards`; "Top Talent" section is in view
- When: user clicks "Top Project" in the left nav
- Then: page smooth-scrolls to the "Top Project" section; URL updates to `/awards#top-project`; "Top Project" nav item becomes highlighted

**Scenario 3: Scroll-spy updates active nav item**
- Given: user is on `/awards` and scrolls down manually
- When: the "Best Manager" section enters the viewport
- Then: "Best Manager" nav item becomes highlighted in the left nav automatically (no click required)

**Scenario 4: Each section shows complete prize information**
- Given: user scrolls to any category section
- When: the section is in view
- Then: award title (with target icon), recipient count (with diamond icon), prize amount (with license icon), and sub-label are all displayed

---

### US2: Browse All Award Categories [P2]

**As a** SSA 2025 participant  
**I want to** click through each category in the left nav  
**So that** I can see each award's details without navigating away

**Why this priority**: Users browsing all awards is the primary interaction pattern.

**Independent Test**: Navigate to `/awards` → click each of the 6 nav items in sequence → verify each click smooth-scrolls to the correct section and updates URL hash → verify all 6 sections have correct content.

#### Acceptance Scenarios

**Scenario 1: All categories are reachable via left nav**
- Given: user is on `/awards`
- When: user clicks each of the 6 left nav items in sequence
- Then: page smooth-scrolls to each category section in turn; URL hash updates with each click (e.g., `#top-talent`, `#top-project`); no page reload occurs

---

### US3: Navigate to Other Platform Sections [P2]

**As a** SSA 2025 participant  
**I want to** use the header navigation to go to other pages  
**So that** I can move between Homepage, Awards, and Kudos without losing context

**Why this priority**: Shared navigation consistency across the platform.

**Independent Test**: From `/awards`, click "About SAA 2025" nav → verify redirect to `/`. Click "Sun* Kudos" → verify redirect to `/kudos`.

#### Acceptance Scenarios

**Scenario 1: Active nav item is "Award Information"**
- Given: user is on the Awards page
- When: page renders
- Then: "Award Information" nav link is highlighted with gold color and bottom underline

---

**Scenario 5: Alternating image position**
- Given: user is on `/awards` and all 6 sections are visible
- When: page renders
- Then: Top Talent, Top Project Leader, Signature 2025 show award image on LEFT side; Top Project, Best Manager, MVP show award image on RIGHT side

**Scenario 6: Signature 2025 dual prize display**
- Given: user scrolls to the "Signature 2025" section
- When: the section is visible
- Then: two "Giá trị giải thưởng" blocks are shown — "5.000.000 VNĐ / cho giải cá nhân" and "8.000.000 VNĐ / cho giải tập thể" — separated by an "Hoặc" divider line

---

### Edge Cases

- **Award data (SSR static)**: Data is statically imported at build time — no loading state or API error at runtime. Use Next.js App Router `error.tsx` for unexpected build/render failures.
- **Invalid URL hash**: If `/awards#invalid` is visited, the browser finds no matching `id` attribute and renders the page from the top (showing Top Talent first). No JS fallback required — browser handles this natively.
- **No hash on URL**: `/awards` (no fragment) renders with all sections visible; scroll-spy highlights "Top Talent" as the first section in viewport.
- **Scroll-spy at page bottom**: When the user scrolls past the last section (MVP), "MVP" remains the active nav item until the user scrolls back up.
- **Mobile nav**: Left nav collapses into a horizontal scrollable row (no dropdown) on tablet/mobile; `overflow-x: auto`; `flex-nowrap`; individual items remain tappable with ≥ 44px touch target height; `scroll-snap` optional for better mobile UX.

---

## UI/UX Requirements

### Screen Components

| ID | Component | Node ID | Kind | Description |
|----|-----------|---------|------|-------------|
| A | Header | `313:8440` | nav | Shared header; "Award Information" is the active nav link |
| KV | Key Visual | `313:8437` | image | 1440×547px background with gradient overlay |
| T | Section Title | `313:8453` | header | TWO lines: subtitle "Sun* Annual Awards 2025" (Montserrat 700 24px, white) + main heading "Hệ thống giải thưởng SAA 2025" (Montserrat 700 48px, gold `#FFEA9E`) + section divider |
| C | Left Nav Menu | `313:8459` | nav | 6 category items (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025, MVP) |
| D | Award sections wrapper | `313:8466` | section | Vertical stack of all 6 award category sections — all always visible; `flex flex-col gap-[80px]` |
| D.1 | Top Talent | `313:8467` | section | Top Talent award details + divider; anchor `#top-talent` |
| D.2 | Top Project | `313:8468` | section | Top Project award details; anchor `#top-project` |
| D.3 | Top Project Leader | `313:8469` | section | Top Project Leader details; anchor `#top-project-leader` |
| D.4 | Best Manager | `313:8470` | section | Best Manager details; anchor `#best-manager` |
| D.5 | Signature 2025 | `313:8471` | section | Signature 2025 Creator details; anchor `#signature-2025` |
| D.6 | MVP | `313:8510` | section | MVP details; anchor `#mvp` |
| D1 | Kudos Promo | `335:12023` | section | Sun* Kudos promotional block |
| Footer | Footer | `354:4323` | footer | Shared footer component |

**Award Data** (from design):
| Category | Recipients | Prize per person | Image position |
|----------|-----------|-----------------|----------------|
| Top Talent | 10 Cá nhân | 7.000.000 VNĐ | LEFT |
| Top Project | 02 Tập thể | 15.000.000 VNĐ | RIGHT |
| Top Project Leader | 03 Cá nhân | 7.000.000 VNĐ | LEFT |
| Best Manager | 01 Cá nhân | 10.000.000 VNĐ | RIGHT |
| Signature 2025 Creator | 01 Cá nhân hoặc Tập thể | 5.000.000 (cá nhân) / 8.000.000 (tập thể) VNĐ | LEFT |
| MVP | 01 Cá nhân | 15.000.000 VNĐ | RIGHT |

> **Alternating image position**: Odd-index categories (1, 3, 5) render image on the left; even-index (2, 4, 6) render image on the right. Pass `imagePosition` prop to `<AwardCategorySection />`.

**Visual specs**: See [`design-style.md`](./design-style.md).

### Navigation Flow

- **From**: Homepage (via header nav or CTA button)
- **To**: `/` — via "About SAA 2025" header nav
- **To**: `/kudos` — via "Sun* Kudos" header nav or Kudos promo block CTA

Source of truth: `.momorph/contexts/SCREENFLOW.md`

### Visual Requirements

- **Layout**: Two-column: sticky left nav (178px) + scrollable right content area (856px); all 6 award sections stacked with 80px gap
- **Left nav sticky**: `position: sticky; top: 80px` (below fixed header); aligns with top of first visible section
- **Dividers**: `rgba(46,57,64,1)` = `#2E3940`, 1px horizontal lines between sections
- **Background**: `#00101A` with keyvisual image at top
- **Nav item active state**: `rgba(255,234,158,0.2)` background + `#FFEA9E` text — updated via `IntersectionObserver` scroll-spy
- **Scroll offset**: Each section uses `scroll-margin-top: 80px` so anchor links don't hide content under the fixed header
- **Responsive**: mobile ≥ 320px, tablet ≥ 768px, desktop ≥ 1280px; left nav becomes horizontal scrollable row (not sidebar) on tablet/mobile

### Accessibility Requirements

- **WCAG 2.1 AA**: All text passes ≥ 4.5:1 contrast ratio
- **Left nav ARIA**: `<nav role="navigation" aria-label="Award categories">`; each item is `<a href="#slug">` with `aria-current="true"` when its section is in the viewport (scroll-spy driven)
- **Section landmarks**: Each `<AwardCategorySection>` wrapper MUST have `id="{slug}"` and `role="region"` + `aria-labelledby="{heading-id}"` so screen readers can navigate between sections
- **Section headings**: Each award section heading (`<h2>`) is the accessible name for its `role="region"` landmark
- **Scroll offset**: `scroll-margin-top` (or `scroll-mt` Tailwind) equal to the fixed header height (80px) MUST be applied to each section so anchor navigation doesn't hide content behind the header
- **Keyboard**: Tab moves focus through all nav anchor links in order; Enter/Space activates the anchor (browser default); no custom Arrow key handling

#### Acceptance Scenario — Keyboard Navigation (US1 extension)

**Scenario K1: Tab through left nav items**
- Given: user focuses the left nav via Tab key
- When: user presses Tab repeatedly
- Then: focus moves through each anchor link in order; each link is individually focusable

**Scenario K2: Enter / Space on focused nav item**
- Given: user has tabbed to the "Best Manager" anchor
- When: user presses Enter or Space
- Then: page scrolls to the "Best Manager" section (browser default anchor behavior); URL updates to `/awards#best-manager`

---

## Data Requirements

### Display Fields

| Field | Source | Notes |
|-------|--------|-------|
| Award categories list | Static data or CMS | 6 fixed categories |
| Award name | i18n (`awards.categories.{slug}`) | Vietnamese + English names; displayed 24px gold with target icon |
| Award description | i18n (`awards.descriptions.{slug}`) | Paragraph describing criteria / what winners are honored for; displayed 16px white bold, text-justify, below the category name row |
| Recipient count | Static (`data/awards.ts`) | Number of winners per category; displayed 36px white with diamond icon + unit |
| Prize amount | Static (`data/awards.ts`) | VND amounts; displayed 36px white with license icon + sub-label |
| Prize sub-label | i18n or `prize.subLabel` | "cho mỗi giải thưởng" (default) or individual/team variant for D.5 |

---

## API Requirements (Predicted)

| Endpoint / Method | Purpose | Trigger |
|-------------------|---------|---------|
| `GET /api/awards` | Load all award categories with details | Page mount |

Alternatively, award data can be a static JSON file (`data/awards.json`) if categories and amounts are fixed for the competition duration.

---

## State Management

### Local Component State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `activeSlug` | `string` | `"top-talent"` | Slug of the section currently in the viewport — updated by `IntersectionObserver` scroll-spy |

> **Scroll layout**: Because all sections are always in the DOM, `isLoading` and `error` are not needed as component state for the static data path. Use Next.js App Router `error.tsx` for SSR failures. `activeSlug` is driven purely by scroll position via `IntersectionObserver`, not by user clicks.

---

## Requirements

### Functional Requirements

- **FR-001**: Page MUST render at `/awards` with all 6 award categories.
- **FR-002**: Left nav MUST allow selecting any category; selected category MUST be visually highlighted based on scroll position (scroll-spy active state).
- **FR-003**: ALL 6 award category sections MUST be rendered and visible simultaneously in a vertically-scrolling layout. Clicking a left nav item smooth-scrolls to the corresponding section and updates the URL hash. There is NO tab-panel hide/show — all content is always in the DOM.
- **FR-004**: All prize amounts and recipient counts MUST be accurately displayed.
- **FR-005**: "Award Information" nav link in the header MUST be in active state when on this page.
- **FR-006**: Sun* Kudos promo block MUST render and link to `/kudos`.
- **FR-007**: Footer MUST display at the bottom (shared component).
- **FR-008**: All text MUST respect active locale (VN / EN).
- **FR-013**: Section title block MUST render TWO text elements: subtitle "Sun* Annual Awards 2025" (24px white) AND main heading "Hệ thống giải thưởng SAA 2025" (48px gold `#FFEA9E`) above the `#2E3940` divider line. The awards page `<SectionTitle>` component must be updated to accept and render both strings.
- **FR-014**: Each award category section header row MUST include a target icon (24×24px) to the left of the category name. Each "Số lượng giải thưởng" label row MUST include a diamond icon (24×24px). Each "Giá trị giải thưởng" label row MUST include a license icon (24×24px). Icons are sourced from the MoMorph media library (`MM_MEDIA_Target`, `MM_MEDIA_Diamond`, `MM_MEDIA_License`).
- **FR-015**: Award category images MUST render with `mix-blend-mode: screen` CSS property. The images (`award-{slug}.png`) are pre-designed circular badge PNGs with dark/transparent backgrounds intended for screen blend mode on the `#00101A` dark navy background. Do NOT render them as standard opaque photos.
- **FR-009**: Left nav items are anchor links (`<a href="#slug">`). Keyboard: Tab through items, Enter/Space follows the anchor (browser default). No custom Arrow key handling required for the scroll layout.
- **FR-010**: On page load with a valid URL hash (e.g., `/awards#top-project`), the browser scrolls to that section automatically (native anchor behavior). The scroll-spy highlights the nav item for the section currently in the viewport.
- **FR-011**: Award category sections MUST alternate image position — odd-indexed categories (Top Talent, Top Project Leader, Signature 2025) render the award image on the LEFT; even-indexed (Top Project, Best Manager, MVP) render the image on the RIGHT.
- **FR-012**: The Signature 2025 section MUST display TWO prize tiers (5.000.000 VNĐ individual + 8.000.000 VNĐ team) separated by an "Hoặc" text divider. Each tier shows its own "Giá trị giải thưởng" label, amount, and sub-label ("cho giải cá nhân" / "cho giải tập thể").

### Technical Requirements

- **TR-001**: Page MUST be server-side rendered (Next.js App Router).
- **TR-002**: Award data MUST be sourced from a single data file or API endpoint (not hardcoded per component). Magic values FORBIDDEN per constitution Principle IV.
- **TR-003**: URL hash updates via native anchor links on nav click (browser default behavior). On page load, browser auto-scrolls to the hash section. No `router.replace()` or custom hash logic required for the scroll layout.
- **TR-004**: Left nav uses `role="navigation"` + `aria-label="Award categories"` container. Each nav item is an `<a href="#slug">` anchor link with `aria-current="true"` on the item whose section is currently in the viewport (scroll-spy driven). The old `role="tablist"` / `role="tab"` / `role="tabpanel"` pattern is REMOVED.
- **TR-005**: All design token values MUST be CSS variables from `app/globals.css` — no hardcoded hex in component files (Constitution Principle II).

---

## Success Criteria

- **SC-001**: All 6 award categories render simultaneously with correct names, descriptions, recipient counts, and prize amounts.
- **SC-002**: Clicking a left nav item smooth-scrolls to the correct section; URL hash updates; nav item becomes highlighted.
- **SC-003**: WCAG 2.1 AA contrast check passes for all text.
- **SC-004**: Page is shareable via `/awards#category` deep-link URLs; browser scrolls directly to the correct section on load.
- **SC-005**: Award images render as glowing golden badges (mix-blend-mode: screen) on the dark background.
- **SC-006**: Section title shows both "Sun* Annual Awards 2025" (24px white) and "Hệ thống giải thưởng SAA 2025" (48px gold).

---

## Out of Scope

- Voting or nominating for awards (separate feature, not on this page).
- Admin editing of award amounts (backend only).
- Historical award data (SSA 2024, etc.).

---

## Dependencies

- [x] Header component with nav active state support
- [x] Language Selector component
- [x] Award data source: static `data/awards.ts` with `AWARD_CATEGORIES` and `VALID_AWARD_HASHES`
- [x] Award category page route: `app/awards/page.tsx` (Server Component)
- [x] Vietnamese + English translations in `i18n/messages/vi.json` + `i18n/messages/en.json`
- [x] `types/awards.ts` — `AwardCategory` with `imagePosition`, `AwardPrize` with `subLabel?`
- [ ] Phase 8 scroll-layout refactor complete (T063–T076 in tasks.md)
