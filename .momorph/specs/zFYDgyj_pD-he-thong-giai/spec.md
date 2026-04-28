# Feature Specification: He Thong Giai (Award System)

**Frame ID**: `zFYDgyj_pD`
**Frame Name**: `He Thong Giai`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
**Created**: 2026-04-22
**Status**: Draft

---

## Overview

The Award System page displays detailed information about all SSA 2025 award categories. It consists of a left navigation menu listing the 6 award categories and a right detail panel showing the selected category's prizes, criteria, and prize amounts. Users can browse all categories via the left nav.

**Target users**: All SSA 2025 participants wanting to understand the award structure and prize amounts.

**Business context**: Motivates participation by clearly presenting what prizes are available. This is a public-facing read-only page.

---

## User Scenarios & Testing

### US1: View Award Category Details [P1]

**As a** SSA 2025 participant  
**I want to** select an award category from the left navigation  
**So that** I can see the prizes, criteria, and prize amounts for that category

**Why this priority**: Core content of the page — without category navigation the page has no function.

**Independent Test**: Navigate to `/awards` → default first category (Top Talent) is selected → detail panel shows Top Talent awards → click "Top Project" → detail panel switches to Top Project content.

#### Acceptance Scenarios

**Scenario 1: Default selected category on page load**
- Given: user navigates to `/awards`
- When: page renders
- Then: "Top Talent" is the default active category in the left nav; its detail panel is displayed on the right

**Scenario 2: Select a different category**
- Given: user is on `/awards`; "Top Talent" is active
- When: user clicks "Top Project" in the left nav
- Then: "Top Project" becomes active (highlighted); its detail panel replaces the previous one on the right; URL updates to `/awards#top-project` for shareable deep links

**Scenario 3: Left nav shows all 6 categories**
- Given: user is on `/awards`
- When: page renders
- Then: left nav displays exactly 6 items: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025, MVP

**Scenario 4: Detail panel shows prize information**
- Given: user selects a category
- When: detail panel renders for that category
- Then: award title, number of recipients, prize amount per recipient, and any special notes are displayed

---

### US2: Browse All Award Categories [P2]

**As a** SSA 2025 participant  
**I want to** click through each category in the left nav  
**So that** I can see each award's details without navigating away

**Why this priority**: Users browsing all awards is the primary interaction pattern.

**Independent Test**: Navigate to `/awards` with "Top Talent" selected → click each of the 6 nav items in sequence → verify each click updates the detail panel → verify all 6 detail panels show correct award content.

#### Acceptance Scenarios

**Scenario 1: All categories are reachable via left nav**
- Given: user is on `/awards`
- When: user clicks each of the 6 left nav items in sequence
- Then: the detail panel updates to show that category's awards for each click; no page reload occurs

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

### Edge Cases

- **Award data from API**: If award data fails to load, show an error state in the detail panel ("Unable to load award information" with a retry CTA) — not a crash.
- **Award data loading (client-side path only)**: While `isLoading=true`, the detail panel MUST show a loading skeleton (not an empty panel). The left nav items are still rendered and clickable.
- **Category not found in URL hash**: If `/awards#invalid` is visited, default to showing "Top Talent".
- **Mobile nav**: Left nav collapses into a horizontal scrollable tab row (no dropdown) on tablet/mobile; `overflow-x: auto`; `flex-nowrap`; individual items remain tappable with ≥ 44px touch target height.

---

## UI/UX Requirements

### Screen Components

| ID | Component | Node ID | Kind | Description |
|----|-----------|---------|------|-------------|
| A | Header | `313:8440` | nav | Shared header; "Award Information" is the active nav link |
| KV | Key Visual | `313:8437` | image | 1440×547px background with gradient overlay |
| T | Section Title | `313:8453` | header | "Sun* Annual Awards 2025" (Montserrat 700 24px) + section divider |
| C | Left Nav Menu | `313:8459` | nav | 6 category items (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025, MVP) |
| D | Detail Panel | `313:8466` | section | Scrollable panel for selected category; shows prize cards |
| D.1 | Top Talent | `313:8467` | section | Top Talent award details + divider; anchor `#top-talent` |
| D.2 | Top Project | `313:8468` | section | Top Project award details; anchor `#top-project` |
| D.3 | Top Project Leader | `313:8469` | section | Top Project Leader details; anchor `#top-project-leader` |
| D.4 | Best Manager | — (Node ID not extracted; follow same structure as D.1–D.3) | section | Best Manager details; anchor `#best-manager` |
| D.5 | Signature 2025 | — (Node ID not extracted; follow same structure as D.1–D.3) | section | Signature 2025 Creator details; anchor `#signature-2025` |
| D.6 | MVP | — (Node ID not extracted; follow same structure as D.1–D.3) | section | MVP details; anchor `#mvp` |
| D1 | Kudos Promo | `335:12023` | section | Sun* Kudos promotional block |
| Footer | Footer | `354:4323` | footer | Shared footer component |

**Award Data** (from design):
| Category | Recipients | Prize per person |
|----------|-----------|-----------------|
| Top Talent | 10 units | 7,000,000 VND |
| Top Project | 2 teams | 15,000,000 VND |
| Top Project Leader | 3 people | 7,000,000 VND |
| Best Manager | 1 person | 10,000,000 VND |
| Signature 2025 Creator | 1 person | 5,000,000 – 8,000,000 VND |
| MVP | 1 person | 15,000,000 VND |

**Visual specs**: See [`design-style.md`](./design-style.md).

### Navigation Flow

- **From**: Homepage (via header nav or CTA button)
- **To**: `/` — via "About SAA 2025" header nav
- **To**: `/kudos` — via "Sun* Kudos" header nav or Kudos promo block CTA

Source of truth: `.momorph/contexts/SCREENFLOW.md`

### Visual Requirements

- **Layout**: Two-column content area: left nav (~178px) + right detail panel (~856px)
- **Dividers**: `rgba(46,57,64,1)` = `#2E3940`, 1px horizontal lines between sections
- **Background**: `#00101A` with keyvisual image at top
- **Nav item active state**: Golden highlight background + gold text (from existing nav button component)
- **Responsive**: mobile ≥ 320px, tablet ≥ 768px, desktop ≥ 1280px; left nav becomes horizontal scrollable tabs on tablet/mobile

### Accessibility Requirements

- **WCAG 2.1 AA**: All text passes ≥ 4.5:1 contrast
- **Left nav keyboard**: Arrow Up/Down to navigate categories; Enter to select; Home moves to first item; End moves to last item
- **Left nav ARIA**: `role="tablist"` on nav container; each item `role="tab"` + `aria-selected` + `aria-controls="{panel-id}"`; detail panel `role="tabpanel"` + `aria-labelledby="{tab-id}"`
- **Section landmarks**: Each award category section MUST have an `id` for anchor navigation and an ARIA landmark
- **Focus management**: When nav item is clicked/selected with keyboard, focus moves to the corresponding detail panel heading

#### Acceptance Scenario — Keyboard Navigation (US1 extension)

**Scenario K1: Arrow key navigation in left nav**
- Given: user focuses any left nav item (e.g., "Top Talent") via Tab key
- When: user presses Arrow Down
- Then: focus moves to the next nav item ("Top Project"); panel does NOT change until Enter is pressed (or changes on Arrow per WAI-ARIA tabs pattern — follow the "automatic activation" variant documented in TR-004)

**Scenario K2: Enter selects focused nav item**
- Given: user has navigated to "Best Manager" via Arrow keys
- When: user presses Enter
- Then: "Best Manager" becomes the active category; its detail panel is shown; focus moves to the "Best Manager" panel heading

---

## Data Requirements

### Display Fields

| Field | Source | Notes |
|-------|--------|-------|
| Award categories list | Static data or CMS | 6 fixed categories |
| Award name | i18n / CMS | Vietnamese + English names |
| Recipient count | Static | Number of winners per category |
| Prize amount | Static | VND amounts |
| Category criteria | Static / CMS | Description of how winners are selected |

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
| `activeCategory` | `string` | `"top-talent"` | Currently selected left nav category |
| `isLoading` | `boolean` | `true` | True while award data is being fetched (client-side path only; SSR renders data synchronously) |
| `error` | `string \| null` | `null` | Error message if award data fetch fails; triggers error UI in detail panel |

> **Note — SSR path**: When award data is a static JSON file imported at build time, `isLoading` and `error` are not needed as client state. Use Next.js App Router `error.tsx` for SSR fetch failures. These states apply when the data is loaded client-side via `GET /api/awards`.

---

## Requirements

### Functional Requirements

- **FR-001**: Page MUST render at `/awards` with all 6 award categories.
- **FR-002**: Left nav MUST allow selecting any category; selected category MUST be visually highlighted.
- **FR-003**: Detail panel MUST update to show the selected category's content when a nav item is clicked.
- **FR-004**: All prize amounts and recipient counts MUST be accurately displayed.
- **FR-005**: "Award Information" nav link in the header MUST be in active state when on this page.
- **FR-006**: Sun* Kudos promo block MUST render and link to `/kudos`.
- **FR-007**: Footer MUST display at the bottom (shared component).
- **FR-008**: All text MUST respect active locale (VN / EN).
- **FR-009**: Left nav MUST support keyboard navigation — Arrow Up/Down to move between category items; Enter to select the focused category.
- **FR-010**: On page load with a valid URL hash (e.g., `/awards#top-project`), the matching category MUST be pre-selected; if the hash is invalid or missing, default to `#top-talent`.

### Technical Requirements

- **TR-001**: Page MUST be server-side rendered (Next.js App Router).
- **TR-002**: Award data MUST be sourced from a single data file or API endpoint (not hardcoded per component). Magic values FORBIDDEN per constitution Principle IV.
- **TR-003**: URL hash MUST update on category selection (e.g., `/awards#top-talent`). Use `router.replace()` with the hash to avoid adding history entries on every click. On page load, if a hash is present, pre-select that category; fallback to "Top Talent" if the hash is invalid.
- **TR-004**: Left nav uses `role="tablist"` + `role="tab"` ARIA pattern (not `role="listbox"`) since the detail panel is shown/hidden, not a form selection.
- **TR-005**: All design token values MUST be CSS variables from `app/globals.css` — no hardcoded hex in component files (Constitution Principle II).

---

## Success Criteria

- **SC-001**: All 6 award categories render with correct names, recipient counts, and prize amounts.
- **SC-002**: Clicking a left nav item updates the active state and shows the correct detail panel content.
- **SC-003**: WCAG 2.1 AA contrast check passes for all text.
- **SC-004**: Page is shareable via `/awards#category` URL anchors.

---

## Out of Scope

- Voting or nominating for awards (separate feature, not on this page).
- Admin editing of award amounts (backend only).
- Historical award data (SSA 2024, etc.).

---

## Dependencies

- [x] Header component with nav active state support
- [x] Language Selector component
- [ ] Award data source defined (static JSON or API)
- [ ] Award category page route created at `app/awards/page.tsx`
- [ ] Vietnamese + English translations for award names and descriptions
