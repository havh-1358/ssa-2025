# Implementation Plan: Login

**Frame**: `GzbNeVGJHz-login`
**Date**: 2026-04-22
**Spec**: `specs/GzbNeVGJHz-login/spec.md`

---

## Summary

Implement the SSA 2025 Login screen at `/login` — a full-screen branded page with Google
OAuth (Supabase Auth) as the exclusive authentication method, a VN/EN language selector,
and a copyright footer. On successful OAuth the user lands on `/dashboard`. Next.js
middleware protects all authenticated routes and redirects unauthenticated sessions to
`/login`. The screen is server-rendered with a thin Client Component layer for interactive
state (`isLoading`, `error`, `languageDropdownOpen`).

---

## Technical Context

| Property | Value |
|---|---|
| **Language / Framework** | TypeScript 5 (strict) / Next.js 16.2.4 App Router |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 with CSS variable design tokens |
| **Auth** | Supabase Auth — Google OAuth via `@supabase/ssr` |
| **i18n** | `next-intl` — locales: `vn` (default), `en` |
| **Validation** | Zod at all external boundaries |
| **Testing (unit/integration)** | Vitest + React Testing Library |
| **Testing (E2E)** | Playwright (Page Object Model) |
| **API Style** | N/A — Supabase client SDK only |

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Principle | Requirement | Status | Notes |
|---|---|---|---|
| I. Type Safety | TypeScript strict, Zod at boundaries | ✅ Planned | Zod validates `?error` query param on callback; `tsconfig.json` already strict |
| II. Design Fidelity | CSS variables from design tokens; no hardcoded values | ✅ Planned | All tokens from `design-style.md` added to `globals.css`; Tailwind maps to tokens |
| II. Responsive | Mobile ≥ 320px, tablet ≥ 768px, desktop ≥ 1280px; touch targets ≥ 44×44px | ✅ Planned | Responsive classes in Phase 2 |
| II. WCAG 2.1 AA | Contrast ≥ 4.5:1, ARIA labels, keyboard nav | ✅ Planned | Verified in design-style; ARIA attrs in Phase 4 |
| III. TDD | Red–Green–Refactor; tests committed before implementation | ✅ Planned | Phase ordering enforces test-first |
| IV. Layered Arch | Page → Component → Hook → Supabase client | ✅ Planned | No business logic in page or route handler |
| IV. Clean Code | Functions ≤ 50 lines, files ≤ 800 lines, no magic values | ✅ Planned | Design tokens extracted to constants |
| V. Doc-Driven | `spec.md` + `plan.md` exist before implementation | ✅ Met | Both files created |
| VI. OWASP | HttpOnly cookies, no service_role on client, no stack traces in responses | ✅ Planned | `@supabase/ssr` handles cookie storage; server client in server-only files |
| VI. OWASP | `code` param validated before `exchangeCodeForSession` | ✅ Planned | Callback route validates presence; missing code → redirect to `/login?error=auth_failed` |

**Violations**: None. No deliberate deviations from constitutional principles.

---

## Architecture Decisions

### Frontend Approach

- **Page component** (`app/login/page.tsx`): Server Component. Reads session via
  Supabase server client — redirects to `/dashboard` if session exists. Reads `?error`
  query param and passes to client shell. No client-side state here.
- **Client shell** (`app/login/LoginClient.tsx`): `"use client"`. Owns `isLoading`,
  `error`, `languageDropdownOpen` state. Renders Header, background, content, footer.
  Receives initial `errorParam` from the server component as a prop.
- **Component isolation**: Each interactive sub-component (`LoginButton`,
  `LanguageSelector`) is its own `"use client"` component with props for state lifting
  to `LoginClient`. Non-interactive components (`Footer`, `Header`, `KeyVisual`) are
  plain function components with no `"use client"` directive — they do not use hooks or
  browser APIs. Because they are imported by `LoginClient.tsx` (a Client Component), they
  are bundled client-side automatically; they do NOT need separate `"use client"` directives.
- **Styling**: Tailwind utility classes mapping to CSS variables defined in `globals.css`.
  No inline `style` attributes. No hardcoded color/spacing values in component files.
  The implementation mapping table in `design-style.md` shows `bg-[#FFEA9E]` for reference
  only — in actual code these MUST be `bg-[var(--color-btn-google-bg)]` per Constitution
  Principle II. All hex values live exclusively in `globals.css` as CSS variables.
- **Fonts**: `next/font/google` for Montserrat and Montserrat_Alternates — loaded in
  `app/layout.tsx` and exposed as CSS variables `--font-montserrat` and
  `--font-montserrat-alt`.
- **Background image**: `<Image priority fill className="object-cover" />` for LCP
  optimization. The `objectFit` prop was removed in Next.js 13 — use `className="object-cover"`
  instead. The parent container must be `position: relative` with explicit dimensions.
  `#00101A` CSS background on the container as fallback when image fails to load.

### Auth Flow

```
Browser → /login → [Server] check session
  → has session   → redirect /dashboard
  → no session    → render login page

Click "LOGIN With Google"
  → LoginButton sets isLoading=true
  → supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: '/auth/callback' })
  → Google consent screen
  → Google redirects to /auth/callback?code=...
  → [Server] exchangeCodeForSession(code)
  → sets HttpOnly session cookie
  → redirect /dashboard

OAuth cancelled (user dismissed Google consent)
  → Google redirects to /auth/callback?error=access_denied
  → [Server] detects access_denied → redirect /login (NO ?error param)
  → [Client] renders login page with NO error message (Scenario 4)

OAuth provider error (account suspended, scope error, etc.)
  → Google redirects to /auth/callback?error=<other>
  → [Server] detects non-access_denied error → redirect /login?error=auth_failed
  → [Client] LoginClient reads ?error param → renders ErrorMessage (Scenario 5)
```

### i18n Approach

- `next-intl` with App Router. Locale stored in a `NEXT_LOCALE` cookie so SSR reads it
  on the first render without a flash. No locale URL prefix (no `/vn/login`).
- `i18n/config.ts` uses `defineRouting({ locales: ['vn', 'en'], defaultLocale: 'vn', localePrefix: 'never' })`.
- `next-intl` middleware is initialized with `createMiddleware(routing)` — it reads the
  cookie and injects locale for every request.
- **Locale switching mechanism**: `useLocale()` from `next-intl` is **read-only**.
  Switching locale requires:
  1. Writing `NEXT_LOCALE=<new>` cookie via `document.cookie` (client-side) or a Server Action.
  2. Calling `router.refresh()` from `next/navigation` to re-render the Server Component
     tree with the new locale.
  - `hooks/useLanguage.ts` encapsulates this: sets cookie → calls `startTransition(() => router.refresh())`.
- Message files: `i18n/messages/vn.json`, `i18n/messages/en.json`.

### Middleware Strategy

Two middlewares must coexist:
1. **Supabase session middleware** (`@supabase/ssr` `updateSession`) — refreshes session
   cookie on every request.
2. **next-intl middleware** — reads locale cookie.

These are composed in a single `middleware.ts` by calling both in sequence. Supabase
session refresh runs first; next-intl locale injection runs second.

The middleware MUST export a `config.matcher` to avoid running on static assets:
```ts
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'],
}
```
Without this, every `_next/static` request triggers middleware, causing performance
degradation and potential Supabase cookie refresh loops.

### Auth Callback Route

`app/auth/callback/route.ts` (Next.js Route Handler):
1. Extract `error` param from `searchParams`.
   - If `error === 'access_denied'` → user cancelled the consent screen (Scenario 4) →
     redirect to `/login` **with no `?error` param** (no error shown to user).
   - If `error` is any other non-null value → provider failure (Scenario 5) →
     redirect to `/login?error=auth_failed` (error message shown).
2. Extract `code` from `searchParams`.
   - If `code` is missing or not a string (and no `error`) → redirect to `/login?error=auth_failed`.
3. Call `supabase.auth.exchangeCodeForSession(code)`.
4. If `exchangeCodeForSession` throws → redirect to `/login?error=auth_failed`.
5. On success → redirect to `/dashboard`.

**Critical**: Differentiating `access_denied` (cancel) from other errors is required by
spec Scenarios 4 and 5. Treating all errors as `auth_failed` would incorrectly show an
error message to users who simply clicked "Cancel" on the Google consent screen.

The `code` validation prevents open-redirect exploitation (Constitution Principle VI /
TR-006).

---

## Project Structure

### Documentation

```text
.momorph/specs/GzbNeVGJHz-login/
├── spec.md          ✅ complete
├── plan.md          ✅ this file
├── design-style.md  ✅ complete
├── tasks.md         📋 next step
└── assets/
    └── frame.png
```

### New Source Files

```text
app/
├── login/
│   ├── page.tsx                        # Server Component — session check + render
│   └── LoginClient.tsx                 # Client Component — interactive state shell
├── auth/
│   └── callback/
│       └── route.ts                    # OAuth code → session exchange
├── dashboard/
│   └── page.tsx                        # Placeholder dashboard (redirect target for /dashboard)
└── globals.css                         # Add Login design tokens (Phase 1)

components/
├── auth/
│   ├── LoginButton.tsx                 # Google login CTA with loading state
│   └── LanguageSelector.tsx            # VN/EN dropdown with ARIA
├── layout/
│   ├── Header.tsx                      # Header bar (logo + language selector)
│   └── Footer.tsx                      # Copyright footer with divider
├── ui/
│   └── ErrorMessage.tsx                # Auth error alert (role="alert")
└── background/
    └── KeyVisual.tsx                   # Background image with gradient overlays

hooks/
└── useLanguage.ts                      # Locale read/write via next-intl + cookie

lib/
├── supabase/
│   ├── client.ts                       # Browser Supabase client (NEXT_PUBLIC_ vars only)
│   └── server.ts                       # Server Supabase client (cookies, server-only)
└── constants/
    └── routes.ts                       # Route constants sourced from SCREENFLOW.md

i18n/
├── config.ts                           # next-intl locale config (locales, defaultLocale)
├── request.ts                          # next-intl getRequestConfig
└── messages/
    ├── vn.json                         # Vietnamese strings
    └── en.json                         # English strings

middleware.ts                           # Supabase session + next-intl locale composition
vitest.config.ts                        # Vitest config (environment: jsdom, setupFiles)
playwright.config.ts                    # Playwright config (baseURL, projects, reporter)
vitest.setup.ts                         # Import @testing-library/jest-dom extended matchers

__tests__/
├── auth/
│   └── callback.test.ts               # Unit: auth callback route (5 scenarios)
├── components/
│   ├── LoginButton.test.tsx            # Unit: button states, ARIA, click handler
│   ├── LanguageSelector.test.tsx       # Unit: dropdown open/close, locale switch, focus
│   ├── ErrorMessage.test.tsx           # Unit: role="alert", aria-live
│   └── Footer.test.tsx                 # Unit: copyright text, border-top
├── login/
│   └── page.test.tsx                   # Integration: session redirect, error prop passing
└── middleware.test.ts                  # Integration: unauthenticated redirect to /login

e2e/
└── login.spec.ts                       # E2E: happy path, cancel, language switch

public/
└── assets/
    └── auth/
        ├── images/
        │   └── login-bg.jpg            # Background key visual (download from Figma)
        └── logos/
            ├── mm-media-logo.png       # Header MM_MEDIA logo
            └── saa-2025-logo.png       # Main SAA 2025 brand logo
```

### Modified Files

| File | Change |
|---|---|
| `app/globals.css` | Add Login design tokens as CSS variables |
| `app/layout.tsx` | (1) Add Montserrat + Montserrat_Alternates via `next/font/google`; (2) Add `NextIntlClientProvider` wrapping `{children}` — required for `useLocale()` and `useTranslations()` to work in Client Components. Pattern: `const locale = await getLocale(); const messages = await getMessages();` then `<NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>` |
| `next.config.ts` | Wrap with `createNextIntlPlugin('./i18n/request.ts')` from `next-intl/plugin`. The path argument tells next-intl where `getRequestConfig` is exported. |

### Design Gap — EN Flag Icon

The Figma design only shows the VN flag in the language selector. When EN is selected, an EN flag icon is required. Two options:
- **Option A**: Use a generic "EN" text label with no flag (safe default, no extra asset needed)
- **Option B**: Add an English/UK/US flag icon from the same icon library as the VN flag

Default assumption: **Option A** (text-only "EN" label). Confirm with design team if a flag is required.

### New Dependencies

| Package | Purpose |
|---|---|
| `@supabase/supabase-js` | Supabase JS client |
| `@supabase/ssr` | SSR-compatible cookie session management |
| `next-intl` | Internationalization (VN + EN) |
| `zod` | Input validation at external boundaries |
| `vitest` | Unit / integration test runner |
| `@vitejs/plugin-react` | Vitest React support |
| `@testing-library/react` | Component testing |
| `@testing-library/user-event` | User interaction simulation |
| `@testing-library/jest-dom` | Extended matchers (`toBeInTheDocument`, `toBeDisabled`, etc.) |
| `jsdom` | DOM environment for Vitest (set `environment: 'jsdom'` in vitest.config.ts) |
| `@playwright/test` | E2E testing |

---

## Implementation Strategy

### Phase 0 — Asset Preparation

Download all Figma assets to `public/assets/auth/`:

| Asset | Figma Node | Output Path |
|---|---|---|
| Background key visual photo | `662:14388` | `public/assets/auth/images/login-bg.jpg` |
| MM_MEDIA header logo | `I662:14391;178:1033;178:1030` | `public/assets/auth/logos/mm-media-logo.png` |
| SAA 2025 brand logo | `2939:9548` | `public/assets/auth/logos/saa-2025-logo.png` |

Google icon is loaded from a well-known CDN or inline SVG — not a Figma asset.

---

### Phase 1 — Foundation (Prerequisite for all phases)

1. Install new dependencies (adjust package manager to match your lockfile — `npm`, `pnpm`, or `yarn`):
   ```sh
   npm install @supabase/supabase-js @supabase/ssr next-intl zod
   npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @playwright/test
   # Download Playwright browser binaries after install:
   npx playwright install
   ```
2. Add `.env.local` variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Create `lib/supabase/client.ts` and `lib/supabase/server.ts`.
4. Create `lib/constants/routes.ts` with `ROUTES.LOGIN`, `ROUTES.DASHBOARD`,
   `ROUTES.AUTH_CALLBACK` sourced from `SCREENFLOW.md`.
5. Add Login design tokens to `app/globals.css` (all CSS variables from `design-style.md`).
6. Update `app/layout.tsx` to load Montserrat and Montserrat_Alternates fonts.
7. Create `i18n/config.ts` (exports `routing` via `defineRouting`), `i18n/request.ts`
   (exports `getRequestConfig` — loads messages by locale), `i18n/messages/vn.json`,
   `i18n/messages/en.json` with all Login screen strings.
   `i18n/request.ts` minimal content:
   ```ts
   import { getRequestConfig } from 'next-intl/server'
   import { routing } from './config'
   export default getRequestConfig(async ({ requestLocale }) => {
     const locale = (await requestLocale) ?? routing.defaultLocale
     return { locale, messages: (await import(`./messages/${locale}.json`)).default }
   })
   ```
8. Update `next.config.ts`: wrap existing config with `createNextIntlPlugin('./i18n/request.ts')`.
9. Update `app/layout.tsx`: add `NextIntlClientProvider` wrapping `{children}`, loading
   locale and messages from `getLocale()` / `getMessages()` (`next-intl/server`).
10. Create `middleware.ts` composing Supabase session update + next-intl locale.
11. Create `vitest.config.ts` (environment: `jsdom`, setupFiles: `['./vitest.setup.ts']`),
    `vitest.setup.ts` (imports `@testing-library/jest-dom`), and `playwright.config.ts`
    (baseURL: `http://localhost:3000`, projects: chromium).
9. Create `vitest.config.ts` (environment: `jsdom`, setupFiles: `['./vitest.setup.ts']`),
   `vitest.setup.ts` (imports `@testing-library/jest-dom`), and `playwright.config.ts`
   (baseURL: `http://localhost:3000`, projects: chromium).

---

### Phase 2 — Core Feature: US1 Google Sign-In [P1]

**Test first** (RED → GREEN → IMPROVE):

| Test | Type | File |
|---|---|---|
| `app/auth/callback/route.ts` — missing `code` (no error param) redirects to `/login?error=auth_failed` | Unit | `__tests__/auth/callback.test.ts` |
| `app/auth/callback/route.ts` — `error=access_denied` redirects to `/login` with NO error param | Unit | `__tests__/auth/callback.test.ts` |
| `app/auth/callback/route.ts` — `error=<other>` redirects to `/login?error=auth_failed` | Unit | `__tests__/auth/callback.test.ts` |
| `app/auth/callback/route.ts` — valid `code` calls `exchangeCodeForSession` and redirects to `/dashboard` | Unit | `__tests__/auth/callback.test.ts` |
| `app/auth/callback/route.ts` — `exchangeCodeForSession` throws → redirects to `/login?error=auth_failed` | Unit | `__tests__/auth/callback.test.ts` |
| `LoginButton` — renders enabled with Google icon and text | Unit | `__tests__/components/LoginButton.test.tsx` |
| `LoginButton` — entering loading state disables button and shows spinner | Unit | `__tests__/components/LoginButton.test.tsx` |
| `LoginButton` — click calls `signInWithOAuth` | Unit | `__tests__/components/LoginButton.test.tsx` |
| `LoginButton` — `aria-busy=true` when loading, `aria-busy=false` when idle | Unit | `__tests__/components/LoginButton.test.tsx` |
| `ErrorMessage` — renders with `role="alert"` and `aria-live="assertive"` | Unit | `__tests__/components/ErrorMessage.test.tsx` |
| `app/login/page.tsx` — authenticated session redirects to `/dashboard` | Integration | `__tests__/login/page.test.tsx` |
| `app/login/page.tsx` — `?error=auth_failed` renders ErrorMessage | Integration | `__tests__/login/page.test.tsx` |
| `app/login/page.tsx` — no `?error` param → ErrorMessage is absent | Integration | `__tests__/login/page.test.tsx` |
| `middleware.ts` — unauthenticated request to `/dashboard` redirects to `/login` | Integration | `__tests__/middleware.test.ts` |
| E2E: User opens `/login`, clicks login, OAuth flow completes, lands on `/dashboard` | E2E | `e2e/login.spec.ts` |
| E2E: User cancels Google consent → returns to `/login` with NO error message visible (US1 Scenario 4) | E2E | `e2e/login.spec.ts` |

**Implementation** (after tests are written):

1. `app/auth/callback/route.ts` — validates code, exchanges for session, redirects.
2. `components/auth/LoginButton.tsx` — `isLoading` prop, `onClick` calls
   `createBrowserClient()` from `lib/supabase/client.ts` then `signInWithOAuth`,
   `aria-busy`, `aria-label`.
   **Architecture note**: `LoginButton` calls the Supabase client directly (skips a
   dedicated hook layer) — justified because there is zero business logic here: it is
   a single `signInWithOAuth` redirect call with no data transformation. A wrapper hook
   would add indirection with no benefit. Documented per Constitution V (deliberate
   deviation must be recorded).
3. `components/ui/ErrorMessage.tsx` — `message` prop, `role="alert"`,
   `aria-live="assertive"`.
4. `components/background/KeyVisual.tsx` — `<Image priority fill />` + gradient overlays.
5. `app/login/LoginClient.tsx` — owns `isLoading`, `error` state; composes
   Header, KeyVisual, content block, LoginButton, ErrorMessage, Footer.
6. `app/login/page.tsx` — session check → redirect; pass `errorParam` to `LoginClient`.
   **Next.js 15/16 breaking change**: `searchParams` is now a `Promise<Record<string, string>>`.
   The page component signature MUST be:
   ```tsx
   export default async function LoginPage({
     searchParams,
   }: {
     searchParams: Promise<{ error?: string }>
   }) {
     const { error } = await searchParams
     // ...
   }
   ```

---

### Phase 3 — Extended Features: US2 Language Selector [P2] + US3 Footer [P3]

**Test first**:

| Test | Type | File |
|---|---|---|
| `LanguageSelector` — renders VN flag, "VN" label, chevron | Unit | `__tests__/components/LanguageSelector.test.tsx` |
| `LanguageSelector` — click opens dropdown with VN and EN options | Unit | `__tests__/components/LanguageSelector.test.tsx` |
| `LanguageSelector` — selecting EN updates locale cookie and closes dropdown | Unit | `__tests__/components/LanguageSelector.test.tsx` |
| `LanguageSelector` — Escape closes dropdown and returns focus to trigger | Unit | `__tests__/components/LanguageSelector.test.tsx` |
| `LanguageSelector` — outside click closes dropdown | Unit | `__tests__/components/LanguageSelector.test.tsx` |
| `Footer` — renders "Bản quyền thuộc về Sun* © 2025" with top border | Unit | `__tests__/components/Footer.test.tsx` |
| E2E: language selector switches tagline and button label to English | E2E | `e2e/login.spec.ts` |

**Implementation**:

1. `hooks/useLanguage.ts` — reads locale via `useLocale()` from `next-intl` (read-only);
   writes locale by setting `document.cookie = 'NEXT_LOCALE=<value>; path=/'` then calling
   `startTransition(() => router.refresh())` from `next/navigation`. Exposes `{ locale, setLocale }`.
2. `components/auth/LanguageSelector.tsx` — dropdown with `role="listbox"`,
   `aria-expanded`, `aria-haspopup`, Escape handler, outside-click handler.
3. `components/layout/Header.tsx` — logo + `LanguageSelector`; `80px` height,
   `--color-bg-header` background.
4. `components/layout/Footer.tsx` — copyright text, `border-top: var(--border-footer)`.
5. Wire `useLanguage` into `LoginClient.tsx`.

---

### Phase 4 — Polish

1. **Accessibility audit**: verify tab order (Language Selector → Login Button),
   `aria-live="polite"` on loading region. Implement `prefers-reduced-motion` for button
   scale animation via CSS:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .btn-login { transition: none; transform: none; }
   }
   ```
   Add this to the button's Tailwind class with `motion-reduce:transform-none motion-reduce:transition-none`.
2. **Responsive pass**: apply mobile / tablet overrides for spacing and font sizes
   per `design-style.md > Responsive Specifications`. Verify 44×44px touch targets.
3. **Error auto-clear**: ensure `error` state resets to `null` on each new login attempt.
4. **Edge cases**:
   - Missing `NEXT_PUBLIC_SUPABASE_ANON_KEY` → catch and show user-friendly message.
   - Network error during `signInWithOAuth` → reset `isLoading`, show error.
   - Background image load failure → `#00101A` fallback via CSS `background-color`.
   - JavaScript disabled → SSR via Next.js ensures the page structure and static text
     render without JS. The login button will not function (OAuth requires JS), but
     the page MUST not crash. No `noscript` fallback required — graceful degradation is
     sufficient per spec. Verify by disabling JS in browser devtools.
5. **Security hardening**:
   - Verify no session token in `localStorage` / `sessionStorage` / response body.
   - Confirm `HttpOnly`, `Secure`, `SameSite=Strict` on session cookie.
   - Ensure `/auth/callback` rejects malformed `code` values.
6. **Performance**: verify `<Image priority />` on background; check Lighthouse LCP.
7. **Final coverage check**: unit/integration ≥ 80%; E2E login flow passing.

---

## Integration Testing Strategy

### Test Scope

- [x] **Component ↔ State**: `LoginClient` state (`isLoading`, `error`, `languageDropdownOpen`) flows correctly to child components
- [x] **App ↔ Supabase**: `signInWithOAuth` → session cookie → middleware session check
- [x] **Auth callback ↔ Supabase**: `exchangeCodeForSession` with valid/invalid codes
- [x] **i18n ↔ Cookie**: locale cookie read server-side, updated client-side without page reload
- [x] **Middleware ↔ Protected routes**: unauthenticated request to `/dashboard` redirects to `/login`

### Mocking Strategy

| Dependency | Strategy | Rationale |
|---|---|---|
| `@supabase/ssr` (server client) | Mock via `vi.mock` | Avoid real network calls in unit tests |
| `supabase.auth.signInWithOAuth` | Mock | Browser OAuth cannot run in test environment |
| `supabase.auth.exchangeCodeForSession` | Mock | Validate route logic independently of Supabase |
| Google OAuth flow | Real (E2E staging) | Must test the full redirect cycle end-to-end |
| Session cookie | Real Supabase test project | Integration tests use a Supabase test environment |

### Key Test Scenarios

1. **Happy Path**
   - [ ] Unauthenticated user visits `/login` → page renders
   - [ ] Click "LOGIN With Google" → `signInWithOAuth` called with `{ provider: 'google' }`
   - [ ] OAuth callback with valid code → session cookie set → redirect to `/dashboard`
   - [ ] Authenticated user visits `/login` → redirected to `/dashboard`

2. **Error Handling**
   - [ ] OAuth callback with `error=access_denied` (user cancelled) → redirect to `/login` with NO error param (Scenario 4)
   - [ ] OAuth callback with `error=<other>` (provider failure) → redirect to `/login?error=auth_failed` (Scenario 5)
   - [ ] OAuth callback with missing `code` (no error param) → redirect to `/login?error=auth_failed`
   - [ ] OAuth callback with invalid `code` → `exchangeCodeForSession` throws → redirect to `/login?error=auth_failed`
   - [ ] `signInWithOAuth` throws network error → `isLoading` reset, error message shown
   - [ ] `?error=auth_failed` in URL → ErrorMessage component renders

3. **Edge Cases**
   - [ ] Double-click on login button → second call is blocked (`isLoading=true` disables button)
   - [ ] Stale/expired session cookie on `/login` → cookie cleared, login page rendered
   - [ ] Language switch from VN to EN → all text labels update, cookie persisted

### Coverage Goals

| Area | Target | Priority |
|---|---|---|
| Auth callback route | 100% | High |
| LoginButton states | 100% | High |
| LanguageSelector interactions | 90% | High |
| ErrorMessage component | 100% | High |
| Login page (server component) | 80% | Medium |
| Footer, Header | 70% | Low |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Supabase + next-intl middleware conflict | Medium | High | Compose both in a single `middleware.ts` chain; test middleware in isolation |
| Google OAuth redirect URL not configured in Supabase dashboard | High | High | **Q3 open**: production domain unknown — use `localhost:3000` for local dev; document Supabase dashboard config step in tasks |
| Mobile Figma design not available (Q4 open) | Medium | Medium | Use inferred responsive values from design-style.md; flag for design review before ship |
| Error message visual design not confirmed (Q5 open) | Low | Low | Use inline banner (below button) as default; `TODO(DESIGN)` flag; easy to swap |
| Montserrat font CORS or loading failure | Low | Low | `next/font/google` bundles fonts at build time — no runtime CORS risk |
| First-time user record creation race condition in Supabase | Low | Low | Supabase handles atomically in `exchangeCodeForSession`; no custom user creation needed |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `spec.md` complete and reviewed (3 passes)
- [x] `design-style.md` complete and reviewed (3 passes)
- [x] `constitution.md` v1.1.0 in place
- [x] `SCREENFLOW.md` documents all routes
- [ ] Supabase project created with Google OAuth provider enabled
- [ ] `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Figma assets exported to `public/assets/auth/`

### Open Questions (Non-blocking for dev start)

| # | Question | Blocking? | Default Assumption |
|---|---|---|---|
| Q3 | Production domain for OAuth `redirectTo` | No (use localhost for dev) | `http://localhost:3000/auth/callback` |
| Q4 | Mobile Figma design exists? | No | Use inferred responsive values from desktop design |
| Q5 | Error message: inline banner vs toast | No | Inline banner below login button |

---

## Next Steps

1. Run `/momorph.tasks` to generate the full task breakdown for implementation.
2. Confirm Supabase project is created and Google OAuth provider is enabled.
3. Export Figma assets (Phase 0) before beginning Phase 1.
4. Begin Phase 1 implementation following TDD order.

---

## Notes

- The `middleware.ts` composition order matters: Supabase session update MUST run before
  next-intl locale injection so the session cookie is fresh when locale is resolved.
- The `app/dashboard/page.tsx` placeholder is a stub only — it will be replaced when
  the Dashboard screen spec is implemented. It exists solely as a redirect target for auth.
  Note: `app/(dashboard)/page.tsx` would route to `/` (root), NOT `/dashboard` — the
  route group syntax `()` is a folder-only grouping and does not contribute to the URL.
- The `lib/supabase/server.ts` client MUST be imported only in Server Components and Route
  Handlers — never in files that could be bundled into the client.
- `locale` cookie is the ONLY permitted use of non-HttpOnly cookie storage per
  Constitution Principle VI (locale is not a security token).
- The `--color-btn-google-text` token (`#00101A`) doubles as both text color and icon
  tint for the Login button — a single token covers both children.
