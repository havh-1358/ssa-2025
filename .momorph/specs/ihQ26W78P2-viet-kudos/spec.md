# Feature Specification: Viet Kudos (Write Kudos)

**Frame ID**: `ihQ26W78P2`
**Frame Name**: `Viet Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
**Created**: 2026-04-22
**Status**: Draft

---

## Overview

The Viet Kudos screen is a modal form (overlay on top of the Sun* Kudos page) that allows authenticated SSA 2025 participants to send a Kudos (recognition message) to a colleague. The form collects: recipient, kudos title, kudos message (rich text), optional hashtags, optional image, and an anonymous toggle.

**Target users**: Authenticated SSA 2025 participants who want to recognize a colleague.

**Business context**: Sending Kudos is the core engagement action in SSA 2025. The form MUST be quick, low-friction, and encourage positive messaging.

---

## User Scenarios & Testing

### US1: Select Recipient and Write Kudos [P1]

**As an** authenticated SSA 2025 participant  
**I want to** search for and select a colleague, write a recognition message, and submit  
**So that** the recipient receives a Kudos and it appears on the live board

**Why this priority**: Core submission flow — the entire feature depends on this working.

**Independent Test**: Click "Ghi nhan" on the Kudos page → modal opens → search "Nguyen" → select a recipient → enter a title → write a message → click "Gui" → verify modal closes → verify new Kudos appears at top of feed.

#### Acceptance Scenarios

**Scenario 1: Open Viet Kudos modal**
- Given: user is on `/kudos` and is authenticated
- When: user clicks the "Ghi nhan" button
- Then: the Viet Kudos modal opens; background page is dimmed (overlay); focus moves to the modal

**Scenario 2: Search and select recipient**
- Given: modal is open
- When: user types in the recipient search field
- Then: matching sunner names appear as suggestions; user clicks a suggestion to select the recipient

**Scenario 3: Enter kudos title**
- Given: modal is open; recipient is selected
- When: user types in the title field
- Then: title text is updated; placeholder "Vi du: Nguoi truyen dong luc cho toi..." is hidden

**Scenario 4: Write kudos message**
- Given: modal is open
- When: user types in the message body
- Then: text updates; rich text formatting (bold, italic) is available

**Scenario 5: Submit kudos**
- Given: recipient is selected; title is filled; message is filled
- When: user clicks the "Gui" (Send) button
- Then: Kudos is submitted via API; modal closes; a success toast is shown; new Kudos appears at the top of the live feed

**Scenario 6: Cancel without submitting**
- Given: modal is open with or without content
- When: user clicks the "Huy" (Cancel) button or presses Escape
- Then: modal closes; no Kudos is submitted; content is discarded (no draft saved)

**Scenario 7: Validation — missing recipient**
- Given: title and message are filled, but no recipient selected
- When: user clicks "Gui"
- Then: an inline validation error appears below the recipient field; submission is blocked

**Scenario 8: Validation — missing message**
- Given: recipient is selected, title filled, but message is empty
- When: user clicks "Gui"
- Then: an inline validation error appears below the message field; submission is blocked

**Scenario 9: Submit button loading state**
- Given: user clicks "Gui" with valid data
- When: API request is in flight
- Then: submit button is disabled and shows a loading spinner; cancel button is also disabled

**Scenario 10: API error on submit**
- Given: user submits valid kudos
- When: API returns an error
- Then: modal remains open; error toast is shown; button returns to enabled state; user can retry

---

### US2: Add Hashtags [P2]

**As a** kudos sender  
**I want to** add hashtags to my kudos  
**So that** other participants can filter kudos by topic

**Independent Test**: Open modal → click hashtag chip → verify it is added to the kudos → remove a hashtag → verify it is removed.

#### Acceptance Scenarios

**Scenario 1: Select hashtag from suggestions**
- Given: modal is open; hashtag input area shows suggestion chips
- When: user clicks a hashtag chip (e.g., "#teamwork")
- Then: hashtag is added to the kudos; chip appears in an "active" selected state

**Scenario 2: Remove a hashtag**
- Given: one or more hashtags are selected
- When: user clicks the selected hashtag chip again or clicks its "X" icon
- Then: hashtag is removed from the selected list

**Scenario 3: Maximum hashtag limit**
- Given: maximum number of hashtags is selected (e.g., 5)
- When: user tries to add another hashtag
- Then: additional selection is blocked; a hint message appears

---

### US3: Add Image [P3]

**As a** kudos sender  
**I want to** attach an image to my kudos  
**So that** my message is more expressive

**Independent Test**: Open modal → click image upload area → select an image file → verify preview appears in the form.

#### Acceptance Scenarios

**Scenario 1: Upload an image**
- Given: modal is open
- When: user clicks the image upload control and selects a file
- Then: image preview renders in the form; file name or thumbnail is shown

**Scenario 2: Remove uploaded image**
- Given: an image has been selected
- When: user clicks the remove/X button on the image preview
- Then: image is removed; upload control resets

**Scenario 3: File type validation**
- Given: user selects a non-image file (e.g., .pdf)
- When: file is selected
- Then: an error message explains only images (JPG, PNG, GIF, WebP) are accepted; file is rejected

**Scenario 4: File size validation**
- Given: user selects an image larger than the allowed size (e.g., > 5MB)
- When: file is selected
- Then: an error message shows the size limit; file is rejected

---

### US4: Send Anonymously [P2]

**As a** kudos sender  
**I want to** optionally hide my identity when sending kudos  
**So that** I can recognize a colleague without social pressure

**Independent Test**: Open modal → toggle "Gui an danh" checkbox → verify toggle state updates → submit → verify kudos on live board shows "Anonymous" instead of my name.

#### Acceptance Scenarios

**Scenario 1: Enable anonymous mode**
- Given: modal is open; "Gui an danh" checkbox is unchecked
- When: user clicks the checkbox
- Then: checkbox becomes checked; sender name will be hidden on the submitted kudos

**Scenario 2: Disable anonymous mode**
- Given: "Gui an danh" is checked
- When: user unchecks it
- Then: checkbox unchecks; kudos will show sender name

**Scenario 3: Anonymous kudos on live board**
- Given: kudos was submitted with "Gui an danh" enabled
- When: kudos appears on the live board
- Then: sender is shown as "Anonymous" or equivalent locale text; sender's avatar is replaced with a placeholder

---

### Edge Cases

- **Recipient search returns no results**: Show "No sunners found" empty state below the search input; do not show error.
- **Recipient search API error**: Show "Unable to search right now — try again" below the field; retry button appears.
- **Message too long**: Character counter turns red when over 1000 chars; submit button disabled; inline error "Message is too long (max 1000 characters)".
- **Title too long**: Character counter turns red when over 100 chars; submit disabled; inline error.
- **Network disconnect while submitting**: Show error toast "Failed to send Kudos — please try again"; modal stays open, form content preserved; button re-enabled.
- **Cannot send kudos to yourself**: If user selects themselves as recipient, an inline validation message appears below the recipient field; submit blocked. Also enforced server-side.
- **Modal closed accidentally (Escape)**: Content is NOT saved. If title or message has content, show a confirmation dialog: "Are you sure? Your Kudos will not be saved." — Cancel (stay) / Discard (close).
- **Duplicate submission prevention**: Submit button is disabled immediately on click; server-side idempotency key or check prevents duplicate inserts.
- **Image upload too slow**: Show upload progress indicator; if upload exceeds 30s, show timeout error and allow retry.
- **Anonymous with image**: If sender sends anonymously, the attached image is still displayed; only the sender identity is hidden.

---

## UI/UX Requirements

### Screen Components

| ID | Component | Node ID | Kind | Description |
|----|-----------|---------|------|-------------|
| BG | Page Overlay | `520:11646` | overlay | Semi-transparent dark overlay, `rgba(0,16,26,0.8)` |
| F | Modal container | `520:11647` | modal | 752×1012px cream bg modal, radius 24px |
| F.A | Title | `I520:11647;520:9870` | label | "Gui loi cam on va ghi nhan den dong doi" — Montserrat 700 32px |
| F.B | Recipient selector | `I520:11647;520:9871` | compound | Label + search input with suggestions |
| F.C | Kudos Title input | `I520:11647;1688:10448` | compound | Label + text input; placeholder example text |
| F.D | Kudos Message | `I520:11647;520:9874` | compound | Rich text editor area |
| F.E | Hashtag chips | `I520:11647;520:9890` | chips | Selectable hashtag chips row |
| F.F | Image upload | `I520:11647;520:9896` | upload | Image attachment control |
| F.G | Anonymous toggle | `I520:11647;520:14099` | checkbox | "Gui loi cam on va ghi nhan an danh" checkbox |
| F.H | Action buttons | `I520:11647;520:9905` | buttons | "Huy" (cancel, secondary) + "Gui" (submit, primary gold) |

**Visual specs**: See [`design-style.md`](./design-style.md).

### Navigation Flow

- **Triggered from**: Sun* Kudos page (`/kudos`) — Write Kudos CTA button
- **On submit success**: Modal closes → feed shows new Kudos at top
- **On cancel**: Modal closes → returns to Kudos feed

Source of truth: `.momorph/contexts/SCREENFLOW.md`

### Visual Requirements

- **Modal size**: 752×1012px (or `max-height: 95vh` with scroll on mobile)
- **Modal background**: `rgba(255, 248, 225, 1)` = `#FFF8E1` (cream/warm white)
- **Modal radius**: `24px`
- **Overlay**: `rgba(0, 16, 26, 0.8)`
- **Input style**: `border: 1px solid #998C5F`, `background: #FFF`, `padding: 16px 24px`
- **Submit button**: `background: #FFEA9E`, `radius: 8px`, dark text
- **Cancel button**: `border: 1px solid #998C5F`, `background: rgba(255,234,158,0.1)`, `padding: 16px 40px`
- **Focus trap**: When modal is open, Tab key MUST cycle within the modal only

### Accessibility Requirements

- **WCAG 2.1 AA**: All text on cream background passes ≥ 4.5:1
- **Modal role**: `role="dialog"` with `aria-modal="true"` and `aria-labelledby="modal-title"`
- **Focus management**: Focus moves to modal title on open; returns to trigger button on close
- **Escape**: Always closes the modal
- **Screen reader**: Form fields have proper `<label>` or `aria-label`

---

## Data Requirements

### Input Fields

| Field | Type | Validation | Notes |
|-------|------|-----------|-------|
| Recipient | Search + select | Required; must be an existing SSA user; cannot be self | Server-side validates user exists and is not current user |
| Title | Text | Required; 1–100 chars | Character counter shown when > 80 chars used |
| Message | Rich text | Required; 1–1000 chars (plain text equivalent) | Character counter shown when > 800 chars used |
| Hashtags | Multi-select chips | Optional; max 5 per Kudos | Server validates tags exist in allowed list |
| Image | File upload | Optional; MIME: image/jpeg, image/png, image/gif, image/webp; max 5MB | Extension check alone is insufficient — MIME type MUST be validated |
| Anonymous | Boolean checkbox | Optional; default `false` | Server stores `isAnonymous` flag; API never returns sender info if `true` |

---

## API Requirements (Predicted)

| Endpoint / Method | Purpose | Trigger |
|-------------------|---------|---------|
| `GET /api/users/search?q={query}` | Search sunner by name for recipient selection | User types in recipient field |
| `GET /api/kudos/hashtags` | Load available hashtags for chip suggestions | Modal open |
| `POST /api/kudos` | Submit new Kudos | "Gui" button click |
| `POST /api/upload` | Upload image attachment | Image file selected |

**POST /api/kudos payload**:
```json
{
  "recipientId": "uuid",
  "title": "string",
  "message": "string (HTML or markdown)",
  "hashtags": ["string"],
  "imageUrl": "string | null",
  "isAnonymous": false
}
```

---

## State Management

### Local Component State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Modal visibility |
| `recipient` | `User \| null` | `null` | Selected recipient |
| `searchQuery` | `string` | `""` | Text typed into the recipient search field |
| `searchResults` | `User[]` | `[]` | Autocomplete suggestions from `GET /api/users/search` |
| `isSearching` | `boolean` | `false` | True while recipient search API request is in flight |
| `searchError` | `string \| null` | `null` | Error if recipient search API fails |
| `title` | `string` | `""` | Kudos title |
| `message` | `string` | `""` | Kudos message (rich text) |
| `hashtags` | `string[]` | `[]` | Selected hashtags |
| `availableHashtags` | `string[]` | `[]` | Hashtag chip options loaded from `GET /api/kudos/hashtags` |
| `image` | `File \| null` | `null` | Attached image file (local, before upload) |
| `imagePreviewUrl` | `string \| null` | `null` | Local object URL for preview |
| `uploadedImageUrl` | `string \| null` | `null` | CDN URL returned after Supabase Storage upload |
| `isUploading` | `boolean` | `false` | True while image is uploading to Supabase Storage |
| `uploadProgress` | `number` | `0` | Upload progress 0–100 (for progress indicator) |
| `isAnonymous` | `boolean` | `false` | Anonymous toggle |
| `isSubmitting` | `boolean` | `false` | True while `POST /api/kudos` request is in flight |
| `errors` | `Record<string, string>` | `{}` | Per-field validation errors (keyed by field name) |

---

## Requirements

### Functional Requirements

- **FR-001**: Modal opens when "Ghi nhan" is clicked on the Kudos page.
- **FR-002**: Recipient search MUST query existing SSA users by name.
- **FR-003**: Recipient MUST be selected before submission is allowed.
- **FR-004**: User CANNOT send a Kudos to themselves.
- **FR-005**: Title and message are required; submission blocked if either is empty.
- **FR-006**: "Gui" button MUST be disabled while API call is in flight.
- **FR-007**: On success, modal closes and new Kudos appears at top of feed.
- **FR-008**: On failure, modal stays open with error toast; button re-enabled.
- **FR-009**: Closing modal (Cancel or Escape) discards all form content.
- **FR-010**: Anonymous kudos displays "Anonymous" instead of sender name on live board.

### Technical Requirements

- **TR-001**: Modal MUST trap focus while open (focus-trap pattern).
- **TR-002**: Rich text message MUST be sanitized with **DOMPurify** before storage AND before render. `dangerouslySetInnerHTML` is FORBIDDEN without DOMPurify (Constitution Principle VI). Prefer storing as plain text + markdown if the editor supports it.
- **TR-003**: Image upload MUST go to Supabase Storage (bucket: `kudos-images`); storage bucket policy MUST restrict to authenticated users only; public URL issued after upload (Constitution Principle VI).
- **TR-004**: Form state MUST be reset on modal close to prevent stale content on reopen.
- **TR-005**: ALL field validation MUST be enforced server-side via Zod in the POST /api/kudos handler. Client-side validation is supplementary only (Constitution Principle I + VI).
- **TR-006**: Self-send check MUST be performed server-side: `if (senderId === recipientId) throw 400`. Client-side check is supplementary.
- **TR-007**: Anonymous kudos: the `senderName` and `senderId` fields MUST be omitted from API responses when `isAnonymous = true`; RLS policy enforces this at the database level.
- **TR-008**: All design token values MUST be CSS variables from `app/globals.css` — no hardcoded hex in component files (Constitution Principle II).
- **TR-009**: Recipient search MUST be debounced at 300ms to avoid flooding `GET /api/users/search`.

---

## Success Criteria

- **SC-001**: Kudos submitted successfully and visible on live board within 3s of submission.
- **SC-002**: Validation prevents submission without required fields (recipient, title, message).
- **SC-003**: Anonymous kudos hides sender name on live board (verified by a third user).
- **SC-004**: Image attachment uploads and displays correctly in the submitted Kudos.

---

## Out of Scope

- Drafting / saving kudos before submission.
- Editing a submitted Kudos.
- Sending kudos to multiple recipients in one submission.
- Scheduled (future-dated) Kudos.

---

## Dependencies

- [x] Authentication (user must be logged in to open modal)
- [x] Sun* Kudos page exists (modal is opened from there)
- [ ] User search API endpoint available
- [ ] Kudos submission API endpoint available
- [ ] Image upload/CDN storage configured
- [ ] Hashtags data available (static or API)
