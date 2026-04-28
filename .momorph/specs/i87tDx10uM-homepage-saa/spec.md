# Feature Specification: Homepage SAA

**Frame ID**: `i87tDx10uM`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
**Created**: 2026-04-22
**Status**: Ready
**Last Reviewed**: 2026-04-28

---

## Overview

The Homepage is the main landing page of SSA 2025, displayed after the pre-launch countdown ends and the platform officially opens. It presents: (1) event key visual + countdown + CTA buttons (hero section), (2) "Root Further" event theme story, (3) award system summary (6 categories), (4) Sun* Kudos promo block, and (5) footer. A floating quick-action widget (F) is always visible. Authenticated users additionally see the User Profile button (A.5). Write Kudos requires authentication.

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
- Then: key visual background renders, SAA 2025 brand logo (451×200px) is visible, "Sự kiện sẽ bắt đầu sau" label and countdown DAYS/HOURS/MINUTES are visible (if pre-launch); event info block shows time, venue, and livestream note; CTA buttons are present

**Scenario 2: Countdown updates in real time**
- Given: user is viewing the homepage
- When: time passes
- Then: countdown values update every 60 seconds without a full page reload

**Scenario 3: CTA button — About SAA 2025**
- Given: user is viewing the hero section
- When: user clicks "About SAA 2025" button
- Then: user is navigated to `/awards` (Award System page — spec: `zFYDgyj_pD-he-thong-giai`)

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

### US5: Read Root Further Theme Story [P3]

**As a** SSA 2025 visitor
**I want to** read about the "Root Further" event theme
**So that** I understand the inspiration and meaning behind SAA 2025

**Why this priority**: Brand storytelling — reinforces event identity, not blocking functionality.

**Independent Test**: Scroll to the RF section → verify 3 text blocks and logos render correctly.

#### Acceptance Scenarios

**Scenario 1: RF section renders**
- Given: user scrolls to the Root Further section (between hero and award section)
- When: section is in viewport
- Then: "Root Further" theme logos are visible; opening paragraph, quote, and closing paragraph render in the correct locale

---

### US6: Use Floating Quick-Action Widget [P2]

**As a** SSA 2025 visitor
**I want to** quickly access Write Kudos and SAA Rules from anywhere on the page
**So that** I don't need to scroll to find these actions

**Why this priority**: Persistent shortcut for key actions — affects discoverability of Kudos feature.

**Independent Test**: Scroll anywhere on homepage → verify floating widget visible at right edge → click each button → verify correct navigation.

#### Acceptance Scenarios

**Scenario 1: Widget is always visible**
- Given: user is on the homepage at any scroll position
- When: page renders
- Then: floating widget (F) appears at the right side of the viewport

**Scenario 2a: Write Kudos button — authenticated**
- Given: user is **authenticated** and sees the floating widget
- When: user clicks the pen icon button
- Then: navigates to the Write Kudos flow (spec: `ihQ26W78P2-viet-kudos`)

**Scenario 2b: Write Kudos button — unauthenticated**
- Given: user is **not authenticated** and sees the floating widget
- When: user clicks the pen icon button
- Then: redirects to `/login`

**Scenario 3: SAA Rules button**
- Given: user sees the floating widget
- When: user clicks the Kudos logo icon button
- Then: opens **"Thể lệ" modal overlay** (Figma: `b1Filzi9i6`) showing SAA Kudos rules — does NOT require authentication

---

### Edge Cases

- **Homepage rendered while platform is still in pre-launch**: Middleware MUST still redirect to countdown screen; homepage MUST never show before `LAUNCH_DATETIME`.
- **Countdown reaches zero on homepage**: If the event start time passes while user is on the homepage, countdown shows `00 00 00` and stops; does NOT go negative. **No auto-redirect** — the `CountdownTimer` in `HeroSection` MUST NOT redirect to `/login` (unlike the pre-launch `CountdownPage` which does redirect). The `isLaunched` guard in `HeroSection` prevents rendering `CountdownTimer` entirely once the launch date has passed, eliminating this risk.
- **Award section API fails**: `awardsError = true`; display a fallback empty state with a retry prompt, not a crash; do not block the rest of the page from rendering.
- **Award section loading**: `awardsLoading = true`; display skeleton cards in the award grid while data loads (client-fetch path); SSR path renders data synchronously.
- **Background image fails**: `#00101A` base color ensures all content remains readable.
- **Mobile nav drawer open during resize**: If user opens the hamburger menu and then resizes to desktop, the drawer MUST close and the desktop nav MUST render in its place.
- **Logo asset missing**: If `saa-2025-logo.png` fails to load, render an `<img alt="SAA 2025">` text fallback so branding context is not lost.
- **Floating Widget — Write Kudos unauthenticated**: Clicking Write Kudos (pen icon) when not logged in MUST redirect to `/login`. After successful login, user returns to homepage (not auto-redirected back to write kudos flow).
- **Floating Widget — SAA Rules**: SAA Rules button does NOT require authentication.

---

## UI/UX Requirements

### Screen Components

| ID | Component | Node ID | Kind | Description |
|----|-----------|---------|------|-------------|
| A | Header | `2167:9091` | nav | 80px fixed; 2 groups: Left (Logo+Nav, gap 64px) + Right (Lang+Notif+Profile, gap 16px); `rgba(16,20,23,0.8)` bg; `justify-content: space-between` |
| A.1 | Logo | `I2167:9091;178:1033` | image | `MM_MEDIA_Logo` 52×48px; links to `/`; aria-label `homepage.nav.logoLabel` |
| A.2 | Nav Links Container | `I2167:9091;178:653` | nav | 490×56px; flex row, gap `24px`; contains A.2.1–A.2.3 |
| A.2.1 | Nav: About SAA 2025 | `I2167:9091;186:1579` | nav-item | **Active state** — gold `#FFEA9E`, gold bottom border, text-shadow; `homepage.nav.aboutSaa`; `aria-current="page"` |
| A.2.2 | Nav: Award Information | `I2167:9091;186:1587` | nav-item | Default state — white; hover bg `rgba(255,255,255,0.1)`; `homepage.nav.awardInfo`; navigates to `/awards` |
| A.2.3 | Nav: Sun* Kudos | `I2167:9091;186:1593` | nav-item | Default state — white; hover bg `rgba(255,255,255,0.1)`; `homepage.nav.kudos`; navigates to `/kudos` |
| A.3 | Language Selector | `I2167:9091;186:1696` | button | 108×56px; flag + locale label + chevron; shared `<LanguageSelector />` |
| A.4 | Notification Bell | `I2167:9091;186:2101` | button | 40×40px; `MM_MEDIA_Noti` bell icon; badge dot when unread kudos received; **click action: TBD** |
| A.5 | User Profile Button | `I2167:9091;186:1597` | button | 40×40px; border `#998C5F`; `MM_MEDIA_User Profile` icon; shown when authenticated; click opens **dropdown** (spec: `z4sCl3_Qtk`) with 2 items: "Profile" → profile page, "Logout" → sign out |
| BG | Background Keyvisual | `2167:9027` | image | 1512×1392px full-bleed BG image with gradient overlay |
| B.0 | Coming Soon Label | `2167:9036` | text | `homepage.comingSoon` — shown only when `isLaunched = false` |
| B.1 | Brand Logo | `2788:12911` | image | SAA 2025 logo 451×200px |
| B.2 | Countdown | `2167:9037` | compound | DAYS/HOURS/MINUTES counter; 3 digit blocks; shown only when `isLaunched = false` |
| B.3 | Event Info Block | `2167:9053` | compound | Row 1: "Thời gian: [date]" + "Địa điểm: [venue]"; Row 2: livestream note |
| B.4 | CTA Buttons | `2167:9062` | buttons | "About SAA 2025" (gold primary) + "Sun* Kudos" (outlined secondary) |
| RF | Root Further Theme Section | `3204:10152` | section | Event theme story section; "Root Further" logos + 3 text blocks (opening para, quote, closing para) |
| F | Floating Widget | `5022:15169` | widget | Fixed floating button at right:19px, top:830px; 2 icon buttons: Write Kudos (pen) + SAA Rules (kudos logo); gold glow shadow |
| C | Award System | `2167:9068` | section | "Hệ thống giải thưởng"; 6 award category cards in 3×2 grid |
| C.1 | Award Section Header | `2167:9069` | heading | Supertitle "Sun* annual awards 2025" + divider + main title "Hệ thống giải thưởng" (57px gold) |
| C.2 | Award Cards | `5005:14974` | grid | 6 cards: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025, MVP |
| D1 | Kudos Promo Outer Container | `3390:10349` | section | 1224×500px outer shell; inner group 1120×500px with `#0F0F0F` bg and `border-radius: 16px` |
| D2 | Kudos Content Column | `I3390:10349;313:8419` | compound | Left column 457×408px; flex column gap 32px; contains 3 text elements + D2.1 button row; right side has illustration (264×219px) and Kudos logo (364×72px, "KUDOS" SVN-Gotham 96px `#DBD1C1`) |
| D2.1 | Kudos CTA Button | `I3390:10349;313:8426` | button | 127×56px; gold bg `#FFEA9E`; label `homepage.kudosCtaLabel` ("Chi tiết") + `MM_MEDIA_Up` icon; navigates to `/kudos` |
| E | Footer | `5001:14800` | footer | Logo + 4 nav links + copyright "Bản quyền thuộc về Sun* © 2025" |

**Visual specs**: See [`design-style.md`](./design-style.md).

### Navigation Flow

- **From**: `/` (post-launch — platform open, no active pre-launch redirect)
- **From**: `/auth/callback` (successful OAuth login redirects here)
- **From**: Any screen — clicking the header logo navigates to `/`
- **To**: `/awards` — via "Award Information" nav, award card click, **or CTA "About SAA 2025" button** (B4.1)
- **To**: `/kudos` — via "Sun* Kudos" nav, Kudos promo CTA (D2.1), or CTA "Sun* Kudos" button (B4.2)
- **To**: `/login` — via auth-required action (if unauthenticated)

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

| Field | Component | i18n Key | vi | en |
|-------|-----------|----------|----|----|
| Coming soon label | B.0 | `homepage.comingSoon` | "Sự kiện sẽ bắt đầu sau" | "Event starts in" |
| *(unused)* | — | `homepage.tagline` | "Sự kiện vinh danh nhân tài..." | *(kept in i18n, not rendered on homepage in current design)* |
| Countdown unit — days | B.2 | `countdown.days` | "NGÀY" | "DAYS" |
| Countdown unit — hours | B.2 | `countdown.hours` | "GIỜ" | "HOURS" |
| Countdown unit — minutes | B.2 | `countdown.minutes` | "PHÚT" | "MINUTES" |
| Event time label | B.3 | `homepage.eventTimeLabel` | "Thời gian:" | "Time:" |
| Event date value | B.3 | `homepage.eventDate` | "26/12/2025" | "26/12/2025" |
| Event venue label | B.3 | `homepage.eventVenueLabel` | "Địa điểm:" | "Venue:" |
| Event venue name | B.3 | `homepage.eventVenue` | "Âu Cơ Art Center" | "Au Co Art Center" |
| Livestream note | B.3 | `homepage.livestream` | "Tường thuật trực tiếp qua sóng Livestream" | "Live-streamed online" |
| CTA — About SAA | B.4 | `homepage.ctaAboutSaa` | "Về SAA 2025" | "About SAA 2025" |
| CTA — Sun* Kudos | B.4 | `homepage.ctaKudos` | "Sun* Kudos" | "Sun* Kudos" |
| Award supertitle | C1 | `awards.sectionTitle` | "Sun* Annual Awards 2025" | "Sun* Annual Awards 2025" |
| Award section title | C1 | `homepage.awardSectionTitle` | "Hệ thống giải thưởng" | "Award System" |
| Kudos promo label | D | `homepage.kudosPromoLabel` | "Phong trào ghi nhận" | "Recognition Movement" |
| Kudos feature name | D | `homepage.kudosSectionTitle` | "Sun* Kudos" | "Sun* Kudos" |
| Kudos promo body | D | `homepage.kudosPromoBody` | *(see vi.json)* | *(see en.json)* |
| Kudos CTA button | D | `homepage.kudosCtaLabel` | "Chi tiết" | "Details" |
| Nav — About SAA (active) | A.2.1 | `homepage.nav.aboutSaa` | "Về SAA 2025" | "About SAA 2025" |
| Nav — Award Information | A.2.2 | `homepage.nav.awardInfo` | "Thông tin giải thưởng" | "Award Information" |
| Nav — Sun* Kudos | A.2.3 | `homepage.nav.kudos` | "Sun* Kudos" | "Sun* Kudos" |
| Header logo aria-label | A.1 | `homepage.nav.logoLabel` | "SSA 2025 — về trang chủ" | "SSA 2025 — go to homepage" |
| Hamburger open | A (mobile) | `homepage.nav.openMenu` | "Mở menu điều hướng" | "Open navigation menu" |
| Hamburger close | A (mobile) | `homepage.nav.closeMenu` | "Đóng menu điều hướng" | "Close navigation menu" |
| Award categories (API) | C2 | *(from data source)* | — | Award category data (6 categories) |
| Award card name | C2 | `awards.categories.{slug}` | "Top Talent", "Top Project", ... | Same |
| Award card description | C2 | `awards.descriptions.{slug}` | See vi.json `awards.descriptions` | See en.json `awards.descriptions` |
| Award card CTA | C2 | `awards.ctaLabel` | "Chi tiết" | "Details" |
| RF opening paragraph | RF | `homepage.rootFurtherParagraph1` | *(see vi.json)* | *(see en.json)* |
| RF quote | RF | `homepage.rootFurtherQuote` | `"A tree with deep roots fears no storm"...` | *(see en.json)* |
| RF closing paragraph | RF | `homepage.rootFurtherParagraph2` | *(see vi.json)* | *(see en.json)* |
| Footer nav — About SAA | E | `footer.nav.aboutSaa` | "Về SAA 2025" | "About SAA 2025" |
| Footer nav — Award Info | E | `footer.nav.awardInfo` | "Thông tin giải thưởng" | "Award Information" |
| Footer nav — Kudos | E | `footer.nav.kudos` | "Sun* Kudos" | "Sun* Kudos" |
| Footer nav — General Standards | E | `footer.nav.generalStandards` | "Tiêu chuẩn chung" | "General Standards" |
| Footer copyright | E | `footer.copyright` | "Bản quyền thuộc về Sun* © 2025" | "Copyright belongs to Sun* © 2025" |

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
| `isLaunched` | `boolean` | computed from `LAUNCH_DATETIME` | `true` when current date ≥ launch date; hides B.0 + B.2 (Coming Soon + Countdown) |
| `awardsData` | `AwardCategory[] \| null` | `null` | Award categories for homepage grid; fetched server-side or via API |
| `awardsLoading` | `boolean` | `true` | True while award categories are being fetched; shows skeleton/loading state in grid |
| `awardsError` | `boolean` | `false` | True if award categories fail to load; shows fallback empty state |
| `profileDropdownOpen` | `boolean` | `false` | Controls visibility of A.5 profile dropdown |
| `theLeModalOpen` | `boolean` | `false` | Controls visibility of Thể lệ modal (F widget SAA Rules) |

### Global State

| State | Source | Notes |
|-------|--------|-------|
| `session` | Supabase Auth | Controls auth-gated UI (A.5 User Profile, F Write Kudos auth check) |
| `isAuthenticated` | Derived from `session` | `true` when valid session exists; gates A.5 visibility and F Write Kudos action |
| `locale` | Cookie / next-intl | Language for all text |

---

## Requirements

### Functional Requirements

- **FR-001**: Homepage MUST render at `/` when the platform is open (post-launch).
- **FR-002**: Countdown MUST display correct DAYS / HOURS / MINUTES and tick every 60s — only rendered when `isLaunched = false`.
- **FR-003**: CTA "About SAA 2025" MUST navigate to `/awards` (Award System page).
- **FR-004**: CTA "Sun* Kudos" MUST navigate to `/kudos`.
- **FR-005**: Header nav links MUST navigate to their respective pages; active link MUST be visually highlighted.
- **FR-006**: Header MUST remain sticky (fixed) at the top during scrolling.
- **FR-007**: Award system section MUST display award categories.
- **FR-008**: Background image MUST degrade gracefully to `#00101A` if it fails to load.
- **FR-009**: All UI text MUST respect the active locale (VN / EN).
- **FR-010**: On viewports < 768px, nav links MUST collapse into a hamburger menu; the menu drawer MUST be keyboard-accessible and support Escape-to-close.
- **FR-011**: Root Further theme section MUST render 3 text blocks (opening paragraph, quote, closing paragraph) and theme logos in the correct locale.
- **FR-012**: Floating widget MUST remain visible at the right edge of the viewport at all scroll positions; Write Kudos button requires authentication — redirects to `/login` if unauthenticated, navigates to write kudos flow if authenticated; SAA Rules button opens **Thể lệ modal** (Figma: `b1Filzi9i6`) without auth check.

### Technical Requirements

- **TR-001**: Page MUST be server-side rendered (Next.js App Router).
- **TR-002**: Countdown is computed client-side after hydration from `NEXT_PUBLIC_LAUNCH_DATETIME` env var.
- **TR-003**: Middleware MUST redirect to countdown screen if `isPrelaunch = true`.
- **TR-004**: Header component MUST be shared across Homepage, Awards, and Kudos pages.
- **TR-005**: All design token values (colors, spacing, radii) MUST be CSS variables from `app/globals.css`; no hardcoded hex values in component files (Constitution Principle II).
- **TR-006**: "About SAA 2025" CTA (B4.1) and award card clicks MUST both navigate to `/awards` via `router.push(ROUTES.AWARDS)`.
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
- [x] SAA 2025 brand logo at `public/assets/homepage/saa-2025-logo.png` ✓
- [x] Keyvisual at `public/assets/homepage/keyvisual.jpg` ✓
