# Screen Flow Overview

## Project Info
- **Project Name**: SSA 2025
- **Figma File Key**: 9ypp4enmFmdK3YAFJLIu6C
- **MoMorph URL**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
- **Created**: 2026-04-22
- **Last Updated**: 2026-04-29 (flow: /countdown → /login → / [homepage]; Viết Kudo modal status updated to design; MaZUn5xHXZ Like Kudos feature added)

---

## Discovery Progress

| Metric | Count |
|--------|-------|
| Total Screens | 8 (from yêu cầu.csv) |
| Discovered | 7 unique frames |
| Remaining | Dashboard (TBD) |
| Completion | ~85% |

---

## Screens

| # | Screen Name | Frame ID | Route | Figma Link | Status | Spec File | Navigations To |
|---|-------------|----------|-------|------------|--------|-----------|----------------|
| 1 | Countdown Prelaunch | 8PJQswPZmU | `/countdown` | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU | specs-ready | `.momorph/specs/8PJQswPZmU-countdown-prelaunch/spec.md` | `/login` (when launch triggers) |
| 2 | Login | GzbNeVGJHz | `/login` | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz | specs-ready | `.momorph/specs/GzbNeVGJHz-login/spec.md` | `/` (post-login) |
| 3 | Homepage SAA | i87tDx10uM | `/` | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM | specs-ready | `.momorph/specs/i87tDx10uM-homepage-saa/spec.md` | `/awards`, `/kudos` |
| 4 | Award System | zFYDgyj_pD | `/awards` | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD | specs-ready | `.momorph/specs/zFYDgyj_pD-he-thong-giai/spec.md` | `/`, `/kudos` |
| 5 | Sun* Kudos | MaZUn5xHXZ | `/kudos` | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ | specs-ready | `.momorph/specs/MaZUn5xHXZ-sun-kudos/spec.md` | `/login` (unauth), Viet Kudos modal; Like Kudos (heart toggle per card) |
| 6 | Viết Kudo (Write Kudos Modal) | ihQ26W78P2 | `/kudos` (modal overlay) | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2 | design | `.momorph/specs/ihQ26W78P2-viet-kudos/spec.md` | `/kudos` (close modal) |
| 7 | Language Selector (component) | hUyaaugye2 | N/A (shared component) | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/hUyaaugye2 | specs-ready | `.momorph/specs/hUyaaugye2-da-ngon-ngu/spec.md` | No route change |
| 8 | Dashboard | TBD | `/dashboard` | TBD | not-started | TBD | TBD |

---

## Registered Routes

| Route | Screen | Auth Required | Notes |
|-------|--------|---------------|-------|
| `/countdown` | Countdown Prelaunch | No | Pre-launch holding screen. Middleware redirects all routes here when `isPrelaunch=true`. When launch triggers → redirect to `/login`. |
| `/login` | Login | No (redirect away if authenticated) | Middleware redirects to `/` if valid session exists |
| `/` | Homepage SAA | Yes | Root path = main homepage. Middleware redirects to `/login` if no valid session. |
| `/awards` | Award System | No (public) | Award info is public; no auth required to browse |
| `/kudos` | Sun* Kudos | No (browse public; auth required to like or write) | Interactive actions (like, write) require auth → redirect to `/login` |
| `/dashboard` | Dashboard | Yes | Middleware redirects to `/login` if no valid session |
| `/auth/callback` | OAuth callback handler | No | Next.js route handler `app/auth/callback/route.ts`; exchanges OAuth code for session; redirects to `/` on success or `/login?error=auth_failed` on failure |

> **Primary flow**: `/countdown` (Prelaunch) → `/login` (Login) → `/` (Homepage).
> **Middleware order**: (1) Pre-launch gate — if `isPrelaunch=true`, ALL routes → `/countdown`; (2) Auth gate — protected routes without session → `/login`.

---

## Navigation Graph

```mermaid
flowchart TD
    subgraph Entry["Pre-Launch"]
        Countdown["Countdown Prelaunch\n(8PJQswPZmU)\nRoute: /countdown"]
    end

    subgraph Auth["Authentication"]
        Login["Login\n(GzbNeVGJHz)\nRoute: /login"]
        OAuthCB["OAuth Callback\nRoute: /auth/callback"]
    end

    subgraph Main["Main Application"]
        Home["Homepage SAA\n(i87tDx10uM)\nRoute: /"]
        Awards["Award System\n(zFYDgyj_pD)\nRoute: /awards"]
        Kudos["Sun* Kudos\n(MaZUn5xHXZ)\nRoute: /kudos"]
        VietKudos["Viet Kudos Modal\n(ihQ26W78P2)\nOverlay on /kudos"]
        Dashboard["Dashboard\n(TBD)\nRoute: /dashboard"]
    end

    subgraph Shared["Shared Components"]
        LangSelector["Language Selector\n(hUyaaugye2)\nIn-page dropdown"]
    end

    %% PRIMARY FLOW: /countdown → /login → /
    AnyRoute([Any Route]) -->|"isPrelaunch=true, middleware"| Countdown
    Countdown -->|"launch triggers → redirect to /login"| Login
    Login -->|"LOGIN With Google (OAuth)"| OAuthCB
    OAuthCB -->|"success → session created"| Home
    OAuthCB -->|"failure → ?error=auth_failed"| Login
    Login -->|"already authenticated (session exists)"| Home

    %% Auth guard
    AnyRoute -->|"protected route + no session"| Login

    %% Main navigation
    Home -->|"Header: Award Information OR Award card"| Awards
    Home -->|"Header: Sun* Kudos OR CTA button"| Kudos
    Awards -->|"Header: About SAA 2025"| Home
    Awards -->|"Header: Sun* Kudos OR Kudos promo CTA"| Kudos
    Kudos -->|"Header: About SAA 2025"| Home
    Kudos -->|"Header: Award Information"| Awards
    Kudos -->|"Button: Ghi nhận (Write Kudos)"| VietKudos
    VietKudos -->|"Submit success OR Cancel"| Kudos
    Kudos -->|"Like/Write (unauthenticated)"| Login
    Login -->|"Post-login redirect"| Home

    %% Language selector (no route change)
    LangSelector -.->|"in-page locale switch (all screens)"| LangSelector

    classDef entry fill:#ffefd5,stroke:#e89b00
    classDef auth fill:#e8f4f8,stroke:#0077aa
    classDef main fill:#e8f8e8,stroke:#007700
    classDef shared fill:#f5f5f5,stroke:#999,stroke-dasharray:5 5
    class Countdown entry
    class Login,OAuthCB auth
    class Home,Awards,Kudos,VietKudos,Dashboard main
    class LangSelector shared
```

---

## Navigation Edges — All Screens

### Countdown Prelaunch (`/countdown`)

| Direction | Target/Source | Trigger | Condition |
|-----------|--------------|---------|-----------|
| OUT | `/login` | Automatic redirect when launch triggers | `isPrelaunch` flips to `false` |
| IN | Any route | Middleware redirect | `isPrelaunch = true` |

### Login (`/login`)

| Direction | Target/Source | Trigger | Condition |
|-----------|--------------|---------|-----------|
| OUT | `/auth/callback` → `/` | "LOGIN With Google" button | OAuth flow initiates |
| OUT | `/` | Already-authenticated check | Valid session exists on page load |
| IN | `/countdown` | Launch triggers | `isPrelaunch` flips to `false` |
| IN | Any protected route | Middleware | No valid session |
| IN | `/kudos` | Like/Write action (unauth) | Not logged in |

### Homepage SAA (`/`)

| Direction | Target/Source | Trigger | Condition |
|-----------|--------------|---------|-----------|
| OUT | `/awards` | Header "Award Information" nav OR Award section CTA | Click |
| OUT | `/kudos` | Header "Sun* Kudos" nav OR "Sun* Kudos" CTA button | Click |
| IN | `/auth/callback` | Post-OAuth redirect | Login success |
| IN | Any screen | Header logo click | N/A |

### Award System (`/awards`)

| Direction | Target/Source | Trigger | Condition |
|-----------|--------------|---------|-----------|
| OUT | `/` | Header "About SAA 2025" nav | Click |
| OUT | `/kudos` | Header "Sun* Kudos" nav OR Kudos promo CTA | Click |
| IN | `/` | Award card or CTA | Click |
| IN | `/kudos` | Header nav | Click |
| DEEP LINK | `/awards#top-talent` | Left nav "Top Talent" click | URL hash updates via `router.replace()` |
| DEEP LINK | `/awards#top-project` | Left nav "Top Project" click | URL hash updates via `router.replace()` |
| DEEP LINK | `/awards#top-project-leader` | Left nav "Top Project Leader" click | URL hash updates via `router.replace()` |
| DEEP LINK | `/awards#best-manager` | Left nav "Best Manager" click | URL hash updates via `router.replace()` |
| DEEP LINK | `/awards#signature-2025` | Left nav "Signature 2025" click | URL hash updates via `router.replace()` |
| DEEP LINK | `/awards#mvp` | Left nav "MVP" click | URL hash updates via `router.replace()` |

### Sun* Kudos (`/kudos`)

| Direction | Target/Source | Trigger | Condition |
|-----------|--------------|---------|-----------|
| OUT | `/` | Header "About SAA 2025" nav | Click |
| OUT | `/awards` | Header "Award Information" nav | Click |
| OUT | `/login` | Like or Write action | User is unauthenticated |
| OUT | Viet Kudos modal | "Ghi nhận" button | User is authenticated |
| IN | `/` | CTA "Sun* Kudos" or nav | Click |
| IN | `/awards` | Nav | Click |
| IN | `/auth/callback` | Post-login redirect (if Kudos was the protected action) | Login success |

> **Like Kudos feature** (interactive, on each kudos card):
> - Each card has a heart button (like/unlike toggle).
> - **Like**: `POST /kudos/{id}/like` (auth required) — toggles to liked state.
> - **Unlike**: `DELETE /kudos/{id}/like` (auth required) — toggles back to unliked state.
> - **Special day rule**: When an admin-configured special day is active (`GET /api/admin/special-days`), each like counts as **2 hearts** instead of 1.
> - **Own kudos**: Heart button is **disabled** — users cannot like their own kudos.
> - Unauthenticated click → redirect to `/login`.

### Viết Kudo Modal — `ihQ26W78P2` (overlay on `/kudos`)

> **Type**: Modal dialog (overlay). **Status**: design. Triggered from Sun* Kudos page; does not change the URL.
>
> **Key APIs**: `GET /api/users/search`, `GET /api/kudos/hashtags`, `POST /api/kudos`, `POST /api/upload`

| Direction | Target/Source | Trigger | Condition |
|-----------|--------------|---------|-----------|
| IN | `/kudos` | "Ghi nhận kudos" button click | User is authenticated |
| OUT (cancel) | `/kudos` (modal closes, no change) | Cancel button OR Escape key | N/A — user stays on `/kudos` |
| OUT (submit) | `/kudos` (modal closes + new kudos appears in feed) | "Gửi" submit button | `POST /api/kudos` returns success |

### Language Selector (shared component)

| Direction | Target | Trigger | Condition |
|-----------|--------|---------|-----------|
| — | No route change | Dropdown option click | Locale cookie updated |

---

## API Endpoints Summary

| Endpoint | Method | Auth | Screens Using | Purpose |
|----------|--------|------|---------------|---------|
| `supabase.auth.signInWithOAuth` | — | No | Login | Initiate Google OAuth |
| `supabase.auth.exchangeCodeForSession` | — | No | `/auth/callback` | Exchange code for session; redirect to `/home` on success |
| `supabase.auth.getSession()` | — | Yes | All authenticated | Check session on page load |
| `GET /api/kudos` | GET | No (browse) | Sun* Kudos | Paginated kudos feed |
| `GET /api/kudos/highlights` | GET | No | Sun* Kudos | Top 5 most-liked |
| `GET /api/kudos/spotlight` | GET | No | Sun* Kudos | Spotlight boards |
| `GET /api/kudos/stats` | GET | No | Sun* Kudos | General statistics |
| `GET /api/kudos/top-sunners` | GET | No | Sun* Kudos | Top 10 recipients |
| `POST /api/kudos/:id/like` | POST | Yes | Sun* Kudos | Like a kudos |
| `DELETE /api/kudos/:id/like` | DELETE | Yes | Sun* Kudos | Unlike a kudos |
| `GET /api/admin/special-days` | GET | No (cached) | Sun* Kudos | Check special day status |
| `GET /api/awards` | GET | No | Awards, Homepage | Award category data |
| `GET /api/users/search` | GET | Yes | Viet Kudos | Search sunner by name |
| `GET /api/kudos/hashtags` | GET | Yes | Viet Kudos | Available hashtag list |
| `POST /api/kudos` | POST | Yes | Viet Kudos | Submit new kudos |
| `POST /api/upload` | POST | Yes | Viet Kudos | Upload image to Supabase Storage |

---

## Authentication Flow

- Authentication: Supabase Auth Google OAuth only
- Session: `HttpOnly`, `Secure`, `SameSite=Strict` cookie — `localStorage` is FORBIDDEN
- Middleware: Next.js middleware checks session on every request; pre-launch gate runs before auth check
- RLS: Enabled on all user-data tables (kudos, likes, users)

---

## Discovery Log

| Date | Action | Screens | Notes |
|------|--------|---------|-------|
| 2026-04-22 | Initial discovery | Login (GzbNeVGJHz) | MoMorph returned no registered frames; documented from Figma + constitution |
| 2026-04-22 | Expanded discovery | +6 screens from yêu cầu.csv | Frame IDs found via list_frames API; all specs created |
| 2026-04-29 | Screen spec created | Award System (zFYDgyj_pD) | Full node tree analysis; screen_specs/award-system.md created; Footer has 4 nav links (node 1161:9487 is the 4th); D5 Signature has 2 prize tiers with "Hoặc" separator |
| 2026-04-29 | Flow updated | All screens | Primary flow confirmed: `/countdown` (Prelaunch) → `/login` (Login) → `/` (Homepage). Root path `/` = Homepage. Prelaunch moved to `/countdown`. |

---

## Open Questions / Next Steps

- [x] Homepage route confirmed: `/` (root path = homepage). Prelaunch at `/countdown`. Flow: `/countdown` → `/login` → `/`.
- [ ] Confirm Dashboard frame ID and route from design team
- [ ] Confirm "About SAA 2025" CTA on homepage: in-page scroll to awards section, OR navigate to `/awards`?
- [x] `/awards#category` hash behavior confirmed: left nav click updates URL hash via `router.replace()` (no new history entry per TR-003 in Award System spec). Invalid or missing hash defaults to `#top-talent`.
- [ ] Confirm Sun* Kudos feed auto-refresh interval (or polling vs WebSocket)
- [ ] Run `momorph.screenflow` again once Dashboard frame is available
