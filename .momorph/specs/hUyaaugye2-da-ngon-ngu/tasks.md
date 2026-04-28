# Tasks: Language Selector (Shared Component)

**Frame**: `hUyaaugye2-da-ngon-ngu`
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

**Purpose**: Download and place static assets required before any component work

- [x] T001 Download Vietnam flag SVG asset and place at correct path | public/assets/flags/vn.svg
- [x] T002 [P] Download UK/EN flag SVG asset and place at correct path | public/assets/flags/en.svg
- [x] T003 Verify both flag SVGs render cleanly at 24×16px in browser

**Checkpoint**: Flag assets present in `public/assets/flags/` — component can reference them ✅

---

## Phase 1: Foundation (Blocking Prerequisites)

**Purpose**: Core locale utilities and hook that all component work depends on

**CRITICAL**: No component or integration work can begin until this phase is complete

- [x] T004 Define `SUPPORTED_LOCALES`, `LOCALE_COOKIE_KEY` constant, and Zod schema `z.enum(["vi","en"])` | lib/locale.ts
- [x] T005 Implement `parseLocale(cookieString)` with Zod validation and `"vi"` fallback on invalid value | lib/locale.ts
- [x] T006 Export `LocaleCode` TypeScript type derived from the Zod schema | lib/locale.ts
- [x] T007 Implement `useLocale()` hook — read locale cookie on mount, expose current locale and setter | hooks/useLocale.ts
- [x] T008 Implement cookie write logic inside `useLocale` setter (`path=/; max-age=31536000; SameSite=Lax`) | hooks/useLocale.ts
- [x] T009 Implement `localStorage` fallback inside `useLocale` for when cookies are blocked | hooks/useLocale.ts
- [x] T010 Call `router.refresh()` inside the `useLocale` setter after writing cookie to trigger next-intl SSR re-render | hooks/useLocale.ts
- [x] T011 Verify `middleware.ts` reads `locale` cookie and forwards it as `x-next-intl-locale` header | middleware.ts

**Checkpoint**: `lib/locale.ts` and `hooks/useLocale.ts` are fully implemented — component work can begin ✅

---

## Phase 2: i18n Message Entries

**Purpose**: Add locale-namespaced string keys consumed by the Language Selector

- [x] T012 Add `languageSelector` namespace keys (trigger label, option labels, aria descriptions) to Vietnamese messages | i18n/messages/vi.json
- [x] T013 [P] Add `languageSelector` namespace keys (trigger label, option labels, aria descriptions) to English messages | i18n/messages/en.json

**Checkpoint**: i18n strings available in both locales ✅

---

## Phase 3: CSS Tokens

**Purpose**: Register design-system CSS custom properties before component styling begins

- [x] T014 Add `--color-dropdown-bg` CSS variable to `:root` block | app/globals.css
- [x] T015 [P] Add `--color-dropdown-border` CSS variable to `:root` block | app/globals.css
- [x] T016 [P] Add `--color-option-selected-bg` CSS variable to `:root` block | app/globals.css
- [x] T017 [P] Add `--color-option-hover-bg` CSS variable to `:root` block | app/globals.css
- [x] T018 [P] Add `--color-text-option` CSS variable to `:root` block | app/globals.css
- [x] T019 [P] Add `--color-accent-gold` CSS variable to `:root` block | app/globals.css

**Checkpoint**: All dropdown CSS custom properties defined — component Tailwind utilities can map to them ✅

---

## Phase 4: User Story 1 — Switch Language (Priority: P1) MVP

**Goal**: Render a trigger button showing the current locale flag; open/close the dropdown; select a locale; navigate entirely by keyboard; persist the choice in a cookie.

**Independent Test**: Open the app, click the language trigger, switch from VN to EN, reload — page language stays EN; keyboard navigation (Tab/Enter/Space/Arrow/Escape) works without a mouse.

### Component Structure (US1)

- [x] T020 [US1] Scaffold `<LanguageSelector />` as a `"use client"` Client Component with `isOpen` state and basic trigger button | components/shared/LanguageSelector.tsx
- [x] T021 [US1] Render trigger button with current-locale flag `<img>` and locale text label; apply `≥44×44px` touch target via Tailwind | components/shared/LanguageSelector.tsx
- [x] T022 [US1] Set `aria-haspopup="listbox"` and `aria-expanded={isOpen}` on the trigger button | components/shared/LanguageSelector.tsx
- [x] T023 [US1] Render dropdown popup with `role="listbox"` containing one `role="option"` per supported locale | components/shared/LanguageSelector.tsx
- [x] T024 [US1] Render flag SVG and display label inside each `role="option"` item | components/shared/LanguageSelector.tsx
- [x] T025 [US1] Set `aria-selected="true"` on the option matching the current locale; `aria-selected="false"` on all others | components/shared/LanguageSelector.tsx

### Locale Selection & Cookie Persistence (US1)

- [x] T026 [US1] Wire option click to `useLocale` setter; close dropdown and return focus to trigger after selection | components/shared/LanguageSelector.tsx
- [x] T027 [US1] Implement `suppressHydrationWarning` on locale-dependent display elements to prevent SSR/hydration mismatch | components/shared/LanguageSelector.tsx

### Keyboard Navigation (US1)

- [x] T028 [US1] Handle `Enter` / `Space` on the trigger button to open dropdown and move focus to the current (or first) option | components/shared/LanguageSelector.tsx
- [x] T029 [US1] Handle `ArrowDown` to move focus to the next option (wraps to first at end) | components/shared/LanguageSelector.tsx
- [x] T030 [US1] Handle `ArrowUp` to move focus to the previous option (wraps to last at start) | components/shared/LanguageSelector.tsx
- [x] T031 [US1] Handle `Enter` / `Space` on a focused option to select that locale, close the dropdown, and return focus to trigger | components/shared/LanguageSelector.tsx
- [x] T032 [US1] Handle `Escape` to close the dropdown without locale change and return focus to trigger | components/shared/LanguageSelector.tsx

### Click-Outside Behavior (US1)

- [x] T033 [US1] Attach `mousedown` / `focusout` event listener (or `useOnClickOutside`) to close the dropdown when clicking outside | components/shared/LanguageSelector.tsx

### Focus Trap (US1)

- [x] T034 [US1] Wrap open dropdown with `<FocusTrap>` from `focus-trap-react ^10.x`; activate when `isOpen=true`, deactivate on close (WCAG TR-004) | components/shared/LanguageSelector.tsx

### Header Integration (US1)

- [x] T035 [US1] Import `<LanguageSelector />` and render it in the correct header slot (only if `Header.tsx` already exists from Login plan `GzbNeVGJHz`) | components/shared/Header.tsx

**Checkpoint**: User Story 1 complete — language switching, keyboard navigation, and cookie persistence all functional ✅

---

## Phase 5: Polish & Animations

**Purpose**: Motion and visual refinements; cross-cutting concerns

- [x] T036 Add fade + scale CSS transition on dropdown open (`150ms ease-out`) and close (`100ms ease-in`) using Tailwind `transition` utilities mapped to CSS variables | components/shared/LanguageSelector.tsx
- [x] T037 Apply `@media (prefers-reduced-motion: reduce)` overrides — skip scale animation; keep opacity-only fade | app/globals.css
- [x] T038 Audit `--color-dropdown-bg` and `--color-text-option` values against WCAG 2.1 AA contrast ratio (≥4.5:1) and adjust token values if needed | app/globals.css

**Checkpoint**: All phases complete — Language Selector is production-ready ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0 (Assets)**: No dependencies — start immediately; T001 and T002 are parallel
- **Phase 1 (Foundation)**: Depends on Phase 0 completion — BLOCKS Phases 2–5
- **Phase 2 (i18n)**: Can start in parallel with Phase 3 once Phase 1 is complete; T012 and T013 are parallel
- **Phase 3 (CSS Tokens)**: Can start in parallel with Phase 2 once Phase 1 is complete; T014–T019 are parallel within one file (apply sequentially inside `globals.css` to avoid conflicts)
- **Phase 4 (US1 Component)**: Depends on Phases 1, 2, and 3 being complete
- **Phase 5 (Polish)**: Depends on Phase 4 completion

### Within Phase 4

- T020 (scaffold) must complete before T021–T035
- T021–T025 (render structure) can be implemented together
- T026–T027 (selection logic) depend on T020–T024
- T028–T032 (keyboard handlers) can be implemented in parallel with T026–T027
- T033 (click-outside) can be implemented in parallel with T028–T032
- T034 (focus trap) depends on T020 scaffold; activate/deactivate logic depends on T028–T032
- T035 (Header integration) is independent of T021–T034 but requires `Header.tsx` to already exist

### Parallel Opportunities

- T001 and T002 (flag SVGs) — fully parallel
- T012 and T013 (i18n messages) — fully parallel (different files)
- T014–T019 (CSS tokens) — logically parallel; apply in a single editing pass
- T028–T033 (keyboard and click-outside handlers) — can be implemented simultaneously within the component

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 0 + Phase 1
2. Complete Phase 2 + Phase 3
3. Complete Phase 4 (US1 only)
4. **STOP and VALIDATE**: Smoke-test trigger, dropdown, keyboard nav, cookie persistence
5. Complete Phase 5 (polish)

---

## Notes

- `<LanguageSelector />` is a **shared component** — do not add screen-specific logic inside it
- Dropdown popup (`215×304px`) anchors **below-right** of the trigger using `position: absolute` relative to the header's containing block
- The `Header.tsx` integration step (T035) must only import `<LanguageSelector />` — do not recreate Header.tsx
- Mark tasks complete as you go: `[x]`
- Commit after each phase or logical group
