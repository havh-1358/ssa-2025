# Backend API Test Cases — SSA 2025

**Generated**: 2026-04-28
**Source**: `api-docs.yaml` v1.0.0 + all 7 screen specs
**Platform**: Next.js App Router / Supabase (PostgreSQL)

---

## Overview

| Endpoint | Method | Auth | Tag |
|----------|--------|------|-----|
| `/auth/callback` | GET | — | Auth |
| `/kudos` | GET | Public | Kudos |
| `/kudos` | POST | Required | Kudos |
| `/kudos/highlights` | GET | Public | Kudos |
| `/kudos/spotlight` | GET | Required | Kudos |
| `/kudos/stats` | GET | Public | Kudos |
| `/kudos/top-sunners` | GET | Public | Kudos |
| `/kudos/hashtags` | GET | Required | Kudos |
| `/kudos/{id}/like` | POST | Required | Likes |
| `/kudos/{id}/like` | DELETE | Required | Likes |
| `/users/search` | GET | Required | Users |
| `/upload` | POST | Required | Upload |
| `/admin/special-days` | GET | Public | Admin |

**Total endpoints**: 13
**Total test cases**: 88

---

## Test Data Prerequisites

```
# Test accounts (seeded in Supabase Auth)
USER_A:  id=uuid-user-a  name="Nguyen Van A"  department="Engineering"
USER_B:  id=uuid-user-b  name="Tran Thi B"   department="Design"
USER_C:  id=uuid-user-c  name="Le Van C"      department="Engineering"

# Test kudos (seeded)
KUDOS_1: id=1  sender=USER_B  recipient=USER_A  heartCount=12  isAnonymous=false
KUDOS_2: id=2  sender=USER_A  recipient=USER_C  heartCount=5   isAnonymous=true
KUDOS_3: id=3  sender=USER_C  recipient=USER_B  heartCount=0

# Test hashtags (seeded)
HASHTAG_1: id=1  name="#thank-you"  usageCount=42
HASHTAG_2: id=2  name="#teamwork"   usageCount=38

# Special day (seeded for special-day tests)
SPECIAL_DAY_1: id=1  date="2026-05-21"  title="Sun* Anniversary"  multiplier=2

# Supabase Storage bucket: kudos-images (exists)
```

---

## GET /auth/callback

### Description
OAuth callback route handler. Not a JSON API — responds with HTTP redirects only.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| AUTH_01 | Positive | Valid OAuth code | `?code=valid_code_from_google` | Redirect `302` to `/` (Homepage) | 302 |
| AUTH_02 | Positive | User cancelled OAuth | `?error=access_denied` | Redirect `302` to `/login` (NO error query param) | 302 |
| AUTH_03 | Negative | Other OAuth error | `?error=server_error` | Redirect `302` to `/login?error=auth_failed` | 302 |
| AUTH_04 | Negative | Code missing entirely | `(no code, no error params)` | Redirect `302` to `/login?error=auth_failed` | 302 |
| AUTH_05 | Negative | Invalid/expired code | `?code=expired_or_invalid_code` | `exchangeCodeForSession` throws → redirect `302` to `/login?error=auth_failed` | 302 |
| AUTH_06 | Boundary | Both code and error present | `?code=abc&error=access_denied` | Error takes precedence → redirect `/login` (no error param — user cancelled) | 302 |

**Notes**:
- `access_denied` must NOT add `?error=auth_failed` to the redirect (user intentionally cancelled)
- All other `?error=*` values redirect to `/login?error=auth_failed`
- Session cookie (`sb-access-token`) is set as HttpOnly on successful code exchange (AUTH_01)
- Verify cookie is NOT set on failure cases (AUTH_03, AUTH_04, AUTH_05)

---

## GET /kudos

### Description
Paginated kudos feed ordered by `createdAt DESC`. Filters by hashtag and department. Public — no auth required. Anonymous kudos omit sender fields from response.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| KUDOS_GET_01 | Positive | Default feed (no filters) | `GET /kudos` | Array of kudos, `meta.page=1`, `meta.limit=20` | 200 |
| KUDOS_GET_02 | Positive | Filter by hashtag | `GET /kudos?hashtag=%23thank-you` | Only kudos with `"#thank-you"` in `hashtags[]` | 200 |
| KUDOS_GET_03 | Positive | Filter by department | `GET /kudos?department=Engineering` | Only kudos where recipient's department is "Engineering" | 200 |
| KUDOS_GET_04 | Positive | Second page | `GET /kudos?page=2&limit=10` | `meta.page=2`, `meta.limit=10`, correct offset | 200 |
| KUDOS_GET_05 | Positive | Anonymous kudos in feed | `GET /kudos` (KUDOS_2 is anonymous) | KUDOS_2 response: `isAnonymous=true`, NO `senderId/senderName/senderAvatarUrl` keys in JSON | 200 |
| KUDOS_GET_06 | Positive | Non-anonymous kudos in feed | `GET /kudos` | KUDOS_1 response: `isAnonymous=false`, `senderName` present | 200 |
| KUDOS_GET_07 | Positive | Combined filter: hashtag + department | `GET /kudos?hashtag=%23teamwork&department=Design` | Intersection of both filters | 200 |
| KUDOS_GET_08 | Positive | No results (valid filter, no matches) | `GET /kudos?hashtag=%23nonexistent` | `data=[]`, `meta.total=0` | 200 |
| KUDOS_GET_09 | Boundary | Page 1, limit 1 | `GET /kudos?page=1&limit=1` | `data` has exactly 1 item, `meta.limit=1` | 200 |
| KUDOS_GET_10 | Boundary | limit=100 (max) | `GET /kudos?limit=100` | `meta.limit=100` | 200 |
| KUDOS_GET_11 | Boundary | limit=101 (exceeds max) | `GET /kudos?limit=101` | Clamped to 100 OR `422 Validation error` | 200/422 |
| KUDOS_GET_12 | Boundary | page=0 (below min) | `GET /kudos?page=0` | `422 Validation error` | 422 |
| KUDOS_GET_13 | Validation | Soft-deleted kudos excluded | Seed kudos with `deleted_at IS NOT NULL`; `GET /kudos` | Soft-deleted kudos NOT in response | 200 |
| KUDOS_GET_14 | Validation | Ordering is `createdAt DESC` | Multiple kudos with different timestamps | Most recent first | 200 |

**Assertions for KUDOS_GET_05 (anonymous field absence)**:
```json
// MUST NOT have these keys at all (not even null):
{ "senderId": ..., "senderName": ..., "senderAvatarUrl": ... }

// MUST have:
{ "isAnonymous": true, "recipientId": "...", "recipientName": "..." }
```

---

## POST /kudos

### Description
Create a new kudos. Requires authentication. Server-side DOMPurify sanitization on `message`. Idempotency key prevents duplicate submissions. Self-send is forbidden.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| KUDOS_POST_01 | Positive | Valid non-anonymous kudos | Auth as USER_A; `{recipientId: USER_C, title: "Thanks!", message: "<p>Thanks!</p>", hashtags: ["#thank-you"], imageUrls: [], isAnonymous: false, idempotencyKey: "uuid-1"}` | `201`; kudos object with `id`, `senderId=USER_A`, `recipientId=USER_C` | 201 |
| KUDOS_POST_02 | Positive | Valid anonymous kudos | Auth as USER_A; same body with `isAnonymous: true` | `201`; response has NO `senderId/senderName/senderAvatarUrl` keys; DB row still has `sender_id=USER_A` | 201 |
| KUDOS_POST_03 | Positive | Kudos with image URLs | Auth as USER_A; `imageUrls: ["https://storage.supabase.co/kudos-images/test.jpg"]` | `201`; `imageUrls` array contains the CDN URL | 201 |
| KUDOS_POST_04 | Positive | Kudos with multiple hashtags | `hashtags: ["#thank-you", "#teamwork", "#innovation"]` | `201`; `hashtags` array matches input | 201 |
| KUDOS_POST_05 | Positive | XSS in message is sanitized | `message: "<script>alert('xss')</script><p>Real content</p>"` | `201`; stored message has `<script>` stripped; only `<p>Real content</p>` | 201 |
| KUDOS_POST_06 | Positive | Idempotent re-submission (same key, second call) | Same body with same `idempotencyKey` as KUDOS_POST_01 | `409 Conflict`; error code `DUPLICATE_SUBMISSION` | 409 |
| KUDOS_POST_07 | Negative | Unauthenticated | No session cookie; valid body | `401 Unauthorized`; error code `UNAUTHORIZED` | 401 |
| KUDOS_POST_08 | Negative | Self-send | Auth as USER_A; `recipientId=USER_A (same as senderId)` | `400 Bad Request`; error code `SELF_SEND_FORBIDDEN` | 400 |
| KUDOS_POST_09 | Validation | Missing `recipientId` | Body without `recipientId` | `422`; details.recipientId has error | 422 |
| KUDOS_POST_10 | Validation | Missing `title` | Body without `title` | `422`; details.title has error | 422 |
| KUDOS_POST_11 | Validation | Missing `message` | Body without `message` | `422`; details.message has error | 422 |
| KUDOS_POST_12 | Validation | Missing `idempotencyKey` | Body without `idempotencyKey` | `422`; details.idempotencyKey has error | 422 |
| KUDOS_POST_13 | Validation | `idempotencyKey` not a UUID | `idempotencyKey: "not-a-uuid"` | `422`; details.idempotencyKey has error | 422 |
| KUDOS_POST_14 | Boundary | Title at max length (100 chars) | `title: "A".repeat(100)` | `201` | 201 |
| KUDOS_POST_15 | Boundary | Title exceeds max length (101 chars) | `title: "A".repeat(101)` | `422`; details.title has max-length error | 422 |
| KUDOS_POST_16 | Boundary | Empty `hashtags` array | `hashtags: []` | `201`; `hashtags: []` in response | 201 |
| KUDOS_POST_17 | Boundary | Empty `imageUrls` array | `imageUrls: []` | `201`; `imageUrls: []` in response | 201 |
| KUDOS_POST_18 | Boundary | `recipientId` does not exist | `recipientId: "non-existent-uuid"` | `422` OR `404`; recipient not found | 422/404 |

---

## GET /kudos/highlights

### Description
Top 5 most-liked kudos by `heartCount DESC`. Public.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| HIGHLIGHTS_01 | Positive | Normal response | `GET /kudos/highlights` | Array of ≤5 kudos; ordered by `heartCount DESC` | 200 |
| HIGHLIGHTS_02 | Positive | Anonymous kudos in highlights | If a highlighted kudos is anonymous | `isAnonymous=true`, NO sender fields in that item | 200 |
| HIGHLIGHTS_03 | Boundary | Fewer than 5 kudos in DB | Seed ≤3 kudos; `GET /kudos/highlights` | Returns all available (≤5); no error | 200 |
| HIGHLIGHTS_04 | Boundary | Zero kudos in DB | Empty DB; `GET /kudos/highlights` | `data: []` | 200 |
| HIGHLIGHTS_05 | Validation | Soft-deleted kudos excluded | Seed kudos with `deleted_at` set; `GET /kudos/highlights` | Soft-deleted NOT returned | 200 |

---

## GET /kudos/spotlight

### Description
Admin-configured spotlight boards with featured kudos. Requires authentication. Boards ordered by `displayOrder ASC`.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| SPOTLIGHT_01 | Positive | Authenticated user | Auth cookie; `GET /kudos/spotlight` | Array of active boards, each with `kudos[]` array | 200 |
| SPOTLIGHT_02 | Positive | Inactive boards excluded | Seed board with `is_active=false` | Only boards where `is_active=true` appear | 200 |
| SPOTLIGHT_03 | Positive | Boards ordered by `displayOrder` | Seed boards with different `display_order` | Response ordered `displayOrder ASC` | 200 |
| SPOTLIGHT_04 | Negative | Unauthenticated | No session cookie | `401 Unauthorized` | 401 |
| SPOTLIGHT_05 | Boundary | No active boards | All boards `is_active=false` | `data: []` | 200 |

---

## GET /kudos/stats

### Description
Aggregate platform statistics. Public.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| STATS_01 | Positive | Returns stats | `GET /kudos/stats` | `{totalKudos, totalHearts, totalParticipants}` all integers ≥ 0 | 200 |
| STATS_02 | Boundary | Empty DB (zero stats) | Empty DB | `{totalKudos: 0, totalHearts: 0, totalParticipants: 0}` | 200 |
| STATS_03 | Positive | `totalHearts` accounts for special-day likes | Seed like with `hearts_given=2` | `totalHearts` sums `hearts_given` (not like count) | 200 |

---

## GET /kudos/top-sunners

### Description
Top 10 kudos recipients by kudos received count. Public.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| TOPSUNN_01 | Positive | Returns top sunners | `GET /kudos/top-sunners` | Array of ≤10 users; each has `id, name, avatarUrl, kudosReceived` | 200 |
| TOPSUNN_02 | Positive | Ordered by `kudosReceived DESC` | Multiple users with different counts | Highest kudosReceived first | 200 |
| TOPSUNN_03 | Boundary | Fewer than 10 recipients | Only 3 unique recipients in DB | Returns 3 (not 10); no error | 200 |
| TOPSUNN_04 | Boundary | Zero kudos in DB | Empty DB | `data: []` | 200 |
| TOPSUNN_05 | Validation | Soft-deleted kudos excluded from count | Kudos with `deleted_at` set | Those kudos not counted toward recipient's rank | 200 |

---

## GET /kudos/hashtags

### Description
All available hashtags ordered by `usageCount DESC`. Requires authentication.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| HASHTAGS_01 | Positive | Authenticated user | Auth cookie; `GET /kudos/hashtags` | Array of hashtags with `id, name, usageCount` | 200 |
| HASHTAGS_02 | Positive | Ordered by `usageCount DESC` | Multiple hashtags with different counts | Highest usageCount first | 200 |
| HASHTAGS_03 | Negative | Unauthenticated | No session cookie | `401 Unauthorized` | 401 |
| HASHTAGS_04 | Boundary | No hashtags seeded | Empty hashtags table | `data: []` | 200 |

---

## POST /kudos/{id}/like

### Description
Like a kudos. `heartsGiven` is 1 normally, 2 on special days. Cannot like own kudos. Cannot like twice.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| LIKE_POST_01 | Positive | Normal like (1 heart) | Auth as USER_A; `POST /kudos/1/like` with `{heartsGiven: 1}` | `200`; `{kudosId: 1, heartCount: 13, heartsGiven: 1}` | 200 |
| LIKE_POST_02 | Positive | Special day like (2 hearts) | Auth as USER_A; `POST /kudos/1/like` with `{heartsGiven: 2}` | `200`; `{kudosId: 1, heartCount: 14, heartsGiven: 2}` | 200 |
| LIKE_POST_03 | Positive | `kudos.heart_count` atomically incremented | Before: heartCount=12; like with heartsGiven=1 | `heartCount` in DB = 13; response `heartCount: 13` | 200 |
| LIKE_POST_04 | Negative | Unauthenticated | No session cookie | `401 Unauthorized` | 401 |
| LIKE_POST_05 | Negative | Like own kudos | Auth as USER_B (sender of KUDOS_1); `POST /kudos/1/like` | `403 Forbidden`; error code `SELF_LIKE_FORBIDDEN` | 403 |
| LIKE_POST_06 | Negative | Like same kudos twice | Auth as USER_A; `POST /kudos/1/like` twice | Second call: `409 Conflict`; error code `ALREADY_LIKED` | 409 |
| LIKE_POST_07 | Negative | Kudos does not exist | `POST /kudos/99999/like` | `404 Not Found` | 404 |
| LIKE_POST_08 | Validation | Missing `heartsGiven` | `{}` body | `422 Validation error`; details.heartsGiven has error | 422 |
| LIKE_POST_09 | Validation | `heartsGiven=0` (not in enum 1,2) | `{heartsGiven: 0}` | `422 Validation error` | 422 |
| LIKE_POST_10 | Validation | `heartsGiven=3` (not in enum 1,2) | `{heartsGiven: 3}` | `422 Validation error` | 422 |
| LIKE_POST_11 | Boundary | Like anonymous kudos | `POST /kudos/2/like` (KUDOS_2 is anonymous); auth as USER_B | `200`; operation succeeds (anonymity doesn't affect liking) | 200 |
| LIKE_POST_12 | Boundary | `id=0` (invalid) | `POST /kudos/0/like` | `404` or `422` | 404/422 |

---

## DELETE /kudos/{id}/like

### Description
Unlike a kudos. Decrements `heart_count` by original `hearts_given`. Returns `404` if like never existed.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| LIKE_DEL_01 | Positive | Unlike a previously liked kudos | Auth as USER_A; seed like for USER_A on KUDOS_3; `DELETE /kudos/3/like` | `200`; `{kudosId: 3, heartCount: -1 from before}` | 200 |
| LIKE_DEL_02 | Positive | `heartCount` decremented by original `heartsGiven` | Like with `heartsGiven=2`; unlike | `heartCount` decremented by 2, not 1 | 200 |
| LIKE_DEL_03 | Positive | `heartCount` never goes below 0 | DB CHECK constraint enforces `heart_count >= 0` | If somehow triggered, `500` (CHECK violation) | 200 |
| LIKE_DEL_04 | Negative | Unauthenticated | No session cookie | `401 Unauthorized` | 401 |
| LIKE_DEL_05 | Negative | Unlike kudos never liked | Auth as USER_A; `DELETE /kudos/1/like` without having liked it | `404 Not Found`; error code `LIKE_NOT_FOUND` | 404 |
| LIKE_DEL_06 | Negative | Unlike already removed like | Auth as USER_A; like KUDOS_3, unlike KUDOS_3, unlike again | `404 Not Found`; error code `LIKE_NOT_FOUND` | 404 |
| LIKE_DEL_07 | Negative | Kudos does not exist | `DELETE /kudos/99999/like` | `404 Not Found` | 404 |
| LIKE_DEL_08 | Boundary | Cannot unlike another user's like | Auth as USER_C trying to delete USER_A's like on KUDOS_1 | `404 Not Found` (own-row delete RLS; can only delete own likes) | 404 |

---

## GET /users/search

### Description
Full-text name search (iLIKE via trigram). Excludes self. Max 10 results. Requires authentication.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| USERS_01 | Positive | Single match | Auth as USER_A; `?q=Tran` | `[{id: USER_B, name: "Tran Thi B", ...}]` | 200 |
| USERS_02 | Positive | Multiple matches | Auth as USER_A; `?q=an` | Array of users whose names contain "an" | 200 |
| USERS_03 | Positive | Self excluded from results | Auth as USER_A; `?q=Nguyen` | USER_A NOT in results even if name matches | 200 |
| USERS_04 | Positive | Case-insensitive match | Auth as USER_A; `?q=nguyen` (lowercase) | Matches "Nguyen Van A" regardless of case | 200 |
| USERS_05 | Positive | No matches | Auth as USER_A; `?q=zzzzzzz` | `data: []` | 200 |
| USERS_06 | Positive | Department included in response | Auth as USER_A; `?q=Tran` | USER_B response includes `department: "Design"` | 200 |
| USERS_07 | Negative | Unauthenticated | No session cookie | `401 Unauthorized` | 401 |
| USERS_08 | Boundary | Query with exactly 2 chars | `?q=ng` | `200`; valid results (minimum length) | 200 |
| USERS_09 | Boundary | Query with 1 char (below min) | `?q=n` | `200` with `data: []` OR `422` (behavior: return empty) | 200/422 |
| USERS_10 | Boundary | Empty string query | `?q=` | `data: []` OR `422` | 200/422 |
| USERS_11 | Boundary | Results capped at 10 | Seed 15 users matching query; `?q=test` | Response has exactly 10 items | 200 |
| USERS_12 | Validation | Missing `q` parameter | `GET /users/search` (no q) | `422 Validation error` | 422 |

---

## POST /upload

### Description
Upload image to Supabase Storage `kudos-images` bucket. Returns CDN URL. Requires authentication. Max 5 MB. JPEG/PNG/GIF/WebP only.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| UPLOAD_01 | Positive | Valid JPEG upload | Auth; `multipart/form-data`; file=1MB JPEG | `201`; `{data: {url: "https://storage.supabase.co/..."}}` | 201 |
| UPLOAD_02 | Positive | Valid PNG upload | Auth; file=500KB PNG | `201`; CDN URL returned | 201 |
| UPLOAD_03 | Positive | Valid GIF upload | Auth; file=2MB GIF | `201`; CDN URL returned | 201 |
| UPLOAD_04 | Positive | Valid WebP upload | Auth; file=300KB WebP | `201`; CDN URL returned | 201 |
| UPLOAD_05 | Positive | URL is a valid Supabase CDN URL | Successful upload | Response `url` starts with `https://` and contains Supabase hostname | 201 |
| UPLOAD_06 | Negative | Unauthenticated | No session cookie | `401 Unauthorized` | 401 |
| UPLOAD_07 | Negative | Non-image file (PDF) | Auth; file=PDF document | `422`; error code `INVALID_FILE`; "File must be an image" | 422 |
| UPLOAD_08 | Negative | Non-image file (SVG) | Auth; file=SVG (not in allowed list) | `422`; error code `INVALID_FILE` | 422 |
| UPLOAD_09 | Boundary | File exactly 5 MB | Auth; file=5242880 bytes JPEG | `201`; upload succeeds | 201 |
| UPLOAD_10 | Boundary | File exceeds 5 MB | Auth; file=5242881 bytes JPEG | `422`; error code `INVALID_FILE`; size exceeded | 422 |
| UPLOAD_11 | Boundary | Zero-byte file | Auth; file=0 bytes | `422` or `500`; empty file rejected | 422 |
| UPLOAD_12 | Validation | Missing `file` field in form | Auth; empty multipart body | `422`; file is required | 422 |
| UPLOAD_13 | Validation | Wrong content-type header | Auth; `application/json` body | `422` or `400` | 422/400 |

---

## GET /admin/special-days

### Description
List special days (heart multiplier configuration). Includes `isToday` computed boolean. Public.

### Test Cases

| ID | Category | Scenario | Input | Expected Output | Status |
|----|----------|----------|-------|-----------------|--------|
| SPECIAL_01 | Positive | Returns special days | `GET /admin/special-days` | Array with `id, date, title, multiplier`; top-level `isToday` boolean | 200 |
| SPECIAL_02 | Positive | `isToday=true` when today matches | Seed special day with today's date; request on that day | `isToday: true` | 200 |
| SPECIAL_03 | Positive | `isToday=false` when no match | Request on a non-special day | `isToday: false` | 200 |
| SPECIAL_04 | Positive | Multiple special days | Seed 3 special days | All 3 returned in response | 200 |
| SPECIAL_05 | Boundary | No special days configured | Empty `special_days` table | `{data: [], isToday: false}` | 200 |

---

## Integration Scenarios

### Scenario A: Complete Kudos Submission Flow (Happy Path)

Tests the full lifecycle: upload image → submit kudos → kudos appears in feed → kudos appears in highlights.

```
Step 1: Upload image
  Request:  POST /upload  (Auth as USER_A; 500KB JPEG)
  Expected: 201  →  imageUrl = response.data.url

Step 2: Submit kudos
  Request:  POST /kudos  (Auth as USER_A)
            { recipientId: USER_C, title: "Great work!", message: "<p>Well done!</p>",
              hashtags: ["#teamwork"], imageUrl: {imageUrl from Step 1},
              isAnonymous: false, idempotencyKey: uuid() }
  Expected: 201  →  kudosId = response.data.id

Step 3: Verify kudos appears in feed (most recent first)
  Request:  GET /kudos?page=1&limit=5
  Expected: 200  →  response.data[0].id == kudosId (just created)

Step 4: Filter feed by hashtag
  Request:  GET /kudos?hashtag=%23teamwork
  Expected: 200  →  kudosId appears in results

Step 5: Filter feed by department
  Request:  GET /kudos?department=Engineering  (USER_C's department)
  Expected: 200  →  kudosId appears in results

Step 6: Verify kudos stats incremented
  Request:  GET /kudos/stats
  Expected: 200  →  totalKudos increased by 1 from baseline
```

### Scenario B: Like → Unlike Cycle (Optimistic UI Rollback Simulation)

Tests that liking and unliking correctly maintains `heartCount` integrity.

```
Step 0: Baseline
  Request:  GET /kudos  (find KUDOS_1 which has heartCount=12)
  Expected: KUDOS_1.heartCount == 12

Step 1: Like kudos
  Request:  POST /kudos/1/like  (Auth as USER_A; {heartsGiven: 1})
  Expected: 200  →  {kudosId: 1, heartCount: 13, heartsGiven: 1}

Step 2: Verify heartCount in feed
  Request:  GET /kudos
  Expected: KUDOS_1.heartCount == 13

Step 3: Unlike kudos
  Request:  DELETE /kudos/1/like  (Auth as USER_A)
  Expected: 200  →  {kudosId: 1, heartCount: 12}

Step 4: Verify heartCount restored
  Request:  GET /kudos
  Expected: KUDOS_1.heartCount == 12

Step 5: Try to unlike again (simulate double-tap edge case)
  Request:  DELETE /kudos/1/like  (Auth as USER_A)
  Expected: 404  →  error code LIKE_NOT_FOUND
```

### Scenario C: Special Day Double Hearts

Tests that `heartsGiven=2` is accepted and correctly doubles the heart count.

```
Step 0: Ensure today is a special day (seed special_days with today's date)

Step 1: Check special days endpoint
  Request:  GET /admin/special-days
  Expected: 200  →  isToday=true; multiplier=2

Step 2: Like with 2 hearts
  Request:  POST /kudos/3/like  (Auth as USER_A; {heartsGiven: 2})
            (KUDOS_3 has heartCount=0)
  Expected: 200  →  {kudosId: 3, heartCount: 2, heartsGiven: 2}

Step 3: Unlike (removes 2 hearts)
  Request:  DELETE /kudos/3/like  (Auth as USER_A)
  Expected: 200  →  {kudosId: 3, heartCount: 0}
```

### Scenario D: Idempotent Kudos Submission

Simulates network retry where client sends the same kudos twice with the same `idempotencyKey`.

```
Step 1: Submit kudos (first attempt)
  Request:  POST /kudos  (idempotencyKey: "fixed-key-uuid-001")
  Expected: 201  →  kudos created

Step 2: Retry submission (network retry simulation)
  Request:  POST /kudos  (same idempotencyKey: "fixed-key-uuid-001", same body)
  Expected: 409  →  error code DUPLICATE_SUBMISSION

Step 3: Verify only one kudos exists
  Request:  GET /kudos?page=1&limit=100
  Expected: 200  →  exactly 1 kudos with the given content (not 2)
```

### Scenario E: User Search → Recipient Selection Flow

Simulates the Viet Kudos modal recipient search flow.

```
Step 1: Search for recipient
  Request:  GET /users/search?q=Le  (Auth as USER_A)
  Expected: 200  →  USER_C in results; USER_A NOT in results (self-excluded)

Step 2: Submit kudos to found recipient
  Request:  POST /kudos
            { recipientId: USER_C.id, title: "Awesome!", ...}
  Expected: 201

Step 3: Attempt self-send
  Request:  GET /users/search?q=Nguyen  (Auth as USER_A)
  Expected: USER_A NOT in results → client cannot select self
  
  (Defensive: even if client tampers)
  Request:  POST /kudos  {recipientId: USER_A (self)}
  Expected: 400  →  SELF_SEND_FORBIDDEN
```

---

## Test Coverage Summary

| Endpoint | Positive | Negative | Boundary | Validation | Integration | Total |
|----------|----------|----------|----------|------------|-------------|-------|
| GET /auth/callback | 2 | 3 | 1 | — | — | 6 |
| GET /kudos | 8 | — | 3 | 3 | Scenarios A | 14 |
| POST /kudos | 5 | 3 | 4 | 6 | Scenarios A, D, E | 18 |
| GET /kudos/highlights | 3 | — | 2 | — | — | 5 |
| GET /kudos/spotlight | 3 | 1 | 1 | — | — | 5 |
| GET /kudos/stats | 2 | — | 1 | — | Scenario A | 3 |
| GET /kudos/top-sunners | 3 | — | 2 | — | — | 5 |
| GET /kudos/hashtags | 2 | 1 | 1 | — | — | 4 |
| POST /kudos/{id}/like | 3 | 4 | 2 | 3 | Scenarios B, C | 12 |
| DELETE /kudos/{id}/like | 3 | 4 | 1 | — | Scenarios B, C | 8 |
| GET /users/search | 6 | 1 | 3 | 1 | Scenario E | 12 |
| POST /upload | 5 | 3 | 3 | 2 | Scenario A | 13 |
| GET /admin/special-days | 4 | — | 1 | — | Scenario C | 5 |
| **Total** | **53** | **20** | **25** | **15** | **5 scenarios** | **110** |

---

## Test Data Teardown

After each test run, clean up in this order to respect FK constraints:

```sql
DELETE FROM spotlight_board_kudos;
DELETE FROM spotlight_boards;
DELETE FROM likes;
DELETE FROM kudos;
DELETE FROM hashtags;
DELETE FROM special_days;
DELETE FROM users WHERE id NOT IN (uuid-user-a, uuid-user-b, uuid-user-c);
-- Supabase Storage: delete all objects in kudos-images bucket
```
