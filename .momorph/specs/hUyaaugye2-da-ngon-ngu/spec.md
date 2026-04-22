# Feature Specification: Đa ngôn ngữ (Language Selector)

**Frame ID**: `hUyaaugye2`
**Frame Name**: `Dropdown-ngôn ngữ`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/hUyaaugye2
**Created**: 2026-04-22
**Status**: Draft

---

## Overview

The Language Selector is a **shared dropdown component** that appears in the header of multiple SSA 2025 screens (Login, Countdown, Homepage, etc.). It allows users to switch the interface language between Vietnamese (VN) and English (EN). This frame documents the dropdown popup specifically — the trigger button is part of the Header component.

**Target users**: All SSA 2025 platform visitors who prefer a non-default language.

**Business context**: The platform serves a multi-lingual audience (Vietnamese and English). Language preference is persisted in a cookie for SSR compatibility.

---

## User Scenarios & Testing

### US1: Switch Display Language [P1]

**As a** user who prefers a different language  
**I want to** open the language dropdown and select my preferred locale  
**So that** all visible text updates to my chosen language and the preference persists

**Why this priority**: Core accessibility requirement; shared component used across all screens.

**Independent Test**: Open any screen with the language selector → click the selector → verify dropdown shows VN and EN options → select EN → verify all visible text changes to English → reload page → verify English is still selected.

#### Acceptance Scenarios

**Scenario 1: Open language dropdown**
- Given: user is on any screen with the language selector in the header
- When: user clicks the language selector button (flag + "VN" / "EN" + chevron)
- Then: the dropdown popup appears showing two options: VN (Vietnamese) and EN (English); currently active locale is highlighted

**Scenario 2: Select Vietnamese (VN)**
- Given: dropdown is open; current locale is EN
- When: user clicks the "VN" option
- Then: dropdown closes; all visible text updates to Vietnamese; locale cookie set to `"vi"`; language selector trigger updates to show VN flag + "VN"

**Scenario 3: Select English (EN)**
- Given: dropdown is open; current locale is VN
- When: user clicks the "EN" option
- Then: dropdown closes; all visible text updates to English; locale cookie set to `"en"`; language selector trigger updates to show EN flag + "EN"

**Scenario 4: Close dropdown without changing language**
- Given: dropdown is open
- When: user clicks outside the dropdown OR presses Escape
- Then: dropdown closes with no change to current locale

**Scenario 5: Active locale is visually highlighted**
- Given: current locale is VN
- When: user opens the dropdown
- Then: VN option has highlighted background (`rgba(255,234,158,0.2)`); EN option has normal dark background

**Scenario 6: Locale persists across page reloads**
- Given: user selected EN locale
- When: user reloads the page or navigates to another screen
- Then: interface remains in English; language selector shows EN flag + "EN"

---

### Edge Cases

- **Cookie unavailable** (private browsing / blocked): Fall back to `localStorage`, then to default locale (VN). Log warning; do not crash.
- **Cookie save failure**: If `document.cookie` write fails silently, locale change still takes effect for the current session (in-memory); user is NOT notified (non-critical failure).
- **Unsupported locale in cookie**: If cookie value is not `"vi"` or `"en"`, reset to `"vi"` (default). Validated via Zod at read time.
- **Keyboard navigation**: Tab to trigger button → Enter/Space opens dropdown → Arrow Up/Down navigates options → Enter selects → Escape closes.
- **Only two locales**: The dropdown MUST NOT show more than VN and EN. Future locales require design approval before adding.
- **SSR/hydration mismatch**: If server renders with `"vi"` but cookie says `"en"` (cookie set after SSR), React hydration MUST NOT flash. Use `suppressHydrationWarning` on locale-dependent text or ensure middleware passes locale to SSR correctly.

---

## UI/UX Requirements

### Component Structure

| ID | Component | Node ID | Kind | Description |
|----|-----------|---------|------|-------------|
| A | Dropdown container | `525:11713` | popup | 215×304px dropdown popup; `#00070C` bg, golden border |
| A.1 | VN option (selected state) | — | option | 108×56px; highlighted bg; VN flag + "VN" text |
| A.2 | EN option (unselected state) | — | option | 110×56px; dark bg; UK flag + "EN" text |

**Visual specs**: See [`design-style.md`](./design-style.md) for exact pixel values, colors, and component states.

### Navigation Flow

- **No route change**: Language selection is an in-page interaction only.
- **Appears in header** of: Login (`/login`), Countdown (`/`), Homepage (`/`, post-launch), Awards (`/awards`), Kudos (`/kudos`), and all screens with a shared header.

### Visual Requirements

- **Dropdown width**: 215px fixed
- **Dropdown height**: 304px (accommodates 2 options with padding)
- **Position**: Anchored below-right of the trigger button
- **Z-index**: Above all page content (modal-like overlay)
- **Animation**: Fade in/out (150ms); scale from trigger origin

### Accessibility Requirements

- **ARIA on trigger button**:
  - `aria-label="Select language"` (or locale-appropriate equivalent)
  - `aria-expanded="true|false"`
  - `aria-haspopup="listbox"`
  - `aria-controls="language-dropdown"`
- **ARIA on dropdown**:
  - `role="listbox"` on container
  - `id="language-dropdown"`
  - Each option: `role="option"` + `aria-selected="true|false"`
- **Focus management**: When dropdown opens, focus moves to the first (or currently selected) option; when it closes (Escape or selection), focus returns to the trigger button
- **Keyboard**: Arrow Up/Down navigates; Enter/Space selects; Escape closes

---

## Data Requirements

### Display Fields

| Field | Source | Notes |
|-------|--------|-------|
| Flag icon | Static asset | `/assets/flags/vn.svg`, `/assets/flags/en.svg` |
| Locale label | Static | "VN" or "EN" |
| Active locale | Cookie `locale` or `localStorage.locale` | Read on mount; write on selection |

### Supported Locales

| Code | Label | Flag |
|------|-------|------|
| `vi` | VN | Vietnam flag |
| `en` | EN | UK / English flag |

---

## API Requirements (Predicted)

No API calls required. Locale is managed client-side via cookie / localStorage with SSR read via Next.js middleware cookie inspection.

| Action | Mechanism |
|--------|-----------|
| Read locale on SSR | Next.js middleware reads `locale` cookie → passes to layout |
| Persist locale | `document.cookie = "locale=en; path=/; max-age=31536000"` |

---

## State Management

### Local Component State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls dropdown visibility |
| `locale` | `"vi" \| "en"` | From cookie/default | Currently selected locale |

### Global State

| State | Source | Notes |
|-------|--------|-------|
| `locale` | Cookie + next-intl context | SSR-safe; shared across all components |

---

## Requirements

### Functional Requirements

- **FR-001**: Language selector MUST display a dropdown with VN and EN options when triggered.
- **FR-002**: Selecting a locale MUST update all visible text labels on the current screen without a full page reload.
- **FR-003**: Selected locale MUST be persisted in a cookie (preferred) or localStorage (fallback) and survive page reload.
- **FR-004**: Currently active locale MUST be visually highlighted in the dropdown.
- **FR-005**: Dropdown MUST close on outside click or Escape key; focus MUST return to trigger.
- **FR-006**: Locale changes MUST propagate to all i18n text via next-intl context update.

### Technical Requirements

- **TR-001**: Implement with next-intl locale switching using **cookie-based locale without route prefix** (preferred — avoids URL structure change). Cookie is read server-side in middleware to set the `next-intl` locale for SSR. Client-side locale changes use `useRouter().refresh()` after cookie write.
- **TR-002**: Locale cookie name: `locale`; value: `"vi"` or `"en"`; `path=/`; `max-age=31536000` (1 year); `SameSite=Lax` (not sensitive data — `Strict` is not required).
- **TR-003**: Component MUST be reusable across all screens (extract as `<LanguageSelector />`).
- **TR-004**: Dropdown overlay MUST trap focus while open (focus trap pattern).
- **TR-005**: SSR default locale: if no `locale` cookie is present, default to `"vi"` both server-side and client-side.
- **TR-006**: All design token values MUST be CSS variables from `app/globals.css` — no hardcoded hex in component files (Constitution Principle II).

---

## Success Criteria

- **SC-001**: Switching between VN and EN updates all visible text labels without a full page reload.
- **SC-002**: Selected locale persists in cookie across browser sessions.
- **SC-003**: Keyboard navigation (Tab → Enter → ArrowDown → Enter) fully controls the dropdown.
- **SC-004**: WCAG 2.1 AA contrast check passes for both option states (selected + unselected).

---

## Out of Scope

- Additional locales beyond VN and EN.
- Automatic locale detection from browser `Accept-Language` header (user must choose explicitly).
- Any locale-specific content other than UI text labels.

---

## Dependencies

- [x] next-intl configured in the project
- [x] Locale messages files: `messages/vi.json` and `messages/en.json`
- [ ] Flag SVG assets in `public/assets/flags/`
- [ ] `<LanguageSelector />` component created and integrated into `<Header />`

---

## Notes

- This frame (`hUyaaugye2`) documents only the **dropdown popup**. The trigger button (flag + locale text + chevron) is part of the Header component (`<Header />`).
- The dropdown is a **shared component** — it must be reused across Login, Countdown, Homepage, and all other screens with a header. Do NOT re-implement per screen.
- Default locale is VN (`vi`). If no cookie is present, render in Vietnamese.
