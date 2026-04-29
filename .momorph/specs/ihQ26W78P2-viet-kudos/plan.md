# Implementation Plan: Viet Kudos (Write Kudos Modal)

**Frame**: `ihQ26W78P2-viet-kudos`
**Date**: 2026-04-22
**Last Updated**: 2026-04-29
**Spec**: `specs/ihQ26W78P2-viet-kudos/spec.md`

---

## Implementation Status

> **⚠️ Partially implemented.** All component files, API routes, hooks, and library files have been created. This plan governs what STILL needs completion, testing, and validation. Treat "New Files" below as "Exists — complete/test/fix."

---

## Summary

The Viet Kudos screen is a modal form (752×1012px, cream background) overlaid on the Sun* Kudos page. Authenticated users search for a recipient, write a recognition title + rich text message, optionally add hashtags and an image, and optionally send anonymously. On submission, `POST /api/kudos` creates the Kudos; the modal closes and the new Kudos appears at the top of the live feed. All server-side validation uses Zod. Rich text is sanitized with DOMPurify before storage and render. Image upload uses Supabase Storage (`kudos-images` bucket, authenticated users only).

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js App Router
**Primary Dependencies**: React 19, Tailwind CSS 4, next-intl, Supabase JS client, DOMPurify, Tiptap v3 (`@tiptap/react ^3.x`, `@tiptap/starter-kit ^3.x`, `@tiptap/extension-underline ^3.x` — see ⚠️ Strikethrough note), `focus-trap-react ^10.x`, `focus-trap ^7.x` (used by `useFocusTrap.ts` hook)
**Database**: Supabase (PostgreSQL + Storage)
**Testing**: Vitest + React Testing Library; Playwright E2E
**State Management**: React `useState` for all form fields; `useReducer` optional if state grows; debounced recipient search
**API Style**: REST (`POST /api/kudos`, `GET /api/users/search`, `POST /api/upload`, `GET /api/kudos/hashtags`)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Requirement | Constitution Rule | Status |
|-------------|-------------------|--------|
| I. Type Safety | Strict TS; `KudosFormData` type; Zod schema on all API routes | ✅ Planned |
| II. Design Fidelity | All hex tokens → CSS vars in `globals.css`; modal on cream `#FFF8E1` | ✅ Planned |
| II. Responsive | Desktop: 752px; Tablet: 90vw; Mobile: full-screen bottom sheet | ✅ Planned |
| II. WCAG 2.1 AA | `role="dialog"` + `aria-modal` + `aria-labelledby`; focus trap; Escape to close | ✅ Planned |
| III. Test-First | Tests before components | ✅ Planned |
| IV. Layered Arch | Modal → Form sections → API client → `kudos-service.ts` → `kudos-repository.ts` → Supabase | ✅ Planned |
| IV. Clean Code | Debounced recipient search (300ms); form state reset on close | ✅ Planned |
| V. Doc-Driven | spec.md + plan.md exist | ✅ Met |
| VI. Security | DOMPurify on message; Supabase Storage bucket policy auth-only; server-side self-send check; Zod validation | ✅ Planned |

**Violations**: None.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure** (all Client Components — modal requires interactivity):
  - `<WriteKudosModal />` — Root modal; `role="dialog"` + `aria-modal` + focus trap; opened by `<WriteKudosButton />` from Kudos page
  - `<ModalOverlay />` — `fixed inset-0 bg-[rgba(0,16,26,0.8)]`; click outside closes with confirmation if form has content
  - `<RecipientSearch />` — Debounced search input; autocomplete suggestions dropdown; `GET /api/users/search`
  - `<TitleInput />` — Controlled text input; character counter appears when > 80 chars used (12px Montserrat 400, `#999999`, turns `#EF4444` at ≥ 80 chars warning and at 100-char limit)
  - `<MessageEditor />` — Tiptap rich text editor (bold, italic, **underline** minimum); `268px` fixed height; character counter appears when > 800 chars used (12px Montserrat 400, `#999999`, turns `#EF4444` at ≥ 800 chars warning and at limit); DOMPurify sanitization on output
  - `<HashtagChips />` — Pill-shaped selectable chips; loaded from `GET /api/kudos/hashtags`; max 5 selected; when 5 are selected, all unselected chips render in `disabled` visual state (`opacity: 0.5`, `#999999` text, `cursor: not-allowed`) and are not clickable; "Maximum 5 hashtags reached" hint shown below chip row
  - `<ImageUpload />` — Dashed border upload area; preview on selection; upload to Supabase Storage; progress indicator
  - `<AnonymousToggle />` — Checkbox with label; label darkens on checked
  - `<ModalActions />` — Cancel (Huy) + Submit (Gui) buttons; loading state; both disabled while submitting

- **Styling Strategy**: Tailwind CSS 4 + CSS custom properties. Modal background is cream (`#FFF8E1`); all modal text is dark (`#00101A`). Overlay is `rgba(0,16,26,0.8)`.

- **Form State**: `useState` for each field:
  - `recipient`, `searchQuery`, `searchResults` — recipient selection
  - `isSearching` — `true` while `GET /api/users/search` is in flight (shows loading indicator in dropdown)
  - `searchError` — error message if recipient search API fails (enables retry UI)
  - `title`, `message` — text fields
  - `hashtags`, `availableHashtags` — hashtag selection
  - `isLoadingHashtags` — `true` while `GET /api/kudos/hashtags` is in flight (chips show skeleton)
  - `hashtagsError` — error message if hashtag list API fails; show retry option
  - `images: File[]`, `imagePreviewUrls: string[]`, `uploadedImageUrls: string[]`, `isUploading`, `uploadProgress` — max 5 images; each upload call returns one CDN URL; collect all before submitting
  - `isAnonymous`, `isSubmitting`
  - `isDirty` — `true` when `title` or `message` has any content; drives the cancel-confirmation dialog
  - `errors: Record<string, string>` — per-field validation errors; **reset to `{}` at the start of each new submit attempt** (error auto-clear)
  - Reset ALL state on modal close.

- **Validation Strategy**:
  - Client-side: inline errors per field using `errors: Record<string, string>` state; check on blur + on submit
  - Server-side: Zod schema in `POST /api/kudos` handler (authoritative); client checks are supplementary
  - Self-send: checked client-side (hide own name from results) AND server-side (`if senderId === recipientId → 400`)

- **Confirmation on accidental close**: Driven by `isDirty` state (set to `true` whenever `title` or `message` has any content). If `isDirty === true` and user presses Escape or clicks outside → show confirmation dialog ("Are you sure? Your Kudos will not be saved." Cancel / Discard). If `isDirty === false` → close immediately.

- **Focus trap**: Use `focus-trap-react` library or custom implementation. On open: focus moves to modal title or first input. On close: focus returns to `<WriteKudosButton />` trigger.

### Backend Approach

- **`POST /api/kudos`**:
  - Auth: verify Supabase session cookie; 401 if missing
  - Validation: Zod schema (recipientId required, title 1–100, message 1–1000, hashtags max 5, imageUrl optional CDN URL string, isAnonymous boolean)
  - Self-send check: `if req.userId === body.recipientId → 400 "Cannot send Kudos to yourself"`
  - DOMPurify: sanitize `message` server-side before INSERT
  - INSERT to `kudos` table; return created Kudos object
  - **Exact payload shape** (must match Zod schema):
    ```json
    {
      "recipientId": "uuid",
      "title": "string (1–100 chars)",
      "message": "string (HTML, plain-text equivalent 1–1000 chars)",
      "hashtags": ["string"],
      "imageUrls": ["string"],
      "isAnonymous": false,
      "idempotencyKey": "uuid (client-generated on modal open)"
    }
    ```
  - **⚠️ API migration required**: Current implementation uses `imageUrl: string | null` (singular) with internal conversion to `imageUrls`. This must be migrated to `imageUrls: string[]` (max 5) to match the design (5-image support). Update the Zod schema in `app/api/kudos/route.ts` from `imageUrl: z.string().url().nullable().optional()` to `imageUrls: z.array(z.string().url()).max(5).default([])`. The `BACKEND_API_TESTCASES.md` test cases (`KUDOS_POST_03`, `KUDOS_POST_17`) still use the old `imageUrl` field — update those test cases as part of this migration.
  - Each image is uploaded individually to `POST /api/upload` (returns one CDN URL per call). Client calls it up to 5 times, collects all CDN URLs, then sends them in `imageUrls[]` inside `POST /api/kudos`. Never send raw File objects.
- **`GET /api/users/search?q={query}`**: **Auth required** (Supabase session cookie; 401 if missing); search `users` table by name (iLIKE); return `[{ id, name, avatarUrl }]`; min 2 chars before search; excludes current user from results (server-side filter + client-side hide)
- **`GET /api/kudos/hashtags`**: **Auth required** (Supabase session cookie; 401 if missing); return available hashtags from `hashtags` table or static list; RLS policy applies
- **`POST /api/upload`**: **Auth required**; receive image file; validate MIME type (image/jpeg, image/png, image/gif, image/webp) and size (≤ 5MB) with Zod + `file.type`; upload to Supabase Storage `kudos-images` bucket; return `{ url }` (CDN URL)

> **API auth note**: ALL four endpoints (`GET /api/users/search`, `GET /api/kudos/hashtags`, `POST /api/kudos`, `POST /api/upload`) require an authenticated Supabase session cookie. Each route handler MUST call `supabase.auth.getUser()` and return 401 if no session. RLS policies on Supabase tables enforce access at the DB layer as a second line of defense.

### Integration Points

- **Sun* Kudos page**: `<WriteKudosModal />` is rendered inside `<KudosPage />` (Kudos plan). `<WriteKudosButton />` controls `isOpen` state. On `onSuccess(newKudos)` callback → Kudos page prepends to feed.
- **Supabase Storage**: `kudos-images` bucket; policy: `authenticated users` can INSERT; public URL after upload
- **DOMPurify**: Client-side in `<MessageEditor />` (preview sanitization); server-side in `POST /api/kudos` before DB insert

---

## Project Structure

### Documentation

```text
.momorph/specs/ihQ26W78P2-viet-kudos/
├── spec.md
├── design-style.md
└── plan.md   ← this file
```

### Source Code (all files already exist — see Implementation Status above)

```text
app/
└── api/
    ├── kudos/
    │   └── route.ts             ✅ EXISTS — GET + POST handlers; needs imageUrl→imageUrls migration
    ├── users/
    │   └── search/route.ts      ✅ EXISTS — GET /api/users/search?q= (2-char minimum)
    └── upload/
        └── route.ts             ✅ EXISTS — POST /api/upload; MIME + 5MB validation

components/
└── viet-kudos/
    ├── WriteKudosModal.tsx      ✅ EXISTS — root modal with FocusTrap, dynamic MessageEditor import
    ├── ModalOverlay.tsx         ✅ EXISTS — backdrop with confirmation dialog
    ├── RecipientSearch.tsx      ✅ EXISTS — 300ms debounce + suggestions dropdown
    ├── TitleInput.tsx           ✅ EXISTS — "Danh hiệu" input + character counter
    ├── MessageEditor.tsx        ✅ EXISTS — Tiptap v3; uses Underline (⚠️ design shows Strikethrough)
    ├── HashtagChips.tsx         ✅ EXISTS — max 5; loading skeleton; disabled state
    ├── ImageUpload.tsx          ✅ EXISTS — single file only (⚠️ needs multi-file up to 5)
    ├── AnonymousToggle.tsx      ✅ EXISTS — checkbox + label colour change
    └── ModalActions.tsx         ✅ EXISTS — Cancel + Submit with loading/disabled states

hooks/
├── useKudosForm.ts              ✅ EXISTS — form state + validation + submit (used by WriteKudosModal)
└── useFocusTrap.ts              ✅ EXISTS — lower-level focus trap using `focus-trap` package

lib/
└── upload.ts                    ✅ EXISTS — uploadKudosImage() with 30s AbortController timeout
```

### Still Needed / Outstanding Changes

| File | Outstanding Change |
|------|-------------------|
| `app/api/kudos/route.ts` | Migrate `imageUrl: z.string().url().nullable().optional()` → `imageUrls: z.array(z.string().url()).max(5).default([])` in the Zod schema (⚠️ breaking change — update `BACKEND_API_TESTCASES.md` KUDOS_POST_03/17 too) |
| `components/viet-kudos/MessageEditor.tsx` | Add `@tiptap/extension-link`; toolbar: replace Underline button with Strikethrough (use `StarterKit`'s built-in `Strike`); add Link button; add "Tiêu chuẩn cộng đồng" link button → `ROUTES.GENERAL_STANDARDS` |
| `components/viet-kudos/ImageUpload.tsx` | Upgrade from single-file to multi-file (up to 5); add `+Image` button visibility logic; update state to `images: File[]` |
| `hooks/useKudosForm.ts` | Update `imageUrl` → `imageUrls: string[]` in submit payload; update form state for multi-image |
| `app/globals.css` | Verify all modal tokens exist: `--color-modal-bg`, `--color-overlay`, `--color-modal-text-dark`, `--color-input-border`, `--color-placeholder`, `--color-checkbox-border`, `--border-modal`, `--border-input-radius`, `--modal-padding`, `--modal-gap`, `--field-gap`, `--color-required-star: #CF1322`, `--color-community-link: #E46060` |

### Dependencies

| Package | Version | Status | Purpose |
|---------|---------|--------|---------|
| `@tiptap/react` | `^3.22.4` | ✅ Installed | Rich text editor for Kudos message |
| `@tiptap/starter-kit` | `^3.22.4` | ✅ Installed | Bold, Italic, Strike, OrderedList, Blockquote (no Link) |
| `@tiptap/extension-underline` | `^3.22.4` | ✅ Installed (⚠️ see note) | Underline — installed but design shows Strikethrough (S); Strikethrough is in StarterKit |
| `@tiptap/extension-link` | `^3.x` | ❌ Missing | Link (⛓) toolbar button — NOT in StarterKit, must install |
| `focus-trap-react` | `^10.x` | ✅ Installed | Modal uses `<FocusTrap />` component from this package |
| `focus-trap` | `^7.x` | ✅ Installed | Used by `hooks/useFocusTrap.ts` (lower-level API) |
| `dompurify` | `^3.x` | ✅ Installed | XSS sanitization |
| `@types/dompurify` | `^3.x` | ✅ Installed | TypeScript types for DOMPurify |

---

## Implementation Strategy

### Phase 0: Asset Preparation

- Verify Supabase Storage `kudos-images` bucket exists; set policy: authenticated users INSERT
- Verify and complete modal CSS tokens in `app/globals.css` (see Still Needed / Outstanding Changes)
- Install `@tiptap/extension-link` (missing — needed for Link toolbar button)
- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `focus-trap-react` — ✅ already installed

### Phase 1: Foundation (TDD) — API Routes

1. Define `KudosCreateDto` Zod schema (recipientId, title, message, hashtags, imageUrl, isAnonymous, idempotencyKey)
2. Write failing tests for `POST /api/kudos`:
   - Valid payload → 201 + Kudos object
   - Missing recipient → 422 validation error
   - Self-send → 400
   - Unauthenticated → 401
   - Message > 1000 chars → 422
   - Duplicate `idempotencyKey` → 409 Conflict
   - `imageUrl` is a CDN string URL (not a File object) — Zod validates it is a string or null
3. Implement `POST /api/kudos` with DOMPurify sanitization
4. Write failing tests for `GET /api/users/search`:
   - Returns matching users (case-insensitive)
   - Query < 2 chars → returns empty (no DB call)
   - Excludes current user from results
   - Unauthenticated → 401
5. Implement `GET /api/users/search`
6. Write failing tests for `GET /api/kudos/hashtags`:
   - Unauthenticated → 401
   - Returns hashtag list for authenticated user
7. Write failing tests for `POST /api/upload`:
   - Valid image → 201 + `{ url }`
   - Invalid MIME (non image/* type) → 422
   - File > 5MB → 422
   - Unauthenticated → 401
8. Implement `POST /api/upload` with Supabase Storage

### Phase 2: Core Modal + Recipient Search (US1)

1. Write component tests for `<RecipientSearch />`:
   - Renders search input
   - Debounce: no API call in first 300ms
   - `isSearching` is `true` while request is in flight → loading indicator (spinner or skeleton) shown in dropdown
   - Shows suggestions from API; click to select; dropdown max-height 240px with scroll beyond 5 results
   - Empty state shows "No results found" (Montserrat 400 14px `#999999`, centered) — NOT an error
   - Shows error state "Unable to search right now — try again" when API fails; `searchError` set
   - Retry button re-triggers the last query; clears `searchError` on re-attempt
2. Implement `<RecipientSearch />` with 300ms debounce; dropdown max-height `240px`, `overflow-y: auto`, z-index 50; `isSearching` drives loading indicator; when `searchError` is set, render retry button below the field that re-triggers the last query; empty-state text "No results found" shown when results array is empty
3. Write component tests for `<TitleInput />` (renders, updates state, character counter > 80)
4. Implement `<TitleInput />`
5. Write component tests for `<MessageEditor />` (renders Tiptap, character counter, max 1000)
6. Implement `<MessageEditor />`
7. Write component tests for `<ModalActions />` (disabled while submitting, loading spinner)
8. Implement `<ModalActions />`
9. Write integration test for `<WriteKudosModal />` (happy path submit: fill all fields → click Gui → API called → modal closes)
10. Write integration test for error auto-clear: submit with error → error shown → re-submit → `errors` reset to `{}` at start of new attempt before validation re-runs
11. Implement `<WriteKudosModal />` with focus trap (`focus-trap-react ^10.x`) + Escape handler + `isDirty`-gated confirmation dialog + form state reset; `errors` must be cleared to `{}` at the start of every submit handler invocation

### Phase 3: Hashtags + Image Upload (US2 + US3)

1. Write tests for `<HashtagChips />`:
   - `isLoadingHashtags === true` → chips show skeleton/placeholder
   - `hashtagsError` set → error message + retry button shown
   - Toggle select works; selected chip shows `#FFEA9E` background
   - Exactly 5 selected → unselected chips render `disabled` state (`#999999` text, `1px solid #999999` border); 6th click is a no-op
   - "Maximum 5 hashtags reached" hint appears below chip row when max reached
   - Retry on `hashtagsError` re-fetches hashtag list
2. Implement `<HashtagChips />` with `isLoadingHashtags` skeleton, `hashtagsError` retry UI, and disabled chip state when max 5 reached
3. Write tests for `<ImageUpload />` (add 1 file → preview appears; add up to 5 files → `+Image` button hidden; click `×` → file removed + button reappears; 6th file → rejected silently (button hidden already); invalid MIME → error shown; > 5MB → error shown; upload exceeds 30s → timeout error + retry)
4. Implement `<ImageUpload />` with multi-file support (up to 5): each file is uploaded independently via `POST /api/upload`; collect CDN URLs in `uploadedImageUrls[]`; hide `+Image` button when 5 images attached; per-upload `AbortController` with 30s timeout; "Upload timed out — please try again" on timeout; allow retry without re-selecting the file
5. Wire hashtags and multi-image into `<WriteKudosModal />` form state; POST payload sends `imageUrls: uploadedImageUrls`

### Phase 4: Anonymous Toggle + Validation (US4)

1. Write tests for `<AnonymousToggle />` (checkbox toggles state; label color changes)
2. Implement `<AnonymousToggle />`
3. Add inline validation errors to all fields:
   - Missing recipient: "Please select a recipient"
   - Missing title: "Title is required"
   - Missing message: "Message is required"
   - Self-send: "You cannot send a Kudos to yourself"
   - Title > 100 chars: "Title is too long (max 100 characters)"
   - Message > 1000 chars: "Message is too long (max 1000 characters)"
4. Submit button disabled when form is invalid
5. Wire `<ModalOverlay />` with `isDirty`-gated confirmation dialog: if `isDirty === true` on overlay click or Escape, show "Are you sure? Your Kudos will not be saved." dialog with Cancel (stay) / Discard (close + reset) actions; if `isDirty === false`, close immediately without dialog

### Phase 5: Integration + Polish

1. Wire `<WriteKudosModal />` into `<KudosPage />` via `<WriteKudosButton />`
2. On `onSuccess(newKudos)` → Kudos page prepends new Kudos to feed (via callback prop)
3. E2E test: open modal → fill form → submit → verify new Kudos at top of feed
4. E2E test: cancel → verify modal closes → form cleared on reopen
5. E2E test: anonymous submit → verify "Anonymous" shown on feed card
6. Responsive: 90vw on tablet; full-screen bottom sheet on mobile
7. Animation: fade in + slide up 250ms on open; fade out + slide down 200ms on close
8. `prefers-reduced-motion`: fade only (no slide)
9. Toast on success: "Your Kudos has been sent!"
10. Toast on error: "Failed to send Kudos — please try again"
11. Server-side duplicate submission prevention: `POST /api/kudos` MUST check for a recent duplicate (same `senderId` + `recipientId` + `title` within the last 5 seconds) and return `409 Conflict` if detected. Alternatively, include a client-generated `idempotencyKey` (UUID) in the POST body; store it in the DB with a unique constraint and return `409` if the same key is resubmitted. Client-side: submit button is disabled immediately on click (already implemented in Phase 2) to prevent accidental double-tap.
12. All navigation `href` values in modal (e.g., redirect after submit) MUST reference `.momorph/contexts/SCREENFLOW.md` — do not hardcode routes.

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Tiptap editor SSR issue | Medium | Medium | Use dynamic import (`next/dynamic`) with `ssr: false` for `<MessageEditor />`; Tiptap requires browser APIs |
| Supabase Storage bucket not configured | High | High | Configure + set policy in Phase 0 before any upload code |
| DOMPurify missing on server | Medium | High | Add server-side DOMPurify sanitization in `POST /api/kudos`; enforce via code review |
| Focus trap conflicts with native browser focus | Low | Low | Use `focus-trap-react` (well-tested library); fallback to `inert` attribute if needed |
| Rich text character count (HTML vs plain text) | Medium | Medium | Count plain text chars (strip HTML tags before counting); use Tiptap's `getText()` method |
| Accidental form discard (Escape) | Low | Low | Confirmation dialog implemented in Phase 4; spec explicitly requires it |
| Image upload timeout (> 30s) | Low | Low | Show timeout error at 30s; allow retry; Supabase Storage is usually fast |

### Estimated Complexity

- **Frontend**: High (rich text editor, file upload, focus trap, debounced search, confirmation dialog)
- **Backend**: Medium (Zod validation, DOMPurify, Supabase Storage, self-send check)
- **Testing**: High (async search, upload flow, focus management, optimistic feed update)

---

## Integration Testing Strategy

### Test Scope

- [x] **Form submission**: Full happy path (recipient + title + message → submit → Kudos on feed)
- [x] **Validation**: All required fields; self-send; length limits; error auto-clear on re-submit
- [x] **Recipient search**: Debounce 300ms; `isSearching` loading indicator; suggestions; empty state "No results found"; error state with retry
- [x] **Hashtag loading**: `isLoadingHashtags` skeleton; `hashtagsError` retry; disabled chips at max 5
- [x] **Image upload**: Valid file → preview → upload → CDN URL in payload (not raw File)
- [x] **Anonymous**: Sender hidden on submitted Kudos
- [x] **Focus trap** (`focus-trap-react ^10.x`): Tab cycles within modal; Escape closes with `isDirty`-gated confirmation dialog
- [x] **isDirty**: Empty form → immediate close; form with content → confirmation dialog
- [ ] **Rich text**: Bold/italic/underline formatting preserved in submitted message

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Form state; validation; submit flow |
| App ↔ Data Layer | Yes | POST /api/kudos; Supabase Storage upload |
| Cross-platform | Yes | Bottom sheet on mobile; 90vw on tablet |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| `GET /api/users/search` | Mock (msw or jest) | Avoid DB call in component tests |
| `POST /api/kudos` | Mock in component tests | Avoid DB in modal unit tests |
| Supabase Storage | Real in API tests | Verify upload policy works |
| `navigator.clipboard` | N/A (not in this modal) | — |
| Focus trap | Real | Verify WCAG focus behavior |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Open modal → fill recipient, title, message → click Gui → modal closes → new Kudos at top of feed
   - [ ] Anonymous submit → sender shown as "Anonymous" on feed card
   - [ ] Add image → preview shown → submit → image visible in Kudos card

2. **Error Handling**
   - [ ] Missing recipient → submit blocked → inline error shown
   - [ ] Missing message → submit blocked → inline error shown
   - [ ] Self-send → inline error: "You cannot send a Kudos to yourself"
   - [ ] API error on submit → modal stays open → toast shown → button re-enabled

3. **Edge Cases**
   - [ ] Escape with empty form (`isDirty === false`) → closes immediately (no confirmation)
   - [ ] Escape with content (`isDirty === true`) → confirmation dialog appears → Cancel stays → Discard closes
   - [ ] Click overlay with content (`isDirty === true`) → confirmation dialog appears
   - [ ] Message at exactly 1000 chars → submit allowed → at 1001 → submit blocked
   - [ ] Character counter hidden until > 80 chars for title; turns red at ≥ 80 chars warning, red at limit
   - [ ] Character counter visible from start or after first keystroke for message; turns red at ≥ 800 chars, red at 1000 limit
   - [ ] Zero hashtags selected → submit blocked → inline error "Please select at least 1 hashtag"
   - [ ] More than 5 hashtags selected → 6th click blocked → unselected chips go disabled → hint shown
   - [ ] `hashtagsError` set → retry button shown → retry clears error and re-fetches
   - [ ] Image > 5MB → file rejected → error message shown; form still valid
   - [ ] Submit with errors → re-submit → `errors` state reset to `{}` before new validation pass (error auto-clear)
   - [ ] `isSearching === true` while search in flight → loading indicator visible in dropdown

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `POST /api/kudos` route | 100% | High |
| `<RecipientSearch />` debounce | 90%+ | High |
| `<WriteKudosModal />` submit flow | 90%+ | High |
| `<ImageUpload />` validation | 85%+ | High |
| E2E happy path | Key flow | High |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved
- [ ] Supabase project configured (from Sun* Kudos plan Phase 0)
- [ ] `kudos-images` Supabase Storage bucket created with auth policy
- [ ] Authentication implemented (from Login plan)
- [ ] `dompurify` installed (from Sun* Kudos plan)
- [ ] `@tiptap/react` + `@tiptap/starter-kit` + `focus-trap-react` installed
- [ ] Sun* Kudos page exists (modal is opened from there)
- [ ] `app/api/kudos/route.ts` GET handler exists (from Sun* Kudos plan); this plan adds POST handler to same file
- [ ] `app/api/kudos/hashtags/route.ts` exists (from Sun* Kudos plan); Viet Kudos modal reads this endpoint
- [ ] `lib/kudos-service.ts` exists (from Sun* Kudos plan); `POST /api/kudos` handler delegates Kudos creation business logic to this service

### External Dependencies

- Supabase Storage (image uploads)
- Tiptap (rich text editor — open source, no external service)
- DOMPurify (XSS prevention)

---

## Next Steps

1. Ensure Sun* Kudos plan Phase 0 (Supabase config) is complete
2. Install Tiptap and focus-trap-react
3. Run `/momorph.tasks` to generate task breakdown
4. Begin TDD with `POST /api/kudos` (Phase 1)

---

## Notes

- **Tiptap requires `next/dynamic` with `ssr: false`**: Tiptap uses browser APIs that are not available in SSR. Wrap `<MessageEditor />` with `dynamic(() => import('./MessageEditor'), { ssr: false })` to avoid SSR errors.
- **Character count for rich text**: Use Tiptap's `editor.getText().length` to count plain-text characters. Do NOT count HTML tags — the 1000-char limit applies to the readable content, not the raw HTML.
- **DOMPurify is required on BOTH client and server**:
  - Client: preview sanitization in `<MessageEditor />` before display
  - Server: `POST /api/kudos` handler sanitizes message before DB INSERT
- **Form reset is critical**: On `onClose()`, call a dedicated `resetForm()` function that sets ALL state back to initial values. Verify this in tests by reopening the modal after cancelling a partially filled form.
- **`POST /api/kudos` is ADDED to an existing file**: The Sun* Kudos plan (`MaZUn5xHXZ`) creates `app/api/kudos/route.ts` with a `GET` handler. This plan ADDS a `POST` handler to the same file. Do NOT create a new file — export both `GET` and `POST` from the same `route.ts`.
- **`GET /api/kudos/hashtags` is owned by the Sun* Kudos plan**: The `hashtags/route.ts` is created in the Sun* Kudos plan. The Viet Kudos modal calls this same endpoint to populate `<HashtagChips />`. No duplication needed.
- **Server-side idempotency**: To prevent duplicate submissions (e.g., double-tap on slow networks), add an `idempotencyKey` (UUID, generated client-side on modal open) to the `POST /api/kudos` body. Store it in the `kudos` table with a `UNIQUE` constraint. Return `409` if the same key is resubmitted. Client resets the key each time the modal opens.
- **`onSuccess` callback pattern**: `<WriteKudosModal onSuccess={(newKudos: Kudos) => void} />` — the parent `<KudosPage />` receives the new Kudos and prepends it to the feed list without a full reload.
- **Supabase Storage anonymous access**: The `kudos-images` bucket MUST require authentication for uploads. Public URLs for display are acceptable (read-only public policy). Never allow unauthenticated writes.
- **`isDirty` drives confirmation dialog**: Compute `isDirty` as `title.trim().length > 0 || message.trim().length > 0` (or equivalent for Tiptap's plain-text output). Set it reactively on every `title`/`message` change. Reset to `false` on `resetForm()`. Never use `isDirty` to block submit — it only controls the cancel/escape confirmation.
- **Error auto-clear on re-submit**: At the very start of the submit handler, before any validation, call `setErrors({})`. This ensures stale error messages from a prior failed attempt are wiped so the user sees only fresh errors from the new attempt.
- **Hashtag min-1 is frontend-only**: `BACKEND_API_TESTCASES.md` test `KUDOS_POST_16` confirms the backend accepts `hashtags: []` (201 OK). The min-1 constraint is enforced exclusively by the frontend `<HashtagChips />` validation before submission. The backend Zod schema uses `.max(5).default([])` — no minimum. Do NOT add a server-side min-1 check; this is intentional (future API consumers may send 0 hashtags).
- **`isSearching` and `isLoadingHashtags` states**: These are distinct booleans — do not share a single `isLoading` state between the two async operations. Recipient search and hashtag fetch can be in flight simultaneously. Manage each independently.
- **`hashtagsError` retry**: When `GET /api/kudos/hashtags` fails, set `hashtagsError` and show a "Retry" button inside `<HashtagChips />`. Clicking retry calls the hashtag API again and clears `hashtagsError` on success.
- **⚠️ Strikethrough vs Underline bug**: The current `MessageEditor.tsx` uses `@tiptap/extension-underline` (Underline "U") but the Figma design shows "S" (Strikethrough/gạch ngang — C.3 in design items). Fix: Remove the Underline toolbar button; Strikethrough is already in `StarterKit` (use `editor.chain().toggleStrike().run()`). If Underline is kept for other reasons, that is a deliberate deviation from design that must be documented.
- **`@tiptap/extension-link` is missing**: Design toolbar has a Link (⛓) button. `@tiptap/extension-link` is NOT in `package.json`. Install it and add to `MessageEditor.tsx` extensions. Toolbar button: `aria-label="Link"`, click → opens link input dialog.
- **"Tiêu chuẩn cộng đồng" link in toolbar**: This is a navigation link (not a formatting button) that opens the community standards page. Use `ROUTES.GENERAL_STANDARDS` from `lib/constants/routes.ts` (= `"/general-standards"`). Render as `<a href={ROUTES.GENERAL_STANDARDS} target="_blank">` inside the toolbar. Style: `#E46060`, `border-radius: 0 8px 0 0`, right-aligned in the toolbar row.
- **Tiptap v3 vs v2**: All Tiptap packages are v3 (`^3.22.4`). Do NOT use v2 APIs. Key v3 changes: `editor.chain().focus()` pattern unchanged; `useEditor` hook unchanged; `EditorContent` unchanged. Check [Tiptap v3 changelog](https://tiptap.dev) for any API differences if needed.
- **Character counter visibility (title)**: Counter is hidden when `title.length <= 80`; appears (and is `#999999`) when `title.length > 80`; turns `#EF4444` when `title.length >= 80` (warning) and remains red at limit. Note the warning and appearance thresholds are the same (80 chars) per design-style.md.
- **Character counter visibility (message)**: Counter becomes visible once user starts typing (after first keystroke). Turns `#EF4444` at ≥ 800 chars (warning threshold). Submit blocked at > 1000 chars.
- **Multiple image upload (up to 5)**: `<ImageUpload />` accepts up to 5 files. Each file is uploaded separately via `POST /api/upload` (one URL returned per call). The `POST /api/kudos` payload uses `imageUrls: string[]` (max 5 CDN URLs). This requires migrating the existing API from `imageUrl: string | null` (singular) — see ⚠️ note in Backend Approach above.
- **Cancel button border-radius is `4px`**, not `8px`. The `--border-btn-submit: 8px` token applies only to the submit button. The cancel button uses `border-radius: 4px` per Figma.
