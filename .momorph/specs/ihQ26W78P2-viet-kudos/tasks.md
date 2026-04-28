# Tasks: Viet Kudos — Write Kudos Modal

**Frame**: `ihQ26W78P2-viet-kudos`
**Prerequisites**: plan.md (required), spec.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4)
- **|**: File path affected by this task

---

## Phase 0: Asset Preparation

**Purpose**: Environment, storage, tokens, and dependency setup required before any code is written.

- [x] T001 Verify `kudos-images` Supabase Storage bucket exists; set INSERT policy for authenticated users only (public read URL is acceptable)
- [x] T002 Add modal CSS tokens to `app/globals.css`: `--color-modal-bg`, `--color-overlay`, `--color-modal-text-dark`, `--color-input-border`, `--color-placeholder`, `--color-checkbox-border`, `--border-modal`, `--border-input-radius`, `--modal-padding`, `--modal-gap`, `--field-gap` | `app/globals.css`
- [x] T003 [P] Install `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline` npm packages
- [x] T004 [P] Install `focus-trap-react ^10.x` npm package

**Checkpoint**: Storage bucket configured, CSS tokens added, all dependencies installed.

---

## Phase 1: Foundation — API Routes (TDD)

**Purpose**: All four auth-required API endpoints that the modal depends on. No user story UI work begins until these are stable.

**CRITICAL**: ALL four endpoints require Supabase session cookie auth. Each handler MUST call `supabase.auth.getUser()` and return `401` if no session exists.

### Zod Schema

- [x] T005 Define `KudosCreateDto` Zod schema: `recipientId` (uuid required), `title` (string 1–100), `message` (string 1–1000), `hashtags` (array max 5 strings), `imageUrl` (string url or null), `isAnonymous` (boolean), `idempotencyKey` (uuid required) | `app/api/kudos/route.ts`

### POST /api/kudos

- [x] T006 Add `export async function POST(...)` handler to existing `app/api/kudos/route.ts`; verify Supabase session cookie — return `401` if missing | `app/api/kudos/route.ts`
- [x] T007 Apply `KudosCreateDto` Zod validation in POST handler; return `422` with field errors on invalid payload | `app/api/kudos/route.ts`
- [x] T008 Add self-send check: `if senderId === recipientId → 400 "Cannot send Kudos to yourself"` | `app/api/kudos/route.ts`
- [x] T009 Add DOMPurify server-side sanitization of `message` field before DB INSERT | `app/api/kudos/route.ts`
- [x] T010 Insert sanitized Kudos into `kudos` table via `lib/kudos-service.ts`; return `201` with created Kudos object | `app/api/kudos/route.ts`
- [x] T011 Add `idempotencyKey` unique constraint check: catch DB unique-constraint violation and return `409 Conflict` | `app/api/kudos/route.ts`

### GET /api/users/search

- [x] T012 Create `app/api/users/search/route.ts`; verify Supabase session — return `401` if missing | `app/api/users/search/route.ts`
- [x] T013 Implement `GET /api/users/search?q={query}`: require `q` min 2 chars (return empty array without DB call if shorter); iLIKE search on `users` table by name; exclude the requesting user from results; return `[{ id, name, avatarUrl }]` | `app/api/users/search/route.ts`

### GET /api/kudos/hashtags

- [x] T014 Confirm `app/api/kudos/hashtags/route.ts` (owned by Sun* Kudos plan) has auth guard — return `401` if Supabase session missing; no new file to create, verify behavior only | `app/api/kudos/hashtags/route.ts`

### POST /api/upload

- [x] T015 Create `app/api/upload/route.ts`; verify Supabase session — return `401` if missing | `app/api/upload/route.ts`
- [x] T016 Validate uploaded file MIME type with Zod + `file.type` (allow: `image/jpeg`, `image/png`, `image/gif`, `image/webp`); validate size ≤ 5MB; return `422` on failure | `app/api/upload/route.ts`
- [x] T017 Upload validated file to Supabase Storage `kudos-images` bucket; return `201` with `{ url }` (CDN public URL) | `app/api/upload/route.ts`

### Upload Helper

- [x] T018 Create `lib/upload.ts` Supabase Storage upload helper with `AbortSignal` 30s timeout via `AbortController`; on timeout reject with timeout error for caller to surface | `lib/upload.ts`

**Checkpoint**: All four API routes implemented and manually verifiable with a REST client. POST /api/kudos accepts the exact payload shape from plan.md.

---

## Phase 2: Core Modal + Recipient Search (US1 + US3)

**Goal**: US1 — recipient selection, title input, message editor, modal actions. US3 — form submission, modal close on success, onSuccess callback.

**Independent Test**: Fill recipient + title + message → click Gui → `POST /api/kudos` called → modal closes.

### Modal Foundation

- [x] T019 [US1] Create `components/viet-kudos/WriteKudosModal.tsx` skeleton: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`; render all child section placeholders; manage `isOpen` prop; apply cream background `#FFF8E1` | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T020 [US1] Add `focus-trap-react` `<FocusTrap>` wrapper to `WriteKudosModal`; on open focus moves to first input; on close focus returns to `<WriteKudosButton />` trigger element | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T021 [US1] Implement Escape key handler in `WriteKudosModal`: if `isDirty === false` close immediately; if `isDirty === true` show confirmation dialog | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T022 [US1] Implement `resetForm()` function in `WriteKudosModal` that resets ALL form state fields to initial values including `isDirty = false` and `errors = {}`; call on modal close | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T023 [US1] Generate `idempotencyKey` (UUID) on each modal open; reset key on `resetForm()` | `components/viet-kudos/WriteKudosModal.tsx`

### Form State

- [x] T024 [US1] Initialize all form state in `WriteKudosModal` with `useState`: `recipient`, `searchQuery`, `searchResults`, `isSearching`, `searchError`, `title`, `message`, `hashtags`, `availableHashtags`, `isLoadingHashtags`, `hashtagsError`, `image`, `imagePreviewUrl`, `uploadedImageUrl`, `isUploading`, `uploadProgress`, `isAnonymous`, `isSubmitting`, `isDirty`, `errors` | `components/viet-kudos/WriteKudosModal.tsx`

### RecipientSearch Component

- [x] T025 [US1] Create `components/viet-kudos/RecipientSearch.tsx`: controlled search input that calls `GET /api/users/search?q=` with 300ms debounce; set `isSearching = true` while request is in flight | `components/viet-kudos/RecipientSearch.tsx`
- [x] T026 [US1] Implement suggestions dropdown in `RecipientSearch`: max-height `240px`, `overflow-y: auto`, `z-index: 50`; render each result as a clickable row (`{ id, name, avatarUrl }`); clicking a row selects recipient and closes dropdown | `components/viet-kudos/RecipientSearch.tsx`
- [x] T027 [US1] Add `isSearching` loading indicator inside `RecipientSearch` dropdown while API call is in flight; show "No results found" (Montserrat 400 14px `#999999` centered) when results array is empty and query length ≥ 2 | `components/viet-kudos/RecipientSearch.tsx`
- [x] T028 [US1] Add `searchError` error state to `RecipientSearch`: render "Unable to search right now — try again" message and a Retry button below the input; clicking Retry re-triggers the last query and clears `searchError` on re-attempt | `components/viet-kudos/RecipientSearch.tsx`

### TitleInput Component

- [x] T029 [US1] Create `components/viet-kudos/TitleInput.tsx`: controlled text input (max 100 chars); character counter hidden when `title.length <= 80`; counter appears (`#999999`) when `title.length > 80`; counter turns `#EF4444` when `title.length >= 80` (warning and at limit) | `components/viet-kudos/TitleInput.tsx`

### MessageEditor Component

- [x] T030 [US1] Create `components/viet-kudos/MessageEditor.tsx` as a Tiptap editor component: import `useEditor` from `@tiptap/react`; include `StarterKit` + `Underline` extension; fixed height `268px`; toolbar with Bold, Italic, Underline buttons each with `aria-label` and `aria-pressed` | `components/viet-kudos/MessageEditor.tsx`
- [x] T031 [US1] Wire character counter in `MessageEditor` using `editor.getText().length` (NOT raw HTML length); counter turns `#EF4444` at ≥ 800 chars; submit blocked at > 1000 chars | `components/viet-kudos/MessageEditor.tsx`
- [x] T032 [US1] Apply DOMPurify client-side sanitization in `MessageEditor` on output before passing `message` value to parent | `components/viet-kudos/MessageEditor.tsx`
- [x] T033 [US1] Wrap `MessageEditor` with `next/dynamic` (`ssr: false`) at the import site in `WriteKudosModal` to prevent SSR errors from Tiptap browser APIs | `components/viet-kudos/WriteKudosModal.tsx`

### ModalActions Component

- [x] T034 [US1] Create `components/viet-kudos/ModalActions.tsx`: Cancel ("Huy") + Submit ("Gui") buttons; both buttons `disabled` while `isSubmitting === true`; Submit button shows loading spinner while submitting | `components/viet-kudos/ModalActions.tsx`

### Submit Handler (US3)

- [x] T035 [US3] Implement submit handler in `WriteKudosModal`: at the very start call `setErrors({})` (error auto-clear); run client-side validation; set `isSubmitting = true`; call `POST /api/kudos` with full payload including `idempotencyKey` | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T036 [US3] On successful `POST /api/kudos` response: call `resetForm()`; call `onClose()`; call `onSuccess(newKudos)` with returned Kudos object | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T037 [US3] On `POST /api/kudos` error: set `isSubmitting = false`; surface error toast "Failed to send Kudos — please try again"; keep modal open | `components/viet-kudos/WriteKudosModal.tsx`

### isDirty Tracking

- [x] T038 [US1] Compute `isDirty` reactively: `isDirty = title.trim().length > 0 || editor.getText().trim().length > 0`; update on every `title` change and every Tiptap `onUpdate` event | `components/viet-kudos/WriteKudosModal.tsx`

**Checkpoint**: US1 + US3 complete. Recipient search, title, message, submit, and modal close all function independently.

---

## Phase 3: Hashtags + Image Upload (US2)

**Goal**: US2 — hashtag chip selection and single image upload with progress and timeout.

**Independent Test**: Select hashtags → attach image → submit → `POST /api/kudos` payload includes `hashtags[]` and `imageUrl` CDN string.

### HashtagChips Component

- [x] T039 [US2] Create `components/viet-kudos/HashtagChips.tsx`: fetch available hashtags from `GET /api/kudos/hashtags` on mount; set `isLoadingHashtags = true` during fetch; render skeleton placeholder chips while loading | `components/viet-kudos/HashtagChips.tsx`
- [x] T040 [US2] Render pill-shaped selectable chips in `HashtagChips`; selected chips show `#FFEA9E` background; toggling a chip adds/removes it from `selectedHashtags` | `components/viet-kudos/HashtagChips.tsx`
- [x] T041 [US2] Enforce max 5 hashtags in `HashtagChips`: when 5 are selected, all unselected chips render in disabled state (`opacity: 0.5`, `#999999` text, `1px solid #999999` border, `cursor: not-allowed`) and click is no-op; show "Maximum 5 hashtags reached" hint below chip row | `components/viet-kudos/HashtagChips.tsx`
- [x] T042 [US2] Add `hashtagsError` retry UI in `HashtagChips`: when fetch fails set `hashtagsError`; show error message and "Retry" button; clicking Retry re-fetches hashtag list and clears `hashtagsError` on success | `components/viet-kudos/HashtagChips.tsx`

### ImageUpload Component

- [x] T043 [US2] Create `components/viet-kudos/ImageUpload.tsx`: dashed border upload area with `<input type="file" accept="image/jpeg,image/png,image/gif,image/webp" />`; single file only | `components/viet-kudos/ImageUpload.tsx`
- [x] T044 [US2] Add client-side MIME type and size (≤ 5MB) validation in `ImageUpload` before upload attempt; show inline error and do NOT upload on invalid file | `components/viet-kudos/ImageUpload.tsx`
- [x] T045 [US2] On valid file selection in `ImageUpload`: show image preview; set `isUploading = true`; call `POST /api/upload` via `lib/upload.ts` helper with `AbortController` 30s `AbortSignal`; show `uploadProgress` indicator | `components/viet-kudos/ImageUpload.tsx`
- [x] T046 [US2] On successful upload in `ImageUpload`: set `uploadedImageUrl` to returned CDN URL string; set `isUploading = false`; show replace/remove controls | `components/viet-kudos/ImageUpload.tsx`
- [x] T047 [US2] On upload timeout (30s) in `ImageUpload`: abort the request; surface "Upload timed out — please try again" error; allow retry without requiring the user to re-select the file | `components/viet-kudos/ImageUpload.tsx`
- [x] T048 [US2] Add remove image control in `ImageUpload`: clicking remove resets `image`, `imagePreviewUrl`, `uploadedImageUrl`, `uploadProgress` to initial values | `components/viet-kudos/ImageUpload.tsx`

### Wire into WriteKudosModal

- [x] T049 [US2] Wire `HashtagChips` and `ImageUpload` into `WriteKudosModal`: pass `selectedHashtags` + setter to `HashtagChips`; pass `uploadedImageUrl` + upload state props to `ImageUpload`; include `hashtags` and `imageUrl` in POST payload | `components/viet-kudos/WriteKudosModal.tsx`

**Checkpoint**: US1 + US2 + US3 complete. Hashtags and image upload flow with all four states (loading, error, disabled, selected) verified.

---

## Phase 4: Anonymous Toggle + Inline Validation (US4)

**Goal**: US4 — anonymous checkbox, per-field inline validation errors, isDirty-gated confirmation dialog on accidental close.

**Independent Test**: Enable anonymous → submit → Kudos card shows "Anonymous". Escape with content → confirmation dialog appears.

### AnonymousToggle Component

- [x] T050 [US4] Create `components/viet-kudos/AnonymousToggle.tsx`: checkbox input with label "Send anonymously"; label text darkens (from `#999999` to `#00101A`) when `isAnonymous === true`; pass `isAnonymous` and `onChange` as props | `components/viet-kudos/AnonymousToggle.tsx`

### Inline Validation Errors

- [x] T051 [US4] Add client-side validation logic in `WriteKudosModal` submit handler (runs after `setErrors({})` reset): missing recipient → `errors.recipient = "Please select a recipient"`; missing title → `errors.title = "Title is required"`; missing message → `errors.message = "Message is required"` | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T052 [US4] Add additional validation rules: self-send → `errors.recipient = "You cannot send a Kudos to yourself"`; title > 100 chars → `errors.title = "Title is too long (max 100 characters)"`; message > 1000 chars → `errors.message = "Message is too long (max 1000 characters)"` | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T053 [US4] Render per-field inline error messages below each input in `RecipientSearch`, `TitleInput`, and `MessageEditor`; error text style: Montserrat 400 12px `#EF4444` | `components/viet-kudos/RecipientSearch.tsx`
- [x] T054 [US4] Disable Submit ("Gui") button when form is invalid (required fields missing or length limits exceeded) | `components/viet-kudos/ModalActions.tsx`

### ModalOverlay + isDirty Confirmation Dialog

- [x] T055 [US4] Create `components/viet-kudos/ModalOverlay.tsx`: `fixed inset-0` overlay with `background: rgba(0,16,26,0.8)`; accepts `isDirty`, `onClose`, `onConfirmDiscard` props | `components/viet-kudos/ModalOverlay.tsx`
- [x] T056 [US4] Implement click-outside handler in `ModalOverlay`: if `isDirty === false` call `onClose()` immediately; if `isDirty === true` show confirmation dialog "Are you sure? Your Kudos will not be saved." with Cancel (stay) and Discard (call `onClose()` + `resetForm()`) actions | `components/viet-kudos/ModalOverlay.tsx`
- [x] T057 [US4] Wire `ModalOverlay` into `WriteKudosModal`: replace raw overlay div; pass `isDirty`, `onClose`, and `resetForm` to `ModalOverlay` | `components/viet-kudos/WriteKudosModal.tsx`

**Checkpoint**: All four user stories complete. Full modal flow with anonymous, validation errors, and confirmation dialog verified.

---

## Phase 5: Integration + Polish

**Purpose**: Wire modal into KudosPage, onSuccess feed prepend, responsive layout, animations, toasts, and idempotency.

### KudosPage Integration

- [x] T058 Add `onClick` handler to `components/kudos/WriteKudosButton.tsx` that opens `WriteKudosModal` (sets `isOpen = true`) | `components/kudos/WriteKudosButton.tsx`
- [x] T059 Render `<WriteKudosModal isOpen onClose onSuccess />` inside `components/kudos/KudosPage.tsx`; manage `isOpen` state in `KudosPage` | `components/kudos/KudosPage.tsx`
- [x] T060 Implement `onSuccess(newKudos: Kudos)` callback in `KudosPage`: prepend `newKudos` to the feed list state without a full page reload | `components/kudos/KudosPage.tsx`

### Responsive Layout

- [x] T061 [P] Apply responsive modal sizing in `WriteKudosModal`: desktop 752px fixed width; tablet 90vw (`@media (max-width: 1024px)`); mobile full-screen bottom sheet (`@media (max-width: 640px)`) | `components/viet-kudos/WriteKudosModal.tsx`

### Animations

- [x] T062 [P] Add modal open/close animation in `WriteKudosModal`: fade in + slide up 250ms ease on open; fade out + slide down 200ms ease on close | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T063 [P] Add `@media (prefers-reduced-motion: reduce)` override: fade only (no slide) for both open and close | `app/globals.css`

### Toasts

- [x] T064 [P] Show success toast "Your Kudos has been sent!" on successful submission inside `WriteKudosModal` (or via KudosPage toast system) | `components/viet-kudos/WriteKudosModal.tsx`

### Optional Form State Hook

- [x] T065 [P] Extract complex form state and submit logic from `WriteKudosModal` into `hooks/useKudosForm.ts` if the component exceeds 400 lines; hook must expose all state fields and `resetForm`, `handleSubmit`, `isDirty`, `errors` | `hooks/useKudosForm.ts`

**Checkpoint**: Full feature complete. New Kudos appears at top of feed after submit. All responsive breakpoints confirmed.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0**: No dependencies — start immediately
- **Phase 1**: Depends on Phase 0 (bucket + deps) — BLOCKS all component work
- **Phase 2** (US1, US3): Depends on Phase 1 API routes being complete
- **Phase 3** (US2): Depends on Phase 1 (`POST /api/upload`, `GET /api/kudos/hashtags`); can start in parallel with Phase 2 if staffed
- **Phase 4** (US4): Depends on Phase 2 (`WriteKudosModal` skeleton must exist)
- **Phase 5**: Depends on all Phase 2–4 components being complete

### Within Each Phase

- API route handlers: schema → auth guard → validation → business logic → idempotency
- Components: skeleton structure → state wiring → async behavior → error/loading states
- `WriteKudosModal`: after each child component lands, wire it in and verify form state is still coherent

### Parallel Opportunities

- T003 and T004 (package installs) can run in parallel
- T012–T013 (`GET /api/users/search`) and T015–T017 (`POST /api/upload`) can be built in parallel
- T025–T028 (`RecipientSearch`), T029 (`TitleInput`), and T030–T032 (`MessageEditor`) can be built in parallel
- T039–T042 (`HashtagChips`) and T043–T048 (`ImageUpload`) can be built in parallel
- T058–T060 (KudosPage wiring) and T061–T064 (polish) can run in parallel once Phase 4 is done

---

## Implementation Notes

- `MessageEditor` MUST be imported with `dynamic(() => import('./MessageEditor'), { ssr: false })` — Tiptap uses browser APIs unavailable in SSR
- Character count in `MessageEditor`: ALWAYS use `editor.getText().length`, never `.getHTML().length`
- `isSearching` and `isLoadingHashtags` are SEPARATE booleans — never merge into a shared `isLoading`
- `errors` MUST be reset to `{}` at the START of every submit handler call, before any validation runs
- `isDirty` is computed from title + message content only; it does NOT block form submit, only controls close/escape confirmation
- `imageUrl` in the POST payload is a single CDN URL string (or `null`), never a raw File or an array
- The POST handler is ADDED to the existing `app/api/kudos/route.ts` — do NOT create a new file
- `GET /api/kudos/hashtags` is owned by the Sun* Kudos plan — only verify auth guard, do not duplicate the file
