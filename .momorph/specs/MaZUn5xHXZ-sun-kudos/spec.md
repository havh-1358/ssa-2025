# Feature Specification: Sun* Kudos

**Frame ID**: `MaZUn5xHXZ`
**Frame Name**: `Sun* Kudos - Live board`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
**Created**: 2026-04-22
**Status**: Draft

---

## Overview

The Sun* Kudos page is a live recognition board where SSA 2025 participants send and receive appreciation messages (Kudos). The page has 6 major features: Highlight Kudos (top 5 most-liked), Spotlight Boards, recent Kudos feed, filter by hashtag/department, general statistics panel, and a Top 10 sunners widget. The "Like Kudos" (heart) interaction is embedded within this page.

**Target users**: All authenticated SSA 2025 participants who want to recognize colleagues or browse recognitions.

**Business context**: Kudos drives engagement and recognition culture during the SSA 2025 event. The live board updates in near real-time to feel dynamic and alive.

---

## User Scenarios & Testing

### US1: View Highlight Kudos [P1]

**As a** SSA 2025 participant  
**I want to** see the 5 most-liked Kudos in a prominent carousel  
**So that** I can quickly see the most appreciated recognitions

**Why this priority**: First section users see after the keyvisual; drives initial engagement.

**Independent Test**: Navigate to `/kudos` → verify "Highlight Kudos" section shows up to 5 Kudos cards → verify cards display sender, recipient, message preview, and heart count → verify carousel navigation (prev/next) works.

#### Acceptance Scenarios

**Scenario 1: Highlight Kudos renders with top 5**
- Given: there are at least 5 Kudos with likes in the system
- When: user navigates to `/kudos`
- Then: up to 5 most-liked Kudos cards are displayed in the Highlight section

**Scenario 2: Empty highlight state**
- Given: no Kudos have any likes yet
- When: user navigates to `/kudos`
- Then: Highlight section shows an empty state message (no crash)

**Scenario 3: Carousel navigation**
- Given: Highlight section has multiple Kudos
- When: user clicks next/prev carousel controls or the dot indicators
- Then: the active Kudos card changes; dot indicators update

---

### US2: View Spotlight Boards [P1]

**As a** SSA 2025 participant  
**I want to** see the Spotlight Boards section  
**So that** I can discover featured recognitions organized by board

**Why this priority**: Second engagement section; showcases curated content.

**Independent Test**: Scroll to Spotlight section on `/kudos` → verify spotlight boards render with board name and associated Kudos.

#### Acceptance Scenarios

**Scenario 1: Spotlight Boards render**
- Given: spotlight boards exist
- When: user scrolls to the Spotlight section
- Then: boards render with titles and featured Kudos content

**Scenario 2: No spotlight boards available (empty state)**
- Given: no spotlight boards have been configured by admin
- When: user scrolls to the Spotlight section
- Then: an empty state message is shown (e.g., "No spotlights yet"); the section MUST NOT crash or leave a blank gap with no context

**Scenario 3: Spotlight data fails to load (error state)**
- Given: the API call to fetch spotlight boards fails (network error or server error)
- When: user scrolls to the Spotlight section
- Then: a non-sensitive error message is displayed; a retry option SHOULD be available; no raw error or stack trace is exposed to the user

---

### US3: Browse Recent Kudos Feed [P1]

**As a** SSA 2025 participant  
**I want to** scroll through the list of recent Kudos  
**So that** I can see all recognitions in chronological order

**Why this priority**: Main content of the page; users spend most time here.

**Independent Test**: Scroll to the "Danh sach loi cam on" section → verify Kudos cards display sender name, recipient name, message, hashtags, image (if any), and like count → verify load-more/pagination works.

#### Acceptance Scenarios

**Scenario 1: Kudos feed renders**
- Given: Kudos exist in the system
- When: user scrolls to the All Kudos section
- Then: Kudos cards render in reverse-chronological order; each card shows sender, recipient, message, hashtags, and heart count

**Scenario 2: Kudos card with image**
- Given: a Kudos was submitted with an attached image
- When: user sees that Kudos card
- Then: the image is displayed within the card

**Scenario 3: Kudos card without image**
- Given: a Kudos was submitted without an image
- When: user sees that Kudos card
- Then: no image area is rendered; layout adjusts gracefully

**Scenario 4a: Long Kudos message is truncated**
- Given: a Kudos has a message longer than ~180 characters / 3 lines
- When: user sees that Kudos card in the feed
- Then: message is truncated to 3 lines with a "Xem thêm" (Read more) link; clicking "Xem thêm" expands the full message in-place

**Scenario 4b: Anonymous Kudos**
- Given: a Kudos was submitted with `isAnonymous=true`
- When: user sees that Kudos card in the feed
- Then: the sender name and avatar are replaced with "Ẩn danh" (Anonymous) placeholder; the sender's actual name and ID are NOT exposed in the DOM or API response

**Scenario 5: Pagination / load more**
- Given: more than one page of Kudos exists
- When: user scrolls to the bottom of the feed or clicks "Load more"
- Then: additional Kudos load without a full page reload

---

### US4: Like a Kudos [P1]

**As a** SSA 2025 participant  
**I want to** click the heart button on a Kudos to like it  
**So that** I can show appreciation for a recognition

**Why this priority**: Core interactive feature embedded throughout the Kudos page.

**Business rules**:
- 1 like per user per Kudos
- The Kudos sender CANNOT like their own Kudos
- On "special days" (admin-configured dates), each like gives 2 hearts instead of 1
- Unlike removes the heart(s) that were added (1 or 2 depending on special day at time of liking)
- Heart count reflects total hearts (not unique users)

**Independent Test**: Log in → find a Kudos you did not send → click heart → verify heart count increases by 1 (or 2 on special day) → verify button shows filled state → click again → verify heart count decreases by same amount → verify heart is hollow again.

#### Acceptance Scenarios

**Scenario 1: Like a Kudos (normal day)**
- Given: user is authenticated; Kudos was not sent by this user; user has not yet liked this Kudos; today is not a special day
- When: user clicks the heart button
- Then: heart becomes filled; heart count increases by 1; server records the like

**Scenario 2: Like a Kudos (special day — 2 hearts)**
- Given: today is an admin-configured special day
- When: user clicks the heart button on any Kudos they haven't liked
- Then: heart becomes filled (with double-heart visual indicator); heart count increases by 2

**Scenario 3: Unlike a Kudos**
- Given: user has previously liked this Kudos
- When: user clicks the filled heart button
- Then: heart becomes hollow; heart count decreases by the same amount that was added (1 or 2); server removes the like record

**Scenario 4: Cannot like own Kudos**
- Given: user is the sender of a Kudos
- When: user views that Kudos card
- Then: heart button is disabled or hidden; no like action is possible

**Scenario 5: Cannot double-like**
- Given: user has already liked a Kudos
- When: user attempts to click the heart again
- Then: the UI prevents a second like; the existing like state is maintained

**Scenario 6: Like from Highlight section**
- Given: a Kudos is shown in the Highlight carousel
- When: user clicks the heart on that Kudos card
- Then: same like behavior as in the main feed; count updates in both Highlight and feed views

**Scenario 7: Unauthenticated user tries to like**
- Given: user is not logged in
- When: user clicks the heart button
- Then: user is redirected to `/login` or a login prompt appears

---

### US5: Filter Kudos [P2]

**As a** SSA 2025 participant  
**I want to** filter the Kudos feed by hashtag or department  
**So that** I can find Kudos relevant to me or my team

**Why this priority**: Discovery feature; helps users find specific recognitions.

**Independent Test**: Click a hashtag on a Kudos card → verify feed filters to show only Kudos with that hashtag → click "X" to clear filter → verify all Kudos return.

#### Acceptance Scenarios

**Scenario 1: Filter by hashtag**
- Given: Kudos feed is showing all results
- When: user clicks a hashtag chip on any Kudos card
- Then: feed filters to show only Kudos containing that hashtag; active filter is displayed; other Kudos are hidden

**Scenario 2: Clear filter**
- Given: a hashtag filter is active
- When: user removes the filter
- Then: all Kudos are shown again

**Scenario 3: Filter by department**
- Given: a department filter option is available
- When: user selects a department
- Then: feed shows only Kudos from (or to) members of that department

---

### US6: View Statistics [P2]

**As a** SSA 2025 participant  
**I want to** see general statistics in the right sidebar  
**So that** I understand the overall scale of Kudos activity

**Independent Test**: Navigate to `/kudos` → verify right sidebar shows total Kudos count, total hearts, total participants.

#### Acceptance Scenarios

**Scenario 1: Stats render**
- Given: some Kudos exist
- When: user views the right sidebar
- Then: statistics (total Kudos, total hearts, total senders) render with correct values

---

### US7: View Top 10 Sunners [P2]

**As a** SSA 2025 participant  
**I want to** see who are the top 10 Kudos recipients  
**So that** I know who is getting the most recognition

**Independent Test**: View right sidebar → verify "Top 10 sunners" list shows 10 names with their gift/Kudos counts.

#### Acceptance Scenarios

**Scenario 1: Top 10 list renders**
- Given: at least 10 users have received Kudos
- When: user views the right sidebar
- Then: a ranked list of the top 10 Kudos recipients renders with names and counts

---

### Edge Cases

- **Like API fails**: Heart button returns to previous state; a toast error is shown; no optimistic count remains.
- **Special day configuration missing**: Default to 1 heart per like.
- **Kudos feed empty**: Show friendly empty state ("Be the first to send a Kudos!") with a CTA to open Viet Kudos modal.
- **Highlight empty**: If no Kudos have any likes, Highlight section shows an empty state message — does NOT crash or show empty carousel.
- **Very long kudos message**: Message is truncated with "Read more" link in the feed card; full text shown on expand. Truncation at ~3 lines / 180 characters.
- **Concurrent likes**: Two users liking at the same time — server handles race condition via database-level upsert/unique constraint; client shows server-confirmed count on next fetch.
- **Own Kudos in Highlight**: If user's own Kudos appears in Highlight carousel, the like button is still disabled.
- **`isSpecialDay` changes mid-session** (e.g., midnight crosses into special day): The `isSpecialDay` value is fetched once at page mount. If the day changes while the user is on the page, they will use the stale value until next reload. This is acceptable for MVP; add a periodic check in a later iteration.
- **Unauthenticated like attempt**: If cookie expires mid-session and user tries to like, the API returns 401; show toast "Please log in again" and redirect to `/login`.

---

## UI/UX Requirements

### Screen Components

| ID | Component | Node ID | Kind | Description |
|----|-----------|---------|------|-------------|
| A | Header | `2940:13433` | nav | Shared header; "Sun* Kudos" is active nav |
| KV | Keyvisual | `2940:13432` | image | 1440×512px banner |
| B1 | Write Kudos CTA | `2940:13449` | button | "Ghi nhan" button → opens Viet Kudos modal |
| B2 | Search Sunner | `2940:13450` | input | Search sunner by name |
| B3 | Highlight Kudos | `2940:13451` | section | Top 5 most-liked Kudos carousel |
| B4 | Spotlight Boards | `2940:14174` | section | Curated spotlight boards |
| C1 | All Kudos Feed | `2940:13482` | list | Scrollable feed; 680px wide; gap 24px |
| C1.card | Kudos Card | `3127:21871` | card | 680px cream card; user info + message + action bar |
| C1.card.user | Sender → Recipient row | `I3127:21871;256:4857` | row | Avatar + name of sender, arrow icon, avatar + name of recipient |
| C1.card.msg | Message box | `I3127:21871;662:11382` | box | Kudos message in gold-border box `rgba(255,234,158,0.4)` |
| C1.card.images | Image attachments | `I3127:21871;256:5176` | gallery | Up to 5 images × 88×88px |
| C1.card.hashtags | Hashtag list | `I3127:21871;256:5158` | text | Hashtag text in RED `#D4271D` |
| C1.card.actions | Action bar | `I3127:21871;256:5194` | bar | Copy Link button + Heart button; separated by gap |
| C1.card.copylink | Copy Link button | `I3127:21871;256:5216` | button | 145×56px; "Copy Link" text + link icon |
| **C1.card.heart** | **Heart (Like) button** | **`I3127:21871;256:5175`** | **button** | **101×32px; MM_MEDIA_Heart icon 32×32px + count Montserrat 700 24px; toggles like/unlike** |
| C2 | Stats Sidebar | `2940:13489` | panel | Total stats widget; 422px wide right sidebar |
| C2.hearts | Heart count stat | `3241:14882` | widget | Heart image + "x2" badge + count `#FFEA9E` 32px + label |
| C3 | Top 10 Sunners | `2940:13510` | list | Top 10 recipients widget in right sidebar |
| D | Footer | `2940:13522` | footer | Shared footer |

**Visual specs**: See [`design-style.md`](./design-style.md).

### Navigation Flow

- **From**: Homepage (via CTA or nav link) → `/kudos`
- **From**: Awards page (via nav) → `/kudos`
- **To**: Viet Kudos modal — "Ghi nhan" button opens the Viet Kudos form
- **To**: `/login` — unauthenticated user tries to like or write kudos

Source of truth: `.momorph/contexts/SCREENFLOW.md`

### Accessibility Requirements

- **Heart button ARIA**: `aria-label="Like this kudos"` / `aria-label="Unlike this kudos"` depending on state
- **aria-pressed**: `true` when liked, `false` when not liked
- **Screen reader**: Heart count change announced via `aria-live="polite"`
- **Keyboard**: Heart button and Write Kudos button fully keyboard-accessible

---

## Data Requirements

### Kudos Object

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Kudos identifier |
| `senderId` | UUID | Sender user ID |
| `recipientId` | UUID | Recipient user ID |
| `senderName` | string | Display name |
| `recipientName` | string | Display name |
| `title` | string | Kudos title/header |
| `message` | string | Kudos body text |
| `hashtags` | string[] | Tags |
| `imageUrls` | string[] | Optional attached images; up to 5 thumbnails (88×88px each); empty array when no images attached |
| `heartCount` | number | Total hearts |
| `isAnonymous` | boolean | Whether sender is hidden |
| `createdAt` | ISO8601 | Creation time |

### Like Object

| Field | Type | Notes |
|-------|------|-------|
| `kudosId` | UUID | Target Kudos |
| `userId` | UUID | Liker |
| `heartsGiven` | 1 \| 2 | 1 normally, 2 on special days |
| `createdAt` | ISO8601 | Like timestamp |

---

## API Requirements (Predicted)

| Endpoint / Method | Purpose | Trigger |
|-------------------|---------|---------|
| `GET /api/kudos?limit=10&page=1&hashtag=&department=` | Load paginated Kudos feed; supports `hashtag` and `department` filter params | Page mount + load more + filter change |
| `GET /api/kudos/highlights?limit=5` | Load top 5 most-liked Kudos | Page mount |
| `GET /api/kudos/spotlight` | Load spotlight boards | Page mount |
| `GET /api/kudos/stats` | Load general statistics | Page mount |
| `GET /api/kudos/top-sunners?limit=10` | Load top 10 recipients | Page mount |
| `GET /api/kudos/hashtags` | Load available hashtag list (for filter chips and filter UI) | Page mount |
| `POST /api/kudos/:id/like` | Like a Kudos | Heart button click (not liked) |
| `DELETE /api/kudos/:id/like` | Unlike a Kudos | Heart button click (already liked) |
| `GET /api/admin/special-days` | Check if today is a special day | Page mount (SSR) |

---

## State Management

### Local Component State

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `kudosList` | `Kudos[]` | `[]` | All Kudos feed |
| `highlights` | `Kudos[]` | `[]` | Top 5 highlight Kudos |
| `activeSlide` | `number` | `0` | Current Highlight carousel index |
| `filterHashtag` | `string \| null` | `null` | Active hashtag filter |
| `filterDepartment` | `string \| null` | `null` | Active department filter |
| `isSpecialDay` | `boolean` | `false` | Admin-configured special day (fetched once at page load) |
| `isLoadingFeed` | `boolean` | `true` | True while initial Kudos feed is loading |
| `isRefreshing` | `boolean` | `false` | True during 60s auto-refresh poll (shows subtle refresh indicator, not a full spinner) |
| `feedError` | `string \| null` | `null` | Error message if feed load or refresh fails; shows retry UI |
| `currentPage` | `number` | `1` | Current pagination page for feed |
| `hasMore` | `boolean` | `true` | Whether more pages exist for "load more" |

### Per-Kudos State (via `Map<kudosId, KudosLocalState>`)

| State | Type | Description |
|-------|------|-------------|
| `likedByMe` | `boolean` | Whether current user has liked this Kudos |
| `heartCount` | `number` | Current total heart count (optimistic update in progress or confirmed) |
| `isLiking` | `boolean` | True while like/unlike API request is in flight for this specific Kudos |

---

## Requirements

### Functional Requirements

- **FR-001**: Page MUST render at `/kudos` with all 6 sections.
- **FR-002**: Highlight Kudos MUST show up to 5 most-liked Kudos.
- **FR-003**: Kudos feed MUST display in reverse-chronological order.
- **FR-004**: Heart button MUST be disabled/hidden on Kudos sent by the current user.
- **FR-005**: One authenticated user can like a Kudos at most once; UI MUST prevent double-like.
- **FR-006**: On special days, each like MUST add 2 hearts; unlike MUST remove 2.
- **FR-007**: Unlike MUST reduce heart count by the same amount that was added.
- **FR-008**: Statistics sidebar MUST show accurate total counts.
- **FR-009**: Hashtag and department filters MUST update the feed without a full page reload.
- **FR-010**: Unauthenticated users MUST be redirected to `/login` on any interactive action.

### Technical Requirements

- **TR-001**: Like/unlike MUST use optimistic UI updates (count updates before server confirms).
- **TR-002**: On like API failure, MUST roll back the optimistic update and show error toast.
- **TR-003**: Special day status MUST be fetched server-side on page load (not client-polled). Cache result in React context for the session; do NOT re-fetch on every like click.
- **TR-004**: Kudos feed MUST support pagination or infinite scroll. The feed MUST auto-refresh every 60 seconds via polling (`setInterval`) to reflect new Kudos without a manual page reload. On tab hidden (`visibilitychange`), pause polling; resume on tab focus.
- **TR-005**: `POST /api/kudos/:id/like` MUST verify on the server that (a) user is authenticated, (b) user is not the kudos sender, (c) user has not already liked this kudos. Client-side checks are supplementary only (Constitution Principle VI).
- **TR-006**: All kudos, likes, and user tables in Supabase MUST have Row-Level Security (RLS) enabled (Constitution Principle VI). Kudos feed is publicly readable; like/write operations require authenticated RLS policies.
- **TR-007**: Copy Link button copies the URL `{origin}/kudos#{kudosId}` to clipboard. Deep link to a specific Kudos via hash ID SHOULD scroll to that card on load.
- **TR-008**: All design token values MUST be CSS variables from `app/globals.css` — no hardcoded hex in component files (Constitution Principle II).
- **TR-009**: Kudos message content MUST be stored as plain text or sanitized HTML. If rich text is stored as HTML, DOMPurify MUST be applied on render (Constitution Principle VI — XSS prevention).

---

## Success Criteria

- **SC-001**: Kudos feed loads within 1.5s on first render.
- **SC-002**: Like/unlike action reflects in UI within 100ms (optimistic), confirmed by server within 2s.
- **SC-003**: Special day double-heart logic is correctly applied on admin-configured dates.
- **SC-004**: Heart button is disabled for sender's own Kudos (verified with own sent Kudos).

---

## Out of Scope

- Sending Kudos (covered by the Viet Kudos screen/modal).
- Deleting or editing a Kudos after submission.
- Admin management of special days (backend feature).
- Real-time WebSocket/Supabase Realtime subscriptions (60s polling is the MVP strategy).

---

## Dependencies

- [x] Authentication implemented (Supabase Auth)
- [ ] Kudos database table schema defined
- [ ] Kudos API endpoints implemented
- [ ] Special days admin configuration available
- [ ] Viet Kudos modal implemented (for "Write Kudos" CTA)
