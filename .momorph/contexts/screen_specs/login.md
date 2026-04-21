# Screen: Login

## Screen Info

| Property | Value |
|----------|-------|
| **Figma Frame ID** | 662:14387 |
| **Figma Link** | https://momorph.ai/files/Z9KFZ0aAoOfkVEIPuwwkZl/frames/662:14387 |
| **Screen Group** | Authentication |
| **Status** | discovered |
| **Discovered At** | 2026-04-22 |
| **Last Updated** | 2026-04-22 |

> **Note**: Frame `662:14387` was not yet accessible via MoMorph MCP tools at discovery time
> (server returned 404 for all frame queries on file `Z9KFZ0aAoOfkVEIPuwwkZl`). This spec
> documents the Login screen based on the frame ID, project constitution, and standard
> Supabase Auth patterns. Update with actual node tree data once the frame is synced.

---

## Description

The Login screen is the primary authentication entry point for SSA 2025. It allows existing
users to authenticate using their email address and password via Supabase Auth. On successful
authentication a session is established (HttpOnly cookie) and the user is redirected to the
Dashboard. It also surfaces entry points for password recovery and new user registration.

---

## Navigation Analysis

### Incoming Navigations (From)

| Source Screen | Trigger | Condition |
|---------------|---------|-----------|
| App Launch / Middleware | Automatic redirect | User is unauthenticated (no valid Supabase session) |
| Any Authenticated Screen | Logout action | User explicitly signs out |
| Register | Link "Already have an account? Sign in" | User already registered |
| Forgot Password | Redirect after reset success | Password reset flow completed |
| Reset Password | Automatic redirect | Reset token consumed successfully |

### Outgoing Navigations (To)

| Target Screen | Trigger Element | Node ID | Confidence | Notes |
|---------------|-----------------|---------|------------|-------|
| Dashboard | Button: "Sign In" / "Login" | TBD | High | Primary success path — fires after `signInWithPassword` resolves with valid session |
| Forgot Password | Link: "Forgot password?" | TBD | High | User cannot recall password |
| Register | Link: "Sign up" / "Create an account" | TBD | High | New user onboarding path |

### Navigation Rules
- **Back behavior**: No meaningful back — Login is a root-level screen; unauthenticated back navigation returns to Login
- **Deep link support**: Yes — `/login` (confirm from Next.js app directory)
- **Auth required**: No — this is the unauthenticated entry screen

---

## Component Schema

### Layout Structure

```
┌─────────────────────────────────────┐
│           HEADER / BRAND            │
│  [Logo / App Name]                  │
├─────────────────────────────────────┤
│                                     │
│           BODY                      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        LOGIN FORM           │   │
│  │                             │   │
│  │  [Email Input]              │   │
│  │  [Password Input]           │   │
│  │  [Forgot Password Link]     │   │
│  │                             │   │
│  │  [Sign In Button]           │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Register Link]                    │
│                                     │
└─────────────────────────────────────┘
```

### Component Hierarchy

```
LoginScreen
├── BrandHeader (Organism)
│   ├── AppLogo (Atom)
│   └── AppTitle (Atom)
├── LoginForm (Organism)
│   ├── EmailField (Molecule)
│   │   ├── Label (Atom)
│   │   ├── Input[type=email] (Atom)
│   │   └── ErrorText (Atom)
│   ├── PasswordField (Molecule)
│   │   ├── Label (Atom)
│   │   ├── Input[type=password] (Atom)
│   │   ├── ToggleVisibilityButton (Atom)
│   │   └── ErrorText (Atom)
│   ├── ForgotPasswordLink (Atom)
│   └── SignInButton (Atom)
└── RegisterPrompt (Molecule)
    ├── PromptText (Atom)
    └── RegisterLink (Atom)
```

### Main Components

| Component | Type | Node ID | Description | Reusable |
|-----------|------|---------|-------------|----------|
| BrandHeader | Organism | TBD | App logo and name at top of screen | Yes |
| LoginForm | Organism | TBD | Email + password form with submit | No |
| EmailField | Molecule | TBD | Labelled email input with error state | Yes |
| PasswordField | Molecule | TBD | Labelled password input with show/hide toggle and error state | Yes |
| ForgotPasswordLink | Atom | TBD | Text link to Forgot Password screen | Yes |
| SignInButton | Atom | TBD | Primary CTA — submits credentials | Yes |
| RegisterPrompt | Molecule | TBD | "Don't have an account? Sign up" prompt | Yes |

---

## Form Fields

| Field | Type | Required | Validation | Placeholder |
|-------|------|----------|------------|-------------|
| email | email | Yes | Valid email format (RFC 5322) | "Enter your email" |
| password | password | Yes | Non-empty; min 8 chars recommended | "Enter your password" |

### Validation Rules

```typescript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>
```

> Server-side validation is authoritative (Supabase Auth). Client-side validation is
> supplementary per Constitution Principle VI.

---

## API Mapping

### On Screen Load

| API | Method | Purpose | Response Usage |
|-----|--------|---------|----------------|
| Supabase `getSession()` | — | Check existing session on mount | If session exists, redirect to Dashboard immediately |

### On User Action

| Action | API | Method | Request Body | Response |
|--------|-----|--------|--------------|----------|
| Submit Sign In | `supabase.auth.signInWithPassword` | POST (Supabase SDK) | `{ email, password }` | `{ data: { session, user }, error }` |
| Click Forgot Password | — | Navigation only | — | Redirect to Forgot Password screen |
| Click Register | — | Navigation only | — | Redirect to Register screen |

### Error Handling

| Error Code / Type | Message | UI Action |
|-------------------|---------|-----------|
| `invalid_credentials` (Supabase) | "Invalid email or password" | Show inline form error |
| `email_not_confirmed` (Supabase) | "Please confirm your email before signing in" | Show toast notification |
| Network error | "Unable to connect. Please check your connection." | Show toast with retry |
| 500 / unexpected | "Something went wrong. Please try again." | Show toast; log server-side |

---

## State Management

### Local State

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| formData | `{ email: string; password: string }` | `{ email: '', password: '' }` | Controlled form inputs |
| isLoading | boolean | false | Show spinner on Sign In button during auth request |
| showPassword | boolean | false | Toggle password field visibility |
| formError | string \| null | null | Display auth-level error below form |

### Global State

| State | Store | Read/Write | Purpose |
|-------|-------|------------|---------|
| session | Supabase Auth | Write | Persist session (HttpOnly cookie) after successful login |
| user | Supabase Auth | Write | Store authenticated user object for downstream screens |

---

## UI States

### Loading State
- Sign In button shows spinner and is disabled
- All form inputs are disabled during the request
- No skeleton needed (form is pre-rendered)

### Error State
- Inline error message below the form (not per-field) for auth errors (e.g., wrong credentials)
- Per-field error text for client-side validation failures (e.g., invalid email format)
- Toast for network/server errors with a retry affordance

### Success State
- No success toast — immediate redirect to Dashboard
- Transition/animation per design tokens

### Empty State
- N/A for this screen

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Focus management | Auto-focus email field on mount |
| Keyboard navigation | Tab order: email → password → forgot-password link → sign-in button → register link |
| Screen reader | `aria-label` on all inputs; `aria-live="polite"` region for form errors |
| Error announcement | Errors announced via live region; associated with inputs via `aria-describedby` |
| Color contrast | WCAG 2.1 AA compliant (per Constitution Principle II) |
| Touch targets | Minimum 44 × 44 px for all interactive elements |

---

## Responsive Behavior

| Breakpoint | Layout Changes |
|------------|----------------|
| Mobile (≥ 320 px) | Full-width form, single-column, stacked elements |
| Tablet (≥ 768 px) | Centered form card, max-width ~400 px |
| Desktop (≥ 1280 px) | Centered card or split layout with brand illustration |

---

## Analytics Events

| Event | Trigger | Properties |
|-------|---------|------------|
| `screen_view` | On mount | `{ screen: 'login' }` |
| `login_attempt` | Form submit | `{ method: 'email_password' }` |
| `login_success` | Supabase session returned | `{ user_id }` |
| `login_error` | Auth error returned | `{ error_code }` |
| `forgot_password_clicked` | Link click | `{}` |
| `register_link_clicked` | Link click | `{}` |

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | (from `app/globals.css`) | Sign In button background |
| `--color-error` | (from `app/globals.css`) | Error text and border |
| `--spacing-form` | (from `app/globals.css`) | Gap between form fields |
| `--border-radius` | (from `app/globals.css`) | Input and button corner radius |

> All token values MUST be sourced from `app/globals.css`. Hard-coded values are FORBIDDEN
> per Constitution Principle II.

---

## Implementation Notes

### Dependencies
- Auth: Supabase JS client (`@supabase/supabase-js`, `@supabase/ssr`)
- Form handling: `react-hook-form`
- Validation: `zod` + `@hookform/resolvers/zod`
- Routing: Next.js App Router (`next/navigation` → `useRouter`, `redirect`)

### Special Considerations
- Session check on mount: if session already valid, redirect to Dashboard before rendering the form (prevents flash of login screen for authenticated users)
- Tokens MUST be stored in HttpOnly cookies only — use `@supabase/ssr` server client for cookie management
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` must be set in environment; fail fast if missing
- `service_role` key MUST NOT be used in the Login screen (client-side route)

---

## Analysis Metadata

| Property | Value |
|----------|-------|
| Analyzed By | Screen Flow Discovery (momorph.screenflow) |
| Analysis Date | 2026-04-22 |
| Needs Deep Analysis | Yes — run `momorph.specs` once frame is accessible in MoMorph |
| Confidence Score | Medium — navigation edges high-confidence; component details require Figma node tree |

### Next Steps
- [ ] Sync frame `662:14387` to MoMorph, then run `get_frame_node_tree` for actual component IDs
- [ ] Run `momorph.specs` to extract precise design item details from Figma
- [ ] Confirm route path (`/login`) from Next.js `app/` directory structure
- [ ] Update Node IDs in Component Schema table once frame is accessible
- [ ] Validate form validation rules against Supabase Auth password policy
- [ ] Review with design team for any custom states not covered above
