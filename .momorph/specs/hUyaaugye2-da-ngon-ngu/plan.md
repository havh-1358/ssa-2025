# Implementation Plan: Language Selector (Shared Component)

**Frame**: `hUyaaugye2-da-ngon-ngu`
**Date**: 2026-04-22
**Spec**: `specs/hUyaaugye2-da-ngon-ngu/spec.md`

---

## Summary

A shared dropdown component that renders in the `<Header />` on every screen. Clicking the trigger cycles between VN (default) and EN locales; the selection is persisted in a `locale` cookie and propagated to all page text via next-intl. No API calls required; all state is cookie + in-memory. The component must be keyboard-navigable and ARIA-compliant (`role="listbox"` + `role="option"`).

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js (App Router)
**Primary Dependencies**: React 19, Tailwind CSS 4, next-intl
**Database**: N/A
**Testing**: Vitest + React Testing Library; Playwright E2E
**State Management**: React `useState` (local); next-intl context (global locale)
**API Style**: N/A (cookie read/write only)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (kebab-case files, PascalCase components)
- [x] Uses approved libraries (next-intl for i18n, Tailwind CSS 4 for styling)
- [x] Adheres to folder structure guidelines (`components/shared/`)
- [x] Meets security requirements (locale cookie is `SameSite=Lax`, not a session token)
- [x] Follows testing standards (unit + E2E planned)

| Requirement | Constitution Rule | Status |
|-------------|-------------------|--------|
| I. Type Safety | Strict TS; Zod validates cookie value on read | ✅ Planned |
| II. Design Fidelity | All tokens from `design-style.md` → CSS vars in `globals.css` | ✅ Planned |
| II. Responsive | Trigger button ≥ 44×44px touch target; dropdown positions correctly on mobile | ✅ Planned |
| II. WCAG 2.1 AA | `role="listbox"`, `aria-expanded`, `aria-selected`, focus trap, Escape closes | ✅ Planned |
| III. Test-First | Tests written before component implementation | ✅ Planned |
| IV. Layered Arch | Component → `useLocale` hook → cookie utility | ✅ Planned |
| IV. Clean Code | Functions ≤ 50 lines; no magic values | ✅ Planned |
| VI. Security | Locale value validated via Zod; cookie is not a secret | ✅ Planned |

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Single `<LanguageSelector />` Client Component containing the trigger button and the dropdown popup. Extracted from the `<Header />` server component as a Client island.
- **Styling Strategy**: Tailwind CSS 4 utility classes mapping to CSS custom properties defined in `app/globals.css`. No inline styles.
- **Data Fetching**: No API. Locale is read from cookie on mount via `useLocale()` hook; written to cookie on selection change. `router.refresh()` triggers next-intl SSR re-render.

### Backend Approach

- **API Design**: N/A — cookie-based locale, no API call.
- **Data Access**: `document.cookie` (write); Next.js middleware reads the same cookie for SSR.
- **Validation**: Zod schema `z.enum(["vi", "en"])` applied on cookie read; falls back to `"vi"` on invalid value.

### Integration Points

- **Existing Services**: next-intl middleware (`middleware.ts`) must read `locale` cookie and set `x-next-intl-locale` header.
- **Shared Components**: `<Header />` — language selector is rendered as a Client island inside the Server Component header.
- **Asset Dependencies**: `/public/assets/flags/vn.svg`, `/public/assets/flags/en.svg` — must be present before component is usable.

---

## Project Structure

### Documentation

```text
.momorph/specs/hUyaaugye2-da-ngon-ngu/
├── spec.md
├── design-style.md
└── plan.md   ← this file
```

### Source Code

```text
app/
├── globals.css                           # Add --color-dropdown-bg, --color-dropdown-border, etc.
└── [layout.tsx]                          # No change; Header already included

components/
└── shared/
    ├── LanguageSelector.tsx              # Client Component — trigger + dropdown popup
    └── LanguageSelector.test.tsx         # Unit tests

hooks/
└── useLocale.ts                          # Read/write locale cookie; return current locale + setter

lib/
└── locale.ts                             # Zod schema, cookie key constant, SUPPORTED_LOCALES

public/
└── assets/
    └── flags/
        ├── vn.svg                        # Vietnam flag
        └── en.svg                        # UK/EN flag

i18n/
└── messages/
    ├── vi.json                           # Vietnamese strings (locale code: vi, display label: VN)
    └── en.json                           # English strings
```

### Modified Files

| File | Change |
|------|--------|
| `app/globals.css` | Add `--color-dropdown-bg`, `--color-dropdown-border`, `--color-option-selected-bg`, `--color-option-hover-bg`, `--color-text-option`, `--color-accent-gold` CSS variables |
| `middleware.ts` | Ensure `locale` cookie is read and forwarded as `x-next-intl-locale` header |
| `components/shared/Header.tsx` | Import and render `<LanguageSelector />` in the right slot. **Note**: `Header.tsx` is created by the Login plan (`GzbNeVGJHz`). This integration step is only needed if Header already exists; otherwise it is wired when the Login plan is executed. |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next-intl` | `^3.x` | Cookie-based locale; SSR-safe i18n |
| `zod` | `^3.x` | Locale cookie value validation |
| `focus-trap-react` | `^10.x` | WCAG-compliant focus trap for open dropdown (spec TR-004) |

---

## Implementation Strategy

### Phase 0: Asset Preparation

- Download VN and EN flag SVG assets (from Figma or open-source icon set) → `public/assets/flags/`
- Verify SVG dimensions render cleanly at 24×16px
- Add CSS variable tokens to `app/globals.css` before any component work

### Phase 1: Foundation (TDD)

1. Write failing tests for `lib/locale.ts` (Zod schema, fallback logic)
2. Implement `lib/locale.ts` — `SUPPORTED_LOCALES`, `parseLocale(cookie)` with Zod
3. Write failing tests for `useLocale.ts` (read cookie, write cookie, invalid value fallback)
4. Implement `useLocale.ts` hook
5. Verify `middleware.ts` correctly reads `locale` cookie and passes locale to next-intl

### Phase 2: Component (US1 — Switch Language)

1. Write failing tests for `<LanguageSelector />` covering all spec scenarios including
   Scenario 7 (full keyboard navigation per spec US1 S7):
   - Renders trigger with current locale flag + text
   - Click trigger opens dropdown
   - **S7 — Tab + Enter/Space**: Tab focus reaches trigger; pressing Enter or Space opens
     dropdown; focus moves to the first option (or currently selected option)
   - **S7 — Arrow Down/Up**: Arrow Down moves focus to next option; Arrow Up moves to
     previous option; wraps at boundary
   - **S7 — Enter selects**: Enter (or Space) on focused option → locale cookie updated
     (`locale=<value>; path=/; max-age=31536000; SameSite=Lax`) → dropdown closes →
     focus returns to trigger button
   - **S7 — Escape closes**: Escape while dropdown is open → dropdown closes with no
     locale change → focus returns to trigger button
   - Click outside closes dropdown (no locale change)
   - Active locale highlighted (`aria-selected="true"` on current option)
   - `aria-expanded="true"` on trigger when open; `aria-expanded="false"` when closed
   - `role="listbox"` on dropdown container; `role="option"` on each option
2. Implement `<LanguageSelector />` to pass all tests.
   Use `focus-trap-react ^10.x` (listed in Dependencies) to implement the focus trap
   for WCAG TR-004 compliance. Activate trap when `isOpen=true`; deactivate on close.
3. Integrate into `<Header />` in the correct slot.
   **Note**: `Header.tsx` is created by the Login plan (`GzbNeVGJHz`). This step ONLY
   imports `<LanguageSelector />` into the existing Header — do not recreate Header.tsx.

### Phase 3: Accessibility & Edge Cases

- Focus trap when open (use `focus-trap-react` or custom implementation)
- `suppressHydrationWarning` on locale-dependent elements if SSR/hydration mismatch occurs
- `localStorage` fallback when cookies are blocked

### Phase 4: Polish

- Animate dropdown: fade + scale (150ms ease-out open, 100ms ease-in close)
- `prefers-reduced-motion` — skip scale, keep fade only
- Verify WCAG 2.1 AA contrast on both states

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SSR hydration mismatch (server VN, client EN) | Medium | Medium | Use `suppressHydrationWarning` + ensure middleware passes locale correctly |
| Cookie blocked (private browsing) | Low | Low | `localStorage` fallback already specced |
| next-intl upgrade breaking cookie API | Low | Medium | Pin next-intl version; test on upgrade |

### Estimated Complexity

- **Frontend**: Low
- **Backend**: N/A
- **Testing**: Low

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: Trigger → dropdown open → option click → dropdown close → page text changes
- [x] **External dependencies**: next-intl context; cookie API
- [ ] **Data layer**: N/A
- [x] **User workflows**: Language switch → reload → language persists

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Click VN/EN option → locale state + cookie updates |
| App ↔ Data Layer | No | N/A |
| Cross-platform | Yes | Touch target ≥ 44px on mobile; dropdown position on small screens |

### Test Environment

- **Environment type**: Local (jsdom for unit tests; Playwright for E2E)
- **Test data strategy**: Mock `document.cookie`; mock `next/navigation` router
- **Isolation approach**: Fresh component mount per test

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| `document.cookie` | Mock/Stub | Avoid real cookie state between tests |
| `next/navigation` (useRouter) | Mock | Control `router.refresh()` call assertions |
| next-intl context | Real (test provider) | Verify actual locale propagation |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Render trigger with default VN locale
   - [ ] Click trigger → dropdown appears with VN highlighted
   - [ ] Click EN → locale changes; cookie set; dropdown closes; text changes to English
   - [ ] Reload page → English persists

2. **Keyboard Navigation — Scenario 7 (spec US1 S7)**
   - [ ] Tab reaches trigger button; Enter or Space opens dropdown
   - [ ] On open: focus moves to first option (or currently selected option)
   - [ ] Arrow Down moves focus to next option; Arrow Up moves to previous option
   - [ ] Enter (or Space) on focused option: selects locale, closes dropdown, focus returns to trigger
   - [ ] Escape: closes dropdown without locale change; focus returns to trigger
   - [ ] Tab while open: focus trapped inside dropdown (focus-trap-react — TR-004)

3. **Error Handling & Edge Cases**
   - [ ] Cookie blocked → falls back to localStorage; no crash
   - [ ] Invalid cookie value → resets to VN
   - [ ] Click outside while open → closes dropdown; no locale change

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `lib/locale.ts` utility | 100% | High |
| `useLocale` hook | 95%+ | High |
| `<LanguageSelector />` component | 90%+ | High |
| E2E locale switch + persist | Key flow | High |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved
- [ ] Flag SVG assets downloaded to `public/assets/flags/`
- [ ] next-intl installed and configured (`i18n.ts`, `middleware.ts`, `messages/`)
- [ ] CSS variable tokens added to `app/globals.css`

### External Dependencies

- next-intl documentation for cookie-based locale (no URL prefix mode)
- Open-source flag SVGs (e.g., flagicons.lipis.dev or similar)

---

## Next Steps

1. Run `/momorph.tasks` to generate task breakdown for this component
2. Download flag assets (Phase 0)
3. Begin TDD cycle with `lib/locale.ts`

---

## Notes

- The `<LanguageSelector />` is a **shared component** — it must work identically on Login, Countdown, Homepage, Awards, and Kudos screens. Do not add screen-specific logic inside it.
- The dropdown popup (`215×304px`) is anchored **below-right** of the trigger. Use `position: absolute` relative to the trigger's containing block in the header.
- This plan covers ONLY the dropdown component. The trigger button's visual integration into each screen's `<Header />` is handled in each screen's plan.
