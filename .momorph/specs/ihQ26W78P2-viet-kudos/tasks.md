# Tasks: Viet Kudos — Write Kudos Modal

**Frame**: `ihQ26W78P2-viet-kudos`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)
**Last Updated**: 2026-04-29

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3, US4)
- **|**: File path affected by this task
- **[x]**: Completed

---

## Phase 0: Asset Preparation

**Purpose**: Environment, storage, tokens, and dependency setup required before any code is written.

- [x] T001 Verify `kudos-images` Supabase Storage bucket exists; set INSERT policy for authenticated users only (public read URL acceptable)
- [x] T002 Add modal CSS tokens to `app/globals.css`: `--color-modal-bg`, `--color-overlay`, `--color-modal-text-dark`, `--color-input-border`, `--color-placeholder`, `--color-checkbox-border`, `--border-modal`, `--border-input-radius`, `--modal-padding`, `--modal-gap`, `--field-gap` | `app/globals.css`
- [x] T003 [P] Install `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline` npm packages
- [x] T004 [P] Install `focus-trap-react ^10.x` and `focus-trap ^7.x` npm packages

**Checkpoint**: Storage bucket configured, CSS tokens added, all initial dependencies installed.

---

## Phase 1: Foundation — API Routes

**Purpose**: All four auth-required API endpoints that the modal depends on.

**CRITICAL**: ALL four endpoints require Supabase session cookie auth. Each handler MUST call `supabase.auth.getUser()` and return `401` if no session exists.

### Zod Schema

- [x] T005 Define `KudosCreateDto` Zod schema: `recipientId` (uuid required), `title` (string 1–100), `message` (string 1–1000), `hashtags` (array max 5 strings, default `[]`), `imageUrl` (string url or null — ⚠️ will be migrated to `imageUrls[]` in T066), `isAnonymous` (boolean), `idempotencyKey` (uuid required) | `app/api/kudos/route.ts`

### POST /api/kudos

- [x] T006 `export async function POST(...)` handler exists in `app/api/kudos/route.ts`; verifies Supabase session cookie — returns `401` if missing | `app/api/kudos/route.ts`
- [x] T007 `KudosCreateDto` Zod validation in POST handler; returns `422` with field errors on invalid payload | `app/api/kudos/route.ts`
- [x] T008 Self-send check: `if senderId === recipientId → 400 "Cannot send Kudos to yourself"` | `app/api/kudos/route.ts`
- [x] T009 DOMPurify server-side sanitization of `message` field before DB INSERT | `app/api/kudos/route.ts`
- [x] T010 Insert sanitized Kudos via `lib/kudos-service.ts`; return `201` with created Kudos object | `app/api/kudos/route.ts`
- [x] T011 `idempotencyKey` unique constraint check: catch DB unique-constraint violation and return `409 Conflict` | `app/api/kudos/route.ts`

### GET /api/users/search

- [x] T012 `app/api/users/search/route.ts` exists; verifies Supabase session — returns `401` if missing | `app/api/users/search/route.ts`
- [x] T013 `GET /api/users/search?q={query}`: `q` min 2 chars (return `[]` without DB call if shorter); iLIKE search on `users` table; excludes requesting user from results; returns `[{ id, name, avatarUrl }]` | `app/api/users/search/route.ts`

### GET /api/kudos/hashtags

- [x] T014 `app/api/kudos/hashtags/route.ts` (owned by Sun* Kudos plan) has auth guard; returns `401` if session missing; no new file needed | `app/api/kudos/hashtags/route.ts`

### POST /api/upload

- [x] T015 `app/api/upload/route.ts` exists; verifies Supabase session — returns `401` if missing | `app/api/upload/route.ts`
- [x] T016 Validate file MIME type (allow: `image/jpeg`, `image/png`, `image/gif`, `image/webp`) and size ≤ 5MB; return `422` on failure | `app/api/upload/route.ts`
- [x] T017 Upload validated file to `kudos-images` Supabase Storage bucket; return `201` with `{ url }` (CDN public URL) | `app/api/upload/route.ts`

### Upload Helper

- [x] T018 `lib/upload.ts` — `uploadKudosImage()` with 30s `AbortController` timeout; on timeout rejects with timeout error | `lib/upload.ts`

**Checkpoint**: All four API routes implemented. `POST /api/kudos` accepts the payload shape from plan.md.

---

## Phase 2: Core Modal + Recipient Search (US1)

**Goal**: Recipient selection, title ("Danh hiệu") input, message editor, modal actions.

**Independent Test**: Fill recipient + title + message → click Gửi → `POST /api/kudos` called → modal closes.

### Modal Foundation

- [x] T019 [US1] `components/viet-kudos/WriteKudosModal.tsx` skeleton: `role="dialog"` + `aria-modal="true"` + `aria-labelledby`; cream background `#FFF8E1`; renders child section placeholders | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T020 [US1] `<FocusTrap>` wrapper (from `focus-trap-react`): on open focus moves to first input; on close focus returns to `<WriteKudosButton />` trigger | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T021 [US1] Escape key handler: if `isDirty === false` close immediately; if `isDirty === true` show confirmation dialog | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T022 [US1] `resetForm()` function resets ALL form state to initial values including `isDirty = false` and `errors = {}`; called on modal close | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T023 [US1] Generate `idempotencyKey` (UUID) on each modal open; reset on `resetForm()` | `components/viet-kudos/WriteKudosModal.tsx`

### Form State

- [x] T024 [US1] All form state initialized with `useState` in `hooks/useKudosForm.ts` (used by `WriteKudosModal`): `recipient`, `searchQuery`, `searchResults`, `isSearching`, `searchError`, `title`, `message`, `hashtags`, `availableHashtags`, `isLoadingHashtags`, `hashtagsError`, `images`, `imagePreviewUrls`, `uploadedImageUrls`, `isUploading`, `uploadProgress`, `isAnonymous`, `isSubmitting`, `isDirty`, `errors` | `hooks/useKudosForm.ts`

### RecipientSearch Component

- [x] T025 [US1] `components/viet-kudos/RecipientSearch.tsx`: controlled search input calls `GET /api/users/search?q=` with 300ms debounce; sets `isSearching = true` while in flight | `components/viet-kudos/RecipientSearch.tsx`
- [x] T026 [US1] Suggestions dropdown: max-height `240px`, `overflow-y: auto`, `z-index: 50`; each row shows `{ name, avatarUrl }`; clicking selects recipient and closes dropdown | `components/viet-kudos/RecipientSearch.tsx`
- [x] T027 [US1] `isSearching` loading indicator while API in flight; "No results found" (Montserrat 400 16px `#999999` centered) when results empty and query ≥ 2 chars | `components/viet-kudos/RecipientSearch.tsx`
- [x] T028 [US1] `searchError` error state: "Unable to search right now — try again" + Retry button; Retry re-triggers last query and clears `searchError` on success | `components/viet-kudos/RecipientSearch.tsx`

### TitleInput (Danh Hiệu) Component

- [x] T029 [US1] `components/viet-kudos/TitleInput.tsx`: controlled text input; input placeholder "Dành tặng một danh hiệu cho đồng đội"; hint text below "Ví dụ: Người truyền động lực cho tôi. / Danh hiệu sẽ hiển thị làm tiêu đề Kudos."; max 100 chars; character counter hidden when `title.length ≤ 80`; counter appears (`#999999`) when `title.length > 80`; counter turns `#EF4444` at `title.length ≥ 80` | `components/viet-kudos/TitleInput.tsx`

### MessageEditor Component

- [x] T030 [US1] `components/viet-kudos/MessageEditor.tsx` — Tiptap editor: imports `useEditor`; includes `StarterKit` + `Underline` extension (⚠️ Underline is implemented but design shows Strikethrough "S" — see T073 for fix); toolbar height 40px; textarea height 200px / min-height 120px; `border-radius: 0 0 8px 8px` (bottom corners); placeholder "Hãy gửi gắm lời cảm ơn và ghi nhận đến đồng đội tại đây nhé!" | `components/viet-kudos/MessageEditor.tsx`
- [x] T031 [US1] Character counter via `editor.getText().length` (NOT `.getHTML().length`); counter turns `#EF4444` at ≥ 800 chars (warning); visible once user starts typing; submit blocked at > 1000 chars | `components/viet-kudos/MessageEditor.tsx`
- [x] T032 [US1] DOMPurify client-side sanitization in `MessageEditor` on output before passing `message` value to parent | `components/viet-kudos/MessageEditor.tsx`
- [x] T033 [US1] `MessageEditor` wrapped with `next/dynamic` (`ssr: false`) at import site in `WriteKudosModal`; loading fallback: `h-[268px]` skeleton | `components/viet-kudos/WriteKudosModal.tsx`

### ModalActions Component

- [x] T034 [US1] `components/viet-kudos/ModalActions.tsx`: Cancel ("Hủy ×") + Submit ("Gửi ▷") buttons; both disabled while `isSubmitting === true`; Submit shows loading spinner; Cancel border-radius `4px`; Submit `background: #FFEA9E`, border-radius `8px`, width `502px`, height `60px` | `components/viet-kudos/ModalActions.tsx`

### Submit Handler

- [x] T035 [US1] Submit handler in `hooks/useKudosForm.ts`: first call `setErrors({})` (error auto-clear); run client-side validation; set `isSubmitting = true`; call `POST /api/kudos` with full payload | `hooks/useKudosForm.ts`
- [x] T036 [US1] On successful `POST /api/kudos`: call `resetForm()`; call `onClose()`; call `onSuccess(newKudos)` | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T037 [US1] On `POST /api/kudos` error: set `isSubmitting = false`; show error toast "Failed to send Kudos — please try again"; keep modal open | `components/viet-kudos/WriteKudosModal.tsx`

### isDirty Tracking

- [x] T038 [US1] `isDirty = title.trim().length > 0 || editor.getText().trim().length > 0`; updated on every `title` change and Tiptap `onUpdate` event; reset to `false` on `resetForm()` | `hooks/useKudosForm.ts`

**Checkpoint**: US1 complete. Recipient search, title ("Danh hiệu"), message, submit, and modal close all function independently.

---

## Phase 3: Hashtags + Image Upload (US2 + US3)

**Goal**: Hashtag chip selection and multi-image upload (up to 5) with progress and timeout.

**Independent Test**: Select ≥ 1 hashtag → attach image → submit → `POST /api/kudos` payload includes `hashtags[]` and `imageUrls[]`.

### HashtagChips Component

- [x] T039 [US2] `components/viet-kudos/HashtagChips.tsx`: fetch from `GET /api/kudos/hashtags` on mount; `isLoadingHashtags = true` during fetch; render skeleton placeholder chips while loading | `components/viet-kudos/HashtagChips.tsx`
- [x] T040 [US2] Render selectable chips; selected chips show `#FFEA9E` background, `border-radius: 8px`, `padding: 4px 8px`, Montserrat 700 16px; toggling adds/removes from `selectedHashtags` | `components/viet-kudos/HashtagChips.tsx`
- [x] T041 [US2] Enforce max 5 hashtags: at 5 selected, all unselected chips render in disabled state (`#999999` text, `1px solid #999999` border, `cursor: not-allowed`); click is no-op; show "Maximum 5 hashtags reached" hint below chip row | `components/viet-kudos/HashtagChips.tsx`
- [x] T042 [US2] `hashtagsError` retry UI: show error message + "Retry" button; clicking Retry re-fetches and clears `hashtagsError` on success | `components/viet-kudos/HashtagChips.tsx`

### ImageUpload Component (⚠️ needs multi-file upgrade — see T074–T077)

- [x] T043 [US2] `components/viet-kudos/ImageUpload.tsx` created: file input with MIME type filter; single-file baseline (⚠️ upgrade to 5-file in T074) | `components/viet-kudos/ImageUpload.tsx`
- [x] T044 [US2] Client-side MIME type and size (≤ 5MB) validation before upload; inline error on invalid file; do NOT upload invalid files | `components/viet-kudos/ImageUpload.tsx`
- [x] T045 [US2] On valid selection: show preview; set `isUploading = true`; call `POST /api/upload` via `lib/upload.ts` with 30s `AbortController`; show `uploadProgress` indicator | `components/viet-kudos/ImageUpload.tsx`
- [x] T046 [US2] On successful upload: set CDN URL in state; set `isUploading = false`; show remove control | `components/viet-kudos/ImageUpload.tsx`
- [x] T047 [US2] On upload timeout: abort; show "Upload timed out — please try again"; allow retry without re-selecting file | `components/viet-kudos/ImageUpload.tsx`
- [x] T048 [US2] Remove image control: resets image state + preview to initial values | `components/viet-kudos/ImageUpload.tsx`

### Wire into WriteKudosModal

- [x] T049 [US2] `HashtagChips` and `ImageUpload` wired into `WriteKudosModal`; `hashtags` and `imageUrl` (⚠️ → migrate to `imageUrls[]` in T066) included in POST payload | `components/viet-kudos/WriteKudosModal.tsx`

**Checkpoint**: US2 + US3 complete. Hashtags and image upload flow with all four states verified.

---

## Phase 4: Anonymous Toggle + Inline Validation (US4)

**Goal**: Anonymous checkbox, per-field inline validation errors, isDirty-gated confirmation dialog.

**Independent Test**: Enable anonymous → submit → Kudos shows "Ẩn danh". Escape with content → confirmation dialog appears.

### AnonymousToggle Component

- [x] T050 [US4] `components/viet-kudos/AnonymousToggle.tsx`: checkbox + label "Gửi lời cảm ơn và ghi nhận ẩn danh"; label text `#999999` unchecked → `#00101A` checked; Montserrat 700 22px; checkbox `24×24px`, border `1px solid #999999` unchecked | `components/viet-kudos/AnonymousToggle.tsx`

### Inline Validation Errors

- [x] T051 [US4] Client-side validation in submit handler (after `setErrors({})` reset): missing recipient → `errors.recipient = "Please select a recipient"`; missing title → `errors.title = "Title is required"`; missing message → `errors.message = "Message is required"` | `hooks/useKudosForm.ts`
- [x] T052 [US4] Additional validation: self-send → `errors.recipient = "You cannot send a Kudos to yourself"`; title > 100 → `errors.title = "Title is too long (max 100 characters)"`; message > 1000 → `errors.message = "Message is too long (max 1000 characters)"` | `hooks/useKudosForm.ts`
- [x] T053 [US4] Render per-field inline errors below each input in `RecipientSearch`, `TitleInput`, and `MessageEditor`; style: Montserrat 400 12px `#EF4444`, `margin-top: 4px` | `components/viet-kudos/RecipientSearch.tsx`
- [x] T054 [US4] Submit ("Gửi") button disabled when form is invalid (required fields missing or length limits exceeded) | `components/viet-kudos/ModalActions.tsx`

### ModalOverlay + isDirty Confirmation Dialog

- [x] T055 [US4] `components/viet-kudos/ModalOverlay.tsx`: `fixed inset-0` overlay `rgba(0,16,26,0.8)`; accepts `isDirty`, `onClose`, `onConfirmDiscard` props | `components/viet-kudos/ModalOverlay.tsx`
- [x] T056 [US4] Click-outside handler: `isDirty === false` → call `onClose()` immediately; `isDirty === true` → show confirmation dialog "Are you sure? Your Kudos will not be saved." with Cancel (stay) / Discard (close + resetForm) | `components/viet-kudos/ModalOverlay.tsx`
- [x] T057 [US4] `ModalOverlay` wired into `WriteKudosModal`; receives `isDirty`, `onClose`, `resetForm` props | `components/viet-kudos/WriteKudosModal.tsx`

**Checkpoint**: All four user stories complete. Full modal flow with anonymous, validation errors, and confirmation dialog verified.

---

## Phase 5: Integration + Polish

**Purpose**: Wire into KudosPage, feed prepend, responsive, animations, toasts.

### KudosPage Integration

- [x] T058 `components/kudos/WriteKudosButton.tsx` — `onClick` handler opens `WriteKudosModal` (sets `isOpen = true`) | `components/kudos/WriteKudosButton.tsx`
- [x] T059 Render `<WriteKudosModal isOpen onClose onSuccess />` inside `components/kudos/KudosPage.tsx`; `isOpen` state managed in `KudosPage` | `components/kudos/KudosPage.tsx`
- [x] T060 `onSuccess(newKudos: Kudos)` callback in `KudosPage`: prepend `newKudos` to feed list without full page reload | `components/kudos/KudosPage.tsx`

### Responsive Layout

- [x] T061 [P] Responsive modal sizing: desktop `752px` fixed; tablet `90vw` (`max-width: 1024px`); mobile full-screen bottom sheet (`max-width: 640px`) | `components/viet-kudos/WriteKudosModal.tsx`

### Animations

- [x] T062 [P] Modal open/close animation: fade in + slide up 250ms ease-out on open; fade out + slide down 200ms ease-in on close | `components/viet-kudos/WriteKudosModal.tsx`
- [x] T063 [P] `@media (prefers-reduced-motion: reduce)`: fade only (no slide) | `app/globals.css`

### Toasts

- [x] T064 [P] Success toast "Your Kudos has been sent!" on submission | `components/viet-kudos/WriteKudosModal.tsx`

### Form State Hook

- [x] T065 Form state and submit logic extracted into `hooks/useKudosForm.ts`; exposes all state fields, `resetForm`, `handleSubmit`, `isDirty`, `errors` | `hooks/useKudosForm.ts`

**Checkpoint**: Full initial feature complete. New Kudos appears at top of feed after submit.

---

## Phase 6: Bug Fixes & Outstanding Changes

**Purpose**: Correct implementation gaps found during spec/plan review. All tasks below are INCOMPLETE.

**⚠️ CRITICAL**: T066 is a breaking API change — update test cases alongside the route.

### API Migration: imageUrl → imageUrls (Breaking)

- [x] T066 Migrate `POST /api/kudos` Zod schema: change `imageUrl: z.string().url().nullable().optional()` → `imageUrls: z.array(z.string().url()).max(5).default([])` in `app/api/kudos/route.ts`; update the `insertKudos` call from `imageUrls: dto.imageUrl ? [dto.imageUrl] : []` to `imageUrls: dto.imageUrls` | `app/api/kudos/route.ts`
- [x] - [ ] T067 [P] Update `hooks/useKudosForm.ts` form state: rename `image: File | null` → `images: File[]`; rename `imagePreviewUrl` → `imagePreviewUrls: string[]`; rename `uploadedImageUrl` → `uploadedImageUrls: string[]`; update POST payload to send `imageUrls: uploadedImageUrls` | `hooks/useKudosForm.ts`
- [x] - [ ] T068 [P] Update BACKEND_API_TESTCASES.md: change KUDOS_POST_03 body from `imageUrl: "..."` → `imageUrls: ["..."]`; change KUDOS_POST_17 from `imageUrl: null` → `imageUrls: []` | `.momorph/contexts/BACKEND_API_TESTCASES.md`

### MessageEditor Toolbar Fixes

- [x] - [ ] T069 Install `@tiptap/extension-link ^3.x` npm package (needed for Link ⛓ toolbar button; NOT in StarterKit) | `package.json`
- [x] T070 Fix `components/viet-kudos/MessageEditor.tsx` toolbar — design shows B/I/S/list/link/quote (NOT underline):
  - Remove `Underline` import and extension; remove Underline toolbar button
  - Strikethrough ("S") is in `StarterKit` — use `editor.chain().focus().toggleStrike().run()`, `editor.isActive('strike')`
  - Add Link extension from `@tiptap/extension-link`; add Link (⛓) toolbar button with click → open link input dialog
  - Toolbar button border specs: Bold `border-radius: 8px 0 0 0` (top-left), Quote `border-radius: 0`, Community link `border-radius: 0 8px 0 0` (top-right)
  | `components/viet-kudos/MessageEditor.tsx`
- [x] T071 Add "Tiêu chuẩn cộng đồng" link button to `MessageEditor` toolbar (rightmost element): `<a href={ROUTES.GENERAL_STANDARDS} target="_blank">`; color `#E46060` (`var(--color-community-link)`); `border: 1px solid #998C5F`; `border-radius: 0 8px 0 0`; `padding: 10px 16px`; width `336px`; text right-aligned | `components/viet-kudos/MessageEditor.tsx`

### ImageUpload Multi-file Upgrade

- [x] T072 Upgrade `components/viet-kudos/ImageUpload.tsx` from single-file to multi-file (up to 5):
  - Accept `images: File[]`, `imagePreviewUrls: string[]`, `uploadedImageUrls: string[]` from `useKudosForm.ts`
  - Each newly selected file: validate MIME + size, upload via `lib/upload.ts`, append CDN URL to `uploadedImageUrls`
  - Show thumbnails (`80×80px`, `border-radius: 18px`, `border: 1px solid #998C5F`) with `×` remove button (`20×20px`, `background: #D4271D`, `border-radius: 50%`) for each image
  - Show `+ Image / Tối đa 5` button (node `I520:11647;662:9133`); hide when `images.length === 5`
  - Clicking `×` removes that file from all three arrays and shows button again
  | `components/viet-kudos/ImageUpload.tsx`

### Hashtag Minimum-1 Validation

- [x] T073 Add missing hashtag validation in `hooks/useKudosForm.ts` submit handler: `if hashtags.length === 0 → errors.hashtags = "Please select at least 1 hashtag"` (runs after `setErrors({})` reset, alongside other field checks) | `hooks/useKudosForm.ts`
- [x] T074 [P] Render hashtag inline error below `HashtagChips` in `WriteKudosModal`/`HashtagChips.tsx` when `errors.hashtags` is set; style: Montserrat 400 12px `#EF4444` | `components/viet-kudos/HashtagChips.tsx`

### Missing CSS Tokens

- [x] T075 [P] Add two missing CSS tokens to `app/globals.css`:
  - `--color-required-star: #CF1322` (required field `*` indicator — Noto Sans JP 700 16px)
  - `--color-community-link: #E46060` ("Tiêu chuẩn cộng đồng" link color)
  | `app/globals.css`

**Checkpoint Phase 6**: `imageUrls[]` migration done, toolbar matches design (S + Link + Community Standards), `ImageUpload` handles up to 5 files, hashtag min-1 validated, all CSS tokens present.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0**: No dependencies — start immediately
- **Phase 1**: Depends on Phase 0 — BLOCKS all component work
- **Phase 2** (US1): Depends on Phase 1
- **Phase 3** (US2, US3): Depends on Phase 1; can start in parallel with Phase 2 if staffed
- **Phase 4** (US4): Depends on Phase 2 skeleton existing
- **Phase 5**: Depends on Phases 2–4 complete
- **Phase 6**: Can start immediately (all items are independent bug fixes); T066–T068 must be done together (breaking API change)

### Phase 6 Internal Order

1. T066 (API schema change) + T068 (update test cases) together — breaking change
2. T069 (`@tiptap/extension-link` install) → then T070 (toolbar fix) — T070 depends on T069
3. T071 (Community Standards link) — depends on T070
4. T067 (form state rename), T072 (ImageUpload multi-file), T073–T074 (hashtag validation), T075 (CSS tokens) — independent, can run in parallel

### Parallel Opportunities

- T003 + T004 (package installs) in parallel
- T025–T028 (`RecipientSearch`), T029 (`TitleInput`), T030–T032 (`MessageEditor`) in parallel
- T039–T042 (`HashtagChips`) + T043–T048 (`ImageUpload`) in parallel
- T067 + T072 + T073 + T075 in Phase 6 in parallel

---

## Implementation Notes

- `MessageEditor` MUST be imported with `dynamic(() => import('./MessageEditor'), { ssr: false })` — Tiptap uses browser APIs unavailable in SSR
- Character count in `MessageEditor`: ALWAYS use `editor.getText().length`, never `.getHTML().length`
- `isSearching` and `isLoadingHashtags` are SEPARATE booleans — never merge into a shared `isLoading`
- `errors` MUST be reset to `{}` at the START of every submit handler call, before any validation runs
- `isDirty` is computed from title + message content only; does NOT block submit; controls close/escape confirmation
- `imageUrls` in the POST payload is an array of CDN URL strings (0–5), never raw File objects
- The POST handler lives in `app/api/kudos/route.ts` (exports both GET and POST) — do NOT create a duplicate file
- `GET /api/kudos/hashtags` is owned by the Sun* Kudos plan — only verify auth guard, do not duplicate
- `ROUTES.GENERAL_STANDARDS = "/general-standards"` from `lib/constants/routes.ts` — use this constant, never hardcode the URL
- Hashtag min-1 is a frontend-only constraint; the backend accepts `hashtags: []` per `KUDOS_POST_16` test case

---

## Implementation Strategy

### Completed Work (Phases 0–5)
Phases 0–5 represent completed baseline implementation. All components, API routes, and the form hook exist.

### Outstanding Work (Phase 6) — MVP Fix Scope
1. **Start with T066 + T068** — the `imageUrls[]` API migration is a breaking change; complete together
2. **T069 → T070 → T071** — sequential: install Link extension, fix toolbar, add Community Standards link
3. **T067 + T072 in parallel** — form state rename + ImageUpload multi-file (same domain, different files)
4. **T073 + T074 in parallel** — hashtag validation logic + render
5. **T075 independently** — CSS tokens (isolated to `app/globals.css`)
