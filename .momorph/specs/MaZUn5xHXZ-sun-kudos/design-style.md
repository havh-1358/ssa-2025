# Design Style: Sun* Kudos

**Frame ID**: `MaZUn5xHXZ`
**Frame Name**: `Sun* Kudos - Live board`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Last Updated**: 2026-04-22

---

## Design Tokens

### Colors

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| `--color-bg-base` | `#00101A` | Page background |
| `--color-header-bg` | `rgba(16, 20, 23, 0.8)` | Header background |
| `--color-text-primary` | `#FFFFFF` | Primary text on dark bg |
| `--color-accent-gold` | `#FFEA9E` | Active nav, highlights, CTA |
| `--color-accent-gold-divider` | `rgba(255, 234, 158, 1)` = `#FFEA9E` | Kudos card gold divider lines |
| `--color-kudos-card-bg` | `rgba(255, 248, 225, 1)` = `#FFF8E1` | Kudos card background (cream) |
| `--color-kudos-msg-bg` | `rgba(255, 234, 158, 0.4)` | Message box inside card |
| `--color-kudos-text` | `rgba(0, 16, 26, 1)` = `#00101A` | Text inside cream Kudos card |
| `--color-hashtag` | `rgba(212, 39, 29, 1)` = `#D4271D` | Hashtag text color (red) |
| `--color-timestamp` | `rgba(153, 153, 153, 1)` = `#999999` | Timestamp text |
| `--color-border` | `#998C5F` | Buttons, input borders |
| `--color-btn-secondary-bg` | `rgba(255, 234, 158, 0.1)` | Secondary buttons |
| `--color-divider` | `rgba(46, 57, 64, 1)` = `#2E3940` | Section dividers |
| `--color-heart-count-gold` | `rgba(255, 234, 158, 1)` = `#FFEA9E` | Heart count in stats sidebar |

### Typography

| Token | Family | Size | Weight | Line Height | Usage |
|-------|--------|------|--------|-------------|-------|
| `--font-body` | `"Montserrat", sans-serif` | — | — | — | All text |
| `--text-section-heading` | Montserrat | `24px` | `700` | `32px` | Section titles |
| `--text-kudos-message` | Montserrat | `20px` | `700` | `28px` | Kudos body text in card (note: message text is 20px/700 per design, not 16px/400) |
| `--text-kudos-card-label` | Montserrat | `16px` | `700` | `24px` | Kudos title label and hashtag text |
| `--text-kudos-sender` | Montserrat | `16px` | `700` | `24px` | Sender/recipient names |
| `--text-kudos-sender-detail` | Montserrat | `14px` | `400` | `20px` | Badge/star text below sender name |
| `--text-kudos-timestamp` | Montserrat | `16px` | `700` | `24px` | Timestamp text (e.g., "10:00 - 10/30/2025") |
| `--text-stats-number` | Montserrat | `32px` | `700` | `40px` | Stats large numbers |
| `--text-stats-label` | Montserrat | `22px` | `700` | `28px` | Stats labels ("So tim ban nhan duoc:") |
| `--text-top10-rank` | Montserrat | `16px` | `700` | `24px` | Rank numbers |
| `--text-top10-name` | Montserrat | `14px` | `400` | `20px` | Sunner names |
| `--text-heart-count-card` | Montserrat | `24px` | `700` | `32px` | Heart count inside card (dark bg) |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--header-height` | `80px` | Fixed header |
| `--header-padding-x` | `144px` | Header horizontal padding |
| `--content-padding-top` | `96px` | Main content top padding |
| `--content-padding-bottom` | `120px` | Main content bottom padding |
| `--section-gap` | `120px` | Gap between major sections |
| `--feed-gap` | `24px` | Gap between Kudos cards |
| `--sidebar-gap` | `24px` | Gap between sidebar widgets |
| `--highlight-gap` | `40px` | Gap between highlight section sub-elements |
| `--action-padding` | `24px 16px` | Write Kudos / Search button padding |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border-btn` | `1px solid #998C5F` | Secondary buttons |
| `--border-kudos-card` | `none` | Kudos card has no explicit border (cream bg provides contrast on dark page) |
| `--radius-kudos-card` | `24px` | Kudos card border radius |

---

## Component Style Details

### A — Header (Node: `2940:13433`)

| Property | Value |
|----------|-------|
| Width | 1440px |
| Height | 80px |
| Background | `rgba(16, 20, 23, 0.8)` |
| Padding | `12px 144px` |
| Display | flex, row, justify-content: space-between |
| Position | fixed, top: 0 |

**Active nav link ("Sun* Kudos")**:
| Property | Value |
|----------|-------|
| Color | `#FFEA9E` |
| Text shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |
| Border bottom | `1px solid #FFEA9E` |

---

### KV — Keyvisual (Node: `2940:13432`)

| Property | Value |
|----------|-------|
| Width | 1440px |
| Height | 512px |
| Background | Image (cover) |
| Asset path | `public/assets/kudos/keyvisual.jpg` → import as `/assets/kudos/keyvisual.jpg` |
| Gradient overlay | `linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0) 47.8%)` |

---

### B1 — Write Kudos Button (Node: `2940:13449`)

| Property | Value |
|----------|-------|
| Width | `738px` |
| Height | `72px` |
| Position | `absolute`, `left: 144px`, `top: 0px` |
| Padding | `24px 16px` |
| Gap | `8px` |
| Background | `rgba(255, 234, 158, 0.1)` |
| Border | `1px solid #998C5F` |
| Border-radius | `68px` (pill shape) |
| Display | flex row, align-items center |

**Inner Frame 483** (513×24px, gap 16px):
| Sub-element | Size | Style |
|------------|------|-------|
| MM_MEDIA_Pen icon | 24×24px | fill `#FFFFFF` |
| Placeholder text | 473×24px | Montserrat 700, 16px, lh 24px, ls `0.15px`, `#FFFFFF` |
| Placeholder value | — | `"Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?"` |

**Interaction**: Click → mở dialog Viet Kudos (`ihQ26W78P2`). Toàn bộ component là một button, không phải input thực sự.

**States:**
| State | Background | Border | Cursor |
|-------|-----------|--------|--------|
| Default | `rgba(255,234,158,0.1)` | `1px solid #998C5F` | pointer |
| Hover | `rgba(255,234,158,0.15)` | `1px solid #998C5F` | pointer |
| Active/Pressed | `rgba(255,234,158,0.2)` | `1px solid #FFEA9E` | pointer |
| Focus | `rgba(255,234,158,0.1)` | `1px solid #998C5F`, outline `2px solid #FFEA9E` | pointer |

---

### B2 — Search Sunner (Node: `2940:13450`)

| Property | Value |
|----------|-------|
| Width | 381px |
| Height | 72px |
| Border | `1px solid #998C5F` |
| Padding | `24px 16px` |
| Gap | `8px` |
| Background | `rgba(255, 234, 158, 0.1)` |
| Placeholder text | "Tìm kiếm Sunner" |
| Icon | Magnifier (search) icon, left-aligned, 24×24px |

**States:**
| State | Background | Border | Outline |
|-------|-----------|--------|---------|
| Default | `rgba(255,234,158,0.1)` | `1px solid #998C5F` | none |
| Hover | `rgba(255,234,158,0.15)` | `1px solid #998C5F` | none |
| Focus | `rgba(255,234,158,0.1)` | `1px solid #998C5F` | `2px solid #FFEA9E` |
| Has value | `rgba(255,234,158,0.1)` | `1px solid #FFEA9E` | none |

---

### B3 — Highlight Kudos (Node: `2940:13451`)

| Property | Value |
|----------|-------|
| Width | 1440px |
| Height | 786px |
| Gap | `40px` |

**B3.1 Header (Node: `2940:13452`)**:
| Property | Value |
|----------|-------|
| Padding | `0px 144px` |
| Height | `129px` |

**B3.2 Highlight Kudos Carousel (Node: `2940:13461`)**:
| Property | Value |
|----------|-------|
| Height | `525px` |
| Full width | 1440px |

**Filter Buttons — B.1.1 Hashtag / B.1.2 Phòng ban (Nodes: `2940:13459`, `2940:13460`)**:
| Property | Value |
|----------|-------|
| Height | 40px |
| Padding | `8px 16px` |
| Border | `1px solid #998C5F` |
| Border-radius | `4px` |
| Background (default) | `rgba(255, 234, 158, 0.1)` |
| Font | Montserrat 700 14px, `#FFFFFF` |
| Icon | Chevron-down 16×16px, right-aligned |
| Gap | `4px` (between label and chevron) |

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default | `rgba(255,234,158,0.1)` | `#998C5F` | `#FFFFFF` |
| Hover | `rgba(255,234,158,0.2)` | `#998C5F` | `#FFFFFF` |
| Open/Active | `rgba(255,234,158,0.2)` | `#FFEA9E` | `#FFEA9E` |
| Has selection | `rgba(255,234,158,0.15)` | `#FFEA9E` | `#FFEA9E` |
| Focus | outline `2px solid #FFEA9E` | — | — |

**Filter Dropdown Panel — Phòng ban (A_Dropdown-List)**:
| Property | Value |
|----------|-------|
| Width | `147px` |
| Height | `348px` (6 items × 56px + 2 × 6px padding) |
| Padding | `6px` |
| Background | `#00070C` |
| Border | `1px solid #998C5F` |
| Border-radius | `8px` |
| Position | `absolute`, `left: 36px`, `top: 14px` |

**Phòng ban options** (6 items, từ DB):
`CEVC1`, `CEVC2`, `CEVC3`, `CEVC4`, `OPD`, `Infra`

---

**Filter Dropdown Panel — Hashtag (A_Dropdown-List)**:
| Property | Value |
|----------|-------|
| Width | `103px` |
| Height | `348px` (6 items × 56px + 2 × 6px padding) |
| Padding | `6px` |
| Background | `#00070C` |
| Border | `1px solid #998C5F` |
| Border-radius | `8px` |
| Position | `absolute`, `left: calc(50% - 51.5px)` (centered below trigger) |

**Hashtag options** (dynamic từ DB, ví dụ):
`#Dedicated`, `#Inspiring` *(và các hashtag khác được thêm qua Viet Kudos form)*

---

**Each dropdown option item** (áp dụng cho cả 2 dropdown):
| Property | Value |
|----------|-------|
| Height | `56px` |
| Padding | `16px` |
| Border-radius | `4px` |
| Font | Montserrat 700, 16px, lh 24px, ls `0.5px`, `#FFFFFF` |

| State | Background | Text-shadow |
|-------|-----------|-------------|
| Default | transparent | none |
| Hover | `rgba(255,234,158,0.1)` | none |
| Selected (active) | `rgba(255,234,158,0.1)` | `0px 4px 4px rgba(0,0,0,0.25), 0px 0px 6px #FAE287` |

**B3.3 Slide indicators (Node: `2940:13471`)**:
| Property | Value |
|----------|-------|
| Padding | `0 144px` |
| Gap | `32px` |
| Height | `52px` |

---

### B6 — Spotlight Board Header (Node: `2940:13476`)

| Property | Value |
|----------|-------|
| Display | flex, column |
| Supertitle | "Sun* Annual Awards 2025" — Montserrat 700, 24px, `#FFFFFF` |
| Title | "SPOTLIGHT BOARD" — large heading, gold `#FFEA9E` |

---

### B7 — Spotlight Board Canvas (Node: `2940:14174`)

Interactive word cloud showing names of Kudos recipients.

| Property | Value |
|----------|-------|
| Width | 1157px |
| Height | 548px |
| Display | canvas / SVG interactive area |

**B7.1 — Total KUDOS count (Node: `3007:17482`)**:
| Property | Value |
|----------|-------|
| Text | "388 KUDOS" — dynamic from DB total |
| Font | Montserrat 700, 32px, lh 40px |
| Color | `#FFFFFF` |
| Note | Number portion ("388") may be larger than "KUDOS" label — see frame for visual hierarchy |

**B7.2 — Pan/Zoom button (Node: `3007:17479`)**:
| Property | Value |
|----------|-------|
| Type | Icon button (toggle) |
| Tooltip | "Pan/Zoom" on hover |
| Function | Toggles between pan and zoom mode on canvas |
| Size | 40×40px minimum touch target |

**States:**
| State | Background | Border | aria-pressed |
|-------|-----------|--------|-------------|
| Default (pan mode) | `rgba(255,234,158,0.1)` | `1px solid #998C5F` | `false` |
| Active (zoom mode) | `rgba(255,234,158,0.2)` | `1px solid #FFEA9E` | `true` |
| Hover | `rgba(255,234,158,0.15)` | `1px solid #998C5F` | — |

**B7.3 — Search Sunner input (Node: `2940:14833`)**:
| Property | Value |
|----------|-------|
| Width | 381px |
| Height | 72px |
| Border | `1px solid #998C5F` |
| Background | `rgba(255, 234, 158, 0.1)` |
| Placeholder | "Tìm kiếm profile Sunner" |
| Icon | Magnifier (search) icon, left-aligned |
| Validation | Max 100 chars, not required |

**States:**
| State | Description |
|-------|-------------|
| Loading | Skeleton or spinner overlay |
| Empty | "Chưa có dữ liệu" text |
| Interactive | Word cloud nodes clickable/hoverable; tooltip shows name + time on hover |

---

### C1 — All Kudos Feed (Node: `2940:13482`)

| Property | Value |
|----------|-------|
| Width | 680px |
| Height | 3068px (variable) |
| Gap | `24px` |
| Padding | `0px 144px` (applied at parent level) |

---

### Kudos Card (Node: `3127:21871` — C.3_KUDO Post)

| Property | Value |
|----------|-------|
| Width | 680px |
| Height | 749px (variable by content) |
| Background | `rgba(255, 248, 225, 1)` = `#FFF8E1` (cream) |
| Border radius | `24px` |
| Padding | `40px 40px 16px 40px` |
| Gap | `16px` |
| Display | flex, column |

#### Card Section 1 — User Info Row (Node: `I3127:21871;256:4857`)

| Property | Value |
|----------|-------|
| Width | 600px |
| Height | 123px |
| Display | flex, row, gap 24px |

**Sender info (Node: `I3127:21871;256:4858`)** — flex column, gap 13px:
| Sub-element | Size | Style |
|------------|------|-------|
| Avatar | 64×64px | Circular, border `1.869px solid #FFF`, cover bg |
| Sender name | 235×24px | Montserrat 700 16px, `#00101A` |
| Badge + stars | 235×20px | Flex row, gap 10px |

**Send arrow icon (Node: `I3127:21871;256:5161`)** — 32×32px MM_MEDIA_Send icon

**Recipient info** — same structure as sender (Node: `I3127:21871;256:4860`)

#### Card Divider (Node: `I3127:21871;256:5192`)
| Property | Value |
|----------|-------|
| Width | 600px |
| Height | 1px |
| Background | `rgba(255, 234, 158, 1)` = `#FFEA9E` (gold) |

#### Card Section 2 — Content (Node: `I3127:21871;256:5645`)

| Property | Value |
|----------|-------|
| Width | 600px |
| Height | 448px (variable) |
| Display | flex, column, gap 16px |

**Timestamp (Node: `I3127:21871;256:5229`)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700 16px |
| Color | `rgba(153, 153, 153, 1)` = `#999999` |
| Example | "10:00 - 10/30/2025" |

**Kudos title / hashtag label (Node: `I3127:21871;2234:33038`)**:
| Property | Value |
|----------|-------|
| Height | 32px |
| Title text | Montserrat 700 16px, `#00101A` |
| Edit icon | `MM_MEDIA_Pen` 32×32px (shown to sender) |

**Message box (Node: `I3127:21871;662:11382`)**:
| Property | Value |
|----------|-------|
| Border | `1px solid #FFEA9E` |
| Background | `rgba(255, 234, 158, 0.4)` |
| Padding | `16px 24px` |
| Gap | `10px` |
| Border radius | `8px` (assumed) |

**Message text (Node: `I3127:21871;256:5156`)**:
| Property | Value |
|----------|-------|
| Width | 552px |
| Font | Montserrat 700 20px |
| Color | `#00101A` |

**Image attachments (Node: `I3127:21871;256:5176`)** — flex row, gap 16px:
| Sub-element | Size | Style |
|------------|------|-------|
| Each image thumbnail | 88×88px | `border: 1px solid #998C5F`, `bg: #FFF` |
| Active image | 88×88px | `border: 1px solid #FFEA9E` |

**Hashtags row (Node: `I3127:21871;256:5158`)**:
| Property | Value |
|----------|-------|
| Height | 48px |
| Font | Montserrat 700 16px |
| Color | `rgba(212, 39, 29, 1)` = `#D4271D` (RED) |
| Example | "#Dedicated #Inspiring #..." |

#### Card Divider 2 (Node: `I3127:21871;256:7496`)
Same as first divider: 600×1px, `#FFEA9E`

#### Card Section 3 — Action Bar (Node: `I3127:21871;256:5194`)

| Property | Value |
|----------|-------|
| Width | 600px |
| Height | 56px |
| Display | flex, row, gap 24px |
| Padding | `0px` |

**C.4.2 — Copy Link button (Node: `I3127:21871;256:5216`)**:
| Property | Value |
|----------|-------|
| Width | 145px |
| Height | 56px |
| Border radius | `4px` |
| Padding | `16px` |
| Gap | `4px` |
| Label | "Copy Link" — Montserrat 700 16px `#00101A` |
| Icon | `MM_MEDIA_Link` 24×24px |

---

### C.4.1 — Heart Button (Node: `I3127:21871;256:5175`)

> **This is the Like Kudos feature button — heart icon + count in the card action bar.**

| Property | Value |
|----------|-------|
| Width | 101px |
| Visual height | 32px |
| **Touch target height** | **`min-height: 44px`** — add vertical padding to meet Constitution Principle II (≥ 44×44 px touch target); use `padding-y: 6px` to achieve 44px without changing the 32px visual appearance |
| Display | flex, row, gap 4px, align-items center |
| Position | In the card action bar, right-aligned |

**Heart count text (Node: `I3127:21871;256:5174`)**:
| Property | Value |
|----------|-------|
| Width | 65px |
| Height | 32px |
| Font | Montserrat 700 24px |
| Color | `#00101A` (dark text on cream card) |
| Format | Vietnamese number format: "1.000" (dot as thousands separator) |

**Heart icon (Node: `I3127:21871;256:5171`)**:
| Property | Value |
|----------|-------|
| Name | `MM_MEDIA_Heart` |
| Size | 32×32px |
| Default state | Hollow heart (not liked) |
| Liked state | Filled heart — use the filled `MM_MEDIA_Heart` variant; color is red (`#D4271D`) matching the app's accent-red, or use the icon asset's built-in fill |

**States:**
| State | Heart icon | Count color | Cursor |
|-------|------------|-------------|--------|
| Not liked | Hollow `MM_MEDIA_Heart` | `#00101A` | pointer |
| Liked by me | Filled `MM_MEDIA_Heart` | `#00101A` | pointer |
| Special day + liked | Filled heart + "x2" label | `#00101A` | pointer |
| Own kudos (disabled) | Grayed heart | `#999999` | not-allowed |
| Loading | Spinner | — | wait |

---

### D — Right Sidebar (Node: `2940:13488`)

| Property | Value |
|----------|-------|
| Width | 422px |
| Display | flex, column |
| Gap | `24px` |
| Sticky | Yes — scrolls independently |

---

### D1 — Stats Overview Block (Node: `2940:13489`)

6 stat rows + "Mở quà" button.

| Row ID | Label (vi) | Value style |
|--------|-----------|-------------|
| D.1.2 | Số Kudos bạn nhận được | Number, Montserrat 700 32px `#FFEA9E` |
| D.1.3 | Số Kudos bạn đã gửi | Number, Montserrat 700 32px `#FFEA9E` |
| D.1.4 | Số tim bạn nhận được 🔥 | Number, Montserrat 700 32px `#FFEA9E` |
| D.1.5 | — | Horizontal divider `#2E3940` |
| D.1.6 | Số Secret Box bạn đã mở | Number, Montserrat 700 32px `#FFEA9E` |
| D.1.7 | Số Secret Box chưa mở | Number, Montserrat 700 32px `#FFEA9E` |

**D.1.8 — "Mở quà" button (Node: `2940:13497`)**:
| Property | Value |
|----------|-------|
| Label | "Mở Secret Box" |
| Width | full-width of sidebar (fits 422px container) |
| Height | 56px |
| Background | `#FFEA9E` (gold) |
| Border-radius | `4px` |
| Font | Montserrat 700 16px, `#00101A` |
| Display | flex row, align-items center, justify-content center, gap 8px |
| Navigates to | Frame `1466:7676` (Open secret box dialog) |

**States:**
| State | Background | Cursor |
|-------|-----------|--------|
| Default | `#FFEA9E` | pointer |
| Hover | `rgba(255,234,158,0.9)` | pointer |
| Disabled (0 boxes) | `rgba(255,234,158,0.3)` | not-allowed |

---

### C3 — 10 Sunner Nhận Quà Mới Nhất (Node: `2940:13510`)

| Property | Value |
|----------|-------|
| Title (D.3.1) | "10 SUNNER NHẬN QUÀ MỚI NHẤT" — Montserrat 700, uppercase, `#FFFFFF` |
| Width | 422px |
| Display | flex, column |
| Gap | `8px` (between list items) |

**Each list item (D.3.2–D.3.6, Node: `2940:13516`–`2940:13520`)**:
| Sub-element | Size | Style |
|------------|------|-------|
| Avatar | 40×40px circular | Gmail profile image |
| Name | — | Montserrat 700 14px, `#FFFFFF`, clickable |
| Description | — | Montserrat 400 12px, `rgba(255,255,255,0.7)` — e.g., "Nhận được 1 áo phông SAA" |
| Row layout | flex row, gap 8px, align-items center | — |

**States:**
| State | Effect |
|-------|--------|
| Default | Name: `#FFFFFF` |
| Hover name/avatar | Name underline + preview profile tooltip |
| Click name/avatar | Navigate to profile page |
| Empty list | "Chưa có dữ liệu" Montserrat 400 14px `rgba(255,255,255,0.5)` |

---

## Layout Structure

```
┌───────────────────────────────────────────────────────┐  1440px
│  [Header — fixed 80px]                                │
│  Logo | About SAA | Award Info | Sun* Kudos* | VN     │
├───────────────────────────────────────────────────────┤
│  [Keyvisual — 512px, gradient 25deg]                  │
├───────────────────────────────────────────────────────┤
│  [B1 Write Kudos — 738px] [B2 Search — 381px]         │
├───────────────────────────────────────────────────────┤
│  [B3 Highlight Kudos section — full width — 786px H]  │
│  Carousel of top 5 most-liked Kudos                   │
│  [dot indicators row]                                 │
├───────────────────────────────────────────────────────┤
│  [B6/B7 Spotlight Boards section]                         │
├───────────────────────────────────────────────────────┤
│  padding: 0 144px                                     │
│  ┌── C1 Feed (680px) ──┐  ┌── Sidebar (422px) ──┐    │
│  │ [Kudos card]        │  │ C2 Stats overview   │    │
│  │ [Kudos card]        │  │ C3 Top 10 sunners   │    │
│  │ [Kudos card]        │  └─────────────────────┘    │
│  │ ...                 │                              │
│  └─────────────────────┘                              │
├───────────────────────────────────────────────────────┤
│  [Footer — shared]                                    │
└───────────────────────────────────────────────────────┘
```

---

## Like (Heart) Button — States

| State | Visual | Description |
|-------|--------|-------------|
| Default (not liked) | Hollow heart icon + count | `opacity: 1`, clickable |
| Liked (me) | Filled heart icon + count | Gold filled heart |
| Special day + liked | Double-heart icon + count | 2 hearts shown |
| Disabled (own kudos) | Heart grayed out | `opacity: 0.4`, `cursor: not-allowed` |
| Loading | Heart spinner | During API request |

**Heart button ARIA**:
```html
<button
  aria-label="Like this kudos"
  aria-pressed="false"
  role="button"
/>
```

---

## Responsive Specifications

| Breakpoint | Feed width | Sidebar | Layout |
|------------|-----------|---------|--------|
| Desktop ≥ 1280px | 680px | 422px visible | 2-column |
| Tablet 768–1279px | full width | hidden (moves below feed) | 1-column |
| Mobile 320–767px | full width | hidden (moves below feed) | 1-column |

- On tablet/mobile, sidebar (Stats + Top 10) moves below the feed
- Highlight carousel remains full-width on all breakpoints

---

## Animation

| Element | Animation | Duration |
|---------|-----------|----------|
| Heart like | Scale 1 → 1.3 → 1 (bounce) | 300ms |
| Heart unlike | Scale 1 → 0.8 → 1 | 200ms |
| Carousel slide | Slide / fade transition | 300ms |
| Reduced motion | All transitions disabled | — |

---

## Implementation Mapping

> **Constitution II compliance**: The Tailwind classes below show DESIGN INTENT values for reference only. In actual component code, all hex values MUST be replaced with CSS variable references (e.g., `bg-[var(--color-kudos-card-bg)]`). Raw hex is FORBIDDEN in component files.

| Figma Node | Component | CSS / Tailwind (reference values — use CSS vars in code) |
|------------|-----------|----------------------------------------------------------|
| `2940:13433` | `<Header activeNav="kudos" />` | Shared header |
| `2940:13432` | `<KudosKeyvisual />` | `h-[512px] bg-cover` |
| `2940:13449` | `<WriteKudosButton />` | `border border-[#998C5F] bg-[rgba(255,234,158,0.1)] w-[738px] h-[72px] px-4 py-6` |
| `2940:13450` | `<SearchSunnerInput />` | `border border-[#998C5F] bg-[rgba(255,234,158,0.1)] w-[381px] h-[72px]` |
| `2940:13451` | `<HighlightKudos />` | `w-full flex flex-col gap-10` |
| `2940:14174` | `<SpotlightBoards />` | `w-[1157px]` |
| `2940:13482` | `<KudosFeed />` | `w-[680px] flex flex-col gap-6` |
| `3127:21871` | `<KudosCard kudos={...} />` | `w-[680px] bg-[#FFF8E1] rounded-[24px] p-10 pb-4 flex flex-col gap-4` |
| Card divider | `<hr />` in card | `w-[600px] h-px bg-[#FFEA9E] border-none` |
| Sender/Recipient | `<UserInfo user={...} />` | `flex flex-col gap-[13px]` with avatar 64px circular |
| Message box | `<KudosMessage />` | `border border-[#FFEA9E] bg-[rgba(255,234,158,0.4)] px-6 py-4 rounded-lg` |
| Message text | `<p>` inside | `font-montserrat font-bold text-[20px] text-[#00101A]` |
| Hashtags | `<HashtagList />` | `font-montserrat font-bold text-[16px] text-[#D4271D]` |
| Image thumbs | `<ImageGallery imageUrls={string[]} />` | `flex gap-4` each thumb `88px square border border-[#998C5F]`; up to 5 images; renders nothing when `imageUrls` is empty |
| Card action bar | `<CardActions />` | `w-[600px] h-[56px] flex gap-6` |
| `I3127:21871;256:5216` | `<CopyLinkButton />` | `w-[145px] h-[56px] rounded p-4 flex gap-1 items-center` |
| `I3127:21871;256:5175` | `<LikeButton kudosId liked count />` | `w-[101px] min-h-[44px] flex items-center gap-1 cursor-pointer py-[6px]` — 44px touch target, 32px visual height |
| Heart icon | `<HeartIcon filled={bool} />` | `w-8 h-8` — `MM_MEDIA_Heart` asset, hollow/filled states |
| Heart count | `<span>` inside LikeButton | `font-montserrat font-bold text-[24px] text-[#00101A]` — VN format "1.000" |
| `2940:13476` | `<SpotlightHeader />` | `flex flex-col gap-4` with gold `#FFEA9E` heading |
| `2940:14174` | `<SpotlightBoard />` | `w-[1157px] h-[548px] canvas/svg` — D3 word cloud |
| `2940:14833` | `<SpotlightSearch />` | `w-[381px] h-[72px] border border-[#998C5F] bg-[rgba(255,234,158,0.1)] px-4 py-6 flex items-center gap-2` |
| `2940:13459` | `<FilterButton label="Hashtag" />` | `h-10 px-4 border border-[#998C5F] bg-[rgba(255,234,158,0.1)] rounded flex items-center gap-1` |
| `2940:13460` | `<FilterButton label="Phòng ban" />` | Same as above |
| `2940:13489` | `<StatsPanel />` | `w-[422px] flex flex-col gap-6` |
| `3241:14882` | `<HeartStatWidget />` | `w-[374px] h-10 flex items-center gap-2` |
| Heart stat count | `<span>` | `font-montserrat font-bold text-[32px] text-[#FFEA9E]` |
| `2940:13497` | `<OpenSecretBoxButton />` | `w-full h-[56px] rounded bg-[#FFEA9E] font-bold text-[16px] text-[#00101A] flex items-center justify-center gap-2` |
| `2940:13510` | `<RecentGiftRecipientsPanel />` (C3) | `w-[422px] flex flex-col gap-2` |
| `2940:13516` | `<SunnerListItem />` | `flex flex-row items-center gap-2` with 40px circular avatar |

---

## Design Notes

- **CSS variable mapping (Constitution Principle II)**: All hex values in this document MUST be declared as CSS variables in `app/globals.css`. Component files MUST reference `var(--token-name)` or mapped Tailwind utilities — never raw hex values.

- **Kudos card background is cream `#FFF8E1`**: Cards are light on a dark page — all card-internal text is dark (`#00101A`), not white.
- **Kudos card has TWO gold divider lines**: One between the user info row and content, another between content and the action bar. Both are `1px #FFEA9E`.
- **Hashtag text is RED (`#D4271D`)**: Not gold and not white — this is intentional in the Figma design. Do not change to another color without design approval.
- **Heart button (`C.4.1_Hearts`) is in the action bar** at the bottom of each card, alongside the "Copy Link" button. The heart count uses Vietnamese number format with dot as thousands separator (e.g., "1.000" = 1000).
- **Heart count color inside card**: `#00101A` (dark), since the card bg is cream. In the stats sidebar widget, the count is `#FFEA9E` (gold) on a dark background.
- **Like interaction**: Heart count uses optimistic updates — increment/decrement immediately on click, then confirm with server. On API error, roll back to previous count and restore button state.
- **Special day double-heart**: When `isSpecialDay=true`, each like gives +2 hearts. The stats sidebar shows a "x2" badge on the heart icon (`3241:14933`). The `LikeButton` component should visually indicate this (e.g., show "x2" badge on hover or when on a special day).
- **Own Kudos**: Sender cannot like their own Kudos. Heart button is disabled (`cursor: not-allowed`, `opacity: 0.4`) when `kudos.senderId === currentUser.id`.
- **Kudos card height is variable**: Driven by message length and number of image attachments. Use `height: auto`, not a fixed height.
- **Number format**: Vietnamese locale uses `.` as thousands separator. Use `toLocaleString('vi-VN')` or `Intl.NumberFormat('vi-VN')` for heart counts.
