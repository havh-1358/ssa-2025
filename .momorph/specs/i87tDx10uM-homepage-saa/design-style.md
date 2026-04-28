# Design Style: Homepage SAA

**Frame ID**: `i87tDx10uM`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Last Updated**: 2026-04-28
**Status**: Ready

---

## Design Tokens

### Colors

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| `--color-bg-base` | `#00101A` | Page background |
| `--color-header-bg` | `rgba(16, 20, 23, 0.8)` | Sticky header background |
| `--color-text-primary` | `#FFFFFF` | Body text on dark bg |
| `--color-accent-gold` | `#FFEA9E` | Active nav, CTA button, highlights |
| `--color-nav-active` | `#FFEA9E` | Active nav link text + underline |
| `--color-nav-default` | `#FFFFFF` | Inactive nav link text |
| `--color-divider` | `rgba(46, 57, 64, 1)` = `#2E3940` | Section divider lines |
| `--color-btn-secondary-bg` | `rgba(255, 234, 158, 0.1)` | Secondary/outlined button bg |
| `--color-btn-secondary-border` | `#998C5F` | Secondary button border |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-body` | `"Montserrat", sans-serif` | All text on Homepage |
| `--font-display` | `"Digital Numbers", monospace` | Countdown digit numerals |
| `--text-nav-size` | `14px` | Navigation links (Homepage) |
| `--text-nav-weight` | `700` | Nav link weight |
| `--text-nav-line` | `20px` | Nav line height |
| `--text-nav-letter` | `0.1px` | Nav letter spacing |
| `--text-coming-soon-size` | `24px` | Countdown section "Coming soon" / "Sự kiện sẽ bắt đầu sau" label |
| `--text-coming-soon-weight` | `700` | Same |
| `--text-coming-soon-line` | `32px` | Same |
| `--text-digit-size` | `49px` | Countdown digit numeral size on Homepage (node `I2167:9040;186:2617`: 49.152px) |
| `--text-digit-weight` | `400` | Digit numeral weight |
| `--text-digit-line` | `1` | Digit numeral line height |
| `--text-unit-size` | `24px` | DAYS/HOURS/MINUTES labels |
| `--text-unit-weight` | `700` | Same |
| `--text-unit-line` | `32px` | Unit label line height |
| `--text-event-label-size` | `16px` | Event info row label ("Thời gian:", "Địa điểm:") |
| `--text-event-label-weight` | `700` | Event info label weight |
| `--text-event-label-line` | `24px` | Event info label line-height |
| `--text-event-label-letter` | `0.15px` | Event info label letter-spacing |
| `--text-event-value-size` | `24px` | Event info row value (date, venue name) |
| `--text-event-value-weight` | `700` | Event info value weight |
| `--text-event-value-line` | `32px` | Event info value line-height |
| `--text-livestream-size` | `16px` | Livestream note text size |
| `--text-livestream-weight` | `700` | Livestream note text weight |
| `--text-livestream-letter` | `0.5px` | Livestream note letter-spacing |
| `--text-btn-size` | `22px` | CTA button text (B4.1, B4.2 — from Figma nodes `I2167:9063;186:1568`, `I2167:9064;186:2760`) |
| `--text-btn-weight` | `700` | Same |
| `--text-btn-line` | `28px` | CTA button line height |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--header-height` | `80px` | Fixed header height |
| `--header-padding-x` | `144px` | Header horizontal padding |
| `--header-padding-y` | `12px` | Header vertical padding |
| `--content-padding-x` | `144px` | Main content horizontal padding |
| `--content-padding-y` | `96px` | Main content vertical padding |
| `--section-gap` | `120px` | Gap between page sections |
| `--countdown-gap` | `40px` | Gap between digit blocks |
| `--digit-gap` | `14px` | Gap within each digit block (cards + label) |
| `--btn-padding` | `16px 24px` | CTA button padding |
| `--btn-gap` | `40px` | Gap between CTA buttons |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border-btn-secondary` | `1px solid #998C5F` | Secondary button outline |
| `--radius-btn` | `8px` | CTA button border radius |
| `--radius-card` | `8px` | Award cards |
| `--border-nav-active` | `1px solid #FFEA9E` (bottom) | Active nav link underline |

---

## Component Style Details

### A — Header Container (Node: `2167:9091`)

> Reference screenshot: `assets/header.png`

| Property | Value |
|----------|-------|
| Width | `1512px` |
| Height | `80px` |
| Background | `rgba(16, 20, 23, 0.8)` |
| Padding | `12px 144px` |
| Display | flex row, `justify-content: space-between`, `align-items: center` |
| Gap | `238px` (between left group and right group) |
| Position | `fixed top-0 z-[100]` |

Header is split into **2 groups**:
- **Left group** (Frame 488, `I2167:9091;186:2166`): Logo + Nav links — `606×56px`, flex row, gap `64px`
- **Right group** (Frame 482, `I2167:9091;186:1601`): Language + Notification + Profile — `220×56px`, flex row, gap `16px`, align-items center

---

### A.1 — Logo (Node: `I2167:9091;178:1033`)

| Property | Value |
|----------|-------|
| Width | `52px` |
| Height | `48px` |
| Asset | `MM_MEDIA_Logo` — Sun* Annual Awards logo |
| Link | Navigates to `/` (homepage) |
| aria-label | `homepage.nav.logoLabel` — "SSA 2025 — về trang chủ" (vi) / "SSA 2025 — go to homepage" (en) |

---

### A.2 — Nav Links Container (Node: `I2167:9091;178:653`)

| Property | Value |
|----------|-------|
| Width | `490px` |
| Height | `56px` |
| Display | flex row, `align-items: center`, gap `24px` |

**Common nav link typography:**
| Property | Value |
|----------|-------|
| Font | Montserrat 700, 14px, lh `20px`, ls `0.1px` |
| Padding | `16px` (all sides) |
| Border-radius | `4px` |

**A.2.1 — Nav: About SAA 2025 (Node: `I2167:9091;186:1579`) — Active state:**
| Property | Value |
|----------|-------|
| i18n Key | `homepage.nav.aboutSaa` — "Về SAA 2025" (vi) / "About SAA 2025" (en) |
| Color | `#FFEA9E` |
| Text shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |
| Border bottom | `1px solid #FFEA9E` |
| aria-current | `"page"` |

**A.2.2 — Nav: Award Information (Node: `I2167:9091;186:1587`) — Default state:**
| Property | Value |
|----------|-------|
| i18n Key | `homepage.nav.awardInfo` — "Thông tin giải thưởng" (vi) / "Award Information" (en) |
| Color | `#FFFFFF` |
| Hover bg | `rgba(255,255,255,0.1)` |

**A.2.3 — Nav: Sun* Kudos (Node: `I2167:9091;186:1593`) — Default state:**
| Property | Value |
|----------|-------|
| i18n Key | `homepage.nav.kudos` — "Sun* Kudos" (vi & en) |
| Color | `#FFFFFF` |
| Hover bg | `rgba(255,255,255,0.1)` |

---

### A.3 — Language Selector (Node: `I2167:9091;186:1696`)

| Property | Value |
|----------|-------|
| Width | `108px` |
| Height | `56px` |
| Display | flex row, align-items flex-start |
| Content | Flag image (24×16px) + locale label (e.g., "VN") + chevron icon |
| Component | Shared `<LanguageSelector />` — see Language Selector spec (`hUyaaugye2`) |

---

### A.4 — Notification Bell (Node: `I2167:9091;186:2101`)

| Property | Value |
|----------|-------|
| Size | `40×40px` |
| Icon | `MM_MEDIA_Noti` — bell icon |
| Badge dot | Small colored dot overlay — visible when unread notifications exist |
| Order in right group | 2nd (after Language Selector) |

---

### A.5 — User Profile Button (Node: `I2167:9091;186:1597`)

| Property | Value |
|----------|-------|
| Size | `40×40px` |
| Border | `1px solid #998C5F` |
| Border-radius | `4px` |
| Padding | `10px` |
| Background | transparent |
| Icon | `MM_MEDIA_User Profile` — person silhouette |
| Order in right group | 3rd (last, rightmost) |
| Visibility | Shown only when user is authenticated |
| **On click** | Opens profile **dropdown** (Figma frame: `z4sCl3_Qtk`) |

**A.5 Dropdown (Node: `666:9601` — "A_Dropdown-List"):**
| Property | Value |
|----------|-------|
| Background | `#00070C` |
| Border | `1px solid #998C5F` |
| Border-radius | `8px` |
| Padding | `6px` |
| Display | flex column |
| Position | absolute, below A.5 button |

| Item | Node | i18n Key | Font | Color | Action |
|------|------|----------|------|-------|--------|
| A.1 Profile | `I666:9601;563:7844` | `userMenu.profile` — "Profile" | Montserrat 700, 16px, lh 24px, ls 0.15px | `#FFFFFF` + gold text-shadow | Navigate to profile page |
| A.2 Logout | `I666:9601;563:7868` | `userMenu.logout` — "Đăng xuất" (vi) / "Logout" (en) | Montserrat 700, 16px, lh 24px, ls 0.15px | `#FFFFFF` | Sign out user |

---

### BG — Background Keyvisual (Node: `2167:9027`)

| Property | Value |
|----------|-------|
| Width | `1512px` |
| Height | `1392px` |
| Image asset | `public/assets/homepage/keyvisual.jpg` |
| Image render | `<Image priority fill objectFit="cover" />` (Next.js, LCP optimisation) |
| Gradient overlay | `linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)` |
| Fallback bg | `#00101A` (shown if image fails to load) |

---

### B.1 — SAA 2025 Brand Logo (Node: `2788:12911`)

| Property | Value |
|----------|-------|
| Container (`2167:9032`) | `1224×200px`, flex column, gap `10px` |
| Width | `451px` |
| Height | `200px` |
| Asset | `public/assets/homepage/saa-2025-logo.png` |
| Figma layer | `MM_MEDIA_Root Further Logo` |
| Render | `<Image priority />`, `object-contain` |

---

### B.0 — Coming Soon Label (Node: `2167:9036`)

| Property | Value |
|----------|-------|
| Parent container | `2167:9035` (B1_Countdown time, `1224×176px`, flex column, gap `16px`) |
| i18n Key | `homepage.comingSoon` — vi: "Sự kiện sẽ bắt đầu sau" / en: "Event starts in" |
| Font | Montserrat 700, 24px, lh `32px` |
| Color | `#FFFFFF` |
| Width | `1224px` |
| Visibility | Shown only when `isLaunched = false` |

> Figma layer name: "B1.2_Coming soon" (typo "Comming" in Figma — disregard).

---

### B.2 — Countdown Section (Node: `2167:9037`)

| Property | Value |
|----------|-------|
| Container | `429×128px`, flex row, gap `40px` |
| Visibility | Shown only when `isLaunched = false` |

**3 Digit Blocks:**
| Node | Figma Name | i18n Unit Label Key | Unit text (vi / en) |
|------|-----------|---------------------|---------------------|
| `2167:9038` | B1.3.1_Days | `countdown.days` | "NGÀY" / "DAYS" |
| `2167:9043` | B1.3.2_Hours | `countdown.hours` | "GIỜ" / "HOURS" |
| `2167:9048` | B1.3.3_Minutes | `countdown.minutes` | "PHÚT" / "MINUTES" |

**Each digit block** (`116×128px`, flex column, gap `14px`, justify-content center):
- 2 digit cards side by side (tens digit + units digit)
- 1 unit label below

**Digit Cards (2 per block — `2167:9040` tens, `2167:9041` units):**
| Property | Value |
|----------|-------|
| Width | `51px` |
| Height | `82px` |
| Border | `0.5px solid #FFEA9E` |
| Border-radius | `8px` |
| Backdrop-filter | `blur(16.64px)` |
| Background | `linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%)` at `opacity: 0.5` |

**Digit numeral (inside each card — node `186:2617`):**
| Property | Value |
|----------|-------|
| Font | "Digital Numbers", monospace, 400, `49px`, lh `1` |
| Color | `#FFFFFF` |

**Unit label (e.g., `2167:9042` for DAYS):**
| Property | Value |
|----------|-------|
| Font | Montserrat 700, `24px`, lh `32px` |
| Color | `#FFFFFF` |

---

### B.3 — Event Info Block (Node: `2167:9053`)

> The event info section shows structured data — NOT a single tagline text.

| Property | Value |
|----------|-------|
| Width | `637px` |
| Height | `64px` |
| Display | flex column, gap `8px` |

**Row 1 — Event metadata (Node: `2167:9054`, flex row, gap `60px`, h `32px`):**

*Group 417 — Time (Node: `2167:9055`):*
| Text | i18n Key | Font | Color |
|------|----------|------|-------|
| Label | `homepage.eventTimeLabel` ("Thời gian:") | Montserrat 700, 16px, lh 24px, ls 0.15px | `#FFFFFF` |
| Value | `homepage.eventDate` ("26/12/2025") | Montserrat 700, 24px, lh 32px | `#FFEA9E` |

*Group 418 — Venue (Node: `2167:9058`):*
| Text | i18n Key | Font | Color |
|------|----------|------|-------|
| Label | `homepage.eventVenueLabel` ("Địa điểm:") | Montserrat 700, 16px, lh 24px, ls 0.15px | `#FFFFFF` |
| Value | `homepage.eventVenue` ("Âu Cơ Art Center") | Montserrat 700, 24px, lh 32px | `#FFEA9E` |

**Row 2 — Livestream note (Node: `2167:9061`):**
| Text | i18n Key | Font | Color |
|------|----------|------|-------|
| "Tường thuật trực tiếp qua sóng Livestream" | `homepage.livestream` | Montserrat 700, 16px, lh 24px, ls 0.5px | `#FFFFFF` |

---

### B.4 — CTA Buttons (Node: `2167:9062`)

| Property | Value |
|----------|-------|
| Container | `570×60px`, flex row, gap `40px` |

**B4.1 — Primary button "About SAA 2025" (Node: `2167:9063`):**
| Property | Value |
|----------|-------|
| Label | `homepage.ctaAboutSaa` — "Về SAA 2025" (vi) / "About SAA 2025" (en) |
| Font | Montserrat 700, **22px**, lh 28px, color `#00101A` |
| **Navigate to** | **`/awards`** — Award System page |
| Destination spec | `.momorph/specs/zFYDgyj_pD-he-thong-giai/spec.md` |
| Width | `276px` |
| Height | `60px` |
| Background | `#FFEA9E` |
| Border-radius | `8px` |
| Padding | `16px 24px` |
| Icon | `MM_MEDIA_Up` 24×24px (node `I2167:9063;186:1766`) — arrow icon, color `#00101A` |

**B4.2 — Secondary button "Sun* Kudos" (Node: `2167:9064`):**
| Property | Value |
|----------|-------|
| Label | `homepage.ctaKudos` — "Sun* Kudos" (vi & en) |
| Font | Montserrat 700, **22px**, lh 28px, color `#FFFFFF` |
| **Navigate to** | **`/kudos`** — Sun* Kudos page |
| Destination spec | `.momorph/specs/MaZUn5xHXZ-sun-kudos/spec.md` |
| Border | `1px solid #998C5F` |
| Background | `rgba(255, 234, 158, 0.1)` |
| Border-radius | `8px` |
| Padding | `16px 24px` |
| Color | `#FFFFFF` |
| Icon | `MM_MEDIA_Up` 24×24px (node `I2167:9064;186:2761`) — arrow icon, color `#FFFFFF` |

---

### C — Award System Section (Node: `2167:9068`)

| Property | Value |
|----------|-------|
| Width | `1224px` (content width; 144px horizontal padding from 1512px frame) |
| Height | `1353px` (design reference) |
| Background | transparent (inherits page background `#00101A`) |
| Display | flex column, gap `80px` |

**C1 — Section Header (Node: `2167:9069`):**
| Property | Value |
|----------|-------|
| Height | `129px` |
| Display | flex column, gap `16px` |
| Supertitle (Node `2167:9070`) | `awards.sectionTitle` — "Sun* annual awards 2025" — Montserrat 700, 24px, lh 32px, color `#FFFFFF` |
| Divider (Node `2167:9071`) | `1224px × 1px`, color `#2E3940` |
| Main title (Node `2167:9073`) | `homepage.awardSectionTitle` — "Hệ thống giải thưởng" (vi) / "Award System" (en) — Montserrat 700, **57px**, lh 64px, ls `-0.25px`, color `#FFEA9E` |

> The main section title (`homepage.awardSectionTitle`) is displayed in large 57px gold text. The supertitle (`awards.sectionTitle`) above the divider is smaller 24px white text.

**C2 — Award Cards Grid (Node: `5005:14974`):**
| Property | Value |
|----------|-------|
| Layout | 2 rows, each row: flex row, `justify-content: space-between`, gap `80px` |
| Columns per row | **3** |
| Total cards | **6** (3 × 2 rows) |
| Column gap | `80px` |
| Row gap | `80px` |
| Card size | `336px × 504px` (image: 336×336px + text area: 336×144px + gap 24px) |

**6 award cards — Figma node, category, asset, and visual:**

| Node | Category | Asset path | Visual |
|------|----------|------------|--------|
| `2167:9075` | Top Talent | `assets/award-top-talent.png` | Dark bg + gold ring circle + pedestal + "TOP TALENT" gold text |
| `2167:9076` | Top Project | `assets/award-top-project.png` | Dark bg + gold ring circle + pedestal + "TOP PROJECT" gold text |
| `2167:9077` | Top Project Leader | `assets/award-top-project-leader.png` | Dark bg + gold ring circle + pedestal + "TOP PROJECT LEADER" gold text |
| `2167:9079` | Best Manager | `assets/award-best-manager.png` | Dark bg + gold ring circle + pedestal + "BEST MANAGER" gold text |
| `2167:9080` | Signature 2025 | `assets/award-signature-2025.png` | Dark bg + gold ring circle + pedestal + "SIGNATURE 2025 CREATOR" gold text |
| `2167:9081` | MVP | `assets/award-mvp.png` | Dark bg + gold ring circle + pedestal + "MVP" gold text |

> Reference screenshots saved to `.momorph/specs/i87tDx10uM-homepage-saa/assets/`. Export final assets to `public/assets/awards/` for production use.

**Card visual style (card image area `C2.x.1_Picture-Award`, 336×336px):**
| Property | Value |
|----------|-------|
| Background layer | `MM_MEDIA_Award BG` — dark scene with tropical leaves (same for all 6) |
| Ring | Gold glowing ring circle, center-positioned |
| Pedestal | Stage/trophy pedestal at bottom of ring |
| Award name | Gold uppercase text centered in ring (see each card's asset) |
| mix-blend-mode | `screen` |
| box-shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |
| Image node variant | Each category uses a unique `MM_MEDIA_{Category}` image asset |

**Card content typography (from `I2167:9075;214:1020`, 336×144px):**
| Element | Node | i18n Key | Font | Size | Weight | Color | Line-height |
|---------|------|----------|------|------|--------|-------|-------------|
| Category name | `214:1021` | `awards.categories.{slug}` | Montserrat | `24px` | 400 | `#FFEA9E` | `32px` |
| Description | `214:1022` | `awards.descriptions.{slug}` | Montserrat | `16px` | 400 | `#FFFFFF` | `24px`, ls `0.5px` |
| CTA button label | `214:1023;186:1439` | `awards.ctaLabel` | Montserrat | `16px` | 500 | `#FFFFFF` | `24px`, ls `0.15px` |

**Description text per category (from Figma + i18n):**
| Slug | vi | en |
|------|----|----|
| `top-talent` | "Vinh danh top cá nhân xuất sắc trên mọi phương diện" | "Recognizing the top individual who excels across all dimensions" |
| `top-project` | "Vinh danh dự án xuất sắc trên mọi phương diện, dự án có doanh thu nổi bật" | "Recognizing the outstanding project across all dimensions with remarkable revenue" |
| `top-project-leader` | "Vinh danh người quản lý truyền cảm hứng và dẫn dắt dự án bứt phá" | "Recognizing the inspiring manager who leads projects to breakthrough results" |
| `best-manager` | "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm" | "Recognizing the manager with strong management skills who leads their team effectively" |
| `signature-2025` | "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm" | "Recognizing the manager with strong management skills who leads their team effectively" |
| `mvp` | "Vinh danh người quản lý có năng lực quản lý tốt, dẫn dắt đội nhóm" | "Recognizing the manager with strong management skills who leads their team effectively" |

> Full award card glassmorphism style is in `.momorph/specs/zFYDgyj_pD-he-thong-giai/design-style.md`. The `<AwardCategoryCard />` is a shared component.

---

### D1 — Sun* Kudos Promo Section Outer Container (Node: `3390:10349`)

| Property | Value |
|----------|-------|
| Width | `1224px` |
| Height | `500px` |
| Display | flex column, justify-content center, gap `10px` |

**D1 inner group (Node: `I3390:10349;313:8415`):**
| Property | Value |
|----------|-------|
| Width | `1120px` |
| Height | `500px` |
| Position | absolute within D1 |

**D1 background (Node: `I3390:10349;313:8416`):**
| Property | Value |
|----------|-------|
| Background | `#0F0F0F` |
| Border-radius | `16px` |
| Size | `1120px × 500px` |

---

### D2 — Kudos Content Column (Node: `I3390:10349;313:8419`)

| Property | Value |
|----------|-------|
| Width | `457px` |
| Height | `408px` |
| Left inset | `~64px` from D1 inner group left edge |
| Display | flex column, gap `32px`, justify-content center |

**D2 text block (Node: `I3390:10349;313:8420`) — 457×320px, flex column, gap 16px:**
| Element | Node | i18n Key | Font | Size | Weight | Color | Line-height | Letter-spacing |
|---------|------|----------|------|------|--------|-------|-------------|----------------|
| Section label | `313:8421` | `homepage.kudosPromoLabel` | Montserrat | `24px` | 700 | `#FFFFFF` | `32px` | `0px` |
| Feature name | `313:8422` | `homepage.kudosSectionTitle` | Montserrat | `57px` | 700 | `#FFEA9E` | `64px` | `-0.25px` |
| Body copy | `313:8423` | `homepage.kudosPromoBody` | Montserrat | `16px` | 700 | `#FFFFFF` | `24px` | `0.5px` |

**D2 button row (Node: `I3390:10349;313:8424`) — 457×56px:**
Contains D2.1 (see below).

**D2 illustration (Node: `I3390:10349;313:8417`) — Frame 367:**
| Property | Value |
|----------|-------|
| Width | `264px` |
| Height | `219px` |
| Position | right-center of D1 inner group (~932px from left) |
| Display | flex column, gap `10px` |
| Content | Decorative illustration / image asset |

**D2 Kudos logo (Node: `I3390:10349;329:2948`):**
| Property | Value |
|----------|-------|
| Width | `364px` |
| Height | `72px` |
| Position | right side of D1 inner group (~868px from left) |
| "KUDOS" text (Node `329:2949`) | SVN-Gotham 400, ~96px, line-height 24px, letter-spacing `-13%`, color `#DBD1C1` |

---

### D2.1 — Kudos CTA Button (Node: `I3390:10349;313:8426`)

| Property | Value |
|----------|-------|
| Width | `127px` |
| Height | `56px` |
| Background | `#FFEA9E` |
| Border-radius | `4px` |
| Padding | `16px` |
| Gap | `8px` |
| Display | flex row, align-items center |

| Sub-element | i18n Key | Font | Size | Weight | Color | Line-height | Letter-spacing |
|-------------|----------|------|------|--------|-------|-------------|----------------|
| Label text (Node `186:1568`) | `homepage.kudosCtaLabel` — "Chi tiết" (vi) / "Details" (en) | Montserrat | `16px` | 700 | `#00101A` | `24px` | `0.15px` |
| Icon (Node `186:1766`) | — | `MM_MEDIA_Up` 24×24px | — | — | `#00101A` | — | — |

**States:**
| State | Background | Color | Transform |
|-------|-----------|-------|-----------|
| Default | `#FFEA9E` | `#00101A` | none |
| Hover | `#FFEA9E` at `opacity: 0.9` | `#00101A` | `scale(1.02)` |
| Focus | `#FFEA9E` | `#00101A` | outline `2px solid #FFEA9E` |
| Active | `#FFEA9E` at `opacity: 0.8` | `#00101A` | `scale(0.98)` |

---

### RF — Root Further Theme Section (Node: `3204:10152`)

> **Previously undocumented section.** Positioned between the hero/CTA buttons and the award section (page y: ~899–2118).

| Property | Value |
|----------|-------|
| Width | `1152px` |
| Height | `1219px` |
| Padding | `120px 104px` |
| Border-radius | `8px` |
| Display | flex column, justify-content center, align-items center, gap `32px` |
| Background | inherits page bg `#00101A` |

**RF.1 — Theme Logos (Node: `3204:10153`):**
| Property | Value |
|----------|-------|
| Content | `MM_MEDIA_Root Text` + `MM_MEDIA_Further Text` image assets |
| Layout | Group, side by side |

**RF.2 — Opening Paragraph (Node: `3204:10156`):**
| Text | i18n Key | Font | Size | Color | Line-height |
|------|----------|------|------|-------|-------------|
| Event theme intro | `homepage.rootFurtherParagraph1` | Montserrat 700 | `24px` | `#FFFFFF` | `32px` |
| Alignment | justified | Width | `1152px` | Height | `512px` |

**RF.3 — Quote (Node: `3204:10161`):**
| Text | i18n Key | Font | Size | Color | Line-height |
|------|----------|------|------|-------|-------------|
| "A tree with deep roots..." | `homepage.rootFurtherQuote` | Montserrat 700 | `20px` | `#FFFFFF` | `32px` |
| Alignment | center | — | — | — | — |

**RF.4 — Closing Paragraph (Node: `3204:10162`):**
| Text | i18n Key | Font | Size | Color | Line-height |
|------|----------|------|------|-------|-------------|
| Theme conclusion | `homepage.rootFurtherParagraph2` | Montserrat 700 | `24px` | `#FFFFFF` | `32px` |
| Alignment | justified | Width | `1152px` | Height | `448px` |

---

### F — Floating Widget (Node: `5022:15169`)

| Property | Value |
|----------|-------|
| Position | `fixed` right: `19px`, top: `830px` (absolute within page) |
| Box shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` (gold glow) |
| Size | `106×64px` |
| Layout | flex row, 2 icon buttons + divider |

| Sub-component | Icon | Action |
|---------------|------|--------|
| Write Kudos button | `MM_MEDIA_Pen` | Navigates to Viết Kudos flow |
| Divider | `/` text character | Visual separator |
| SAA Rules button | `MM_MEDIA_Kudos Logo` | Navigates to SAA rules/general standards |

---

### E — Footer (Node: `5001:14800`)

| Property | Value |
|----------|-------|
| Layout | flex row, justify-content space-between |
| Background | inherits page bg `#00101A` |

**E.1 — Logo:**
| Property | Value |
|----------|-------|
| Component | `MM_MEDIA_Logo` — same as header logo |

**E.2 — Footer Navigation (4 links):**
| Link | i18n Key | State |
|------|----------|-------|
| "About SAA 2025" | `footer.nav.aboutSaa` | Default |
| "Award Information" | `footer.nav.awardInfo` | Active (gold text shadow: `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287`) |
| "Sun* Kudos" | `footer.nav.kudos` | Default |
| "Tiêu chuẩn chung" | `footer.nav.generalStandards` | Default |

Footer nav link style: Montserrat 700, 16px, lh 24px, ls 0.15px, color `#FFFFFF`.

**Footer nav link states:**
| State | Color | Text shadow |
|-------|-------|-------------|
| Default | `#FFFFFF` | none |
| Active (current page) | `#FFFFFF` | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` (gold glow) |
| Hover | `#FFFFFF` | `rgba(255,255,255,0.1)` bg |

**E.3 — Copyright (Node: `I5001:14800;342:1413`):**
| Property | Value |
|----------|-------|
| Text | `footer.copyright` — "Bản quyền thuộc về Sun* © 2025" / "Copyright belongs to Sun* © 2025" |
| Font | Montserrat Alternates 700, 16px, lh 24px, center |
| Color | `#FFFFFF` |

---

### A.4 — Notification Bell States

**Purpose**: Notifies user when they have received a new Kudos. Badge dot appears when there are unread notifications. **Click action: TBD — deferred, not in current scope.**

| State | Background | Notes |
|-------|-----------|-------|
| Default (no notifications) | transparent | Bell icon, no badge |
| Default (unread) | transparent | Badge dot visible on top-right of bell icon |
| Hover | `rgba(255,255,255,0.1)` | |
| Focus | outline `2px solid #FFEA9E` | |
| Active (pressed) | `rgba(255,255,255,0.15)` | — |

---

### F — Floating Widget States

| Sub-button | Default | Hover | Focus | Action | Auth required |
|-----------|---------|-------|-------|--------|---------------|
| Write Kudos (pen icon) | visible | `rgba(255,255,255,0.1)` bg | outline `2px solid #FFEA9E` | Authenticated → Write Kudos (`ihQ26W78P2`); Unauthenticated → `/login` | **Yes** |
| SAA Rules (kudos logo) | visible | `rgba(255,255,255,0.1)` bg | outline `2px solid #FFEA9E` | Opens **"Thể lệ" modal** (Figma: `b1Filzi9i6`) | No |

**"Thể lệ" Modal — Overview (Figma: `b1Filzi9i6`):**
| Section | Content |
|---------|---------|
| Title | "Thể lệ" — Montserrat 700, 45px, `#FFEA9E` |
| A — Người nhận | Hero badge rules (New / Rising / Super / Legend Hero based on # kudos received) |
| B — Người gửi | Collect 6 secret box icons → mystery gift |
| C — Kudos Quốc Dân | Top 5 most-liked kudos → special prize from SAA 2025 |
| Button "Đóng" | Montserrat 700, 16px, `#FFFFFF`, ls 0.5px — closes modal |
| Button "Viết KUDOS" | Montserrat 700, 16px, `#00101A` (on gold bg), ls 0.5px — opens Write Kudos flow |

Widget container box-shadow: `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` (always on, gold glow).

---

### A — Mobile Hamburger Menu States

| Property | Value |
|----------|-------|
| Hamburger icon | Inline SVG 24×24px — 3 horizontal lines: `M3 12h18M3 6h18M3 18h18`, stroke `currentColor`, strokeWidth 2, strokeLinecap round |
| Close icon | Inline SVG 24×24px — X cross: `M18 6L6 18M6 6l12 12`, stroke `currentColor`, strokeWidth 2, strokeLinecap round |
| Button size | `40×40px`, border-radius `4px` |
| Button hover | `rgba(255,255,255,0.1)` |
| Button focus | outline `2px solid #FFEA9E` |
| Drawer background | `rgba(16, 20, 23, 0.95)` |
| Drawer width | 100vw (full width on mobile) |
| Drawer padding | `16px` |
| Nav link style in drawer | Same as desktop default state (Montserrat 700 14px `#FFFFFF`) but stacked vertically, `py-4 px-4` |

---

## Layout Structure

```
┌────────────────────────────────────────────────────┐  1512px
│  [Header — fixed 80px — rgba(16,20,23,0.8)]        │
│  Logo | About SAA 2025* | Award Info | Kudos | VN  │
├────────────────────────────────────────────────────┤
│  [Keyvisual BG — 1512×1392px + gradient overlay]   │
│                                                     │
│  [SAA 2025 Brand Logo — 451×200px]                 │
│  "Sự kiện sẽ bắt đầu sau"  (24px white)           │  ← B.0 (pre-launch only)
│  [DD] [HH] [MM]  DAYS  HOURS  MINUTES              │  ← B.2 (pre-launch only)
│  Thời gian: 26/12/2025   Địa điểm: Âu Cơ Art Ctr  │  ← B.3 Row 1
│  Tường thuật trực tiếp qua sóng Livestream         │  ← B.3 Row 2
│  [About SAA 2025]  [Sun* Kudos]                    │  ← B.4
├────────────────────────────────────────────────────┤
│  Sun* annual awards 2025   (24px white)            │  ← C1 supertitle
│  ──────────────────────────────────────────────── │  ← divider #2E3940
│  Hệ thống giải thưởng      (57px gold)            │  ← C1 main title
│  [Card] [Card] [Card]                              │  ← C2 row 1
│  [Card] [Card] [Card]                              │  ← C2 row 2
├────────────────────────────────────────────────────┤
│  [#0F0F0F bg, radius 16px — 1120×500px]            │
│  Phong trào ghi nhận  (24px white)                 │  ← D left col
│  Sun* Kudos           (57px gold)                  │
│  [body copy 16px]                                   │
│  [Chi tiết ↑]                                      │  ← D CTA
│                   [Sun* Kudos Logo — 364×72px]     │  ← D right col
├────────────────────────────────────────────────────┤
│  [Footer — shared component]                        │
└────────────────────────────────────────────────────┘
```

---

## Responsive Specifications

| Breakpoint | Header padding-x | Content padding-x | Section gap |
|------------|-----------------|-------------------|-------------|
| Desktop ≥ 1280px | 144px | 144px | 120px |
| Tablet 768–1279px | 48px | 48px | 64px |
| Mobile 320–767px | 16px | 16px | 40px |

- Nav links collapse to hamburger menu on mobile
- SAA brand logo scales proportionally
- Countdown blocks stack in a row; scale down on mobile

---

## Component States

### Nav Link

| State | Color | Border-bottom | Background |
|-------|-------|---------------|------------|
| Default | `#FFFFFF` | none | transparent |
| Hover | `#FFFFFF` | none | `rgba(255,255,255,0.1)` |
| Active (current page) | `#FFEA9E` | `1px solid #FFEA9E` | transparent |
| Focus (keyboard) | `#FFFFFF` | none | outline `2px solid #FFEA9E` |

### Hamburger Button (Mobile, viewport < 768px)

| State | Icon | Background |
|-------|------|------------|
| Closed (default) | ☰ (3-line icon) | transparent |
| Hover | ☰ | `rgba(255,255,255,0.1)` |
| Open | × (close icon) | transparent |
| Focus (keyboard) | — | outline `2px solid #FFEA9E` |

ARIA: `aria-label="Open navigation menu"` when closed; `aria-label="Close navigation menu"` when open; `aria-expanded={isOpen}`.

### CTA Button — Primary (About SAA 2025)

| State | Background | Color | Transform |
|-------|-----------|-------|-----------|
| Default | `#FFEA9E` | `#00101A` | none |
| Hover | `#FFEA9E` at `opacity: 0.9` | `#00101A` | `scale(1.02)` |
| Focus | `#FFEA9E` | `#00101A` | outline `2px solid #FFEA9E` |
| Active (pressed) | `#FFEA9E` at `opacity: 0.8` | `#00101A` | `scale(0.98)` |

### CTA Button — Secondary (Sun* Kudos)

| State | Background | Border | Color |
|-------|-----------|--------|-------|
| Default | `rgba(255,234,158,0.1)` | `1px solid #998C5F` | `#FFFFFF` |
| Hover | `rgba(255,234,158,0.2)` | `1px solid #998C5F` | `#FFFFFF` |
| Focus | same as hover | outline `2px solid #FFEA9E` | `#FFFFFF` |
| Active (pressed) | `rgba(255,234,158,0.15)` | `1px solid #998C5F` | `#FFFFFF` |

---

## Animation

| Element | Animation | Duration |
|---------|-----------|----------|
| Header hover (nav link) | Background color change | 150ms ease-in-out |
| CTA button hover | `opacity: 0.9` + slight scale | 150ms ease-in-out |
| Countdown tick | Digit fade | 300ms |
| Reduced motion | All transitions disabled | — |

---

## Implementation Mapping

| Figma Node | Component | CSS / Tailwind |
|------------|-----------|----------------|
| `2167:9091` | `<Header />` | `fixed top-0 w-full h-[80px] bg-[rgba(16,20,23,0.8)] px-36 flex items-center justify-between z-[100]` |
| `I2167:9091;178:1033` | `<Image src="mm-media-logo" />` (A.1) | `w-[52px] h-[48px] object-contain` |
| `I2167:9091;186:1579` | `<NavLink active />` (A.2) | `text-[#FFEA9E] font-bold text-sm border-b border-[#FFEA9E] px-4 py-4` |
| `I2167:9091;186:1587` | `<NavLink />` (A.2) | `text-white font-bold text-sm px-4 py-4 rounded hover:bg-white/10` |
| `I2167:9091;186:1601` | `<LanguageSelector />` (A.3) | Shared component |
| `I2167:9091;186:2101` | `<NotificationBell />` (A.4) | `w-10 h-10 relative` — badge dot overlay |
| `I2167:9091;186:1597` | `<UserProfileButton />` (A.5) | `w-10 h-10 border border-[#998C5F] rounded p-[10px]` — auth-gated |
| `2167:9027` | `<KeyvisualBackground />` | `absolute inset-0 h-[1392px] overflow-hidden` |
| `2788:12911` | `<Image src="saa-2025-logo.png" alt="SAA 2025" />` (B.1) | `w-[451px] h-[200px] object-contain` |
| `2167:9036` | `<p>{t("comingSoon")}</p>` (B.0) | `font-bold text-[24px] leading-8 text-white` — `isLaunched = false` only |
| `2167:9037` | `<CountdownTimer />` (B.2) | `flex gap-10 items-start` — `isLaunched = false` only |
| `2167:9038` | `<DigitBlock unit="days" />` | `flex flex-col gap-[14px] items-start` |
| `2167:9053` | `<EventInfoBlock />` (B.3) | `flex flex-col gap-2` |
| `2167:9063` | `<Button variant="primary" onClick={() => router.push('/awards')} />` (B.4.1) | `bg-[#FFEA9E] text-[#00101A] rounded-lg px-6 py-4 font-bold` |
| `2167:9064` | `<Button variant="secondary" onClick={() => router.push('/kudos')} />` (B.4.2) | `border border-[#998C5F] bg-[rgba(255,234,158,0.1)] text-white rounded-lg px-6 py-4` |
| `3204:10152` | `<RootFurtherSection />` (RF) | `flex flex-col items-center justify-center gap-8 rounded-lg px-[104px] py-[120px]` — i18n text from `homepage.rootFurther*` |
| `5022:15169` | `<FloatingWidget />` (F) | `fixed right-5 z-[90] shadow-[0_4px_4px_rgba(0,0,0,0.25),0_0_6px_#FAE287]` top ~830px — 2 icon buttons |
| `2167:9068` | `<AwardSystemSection />` (C) | `<AwardCategoryCard />` grid 3×2 — see Award System spec |
| `3390:10349` | `<KudosPromoSection />` (D) | `#0F0F0F` bg, radius 16px — see Kudos spec |
| `5001:14800` | `<Footer />` (E) | Logo + 4 nav links + copyright `Montserrat Alternates 700` |

---

## Design Notes

- **CSS variable mapping (Constitution Principle II)**: All hex values in this document MUST be declared as CSS variables in `app/globals.css`. Component files MUST reference `var(--token-name)` or mapped Tailwind tokens — never raw hex values.

- **Nav font size 14px**: Homepage uses 14px nav links; other pages (e.g., Awards) use 16px — use the page-specific override via `className` prop on `<Header />`.
- **"Coming soon" text**: Montserrat 700 24px white — labels the countdown section (`B.0`). Only shown when `isLaunched = false`.
- **Digit cards**: Glassmorphism style — `border: 0.5px solid #FFEA9E`, `backdrop-filter: blur(16.64px)`, gradient bg at 0.5 opacity. Dimensions 51×82px (smaller than Countdown Prelaunch 77×123px). Digit numeral: **49px**, Digital Numbers 400.
- **Award section title hierarchy**: "Sun* annual awards 2025" is a 24px white supertitle; "He thong giai thuong" is the main 57px gold title. Both are always visible.
- **Award section**: Reuses `<AwardCategoryCard />` from the Award System page — same component, same style.
- **Kudos CTA**: Button text "Chi tiet" (16px, dark on gold). Icon is `MM_MEDIA_Up` (arrow icon, 24×24px).

---

## Resolved Questions

All previously open questions have been resolved by re-inspecting Figma nodes on 2026-04-28.

| # | Token / Section | Resolution | Source Node |
|---|----------------|------------|-------------|
| OQ-1 | `--text-digit-size` | **`49px`** (49.152px precise) — Digital Numbers 400 | `I2167:9040;186:2617` |
| OQ-2 | Event info structure | **Two-row block**: row 1 = time+venue (label 16px white / value 24px gold); row 2 = livestream 16px white. NOT a single tagline. | `2167:9053`–`2167:9061` |
| OQ-3 | `--text-livestream-*` | **16px, 700, line-height 24px, letter-spacing 0.5px, #FFFFFF** | `2167:9061` |
| OQ-4 | Award grid columns | **3 columns, gap 80px**, 2 rows, card 336×504px; section gap 80px | `2167:9074`, `2167:9078` |
| OQ-5 | Kudos promo background | **`#0F0F0F`, border-radius 16px**, inner 1120×500px; "Sun* Kudos" 57px gold; left content + right logo layout | `I3390:10349;313:8416` |
| OQ-6 | Hamburger icon | **Inline SVG** 24×24px — see Mobile Hamburger Menu States section above | `Header` component |
