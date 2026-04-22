# Tasks: Login

**Frame**: `GzbNeVGJHz-login`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path
```

- **[P]**: Can run in parallel (different files, no incomplete-task dependencies)
- **[US1/US2/US3]**: User story this task belongs to (user-story phases only)
- **|**: File path affected by this task

---

## Phase 0: Asset Preparation

**Purpose**: Download all Figma image assets before any component references them

- [ ] T001 [P] Download background key visual (Figma Node 662:14388) | public/assets/auth/images/login-bg.jpg
- [ ] T002 [P] Download MM_MEDIA header logo (Figma Node I662:14391;178:1033;178:1030) | public/assets/auth/logos/mm-media-logo.png
- [ ] T003 [P] Download SAA 2025 brand logo (Figma Node 2939:9548) | public/assets/auth/logos/saa-2025-logo.png

---

## Phase 1: Foundation (Blocking Prerequisites)

**Purpose**: Install dependencies, configure environment, and create shared infrastructure required by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Install production deps: `@supabase/supabase-js @supabase/ssr next-intl zod` | package.json
- [ ] T005 Install dev deps: `vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @playwright/test`; then run `npx playwright install` for browser binaries | package.json
- [ ] T006 Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` | .env.local
- [ ] T007 [P] Create Supabase browser client via `createBrowserClient()` from `@supabase/ssr` (NEXT_PUBLIC_ vars only — never service_role) | lib/supabase/client.ts
- [ ] T008 [P] Create Supabase server client via `createServerClient()` from `@supabase/ssr` with Next.js cookie adapter; mark file server-only | lib/supabase/server.ts
- [ ] T009 Create route constants `ROUTES.LOGIN = '/login'`, `ROUTES.DASHBOARD = '/dashboard'`, `ROUTES.AUTH_CALLBACK = '/auth/callback'` sourced from SCREENFLOW.md | lib/constants/routes.ts
- [ ] T010 Add all Login design tokens from `design-style.md` as CSS custom properties (colors, typography, spacing, border, shadow) | app/globals.css
- [ ] T011 Update layout to load `Montserrat` and `Montserrat_Alternates` via `next/font/google`; expose as `--font-montserrat` and `--font-montserrat-alt` CSS variables | app/layout.tsx
- [ ] T012 Create i18n routing config with `defineRouting({ locales: ['vn', 'en'], defaultLocale: 'vn', localePrefix: 'never' })` | i18n/config.ts
- [ ] T013 Create `getRequestConfig` that reads `requestLocale`, falls back to `routing.defaultLocale`, and loads messages from `i18n/messages/{locale}.json` | i18n/request.ts
- [ ] T014 [P] Create Vietnamese message file with all Login screen strings: tagline, button label, copyright, language label, signing-in text, error message | i18n/messages/vn.json
- [ ] T015 [P] Create English message file with all Login screen strings matching keys in vn.json | i18n/messages/en.json
- [ ] T016 Wrap `next.config.ts` export with `createNextIntlPlugin('./i18n/request.ts')` from `next-intl/plugin`; run `npm run build` to verify the plugin compiles | next.config.ts
- [ ] T017 Add `NextIntlClientProvider` wrapping `{children}` in root layout using `getLocale()` and `getMessages()` from `next-intl/server`; required for `useLocale()` and `useTranslations()` in Client Components | app/layout.tsx
- [ ] T018 Create `middleware.ts` composing Supabase `updateSession` (first) then next-intl `createMiddleware(routing)` (second); export `config.matcher` excluding `_next/static`, `_next/image`, `favicon.ico`, `assets/` | middleware.ts
- [ ] T019 [P] Create Vitest config with `environment: 'jsdom'` and `setupFiles: ['./vitest.setup.ts']` | vitest.config.ts
- [ ] T020 [P] Create Vitest setup file importing `@testing-library/jest-dom` for extended matchers | vitest.setup.ts
- [ ] T021 [P] Create Playwright config with `baseURL: 'http://localhost:3000'` and `projects: [{ name: 'chromium' }]` | playwright.config.ts
- [ ] T022 Create placeholder dashboard Server Component (stub redirect target only; will be replaced by Dashboard spec implementation) | app/dashboard/page.tsx

**Checkpoint**: Foundation ready — all user story implementation can now begin.

---

## Phase 2: User Story 1 — Google Sign-In (Priority: P1) 🎯 MVP

**Goal**: User clicks "LOGIN With Google", completes Google OAuth, and lands on `/dashboard` with a valid HttpOnly session cookie. Unauthenticated access to protected routes redirects to `/login`. Auth provider errors display a non-sensitive message; OAuth cancellation shows no error.

**Independent Test**: Open `/login` without a session → click "LOGIN With Google" → complete Google OAuth → verify redirect to `/dashboard` with active session.

### Tests — US1 (RED phase — write and confirm FAILING before implementation)

- [ ] T023 [P] [US1] Write auth callback unit tests (5 cases): missing `code` → `/login?error=auth_failed`; `error=access_denied` → `/login` with NO error param; `error=<other>` → `/login?error=auth_failed`; valid `code` calls `exchangeCodeForSession` and redirects `/dashboard`; `exchangeCodeForSession` throws → `/login?error=auth_failed` | __tests__/auth/callback.test.ts
- [ ] T024 [P] [US1] Write LoginButton unit tests (4 cases): renders enabled with Google icon and label text; loading state disables button and shows spinner; click calls `signInWithOAuth({ provider: 'google' })`; `aria-busy="true"` when loading, `aria-busy="false"` when idle | __tests__/components/LoginButton.test.tsx
- [ ] T025 [P] [US1] Write ErrorMessage unit tests: renders with `role="alert"` and `aria-live="assertive"`; displays `message` prop text | __tests__/components/ErrorMessage.test.tsx
- [ ] T026 [US1] Write login page integration tests: authenticated session redirects to `/dashboard`; `?error=auth_failed` param causes ErrorMessage to render; no `?error` param → ErrorMessage absent | __tests__/login/page.test.tsx
- [ ] T027 [US1] Write middleware integration test: unauthenticated GET to `/dashboard` responds with redirect to `/login` | __tests__/middleware.test.ts
- [ ] T028 [US1] Write E2E tests: happy path (open `/login` → OAuth → lands on `/dashboard`); cancelled consent (returns to `/login`, no error message visible) | e2e/login.spec.ts

### Implementation — US1 (GREEN phase — make tests pass)

- [ ] T029 [US1] Create auth callback route handler: (1) check `error` param — `access_denied` → redirect `/login` with no error param; other error → redirect `/login?error=auth_failed`; (2) validate `code` present; (3) call `exchangeCodeForSession(code)`; (4) on throw → redirect `/login?error=auth_failed`; (5) on success → redirect `/dashboard` | app/auth/callback/route.ts
- [ ] T030 [P] [US1] Create ErrorMessage component with `role="alert"` and `aria-live="assertive"`; renders `message` prop; no hardcoded colors (use CSS variables) | components/ui/ErrorMessage.tsx
- [ ] T031 [P] [US1] Create KeyVisual component: `<Image priority fill className="object-cover" />` (not `objectFit` prop — removed in Next.js 13); left and bottom gradient overlays as absolutely-positioned divs; parent container `position: relative`; `background-color: var(--color-bg-fallback)` (#00101A) for image load failure | components/background/KeyVisual.tsx
- [ ] T032 [US1] Create LoginButton component: `isLoading` prop controls disabled state and spinner visibility; `onClick` calls `createBrowserClient()` from `lib/supabase/client.ts` then `signInWithOAuth({ provider: 'google', redirectTo: ROUTES.AUTH_CALLBACK })`; `aria-busy` reflects loading; `aria-label="Login with Google"`; prevents double-submission (disabled when `isLoading`) | components/auth/LoginButton.tsx
- [ ] T033 [US1] Create LoginClient shell (`"use client"`): owns `isLoading`, `error` (init from `errorParam` prop), `languageDropdownOpen` state; clears `error` to `null` on each new login attempt; composes KeyVisual, Header placeholder, SAA 2025 logo `<Image>`, tagline text, LoginButton, ErrorMessage (conditional), Footer placeholder | app/login/LoginClient.tsx
- [ ] T034 [US1] Create login Server Component: check session via `lib/supabase/server.ts` → `redirect(ROUTES.DASHBOARD)` if active session; declare `searchParams: Promise<{ error?: string }>` and `await searchParams` (Next.js 15/16 breaking change); pass `errorParam` string to LoginClient | app/login/page.tsx

**Checkpoint**: US1 complete — Google sign-in works end-to-end; unauthenticated redirects enforced; auth errors displayed correctly.

---

## Phase 3: User Story 2 — Language Selector (P2) + User Story 3 — Footer (P3)

**Goal (US2)**: User opens the VN/EN language dropdown and selects a locale; all visible text updates without a full page reload; locale preference persisted in `NEXT_LOCALE` cookie across sessions.

**Goal (US3)**: Footer renders "Bản quyền thuộc về Sun* © 2025" with a `border-top` divider.

**Independent Test (US2)**: Open `/login` → click language selector → select "EN" → verify tagline, button label, and copyright text update to English strings.

**Independent Test (US3)**: Render `/login` → verify footer text and `border-top` divider are visible.

### Tests — US2 + US3 (RED phase — write and confirm FAILING before implementation)

- [ ] T035 [P] [US2] Write LanguageSelector unit tests (5 cases): renders "VN" label and chevron; click opens dropdown showing VN and EN options; selecting EN writes `NEXT_LOCALE=en` cookie and triggers `router.refresh()`; Escape closes dropdown and returns focus to trigger button; outside click closes dropdown | __tests__/components/LanguageSelector.test.tsx
- [ ] T036 [P] [US3] Write Footer unit tests: renders "Bản quyền thuộc về Sun* © 2025"; element has `border-top` styling | __tests__/components/Footer.test.tsx
- [ ] T037 [US2] Write E2E test: click language selector, select EN → tagline and button label update to English; reload page → locale still EN (cookie persisted) | e2e/login.spec.ts

### Implementation — US2 + US3 (GREEN phase)

- [ ] T038 [US2] Create `useLanguage` hook: read locale via `useLocale()` from `next-intl` (read-only); write locale via `document.cookie = 'NEXT_LOCALE=<value>; path=/'` then `startTransition(() => router.refresh())` from `next/navigation`; expose `{ locale, setLocale }` | hooks/useLanguage.ts
- [ ] T039 [US2] Create LanguageSelector component: trigger button with `aria-label="Select language"`, `aria-expanded`, `aria-haspopup="listbox"`; dropdown `role="listbox"`; each option `role="option"` with `aria-selected`; Escape key closes and returns focus to trigger; `useEffect` closes on outside click; integrates `useLanguage` for read/write | components/auth/LanguageSelector.tsx
- [ ] T040 [US2] Create Header component: MM_MEDIA logo `<Image>` (52×48px) + LanguageSelector; 80px height; `background-color: var(--color-bg-header)`; `aria-label` on logo image | components/layout/Header.tsx
- [ ] T041 [P] [US3] Create Footer component: copyright text via `useTranslations()`; `border-top: 1px solid var(--color-border-footer)` | components/layout/Footer.tsx
- [ ] T042 [US2] Replace Header placeholder and Footer placeholder in LoginClient with real Header and Footer components; verify tagline and button label update reactively via `useTranslations()` when locale cookie changes | app/login/LoginClient.tsx

**Checkpoint**: All user stories complete — sign-in, language selector, and footer fully functional.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, responsive design, edge-case handling, security hardening, and final verification

- [ ] T043 [P] Add `prefers-reduced-motion` support: apply `motion-reduce:transform-none motion-reduce:transition-none` Tailwind classes to LoginButton; add `@media (prefers-reduced-motion: reduce)` rule for button scale animation | app/globals.css, components/auth/LoginButton.tsx
- [ ] T044 [P] Add `aria-live="polite"` loading announcement region in LoginClient so screen readers announce "Signing in…" when OAuth initiates | app/login/LoginClient.tsx
- [ ] T045 [P] Apply responsive breakpoint classes per `design-style.md > Responsive Specifications`: mobile (≥320px), tablet (≥768px), desktop (≥1280px) spacing and font size overrides | app/login/LoginClient.tsx, components/auth/LoginButton.tsx, components/layout/Header.tsx
- [ ] T046 [P] Verify touch targets ≥ 44×44px for LoginButton and LanguageSelector on mobile viewport (min-height, min-width via Tailwind or CSS) | components/auth/LoginButton.tsx, components/auth/LanguageSelector.tsx
- [ ] T047 [P] Handle missing `NEXT_PUBLIC_SUPABASE_ANON_KEY`: catch initialization error in LoginButton `onClick`; display user-friendly error message without leaking internal details | components/auth/LoginButton.tsx
- [ ] T048 [P] Handle network error during `signInWithOAuth`: wrap call in try/catch; on throw reset `isLoading` to `false` and call `setError` with user-friendly message; verify error auto-clears on next click | components/auth/LoginButton.tsx
- [ ] T049 [P] Verify keyboard tab order: Language Selector receives focus first, then Login Button; test with Tab key in browser | app/login/LoginClient.tsx
- [ ] T050 Security audit: confirm no session token in `localStorage`, `sessionStorage`, or response body; confirm session cookie has `HttpOnly Secure SameSite=Strict`; confirm `/auth/callback` rejects malformed/missing `code` | app/auth/callback/route.ts
- [ ] T051 Performance: confirm `<Image priority />` is set on background KeyVisual; run Lighthouse against `/login` and confirm LCP is acceptable | components/background/KeyVisual.tsx
- [ ] T052 Final coverage gate: run `vitest --coverage` (target ≥ 80% unit/integration for all source modules); run `npx playwright test` (E2E login flow must be green) | vitest.config.ts, playwright.config.ts

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 0 (Assets)  ──────────────────────────────────────────┐
Phase 1 (Foundation)  ──────────────────────────────────────┤
                                                             ▼
Phase 2 (US1 Google Sign-In)  ──────────────────────────────┤
                                                             ▼
Phase 3 (US2 Language Selector + US3 Footer)  ──────────────┤
                                                             ▼
Phase 4 (Polish)
```

- **Phase 0**: No dependencies — start immediately
- **Phase 1**: No dependencies — start in parallel with Phase 0
- **Phase 2**: Requires Phase 0 + Phase 1 complete
- **Phase 3**: Requires Phase 2 complete
- **Phase 4**: Requires Phase 3 complete

### Within Phase 2 (US1)

- Tests T023–T028 MUST be written and confirmed FAILING before implementation begins
- T023, T024, T025 can run in parallel (different test files)
- T026 runs after T023–T025 (login page test references callback + button behavior)
- T027 runs after T006/T018 (middleware test requires env + middleware file)
- T028 (E2E) runs after T026–T027
- Implementation: T029 is independent; T030 + T031 parallel; T032 after T030; T033 after T032; T034 after T033

### Within Phase 3 (US2 + US3)

- Tests T035, T036 can run in parallel; T037 (E2E) runs after T035
- T038 (useLanguage) before T039 (LanguageSelector uses the hook)
- T039 (LanguageSelector) before T040 (Header composes it)
- T041 (Footer) parallel with T038–T040
- T042 (wire into LoginClient) after T040 and T041

### Parallel Opportunities

| Phase | Parallel Group |
|---|---|
| Phase 0 | T001, T002, T003 |
| Phase 1 | T007 + T008; then T014 + T015; then T019 + T020 + T021 |
| Phase 2 tests | T023 + T024 + T025 simultaneously |
| Phase 2 impl | T030 + T031 simultaneously |
| Phase 3 tests | T035 + T036 simultaneously |
| Phase 3 impl | T041 in parallel with T038 → T039 → T040 chain |
| Phase 4 | T043, T044, T045, T046, T047, T048, T049 simultaneously |

---

## Implementation Strategy

### MVP Scope (Recommended First Delivery)

1. Complete Phase 0 + Phase 1
2. Complete Phase 2 (US1 Google Sign-In only)
3. **STOP and VALIDATE**: open `/login`, click "LOGIN With Google", complete OAuth, verify `/dashboard` redirect, verify no token in localStorage
4. Deploy if ready

### Incremental Delivery

1. Phase 0 + Phase 1 → foundation ready
2. Phase 2 (US1) → Google Sign-In → validate + deploy
3. Phase 3 (US2 + US3) → Language Selector + Footer → validate + deploy
4. Phase 4 (Polish) → Accessibility + Performance → final deploy

---

## Summary

| Phase | Tasks | Key Deliverables |
|---|---|---|
| Phase 0: Assets | T001–T003 | 3 Figma image assets downloaded |
| Phase 1: Foundation | T004–T022 | 19 tasks — deps, env, Supabase clients, routes, tokens, fonts, i18n, middleware, test configs, dashboard stub |
| Phase 2: US1 Sign-In | T023–T034 | 12 tasks — auth callback, LoginButton, ErrorMessage, KeyVisual, LoginClient, login page |
| Phase 3: US2+US3 | T035–T042 | 8 tasks — useLanguage, LanguageSelector, Header, Footer, wire-up |
| Phase 4: Polish | T043–T052 | 10 tasks — a11y, responsive, edge cases, security audit, performance, coverage gate |
| **Total** | **52 tasks** | |

### Parallel Opportunities: 7 identified (see table above)
### MVP Scope: Phase 0 + Phase 1 + Phase 2 (US1 only) = 34 tasks

---

## Notes

- Mark tasks complete as you go: `- [x]`
- Commit after each phase or logical group using format `feat:`, `test:`, or `chore:`
- Run `npm run build` after T016 to verify `createNextIntlPlugin` wrapping compiles before proceeding
- `app/dashboard/page.tsx` (T022) is a stub only — do not implement Dashboard screen logic here
- E2E tests (T028, T037) require a Supabase project with Google OAuth provider enabled; local dev uses `http://localhost:3000/auth/callback` as `redirectTo`
- Error message visual design (inline banner vs toast) is unconfirmed — default to inline banner below login button per plan.md Q5; mark with `TODO(DESIGN)` comment
