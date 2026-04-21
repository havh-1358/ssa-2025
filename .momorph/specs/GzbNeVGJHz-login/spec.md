# Feature Specification: Login

**Frame ID**: `GzbNeVGJHz`
**Frame Name**: `Login`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
**Created**: 2026-04-22
**Status**: Draft

---

## Overview

The Login screen is the authenticated entry gate for the SSA 2025 platform. It presents a
full-screen branded experience that allows existing users to authenticate via Google OAuth
(Supabase Auth). The screen has no email/password form — authentication is exclusively
through "Login with Google". Upon success the user is redirected to the Dashboard.

**Target users**: All SSA 2025 participants and organizers who are not yet authenticated.

**Business context**: SSA 2025 (Sun* Software Academy 2025) is a training/awards platform.
Authentication via Google removes friction for the target audience (tech professionals
already using Google Workspace).

---

## User Scenarios & Testing

### US1: Sign in with Google [P1]

**As a** returning SSA 2025 participant
**I want to** click "LOGIN With Google" and authenticate via my Google account
**So that** I can access the platform dashboard and my personal data

**Why this priority**: Core authentication — the only entry point to the platform.

**Independent Test**: Open `/login` without a session → click "LOGIN With Google" →
complete Google OAuth → verify redirect to `/dashboard` with active session.

#### Acceptance Scenarios

**Scenario 1: Successful Google sign-in**
- Given: user has a Google account and is on the Login screen
- When: user clicks "LOGIN With Google"
- Then: Google OAuth consent screen appears; after approval, Supabase Auth creates a session,
  sets an `HttpOnly` cookie, and redirects the user to `/dashboard`

**Scenario 2: Unauthenticated redirect**
- Given: user navigates to any protected route without a valid session
- When: Next.js middleware detects no session cookie
- Then: user is redirected to `/login`

**Scenario 3: Already authenticated**
- Given: user already has a valid Supabase session
- When: user visits `/login`
- Then: middleware or page detects the active session and redirects to `/dashboard`
  (no login action needed)

**Scenario 4: Google OAuth cancelled or denied**
- Given: user clicked "LOGIN With Google" and Google consent screen appeared
- When: user dismisses/cancels the consent screen
- Then: user is returned to `/login` with no error message visible (no session created)

**Scenario 5: OAuth error from provider**
- Given: Google OAuth returns an error (e.g., account suspended, misconfigured scope)
- When: Supabase Auth callback receives the error
- Then: user is redirected to `/login`; a non-sensitive error toast or inline message
  MUST be displayed (error details MUST NOT be leaked)

**Scenario 6: Loading state while OAuth initiates**
- Given: user clicks "LOGIN With Google"
- When: the OAuth redirect is being prepared (before browser navigates away)
- Then: button enters loading state — disabled, shows spinner in place of Google icon,
  label changes to locale-appropriate "Signing in…" text; no second click is possible

**Scenario 7: First-time Google user (new account)**
- Given: user authenticates with a Google account that has never logged into SSA 2025
- When: Supabase Auth processes the OAuth callback
- Then: Supabase automatically creates a new user record; the user lands on `/dashboard`
  (no separate registration flow is required — Google OAuth is the only sign-up path).
  First-time users go directly to `/dashboard` — no onboarding step.

---

### US2: Switch display language [P2]

**As a** user who prefers a language other than the current interface language
**I want to** click the language selector (VN flag + "VN" + chevron) in the header
**So that** the interface language changes to my preferred locale

**Why this priority**: Accessibility requirement; platform serves a multi-lingual audience.

**Independent Test**: Open `/login` → click language selector → verify a language dropdown
appears and selecting an option changes visible text labels.

#### Acceptance Scenarios

**Scenario 1: Open language dropdown**
- Given: user is on the Login screen, language selector shows "VN"
- When: user clicks the language selector button
- Then: a dropdown with available language options appears

**Scenario 2: Select a different language**
- Given: language dropdown is open showing VN and EN options
- When: user selects "EN"
- Then: dropdown closes; all visible text updates to English (tagline, button label, footer);
  locale preference persisted in cookie so subsequent visits use the same locale

**Scenario 3: Close dropdown without changing**
- Given: dropdown is open
- When: user clicks outside the dropdown or presses Escape
- Then: dropdown closes with no change to the current language

---

### US3: View footer copyright [P3]

**As a** user
**I want to** see the copyright attribution at the bottom of the page
**So that** I am informed of content ownership

**Why this priority**: Legal/branding requirement; no user interaction required.

**Independent Test**: Render `/login` → verify footer text "Bản quyền thuộc về Sun* © 2025"
is visible and the top border divider is present.

#### Acceptance Scenarios

**Scenario 1: Footer renders**
- Given: user is on the Login screen
- When: page loads
- Then: footer at the bottom shows "Bản quyền thuộc về Sun* © 2025" with `border-top: 1px solid #2E3940`

---

### Edge Cases

- **Supabase `ANON_KEY` missing/misconfigured**:
  Page MUST still render; "LOGIN With Google" click MUST show a user-friendly error message,
  not expose the internal error or stack trace.
- **Background key visual image fails to load**:
  Page MUST remain fully functional; gradient overlays and content remain visible
  over the `#00101A` background fallback color.
- **JavaScript disabled**:
  Graceful degradation expected; at minimum the page structure renders (SSR via Next.js).
- **Network error during OAuth initiation**:
  If `signInWithOAuth()` throws a network error before redirect, `isLoading` MUST be reset
  to `false`, button re-enabled, and error message shown.
- **Malformed or missing `code` in `/auth/callback`**:
  Callback route MUST handle missing/invalid `code` parameter by redirecting to `/login`
  with a `?error=auth_failed` query param; Login page MUST display the error message.
- **Session cookie expired mid-session**:
  If user lands on Login with a stale/expired cookie, Supabase middleware detects it,
  clears the cookie, and renders the Login page in unauthenticated state.
- **Error auto-clear**:
  The `error` state MUST be cleared (reset to `null`) when the user clicks "LOGIN With
  Google" again, so stale error messages do not persist across retry attempts.

---

## UI/UX Requirements

### Screen Components

| ID | Component | Node ID | Kind | Description |
|----|-----------|---------|------|-------------|
| C | Background Key Visual | `662:14388` | image | Full-bleed background photo with left + bottom gradient overlays |
| A | Header | `662:14391` | others | 80px bar with site logo and language selector; semi-transparent bg |
| A.1 | Logo | `I662:14391;186:2166` | others | MM_MEDIA site logo (52×48px) |
| A.2 | Language Selector | `I662:14391;186:1601` | button | VN flag + "VN" text + dropdown chevron; triggers locale change |
| B.1 | Key Visual Logo | `662:14395` | others | SAA 2025 brand logo (451×200px cover image) |
| B.2 | Tagline | `662:14753` | others | 2-line intro text in Montserrat 700 |
| B.3 | Login Button | `662:14425` / `662:14426` | button | "LOGIN With Google" — golden yellow CTA; only login method |
| D | Footer | `662:14447` | label | Copyright text with top divider |
| E | Error Message | *(no Figma node — not in design)* | alert | Non-sensitive auth error displayed when OAuth fails; `TODO(DESIGN)`: visual design (toast vs inline) pending confirmation — see Notes |

**Visual specs**: See [`design-style.md`](./design-style.md) for exact pixel values,
colors, typography, and component states.

**Layout diagram**: See ASCII layout in `design-style.md > Layout Structure`.

### Navigation Flow

- **From**: Any protected route (unauthenticated redirect via middleware) → `/login`
- **From**: App launch with no active session → `/login`
- **To**: `/dashboard` — on successful Google OAuth
- **To**: Language dropdown (in-page interaction, no route change)

Source of truth: `.momorph/contexts/SCREENFLOW.md`

### Visual Requirements

- **Responsive breakpoints**: mobile ≥ 320px, tablet ≥ 768px, desktop ≥ 1024px
  (see `design-style.md > Responsive Specifications`)
- **Touch targets**: Login button and language selector MUST be ≥ 44×44px on mobile
- **Background fallback**: If image fails to load, `#00101A` background color ensures content remains readable
- **Animations**: Button hover transitions 150ms ease-in-out (see `design-style.md > Animation`)
- **Next.js Image**: Background key visual MUST use `<Image priority />` for LCP optimization

### Accessibility Requirements

- **WCAG 2.1 AA**: All text on dark background MUST pass contrast ratio ≥ 4.5:1
- **Keyboard navigation**: Tab order MUST be: Language Selector → Login Button
- **ARIA labels**:
  - Language selector button: `aria-label="Select language"` + `aria-expanded` (true/false) + `aria-haspopup="listbox"`
  - Language dropdown options: `role="listbox"` wrapper, each option `role="option"` + `aria-selected`
  - Login button: `aria-label="Login with Google"` + `aria-busy` (true when loading)
  - Login button loading: `aria-live="polite"` region to announce "Signing in…" to screen readers
- **Focus management**: Language dropdown closes on Escape; focus returns to trigger button
- **Reduced motion**: Button scale animation MUST respect `prefers-reduced-motion: reduce`

---

## Data Requirements

### Input Fields

| Field | Type | Validation | Notes |
|-------|------|------------|-------|
| Google OAuth token | Handled by Supabase Auth | Validated server-side by Google | Never touches client storage directly |

No manual input fields exist on this screen. All authentication data flows through the
Supabase Auth Google OAuth provider.

### Display Fields

| Field | Source | Notes |
|-------|--------|-------|
| Tagline text | Static / i18n | "Bắt đầu hành trình của bạn cùng SAA 2025.\nĐăng nhập để khám phá!" |
| Language code label | Locale state | "VN" (default); "EN" when English selected; updates on locale change |
| Copyright text | Static / i18n | "Bản quyền thuộc về Sun* © 2025" |

---

## API Requirements (Predicted)

| Endpoint / Method | Purpose | Trigger |
|-------------------|---------|---------|
| `supabase.auth.signInWithOAuth({ provider: 'google' })` | Initiate Google OAuth flow | "LOGIN With Google" button click |
| `supabase.auth.getSession()` | Check existing session on page load | Page mount (middleware + client) |
| `supabase.auth.exchangeCodeForSession(code)` | Exchange OAuth code for session | `/auth/callback` route handler |
| `GET /auth/callback` (Next.js route) | Handle OAuth redirect from Google | After Google consent |

**Auth callback route**: Must be created at `app/auth/callback/route.ts` per Supabase Auth
Next.js integration. Sets `HttpOnly` session cookie and redirects to `/dashboard`.

---

## State Management

### Local Component State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `isLoading` | `boolean` | `false` | True while OAuth redirect is in progress; resets to `false` on network error |
| `error` | `string \| null` | `null` | Non-sensitive error message; cleared to `null` on each new login attempt; populated from `?error` query param on callback redirect |
| `languageDropdownOpen` | `boolean` | `false` | Controls language dropdown visibility; closes on Escape or outside click |

### Global State

| State | Source | Notes |
|-------|--------|-------|
| `session` | Supabase Auth (`getSession()`) | Source of truth for auth state; set by server via HttpOnly cookie |
| `locale` | Cookie (preferred) or `localStorage` | Current display language preference. Note: locale is NOT a security token — `localStorage` is permitted for this value only. Prefer a cookie so SSR can read it server-side for initial render. |

### Cache Requirements

- Session is managed entirely by Supabase Auth cookies — no custom caching needed.
- Background image SHOULD be cached via Next.js `<Image>` component with `priority` prop.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST render the Login page at `/login` route.
- **FR-002**: System MUST redirect unauthenticated users to `/login` when accessing protected routes.
- **FR-003**: System MUST redirect authenticated users away from `/login` to `/dashboard`.
- **FR-004**: Clicking "LOGIN With Google" MUST initiate Supabase Google OAuth flow.
- **FR-005**: On successful OAuth, system MUST create an `HttpOnly`, `Secure`, `SameSite=Strict`
  session cookie and redirect to `/dashboard`.
- **FR-006**: On OAuth failure, system MUST display a non-sensitive error message at `/login`.
- **FR-007**: Language selector MUST show VN and EN locale options; selecting either MUST update all visible text labels without a full page reload and persist the choice in a cookie.
- **FR-008**: Background image MUST degrade gracefully to `#00101A` if it fails to load.
- **FR-009**: Login button MUST enter loading/disabled state immediately on click and MUST prevent double-submission.
- **FR-010**: Screen reader MUST announce loading state when OAuth redirect is initiated.

### Technical Requirements

- **TR-001**: Page MUST be server-side rendered (Next.js App Router Server Component or SSR).
- **TR-002**: Session token MUST be stored in `HttpOnly` cookie only — `localStorage` is FORBIDDEN
  (Constitution Principle VI, OWASP A07 Identification Failures).
- **TR-003**: Supabase `service_role` key MUST NOT be used or exposed on the client side.
- **TR-004**: All `href` and redirect values MUST be sourced from `SCREENFLOW.md`
  (Constitution Principle II).
- **TR-005**: Page MUST meet WCAG 2.1 AA contrast requirements on all text elements.
- **TR-006**: Auth callback handler (`/auth/callback`) MUST validate the `code` parameter
  before exchange to prevent open redirect vulnerabilities.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `supabase.auth.signInWithOAuth` | — | Google OAuth initiation | Supabase built-in |
| `supabase.auth.exchangeCodeForSession` | — | OAuth code → session | Supabase built-in |
| `/auth/callback` | GET | OAuth redirect handler | New (to be created) |

---

## Success Criteria

- **SC-001**: User completes Google OAuth and lands on `/dashboard` within 3 seconds of consent.
- **SC-002**: No session token appears in `localStorage`, `sessionStorage`, or response body.
- **SC-003**: Unauthenticated access to any protected route redirects to `/login` in < 50ms (middleware).
- **SC-004**: Switching between VN and EN updates all visible text labels without a full page reload; selected locale persists in cookie across browser sessions.
- **SC-005**: WCAG 2.1 AA contrast check passes for all text on the Login screen.

---

## Out of Scope

- Email/password login (not present in design — Google OAuth only).
- "Forgot password" flow (no link visible in this design).
- "Register / Sign up" link (not present in this design; may exist in other screens).
- Social login providers other than Google.
- Admin-specific login paths.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`) — v1.1.0
- [ ] API specifications available (`.momorph/API.yml`) — not yet created
- [ ] Database design completed — not yet created (Supabase manages auth tables)
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`) — partial (Login only)
- [ ] `/auth/callback` route handler created in Next.js `app/` directory
- [ ] Supabase project configured with Google OAuth provider enabled

---

## Notes

- The Login button text in Figma reads **"LOGIN With Google "** (trailing space) — strip the
  trailing space in implementation.
- The screen uses **Google OAuth exclusively** — no email/password form is present. Do not
  add a fallback email form without design approval.
- Language selector currently shows "VN" (Vietnam). Confirmed supported locales: **VN** (Vietnamese) and **EN** (English). Implement with `next-intl` or equivalent; locale stored in cookie for SSR compatibility. Default locale: VN. Additional locales may be added in future without structural changes.
- The brand logo image (`MM_MEDIA_Root Further Logo`) is an asset served from Figma;
  must be exported and placed under `public/assets/auth/logos/saa-2025-logo.png` following
  asset naming conventions (Constitution Principle IV).
- `mms_D_Footer` is a shared component instance — reuse across all screens that include
  the footer rather than re-implementing it.
