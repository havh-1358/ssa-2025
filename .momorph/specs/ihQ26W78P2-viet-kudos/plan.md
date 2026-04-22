# Implementation Plan: Viet Kudos (Write Kudos Modal)

**Frame**: `ihQ26W78P2-viet-kudos`
**Date**: 2026-04-22
**Spec**: `specs/ihQ26W78P2-viet-kudos/spec.md`

---

## Summary

The Viet Kudos screen is a modal form (752×1012px, cream background) overlaid on the Sun* Kudos page. Authenticated users search for a recipient, write a recognition title + rich text message, optionally add hashtags and an image, and optionally send anonymously. On submission, `POST /api/kudos` creates the Kudos; the modal closes and the new Kudos appears at the top of the live feed. All server-side validation uses Zod. Rich text is sanitized with DOMPurify before storage and render. Image upload uses Supabase Storage (`kudos-images` bucket, authenticated users only).

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js App Router
**Primary Dependencies**: React 19, Tailwind CSS 4, next-intl, Supabase JS client, DOMPurify, Tiptap (rich text editor)
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
| IV. Layered Arch | Modal → Form sections → API client → Supabase | ✅ Planned |
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
  - `<TitleInput />` — Controlled text input; character counter > 80 chars
  - `<MessageEditor />` — Tiptap rich text editor (bold, italic); `268px` fixed height; character counter > 800 chars
  - `<HashtagChips />` — Pill-shaped selectable chips; loaded from `GET /api/kudos/hashtags`; max 5 selected
  - `<ImageUpload />` — Dashed border upload area; preview on selection; upload to Supabase Storage; progress indicator
  - `<AnonymousToggle />` — Checkbox with label; label darkens on checked
  - `<ModalActions />` — Cancel (Huy) + Submit (Gui) buttons; loading state; both disabled while submitting

- **Styling Strategy**: Tailwind CSS 4 + CSS custom properties. Modal background is cream (`#FFF8E1`); all modal text is dark (`#00101A`). Overlay is `rgba(0,16,26,0.8)`.

- **Form State**: `useState` for each field (`recipient`, `searchQuery`, `searchResults`, `title`, `message`, `hashtags`, `image`, `imagePreviewUrl`, `uploadedImageUrl`, `isAnonymous`, `isSubmitting`, `errors`). Reset ALL state on modal close.

- **Validation Strategy**:
  - Client-side: inline errors per field using `errors: Record<string, string>` state; check on blur + on submit
  - Server-side: Zod schema in `POST /api/kudos` handler (authoritative); client checks are supplementary
  - Self-send: checked client-side (hide own name from results) AND server-side (`if senderId === recipientId → 400`)

- **Confirmation on accidental close**: If `title` or `message` has content and user presses Escape or clicks outside → show confirmation dialog ("Are you sure? Your Kudos will not be saved." Cancel / Discard). If form is empty → close immediately.

- **Focus trap**: Use `focus-trap-react` library or custom implementation. On open: focus moves to modal title or first input. On close: focus returns to `<WriteKudosButton />` trigger.

### Backend Approach

- **`POST /api/kudos`**:
  - Auth: verify Supabase session cookie; 401 if missing
  - Validation: Zod schema (recipientId required, title 1–100, message 1–1000, hashtags max 5, imageUrl optional, isAnonymous boolean)
  - Self-send check: `if req.userId === body.recipientId → 400 "Cannot send Kudos to yourself"`
  - DOMPurify: sanitize `message` server-side before INSERT
  - INSERT to `kudos` table; return created Kudos object
- **`GET /api/users/search?q={query}`**: Search `users` table by name (iLIKE); return `[{ id, name, avatarUrl }]`; min 2 chars before search
- **`POST /api/upload`**: Receive image file; validate MIME type (image/*) and size (≤ 5MB) with Zod + `file.type`; upload to Supabase Storage `kudos-images` bucket; return `{ url }`
- **`GET /api/kudos/hashtags`**: Return available hashtags from `hashtags` table or static list

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

### Source Code

```text
app/
└── api/
    ├── kudos/
    │   └── route.ts                      # POST /api/kudos (create; Zod + DOMPurify + RLS)
    ├── users/
    │   └── search/route.ts               # GET /api/users/search?q=
    └── upload/
        └── route.ts                      # POST /api/upload (image to Supabase Storage)

components/
└── viet-kudos/
    ├── WriteKudosModal.tsx               # Root modal: role="dialog", focus trap, form state
    ├── ModalOverlay.tsx                  # Overlay backdrop with accidental-close confirmation
    ├── RecipientSearch.tsx               # Debounced search + autocomplete dropdown
    ├── TitleInput.tsx                    # Controlled input + character counter
    ├── MessageEditor.tsx                 # Tiptap rich text editor + character counter
    ├── HashtagChips.tsx                  # Pill chips: load available + track selected (max 5)
    ├── ImageUpload.tsx                   # File input + preview + Supabase upload + progress
    ├── AnonymousToggle.tsx               # Checkbox + label (label darkens when checked)
    └── ModalActions.tsx                  # Cancel + Submit buttons; loading states

hooks/
└── useKudosForm.ts                       # Form state + validation + submit logic (optional — if form grows complex)

lib/
└── upload.ts                             # Supabase Storage upload helper; MIME + size validation
```

### Modified Files

| File | Change |
|------|--------|
| `app/globals.css` | Add modal tokens: `--color-modal-bg`, `--color-overlay`, `--color-modal-text-dark`, `--color-input-border`, `--color-placeholder`, `--color-checkbox-border`, `--border-modal`, `--border-input-radius`, `--modal-padding`, `--modal-gap`, `--field-gap` |
| `components/kudos/WriteKudosButton.tsx` | Add `onClick` to open `<WriteKudosModal />` |
| `components/kudos/KudosPage.tsx` | Render `<WriteKudosModal isOpen onClose onSuccess />` |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@tiptap/react` | `^2.x` | Rich text editor for Kudos message |
| `@tiptap/starter-kit` | `^2.x` | Basic Tiptap extensions (bold, italic, paragraph) |
| `focus-trap-react` | `^10.x` | WCAG-compliant focus trap for modal |
| `dompurify` | `^3.x` | (Already in Kudos plan) XSS sanitization |
| `@types/dompurify` | `^3.x` | (Already in Kudos plan) |

---

## Implementation Strategy

### Phase 0: Asset Preparation

- Verify Supabase Storage `kudos-images` bucket exists; set policy: authenticated users INSERT
- Add modal CSS tokens to `app/globals.css`
- Install `@tiptap/react`, `@tiptap/starter-kit`, `focus-trap-react`

### Phase 1: Foundation (TDD) — API Routes

1. Define `KudosCreateDto` Zod schema (recipientId, title, message, hashtags, imageUrl, isAnonymous)
2. Write failing tests for `POST /api/kudos`:
   - Valid payload → 201 + Kudos object
   - Missing recipient → 422 validation error
   - Self-send → 400
   - Unauthenticated → 401
   - Message > 1000 chars → 422
3. Implement `POST /api/kudos` with DOMPurify sanitization
4. Write failing tests for `GET /api/users/search`:
   - Returns matching users (case-insensitive)
   - Query < 2 chars → returns empty (no DB call)
   - Excludes current user from results
5. Implement `GET /api/users/search`
6. Write failing tests for `POST /api/upload`:
   - Valid image → 201 + `{ url }`
   - Invalid MIME → 422
   - File > 5MB → 422
7. Implement `POST /api/upload` with Supabase Storage

### Phase 2: Core Modal + Recipient Search (US1)

1. Write component tests for `<RecipientSearch />`:
   - Renders search input
   - Debounce: no API call in first 300ms
   - Shows suggestions from API; click to select
   - Shows empty state if no results
   - Shows error state if API fails
2. Implement `<RecipientSearch />` with 300ms debounce
3. Write component tests for `<TitleInput />` (renders, updates state, character counter > 80)
4. Implement `<TitleInput />`
5. Write component tests for `<MessageEditor />` (renders Tiptap, character counter, max 1000)
6. Implement `<MessageEditor />`
7. Write component tests for `<ModalActions />` (disabled while submitting, loading spinner)
8. Implement `<ModalActions />`
9. Write integration test for `<WriteKudosModal />` (happy path submit: fill all fields → click Gui → API called → modal closes)
10. Implement `<WriteKudosModal />` with focus trap + Escape handler + form state reset

### Phase 3: Hashtags + Image Upload (US2 + US3)

1. Write tests for `<HashtagChips />` (load from API, toggle select, max 5 limit)
2. Implement `<HashtagChips />`
3. Write tests for `<ImageUpload />` (file selection → preview; remove → reset; invalid MIME → error; > 5MB → error)
4. Implement `<ImageUpload />` with Supabase Storage upload + progress indicator
5. Wire hashtags and image into `<WriteKudosModal />` form state

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
5. Wire `<ModalOverlay />` with accidental-close confirmation dialog

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
- [x] **Validation**: All required fields; self-send; length limits
- [x] **Recipient search**: Debounce; suggestions; empty state; error state
- [x] **Image upload**: Valid file → preview → upload → CDN URL in payload
- [x] **Anonymous**: Sender hidden on submitted Kudos
- [x] **Focus trap**: Tab cycles within modal; Escape closes with confirmation
- [ ] **Rich text**: Bold/italic formatting preserved in submitted message

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
   - [ ] Escape with empty form → closes immediately (no confirmation)
   - [ ] Escape with content → confirmation dialog appears → Cancel stays → Discard closes
   - [ ] Message at exactly 1000 chars → submit allowed → at 1001 → submit blocked
   - [ ] More than 5 hashtags selected → 6th click blocked → hint shown
   - [ ] Image > 5MB → file rejected → error message shown; form still valid

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
- [ ] `POST /api/kudos` route (this plan creates it)

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
- **`POST /api/kudos` is created in THIS plan**: The Sun* Kudos plan (`MaZUn5xHXZ`) references this endpoint but does not create it. Ensure `app/api/kudos/route.ts` handles both the GET (feed, from Kudos plan) and POST (create, from this plan) methods.
- **`onSuccess` callback pattern**: `<WriteKudosModal onSuccess={(newKudos: Kudos) => void} />` — the parent `<KudosPage />` receives the new Kudos and prepends it to the feed list without a full reload.
- **Supabase Storage anonymous access**: The `kudos-images` bucket MUST require authentication for uploads. Public URLs for display are acceptable (read-only public policy). Never allow unauthenticated writes.
