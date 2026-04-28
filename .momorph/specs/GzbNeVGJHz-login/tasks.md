# Tasks: Login

**Frame**: `GzbNeVGJHz-login`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (recommended)

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

**Purpose**: Download all Figma image assets before any component references them

- [x] T001 Download background key visual from Figma node `662:14388` | public/assets/auth/images/login-bg.jpg
- [x] T002 [P] Download MM_MEDIA header logo from Figma node `I662:14391;178:1033;178:1030` | public/assets/auth/logos/mm-media-logo.png
- [x] T003 [P] Download SAA 2025 brand logo from Figma node `2939:9548` | public/assets/auth/logos/saa-2025-logo.png

**Checkpoint**: All assets present in `public/assets/auth/` before Phase 1 begins

---

## Phase 1: Foundation (Blocking Prerequisites)

**Purpose**: Install dependencies, configure environment, and create shared infrastructure required by ALL user stories

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Install runtime dependencies: `@supabase/supabase-js @supabase/ssr next-intl zod` | package.json
- [x] T005 Install dev dependencies: `vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @playwright/test`; run `npx playwright install` to download browser binaries | package.json
- [x] T006 Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` placeholder values; document required Supabase dashboard step (add `http://localhost:3000/auth/callback` as allowed OAuth redirect URL) | .env.local
- [x] T007 [P] Create Supabase browser client using `createBrowserClient()` from `@supabase/ssr` (NEXT_PUBLIC_ vars only — never service_role key) | lib/supabase/client.ts
- [x] T008 [P] Create Supabase server client using `createServerClient()` from `@supabase/ssr` with Next.js cookie adapter; mark file server-only | lib/supabase/server.ts
- [x] T009 [P] Create route constants sourced from SCREENFLOW.md: `ROUTES.LOGIN = '/login'`, `ROUTES.HOME = '/'`, `ROUTES.AUTH_CALLBACK = '/auth/callback'` | lib/constants/routes.ts
- [x] T010 Add all Login design tokens from `design-style.md` as CSS custom properties in `:root` (colors, typography, spacing, border, shadow) | app/globals.css
- [x] T011 Update root layout to load `Montserrat` and `Montserrat_Alternates` fonts via `next/font/google`; expose as `--font-montserrat` and `--font-montserrat-alt` CSS variables | app/layout.tsx
- [x] T012 Create i18n routing config: `defineRouting({ locales: ['vi', 'en'], defaultLocale: 'vi', localePrefix: 'never' })` | i18n/config.ts
- [x] T013 Create `getRequestConfig` that reads `requestLocale`, falls back to `routing.defaultLocale`, and dynamically imports messages from `i18n/messages/{locale}.json` | i18n/request.ts
- [x] T014 [P] Create Vietnamese message file with all Login screen strings: tagline, button label, copyright, signing-in state text, error message key (`auth.error`) | i18n/messages/vi.json
- [x] T015 [P] Create English message file with all Login screen strings matching the same keys as `vi.json` | i18n/messages/en.json
- [x] T016 Update `next.config.ts` — wrap existing config with `createNextIntlPlugin('./i18n/request.ts')` from `next-intl/plugin` | next.config.ts
- [x] T017 Update root layout to add `NextIntlClientProvider` wrapping `{children}`, loading `locale` via `getLocale()` and `messages` via `getMessages()` from `next-intl/server` | app/layout.tsx
- [x] T018 Create `middleware.ts` composing Supabase `updateSession` (runs first) then next-intl `createMiddleware(routing)` (runs second); export `config.matcher` excluding `_next/static`, `_next/image`, `favicon.ico`, `assets/` | middleware.ts
- [x] T019 [P] Create Vitest config with `environment: 'jsdom'`, `setupFiles: ['./vitest.setup.ts']`, and `@vitejs/plugin-react` | vitest.config.ts
- [x] T020 [P] Create Vitest setup file importing `@testing-library/jest-dom` for extended matchers | vitest.setup.ts
- [x] T021 [P] Create Playwright config with `baseURL: 'http://localhost:3000'` and `projects: [{ name: 'chromium' }]` | playwright.config.ts
- [x] T022 Create placeholder dashboard Server Component (auth-protected stub only; NOT the post-login redirect target — post-OAuth success redirects to `/`) | app/dashboard/page.tsx

**Checkpoint**: Foundation ready — all user story implementation can now begin

---

## Phase 2: User Story 1 — Google Sign-In (Priority: P1) MVP

**Goal**: Unauthenticated users can sign in with Google OAuth and land on `/` (Homepage); errors are handled gracefully with differentiated access_denied vs auth_failed behaviour

**Independent Test**: Open `/login` without a session → click "LOGIN With Google" → complete Google OAuth → verify redirect to `/` with active session

### Auth Callback Route (US1)

- [x] T023 [US1] Create OAuth callback route handler: (1) check `error` param — `access_denied` → redirect `/login` with NO error param (Scenario 4: user cancelled, no error shown); other non-null error → redirect `/login?error=auth_failed` (Scenario 5); (2) validate `code` is a non-empty string — missing → redirect `/login?error=auth_failed`; (3) call `supabase.auth.exchangeCodeForSession(code)` via server client; (4) on throw → redirect `/login?error=auth_failed`; (5) on success → redirect `ROUTES.HOME` (`/`) | app/auth/callback/route.ts

### Components (US1)

- [x] T024 [US1] Create `LoginButton` component with `isLoading` and `onLoadingChange` props; `onClick` calls `createBrowserClient()` from `lib/supabase/client.ts` then `supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: ROUTES.AUTH_CALLBACK })`; disabled when `isLoading=true` to prevent double-submission; `aria-busy` reflects loading state; Google icon via CDN or inline SVG; `aria-label="Login with Google"` | components/auth/LoginButton.tsx
- [x] T025 [P] [US1] Create `ErrorMessage` component with `message` prop, `role="alert"`, `aria-live="assertive"`; all colors via CSS variables — no hardcoded hex values | components/ui/ErrorMessage.tsx
- [x] T026 [P] [US1] Create `KeyVisual` component: `<Image priority fill className="object-cover" />` (use `className` not deprecated `objectFit` prop); left and bottom gradient overlays as absolutely-positioned divs; parent container `position: relative` with explicit dimensions; `background-color: var(--color-bg-fallback)` (`#00101A`) as CSS fallback when image fails to load | components/background/KeyVisual.tsx

### Client Shell & Page (US1)

- [x] T027 [US1] Create `LoginClient` (`"use client"`): accepts `errorParam: string | null` prop; owns `isLoading` (boolean), `error` (initialised via `useState<string | null>(errorParam)`), and `languageDropdownOpen` (boolean) state; clears `error` to `null` on each new login attempt before `signInWithOAuth` is called; renders `<ErrorMessage message={t('auth.error')} />` (using i18n key — never the raw URL param value) when `error !== null`; composes `KeyVisual`, Header (placeholder for now), SAA 2025 logo `<Image>`, tagline, `LoginButton`, conditional `ErrorMessage`, Footer (placeholder for now) | app/login/LoginClient.tsx
- [x] T028 [US1] Create login Server Component: read session via `lib/supabase/server.ts` → `redirect(ROUTES.HOME)` if active session exists; declare `searchParams: Promise<{ error?: string }>` and `await searchParams` (Next.js 15/16 — `searchParams` is now a Promise); pass `(await searchParams).error ?? null` as `errorParam` to `LoginClient` | app/login/page.tsx

**Checkpoint**: US1 complete — Google Sign-In works end-to-end; access_denied vs auth_failed handled correctly; error message renders only for actual auth failures

---

## Phase 3: User Story 2 — Language Selector (Priority: P2)

**Goal**: Users can switch between VN and EN; locale persists via `locale` cookie (NOT `NEXT_LOCALE`) and survives page refresh

**Independent Test**: Open `/login` → click language selector → select EN → verify all text updates to English; reload page → locale is still EN

### Hook (US2)

- [x] T029 [US2] Create `useLanguage` hook: read current locale via `useLocale()` from `next-intl` (read-only); write locale by setting `document.cookie = 'locale=<value>; path=/; max-age=31536000; SameSite=Lax'` (cookie name is `locale` per `hUyaaugye2` TR-002 — NOT `NEXT_LOCALE`); call `startTransition(() => router.refresh())` from `next/navigation` after setting cookie; expose `{ locale, setLocale }` | hooks/useLanguage.ts

### Components (US2)

- [x] T030 [US2] Import `<LanguageSelector />` from `components/shared/LanguageSelector.tsx` (created by Language Selector plan `hUyaaugye2`); if that plan has not been executed yet, implement it here: VN/EN toggle, dropdown with `role="listbox"`, each option `role="option"`, Escape key closes and returns focus to trigger button, outside-click closes via `useEffect`, integrates `useLanguage` for read/write | components/shared/LanguageSelector.tsx
- [x] T031 [US2] Create shared `Header` component: MM_MEDIA logo `<Image>` + `<LanguageSelector />`; `80px` height; `background-color: var(--color-bg-header)`; accessible `alt` text on logo | components/shared/Header.tsx
- [x] T032 [US2] Replace Header placeholder in `LoginClient` with real `<Header />`; wire `useLanguage` locale state so `LoginClient` re-renders with new translations when locale cookie changes | app/login/LoginClient.tsx

**Checkpoint**: US1 + US2 complete — language switching works; locale persists on refresh

---

## Phase 4: User Story 3 — Footer (Priority: P3)

**Goal**: Copyright footer with top-border divider renders at the bottom of the login page

**Independent Test**: Render `/login` → verify footer displays correct copyright text and has a `border-top` divider

### Component (US3)

- [x] T033 [US3] Create shared `Footer` component: copyright text via `useTranslations()` ("Bản quyền thuộc về Sun* © 2025" / "Copyright belongs to Sun* © 2025"); `border-top: 1px solid var(--color-border-footer)` | components/shared/Footer.tsx
- [x] T034 [US3] Replace Footer placeholder in `LoginClient` with real `<Footer />` | app/login/LoginClient.tsx

**Checkpoint**: All three user stories complete

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, responsive design, error edge cases, security hardening, and final verification

- [x] T035 [P] Add `prefers-reduced-motion` support: apply `motion-reduce:transform-none motion-reduce:transition-none` Tailwind classes to `LoginButton`; ensure button scale/transition animation is suppressed when user prefers reduced motion | components/auth/LoginButton.tsx
- [x] T036 [P] Add `aria-live="polite"` loading announcement region in `LoginClient` so screen readers announce signing-in state when OAuth initiates | app/login/LoginClient.tsx
- [x] T037 Responsive pass: apply mobile (≥320px) and tablet (≥768px) spacing and font-size overrides per `design-style.md > Responsive Specifications`; verify 44×44px minimum touch targets on `LoginButton` and `LanguageSelector` | app/login/LoginClient.tsx
- [x] T038 [P] Responsive adjustments for `KeyVisual` background and gradient overlays at mobile and tablet breakpoints | components/background/KeyVisual.tsx
- [x] T039 [P] Handle missing `NEXT_PUBLIC_SUPABASE_ANON_KEY`: catch client initialization error in `LoginButton` `onClick`; surface user-friendly error message without leaking internal details | components/auth/LoginButton.tsx
- [x] T040 [P] Handle network error during `signInWithOAuth`: wrap call in try/catch; on throw reset `isLoading` to `false` and call `setError` with user-friendly message; verify error auto-clears on the next click | components/auth/LoginButton.tsx
- [x] T041 [P] Verify keyboard tab order: Language Selector receives focus before Login Button; verify with Tab key navigation | app/login/LoginClient.tsx
- [x] T042 Security hardening — verify no session token is stored in `localStorage` or `sessionStorage`; confirm Supabase session cookie has `HttpOnly`, `Secure`, `SameSite=Strict` attributes set by `@supabase/ssr` | app/auth/callback/route.ts
- [x] T043 [P] Security hardening — confirm `/auth/callback` rejects malformed `code` values (empty string, whitespace-only); validate `code` is a non-empty string before passing to `exchangeCodeForSession` | app/auth/callback/route.ts
- [x] T044 [P] Performance — verify `<Image priority />` attribute is present on `KeyVisual` background for LCP optimisation; confirm no deprecated `objectFit` prop usage | components/background/KeyVisual.tsx
- [x] T045 Final code quality pass — verify no `console.log` statements remain; confirm all colour/spacing values in component files use CSS variables (no hardcoded hex); verify all functions ≤50 lines and all files ≤800 lines | app/login/LoginClient.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0 (Assets)**: No dependencies — start immediately
- **Phase 1 (Foundation)**: No dependencies — can run in parallel with Phase 0; BLOCKS all story phases
- **Phase 2 (US1)**: Requires Phase 0 + Phase 1 complete — highest priority, implement first
- **Phase 3 (US2)**: Requires Phase 1 complete; coordinate with Phase 2 on `LoginClient.tsx`
- **Phase 4 (US3)**: Requires Phase 1 complete; coordinate with Phase 3 on `LoginClient.tsx`
- **Phase 5 (Polish)**: Requires all story phases complete

### Within Phase 1

- T004 (runtime deps) must complete before T007, T008, T009
- T012 (`i18n/config.ts`) must complete before T013 (`i18n/request.ts`)
- T016 (`next.config.ts`) and T017 (`layout.tsx`) can run in parallel after T013
- T018 (`middleware.ts`) requires T007, T008 (Supabase clients) and T012 (i18n config)
- T019, T020, T021 (test configs) can run in parallel after T005

### Within Phase 2 (US1)

- T023 (callback route) requires T008 (server client) and T009 (route constants)
- T024 (LoginButton) requires T007 (browser client) and T009 (route constants)
- T025 (ErrorMessage) and T026 (KeyVisual) are independent — parallel with T024
- T027 (LoginClient) requires T024, T025, T026
- T028 (login page) requires T027 and T008

### Within Phase 3 (US2)

- T029 (useLanguage) requires T012 (i18n config)
- T030 (LanguageSelector) requires T029
- T031 (Header) requires T030
- T032 (wire into LoginClient) requires T031 and T027

### Within Phase 4 (US3)

- T033 (Footer) is independent — can start after Phase 1 completes
- T034 (integrate Footer into LoginClient) requires T033 and T027

### Parallel Opportunities

| Phase | Parallel Group |
|---|---|
| Phase 0 | T001, T002, T003 |
| Phase 1 | T007 + T008 + T009 (after T004); T014 + T015 (after T012); T019 + T020 + T021 (after T005) |
| Phase 2 | T024 + T025 + T026 simultaneously (independent components) |
| Phase 3 | T033 (Footer) in parallel with T029 → T030 → T031 chain |
| Phase 5 | T035, T036, T038, T039, T040, T041, T043, T044 simultaneously |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 0 + Phase 1
2. Complete Phase 2 (US1 — Google Sign-In only)
3. **STOP and VALIDATE**: visit `/login`, click "LOGIN With Google", complete OAuth, verify redirect to `/`, verify no session token in localStorage
4. Continue with Phase 3 → Phase 4 → Phase 5

### Incremental Delivery

1. Phase 0 + Phase 1 → verify dev server starts clean
2. Phase 2 (US1) → Google Sign-In end-to-end → validate error scenarios manually
3. Phase 3 (US2) → language switching → verify cookie persistence on refresh
4. Phase 4 (US3) → footer renders → verify text and border
5. Phase 5 → accessibility + security + responsive → final quality pass

---

## Summary

| Phase | Tasks | Key Deliverables |
|---|---|---|
| Phase 0: Assets | T001–T003 | 3 Figma image assets in `public/assets/auth/` |
| Phase 1: Foundation | T004–T022 | 19 tasks — deps, env, Supabase clients, route constants, design tokens, fonts, i18n, middleware, test configs, dashboard stub |
| Phase 2: US1 Sign-In | T023–T028 | 6 tasks — auth callback route, LoginButton, ErrorMessage, KeyVisual, LoginClient, login page |
| Phase 3: US2 Language Selector | T029–T032 | 4 tasks — useLanguage hook, LanguageSelector, Header, wire-up |
| Phase 4: US3 Footer | T033–T034 | 2 tasks — Footer component, integrate into LoginClient |
| Phase 5: Polish | T035–T045 | 11 tasks — a11y, responsive, edge cases, security, performance, code quality |
| **Total** | **45 tasks** | |

### MVP Scope: Phase 0 + Phase 1 + Phase 2 = 28 tasks

---

## Notes

- Cookie name is `locale` — NOT `NEXT_LOCALE` (authoritative per `hUyaaugye2` TR-002)
- Post-OAuth success redirect is `/` (Homepage) — NOT `/dashboard`
- `access_denied` (user cancelled Google consent) → redirect `/login` with NO `?error` param — no error message shown (Scenario 4)
- Other OAuth errors → redirect `/login?error=auth_failed` — error message shown (Scenario 5)
- `LoginClient` accepts `errorParam: string | null` from the server component; initialises `error` state from this prop via `useState<string | null>(errorParam)`
- `searchParams` in Next.js 15/16 is `Promise<{ error?: string }>` — must `await` it in the page Server Component
- `lib/supabase/server.ts` MUST only be imported in Server Components and Route Handlers — never in client-bundled files
- Supabase `updateSession` middleware runs BEFORE `next-intl` middleware in `middleware.ts` (order matters)
- `<Image>` component: use `className="object-cover"` — the `objectFit` prop was removed in Next.js 13
- `LanguageSelector` is owned by Language Selector plan (`hUyaaugye2`); import from `components/shared/` — do NOT create a duplicate in `components/auth/`
- Mark tasks complete as you go: `- [x]`
- Commit after each phase or logical group using `feat:`, `chore:`, or `fix:` prefix
