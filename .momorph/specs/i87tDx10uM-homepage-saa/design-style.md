# Design Style: Homepage SAA

**Frame ID**: `i87tDx10uM`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Last Updated**: 2026-04-22

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
| `--text-digit-size` | `TODO(value needed)` | Countdown digit numeral size on Homepage — see Open Questions |
| `--text-digit-weight` | `400` | Digit numeral weight (matches Countdown Prelaunch screen) |
| `--text-digit-line` | `1` | Digit numeral line height |
| `--text-unit-size` | `24px` | DAYS/HOURS/MINUTES labels |
| `--text-unit-weight` | `700` | Same |
| `--text-unit-line` | `32px` | Unit label line height |
| `--text-tagline-size` | `TODO(value needed)` | Event tagline text size — see Open Questions |
| `--text-tagline-weight` | `TODO(value needed)` | Event tagline text weight — see Open Questions |
| `--text-livestream-size` | `TODO(value needed)` | Livestream note text size — see Open Questions |
| `--text-btn-size` | `16px` | CTA button text |
| `--text-btn-weight` | `700` | Same |
| `--text-btn-line` | `24px` | CTA button line height |

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

### A — Header (Node: `2167:9091`)

| Property | Value |
|----------|-------|
| Width | 1512px |
| Height | 80px |
| Background | `rgba(16, 20, 23, 0.8)` |
| Padding | `12px 144px` |
| Display | flex, row, justify-content: space-between, align-items: center |
| Gap | `238px` |
| Position | fixed top-0 z-[100] (CSS `z-index: 100`) |

**Nav Link — Default State (Node: `I2167:9091;186:1587`)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700 14px |
| Color | `#FFFFFF` |
| Padding | `16px` |
| Border radius | `4px` |

**Nav Link — Active State (Node: `I2167:9091;186:1579`)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700 14px |
| Color | `#FFEA9E` |
| Text shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |
| Border bottom | `1px solid #FFEA9E` |

---

### BG — Background Keyvisual (Node: `2167:9027`)

| Property | Value |
|----------|-------|
| Width | 1512px |
| Height | 1392px |
| Background | cover image + gradient overlay |
| Gradient | `linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)` |

---

### B.1 — SAA 2025 Brand Logo (Node: `2788:12911`)

| Property | Value |
|----------|-------|
| Width | 451px |
| Height | 200px |
| Display | cover image |
| Asset | `public/assets/homepage/saa-2025-logo.png` |

---

### B.2 — Countdown Section (Node: `2167:9037`)

| Property | Value |
|----------|-------|
| Container | 429×128px, flex row, gap 40px |

**Each Digit Block (e.g., `2167:9038`):**
| Property | Value |
|----------|-------|
| Width | 116px |
| Height | 128px |
| Display | flex column, gap 14px |

**Digit Cards (2 groups, each `2167:9040` / `2167:9041`):**
| Property | Value |
|----------|-------|
| Width | 51px per card |
| Height | 82px per card |
| Border | `0.75px solid #FFEA9E` |
| Border radius | `12px` |
| Backdrop filter | `blur(24.96px)` |
| Background | `rgba(255,234,158,0.05)` |

**Unit Labels (`2167:9042` DAYS, `2167:9047` HOURS, `2167:9052` MINUTES):**
| Property | Value |
|----------|-------|
| Font | Montserrat 700 24px |
| Color | `#FFFFFF` |
| Line height | `32px` |

**Digit Numeral (inside each card):**
| Property | Value |
|----------|-------|
| Font family | "Digital Numbers", monospace |
| Font weight | `400` |
| Font size | `TODO(value needed)` — Figma node value not captured in original spec; card is 51×82px (smaller than Countdown Prelaunch 77×123px so digit size is proportionally smaller, approx 38–42px) |
| Line height | `1` |
| Color | `#FFFFFF` |

---

### B.3 — Event Info (Node: `2167:9053`)

| Property | Value |
|----------|-------|
| Display | flex column |
| Color | `#FFFFFF` |

**Event tagline:**
| Property | Value |
|----------|-------|
| Font family | Montserrat |
| Font size | `TODO(value needed)` — not captured in original Figma analysis; see Open Questions |
| Font weight | `TODO(value needed)` |
| Line height | `TODO(value needed)` |
| Color | `#FFFFFF` |

**Livestream note ("Tường thuật trực tiếp qua sóng Livestream"):**
| Property | Value |
|----------|-------|
| Font family | Montserrat |
| Font size | `TODO(value needed)` — see Open Questions |
| Font weight | `TODO(value needed)` |
| Color | `#FFFFFF` |

---

### B.4 — CTA Buttons (Node: `2167:9062`)

**B4.1 — Primary button (About SAA 2025) (Node: `2167:9063`):**
| Property | Value |
|----------|-------|
| Width | 276px |
| Height | 60px |
| Background | `rgba(255, 234, 158, 1)` = `#FFEA9E` |
| Border radius | `8px` |
| Padding | `16px 24px` |
| Gap | `8px` |
| Font | Montserrat 700 (inherited) |
| Color | `#00101A` (dark text on gold bg) |

**B4.2 — Secondary button (Sun* Kudos):**
| Property | Value |
|----------|-------|
| Border | `1px solid #998C5F` |
| Background | `rgba(255, 234, 158, 0.1)` |
| Border radius | `8px` |
| Padding | `16px 24px` |
| Color | `#FFFFFF` |

---

### C — Award System Section (Node: `2167:9068`)

| Property | Value |
|----------|-------|
| Width | 1224px (content width; 144px horizontal padding from 1512px frame) |
| Height | 1353px (design reference) |
| Background | transparent (inherits page background `#00101A`) |
| Padding top | `TODO(value needed)` — gap from hero section above |
| Display | flex column |

**Award Category Card:**
| Property | Value |
|----------|-------|
| Border radius | `8px` |
| Background | `TODO(value needed)` — see Open Questions |
| Layout | grid; number of columns and gap `TODO(value needed)` |

> Note: Full award card style details are defined in the Award System screen spec (`.momorph/specs/zFYDgyj_pD-he-thong-giai/design-style.md`). The `<AwardCategoryCard />` component on the homepage is the same shared component.

---

### D — Sun* Kudos Promo Section (Node: `3390:10349`)

| Property | Value |
|----------|-------|
| Width | 1224px (content width) |
| Height | 500px (design reference) |
| Background | `TODO(value needed)` — see Open Questions |
| Layout | `TODO(value needed)` |

> Note: Full Kudos promo style details are defined in the Sun* Kudos screen spec (`.momorph/specs/MaZUn5xHXZ-sun-kudos/design-style.md`).

---

### E — Footer (Node: `5001:14800`)

The footer is a shared component. Its style details are NOT defined in this document — implement from the shared `<Footer />` component definition. Ensure it inherits `#00101A` page background context.

---

### A — Mobile Hamburger Menu States

| Property | Value |
|----------|-------|
| Hamburger icon | `TODO(value needed)` — icon asset or SVG; 3-line / ☰ icon |
| Close icon | `TODO(value needed)` — × icon when drawer is open |
| Drawer background | same as header: `rgba(16, 20, 23, 0.8)` |
| Drawer width | 100vw (full width) on mobile |
| Drawer padding | `16px` |
| Nav link style in drawer | Same as desktop default state (Montserrat 700 14px `#FFFFFF`) but stacked vertically |

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
│  "Sự kiện sẽ bắt đầu sau" (coming soon)            │
│  [DD] [HH] [MM]  DAYS  HOURS  MINUTES              │
│  [Event tagline text]                               │
│  [CTA: About SAA]  [CTA: Kudos]                    │
├────────────────────────────────────────────────────┤
│  [Award system section — 1224×1353px]               │
│  Award cards grid                                   │
├────────────────────────────────────────────────────┤
│  [Sun* Kudos promo — 1224×500px]                   │
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
| `I2167:9091;178:1033` | `<Image src="mm-media-logo" alt="SSA 2025 – go to homepage" />` | `w-[52px] h-[48px] object-contain` |
| `I2167:9091;186:1579` | `<NavLink active />` | `text-[#FFEA9E] font-bold text-sm border-b border-[#FFEA9E] px-4 py-4` |
| `I2167:9091;186:1587` | `<NavLink />` | `text-white font-bold text-sm px-4 py-4 rounded hover:bg-white/10` |
| `I2167:9091;186:1601` | `<LanguageSelector />` | Shared component — see Language Selector spec |
| `2167:9027` | `<KeyvisualBackground />` | `absolute inset-0 h-[1392px] overflow-hidden` |
| `2788:12911` | `<Image src="saa-2025-logo.png" alt="SAA 2025" />` | `w-[451px] h-[200px] object-contain` |
| `2167:9037` | `<CountdownRow />` | `flex gap-10 items-start` |
| `2167:9038` | `<DigitBlock unit="days" />` | `flex flex-col gap-[14px] items-start` |
| `2167:9053` | `<EventInfo />` | `flex flex-col text-white` |
| `2167:9063` | `<Button variant="primary" />` | `bg-[#FFEA9E] text-[#00101A] rounded-lg px-6 py-4 font-bold` |
| `2167:9062` (B4.2) | `<Button variant="secondary" />` | `border border-[#998C5F] bg-[rgba(255,234,158,0.1)] text-white rounded-lg px-6 py-4` |
| `2167:9068` | `<AwardSystemSection />` | Shared `<AwardCategoryCard />` grid — see Award System spec |
| `3390:10349` | `<KudosPromoSection />` | See Sun* Kudos spec |
| `5001:14800` | `<Footer />` | Shared component |

---

## Design Notes

- **CSS variable mapping (Constitution Principle II)**: All hex values in this document MUST be declared as CSS variables in `app/globals.css`. Component files MUST reference `var(--token-name)` or mapped Tailwind tokens — never raw hex values.

- **Nav font size 14px**: Homepage uses 14px nav links; other pages (e.g., Awards) use 16px — use the page-specific override via `className` prop on `<Header />`.
- **"Coming soon" text**: Montserrat 700 24px, white — this labels the countdown section, not the same as the Countdown Prelaunch screen.
- **Digit cards**: Same glassmorphism style as the standalone Countdown screen (blur, gold border, 12px radius) but slightly different dimensions (51×82px vs 77×123px on Countdown screen).
- **Award section**: Reuses the same `<AwardCategoryCard />` pattern as the Hệ thống giải page.
- **Digit numeral font size on Homepage**: The Homepage countdown card dimensions (51×82px) are smaller than the Countdown Prelaunch card (77×123px). The exact digit font size was not captured in the original spec; implement proportionally or re-inspect the Figma node. See Open Questions below.

---

## Open Questions

The following values are marked `TODO(value needed)` throughout this document because they were not captured during the original Figma analysis. A developer MUST NOT implement guessed values — either re-run `momorph.specs` on the frame or confirm with the design team before coding.

| # | Token / Section | Missing Value | Figma Node to Inspect |
|---|----------------|---------------|-----------------------|
| OQ-1 | `--text-digit-size` (Homepage countdown) | Exact font size of digit numerals inside 51×82px card | `2167:9040` / `2167:9041` |
| OQ-2 | `--text-tagline-size`, `--text-tagline-weight` | Event tagline text style | `2167:9053` |
| OQ-3 | `--text-livestream-size`, `--text-livestream-weight` | Livestream note text style | `2167:9053` |
| OQ-4 | Award card background color and grid columns | Award section card style on homepage | `2167:9068` |
| OQ-5 | Kudos promo section background and layout | Sun* Kudos promo block styling | `3390:10349` |
| OQ-6 | Hamburger icon asset path | Hamburger and close icon SVG/PNG | Header component |
