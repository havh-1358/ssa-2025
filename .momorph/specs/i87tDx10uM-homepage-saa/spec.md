# Feature Specification: Homepage SAA

**Frame ID**: `i87tDx10uM`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
**Created**: 2026-04-22
**Status**: Draft

---

## Overview

The Homepage is the main landing page of SSA 2025, displayed after the pre-launch countdown ends and the platform officially opens. It presents: (1) event key visual + live countdown + CTA buttons, (2) the award system summary, and (3) a Sun* Kudos promo block. Authenticated users see the full page; unauthenticated users see the public landing page and are directed to login for protected actions.

**Target users**: All visitors (authenticated and unauthenticated) accessing the SSA 2025 platform after the official launch date.

**Business context**: First impression of the platform post-launch. Drives users toward: exploring event info, navigating to the award system, and engaging with Sun* Kudos.

---

## User Scenarios & Testing

### US1: View Event Info and Countdown [P1]

**As a** SSA 2025 visitor  
**I want to** see the SAA 2025 key visual, countdown timer, and event description on the homepage  
**So that** I understand what the event is about and how long until it happens

**Why this priority**: Core landing page content — first thing every visitor sees.

**Independent Test**: Navigate to `/` (post-launch) → verify key visual renders, countdown shows correct days/hours/minutes, event info text is visible, and CTA buttons are present.

#### Acceptance Scenarios

**Scenario 1: Full homepage renders on arrival**
- Given: user navigates to `/` after the platform has opened
- When: page loads
- Then: key visual background renders, SAA 2025 brand logo (451×200px) is visible, countdown section shows DAYS/HOURS/MINUTES, event tagline and livestream note are visible

**Scenario 2: Countdown updates in real time**
- Given: user is viewing the homepage
- When: time passes
- Then: countdown values update every 60 seconds without a full page reload

**Scenario 3: CTA button — About SAA 2025**
- Given: user is viewing the hero section
- When: user clicks "About SAA 2025" button
- Then: page smooth-scrolls to the award system section (`#award-system`) on the same page

**Scenario 4: CTA button — Sun* Kudos**
- Given: user is viewing the hero section
- When: user clicks "Sun* Kudos" button
- Then: user is navigated to `/kudos` (the Sun* Kudos page)

---

### US2: Navigate to Platform Sections [P1]

**As a** SSA 2025 visitor  
**I want to** use the top navigation bar to move between main sections  
**So that** I can quickly access Award Information and Sun* Kudos from any scroll position

**Why this priority**: Navigation is always visible; a broken nav breaks the whole site.

**Independent Test**: Scroll the homepage → verify the header stays fixed at top → click each nav link → verify expected navigation occurs.

#### Acceptance Scenarios

**Scenario 1: Active nav item highlighted**
- Given: user is on the homepage
- When: page renders
- Then: "About SAA 2025" nav link is visually marked as active (gold color + bottom underline)

**Scenario 2: Click "Award Information" nav link**
- Given: user is on the homepage
- When: user clicks "Award Information"
- Then: navigates to `/awards` page

**Scenario 3: Click "Sun* Kudos" nav link**
- Given: user is on the homepage
- When: user clicks "Sun* Kudos"
- Then: navigates to `/kudos` page

**Scenario 4: Header is sticky**
- Given: user scrolls down the homepage
- When: the page scrolls past 80px
- Then: the header remains fixed at the top with semi-transparent dark background

**Scenario 5: Mobile hamburger menu opens**
- Given: user is on a viewport < 768px (mobile)
- When: user taps the hamburger menu icon
- Then: a full-width nav drawer or dropdown opens, showing all nav links ("About SAA 2025", "Award Information", "Sun* Kudos") and the language selector; the hamburger icon changes to a close (×) icon; focus is trapped inside the open menu for keyboard users

**Scenario 6: Mobile hamburger menu closes**
- Given: the mobile nav drawer is open
- When: user taps the close (×) icon, taps outside the drawer, or presses Escape
- Then: the drawer closes; focus returns to the hamburger button

---

### US3: Browse Award System Summary [P2]

**As a** SSA 2025 visitor  
**I want to** see an overview of the award categories on the homepage  
**So that** I know what awards are available and feel motivated to participate

**Why this priority**: Key engagement driver; drives clicks to the full Awards page.

**Independent Test**: Scroll to the award system section → verify award category cards render with titles and descriptions.

#### Acceptance Scenarios

**Scenario 1: Award section renders**
- Given: user scrolls to the award system section
- When: section is in viewport
- Then: section title "Hệ thống giải thưởng" renders; award category cards are displayed in a grid

**Scenario 2: Click award card**
- Given: user sees an award category card
- When: user clicks the card
- Then: navigates to `/awards` page (full Award System page)

---

### US4: View Sun* Kudos Promo Block [P3]

**As a** SSA 2025 visitor  
**I want to** see a preview of the Sun* Kudos feature on the homepage  
**So that** I know Kudos exists and am encouraged to send/receive recognition

**Why this priority**: Cross-promote the Kudos feature from the homepage.

**Independent Test**: Scroll to the Kudos promo section → verify it renders with a CTA.

#### Acceptance Scenarios

**Scenario 1: Kudos promo block renders**
- Given: user scrolls to the Sun* Kudos section
- When: section is in viewport
- Then: Sun* Kudos promo block is visible; a CTA button links to `/kudos`

---

### Edge Cases

- **Homepage rendered while platform is still in pre-launch**: Middleware MUST still redirect to countdown screen; homepage MUST never show before `LAUNCH_DATETIME`.
- **Countdown reaches zero on homepage**: If the event start time passes while user is on the homepage, countdown shows `00 00 00` and stops; does not go negative. (Unlike the Countdown Prelaunch screen, no auto-redirect occurs — user is already on the homepage.)
- **Award section API fails**: `awardsError = true`; display a fallback empty state with a retry prompt, not a crash; do not block the rest of the page from rendering.
- **Award section loading**: `awardsLoading = true`; display skeleton cards in the award grid while data loads (client-fetch path); SSR path renders data synchronously.
- **Background image fails**: `#00101A` base color ensures all content remains readable.
- **Mobile nav drawer open during resize**: If user opens the hamburger menu and then resizes to desktop, the drawer MUST close and the desktop nav MUST render in its place.
- **Logo asset missing**: If `saa-2025-logo.png` fails to load, render an `<img alt="SAA 2025">` text fallback so branding context is not lost.

---

## UI/UX Requirements

### Screen Components

| ID | Component | Node ID | Kind | Description |
|----|-----------|---------|------|-------------|
| A | Header | `2167:9091` | nav | 80px sticky; logo + nav links + language selector; semi-transparent bg |
| A.1 | Logo | `I2167:9091;178:1033` | image | MM_MEDIA site logo 52×48px |
| A.2 | Nav Links | `I2167:9091;178:653` | nav | "About SAA 2025" (active), "Award Information", "Sun* Kudos" |
| A.3 | Language Selector | `I2167:9091;186:1601` | button | Shared `<LanguageSelector />` component |
| BG | Background Keyvisual | `2167:9027` | image | 1512×1392px full-bleed BG image with gradient overlay |
| B.1 | Brand Logo | `2788:12911` | image | SAA 2025 logo 451×200px |
| B.2 | Countdown | `2167:9037` | compound | DAYS/HOURS/MINUTES counter; 3 digit blocks 116×128px each |
| B.3 | Event Info | `2167:9053` | text | Event tagline + livestream note |
| B.4 | CTA Buttons | `2167:9062` | buttons | "About SAA 2025" (gold) + "Sun* Kudos" (outlined) |
| C | Award System | `2167:9068` | section | Award category cards grid |
| D | Kudos Promo | `3390:10349` | section | Sun* Kudos promotional block |
| E | Footer | `5001:14800` | footer | Shared footer with copyright |

**Visual specs**: See [`design-style.md`](./design-style.md).

### Navigation Flow

- **From**: `/` (post-launch — platform open, no active pre-launch redirect)
- **From**: `/auth/callback` (successful OAuth login redirects here)
- **From**: Any screen — clicking the header logo navigates to `/`
- **To**: `/awards` — via "Award Information" nav or award card click
- **To**: `/kudos` — via "Sun* Kudos" nav or Kudos promo CTA
- **To**: `/login` — via auth-required action (if unauthenticated)
- **Smooth-scroll**: "About SAA 2025" CTA scrolls to `#award-system` anchor on the same page (no route change)

Source of truth: `.momorph/contexts/SCREENFLOW.md`

### Visual Requirements

- **Responsive**: mobile ≥ 320px, tablet ≥ 768px, desktop ≥ 1280px (Constitution Principle II)
- **Sticky header**: `position: fixed; top: 0; z-index: 100` (Tailwind: `z-[100]`)
- **Background gradient**: `linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)`
- **Next.js Image**: Keyvisual MUST use `<Image priority fill />` for LCP

### Accessibility Requirements

- **WCAG 2.1 AA**: All text on dark backgrounds passes ≥ 4.5:1
- **Nav keyboard**: Tab → nav links → Enter to navigate
- **Hamburger button**: MUST use `aria-label="Open navigation menu"` / `aria-label="Close navigation menu"` and `aria-expanded={isOpen}` to communicate state to screen readers
- **Mobile nav drawer**: When open, focus MUST be trapped inside the drawer; Escape key MUST close it and return focus to the hamburger button
- **Countdown aria-live**: Digit updates announced via `aria-live="polite"`; each digit block wrapper MUST have `aria-label` combining value and unit (e.g., `aria-label="3 days"`)
- **Skip-to-content link**: Provide a visually hidden skip link before the header for keyboard users (href `#main-content`)
- **Logo link**: Header logo anchor MUST have `aria-label="SSA 2025 — go to homepage"` since it is an image-only link

---

## Data Requirements

### Display Fields

| Field | Source | Notes |
|-------|--------|-------|
| Countdown values | `LAUNCH_DATETIME` env var | Days / Hours / Minutes |
| Event tagline | i18n | Static translated text |
| Livestream note | i18n | "Tường thuật trực tiếp qua sóng Livestream" |
| Award categories | API or static data | List of award objects |
| Kudos preview | Static or API | Promo text / images |

---

## API Requirements (Predicted)

| Endpoint / Method | Purpose | Trigger |
|-------------------|---------|---------|
| `GET /api/awards/categories` | Load award category summaries for homepage grid | Page mount |
| `GET /api/kudos/recent?limit=3` | Load recent kudos for promo block (optional) | Page mount |

Countdown is computed client-side from `NEXT_PUBLIC_LAUNCH_DATETIME` env var — no API call needed.

---

## State Management

### Local Component State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `timeRemaining` | `{days, hours, minutes}` | computed | Live countdown; updated every 60s |
| `isExpired` | `boolean` | `false` | Countdown reached zero |
| `awardsData` | `AwardCategory[] \| null` | `null` | Award categories for homepage grid; fetched server-side or via API |
| `awardsLoading` | `boolean` | `true` | True while award categories are being fetched; shows skeleton/loading state in grid (client-fetch path only; SSR renders data synchronously via Suspense) |
| `awardsError` | `boolean` | `false` | True if award categories fail to load; shows fallback empty state |

### Global State

| State | Source | Notes |
|-------|--------|-------|
| `session` | Supabase Auth | Controls auth-gated UI elements |
| `locale` | Cookie / next-intl | Language for all text |

---

## Requirements

### Functional Requirements

- **FR-001**: Homepage MUST render at `/` when the platform is open (post-launch).
- **FR-002**: Countdown MUST display correct DAYS / HOURS / MINUTES and tick every 60s.
- **FR-003**: CTA "About SAA 2025" MUST smooth-scroll to the `#award-system` section on the same page.
- **FR-004**: CTA "Sun* Kudos" MUST navigate to `/kudos`.
- **FR-005**: Header nav links MUST navigate to their respective pages; active link MUST be visually highlighted.
- **FR-006**: Header MUST remain sticky (fixed) at the top during scrolling.
- **FR-007**: Award system section MUST display award categories.
- **FR-008**: Background image MUST degrade gracefully to `#00101A` if it fails to load.
- **FR-009**: All UI text MUST respect the active locale (VN / EN).
- **FR-010**: On viewports < 768px, nav links MUST collapse into a hamburger menu; the menu drawer MUST be keyboard-accessible and support Escape-to-close.

### Technical Requirements

- **TR-001**: Page MUST be server-side rendered (Next.js App Router).
- **TR-002**: Countdown is computed client-side after hydration from `NEXT_PUBLIC_LAUNCH_DATETIME` env var.
- **TR-003**: Middleware MUST redirect to countdown screen if `isPrelaunch = true`.
- **TR-004**: Header component MUST be shared across Homepage, Awards, and Kudos pages.
- **TR-005**: All design token values (colors, spacing, radii) MUST be CSS variables from `app/globals.css`; no hardcoded hex values in component files (Constitution Principle II).
- **TR-006**: "About SAA 2025" CTA MUST use `scrollIntoView({ behavior: 'smooth' })` to scroll to the `#award-system` section. Award card clicks navigate to `/awards` for full detail.
- **TR-007**: Award section data MUST be loaded via a single data source (static JSON or API) — not hardcoded per component.

---

## Success Criteria

- **SC-001**: Homepage renders within 2s LCP on desktop (Lighthouse ≥ 90).
- **SC-002**: Countdown values match server time within ±60s.
- **SC-003**: All nav links navigate to correct pages.
- **SC-004**: WCAG 2.1 AA contrast check passes for all text.

---

## Out of Scope

- User profile / account management on this page.
- Admin controls for event date configuration (separate admin interface).
- Real-time Kudos feed on homepage (promo block is static or cached).

---

## Dependencies

- [x] Countdown Prelaunch screen complete (platform now open)
- [x] Language Selector component implemented
- [ ] `/awards` page and route created
- [ ] `/kudos` page and route created
- [ ] Award categories data available (API or static JSON)
- [ ] SAA 2025 brand logo exported to `public/assets/homepage/saa-2025-logo.png`
