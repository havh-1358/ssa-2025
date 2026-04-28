# Design Style: Countdown Prelaunch

**Frame ID**: `8PJQswPZmU`
**Frame Name**: `Countdown Prelaunch`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Last Updated**: 2026-04-22

---

## Design Tokens

### Colors

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| `--color-bg-base` | `#00101A` | Page background fallback |
| `--color-text-primary` | `#FFFFFF` | Title text, digit numerals, unit labels |
| `--color-accent-gold` | `#FFEA9E` | Digit card border |
| `--color-card-bg` | `rgba(255, 234, 158, 0.05)` | Digit card glassmorphism fill |
| `--color-gradient-overlay` | `linear-gradient(18deg, #00101A 0%, transparent 100%)` | BG gradient overlay |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-display` | `"Digital Numbers", monospace` | Countdown digit numerals |
| `--font-body` | `"Montserrat", sans-serif` | Title and unit labels |
| `--text-title-size` | `36px` | "Sự kiện sẽ bắt đầu sau" |
| `--text-title-weight` | `700` | Title weight |
| `--text-title-line-height` | `1.2` (43px) | Title line height |
| `--text-digit-size` | `73.73px` | Digit numeral size |
| `--text-digit-weight` | `400` | Digit numeral weight |
| `--text-digit-line-height` | `1` | Digit numeral line height (tight, no extra spacing) |
| `--text-unit-size` | `36px` | NGÀY / GIỜ / PHÚT label size |
| `--text-unit-weight` | `700` | Unit label weight |
| `--text-unit-line-height` | `1.2` (43px) | Unit label line height |
| `--text-color-on-dark` | `#FFFFFF` | All text on dark background |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--gap-digit-blocks` | `40px` | Gap between DAYS / HOURS / MINUTES blocks |
| `--gap-digit-cards` | `4px` | Gap between individual digit cards within one block (e.g., tens/units cards) |
| `--gap-digit-label` | `12px` | Gap between digit card group and unit label below |
| `--gap-title-blocks` | `48px` | Gap between title and countdown blocks row |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border-card` | `0.75px solid #FFEA9E` | Digit card border |
| `--radius-card` | `12px` | Digit card corner radius |

### Shadows / Filters

| Token | Value | Usage |
|-------|-------|-------|
| `--blur-card` | `blur(24.96px)` | Digit card backdrop-filter |

---

## Component Style Details

### C — Background Key Visual (Node: `2268:35127`)

| Property | Value |
|----------|-------|
| Dimensions | 1512 × 1077px (full frame) |
| Background color | `#00101A` |
| Background image | `/assets/countdown/keyvisual.jpg` (cover) |
| Gradient overlay | `linear-gradient(18deg, #00101A 0%, rgba(0,16,26,0) 100%)` |
| Gradient overlay z-index | 1 (above background image, below content) |
| Content layer z-index | 2 |
| z-index (image layer) | 0 |

**Implementation notes**:
- Use `<Image priority fill style={{ objectFit: 'cover' }} alt="" />` for the background photo (`objectFit` prop was removed in Next.js 13+; use inline style or Tailwind `object-cover` class)
- Layer gradient overlay as an absolute `<div>` on top

---

### B.1 — Countdown Title

| Property | Value |
|----------|-------|
| Font family | Montserrat |
| Font weight | 700 |
| Font size | 36px |
| Color | `#FFFFFF` |
| Text | "Sự kiện sẽ bắt đầu sau" (VN) / "Event starts in" (EN) |
| Text align | center |
| Margin bottom | `48px` |

---

### B.2 / B.3 / B.4 — Digit Block (Days / Hours / Minutes)

Each digit block is a vertical stack: digit card(s) above, unit label below.

#### Digit Card

| Property | Value |
|----------|-------|
| Node IDs | `2268:35139` (Days), `2268:35144` (Hours), `2268:35149` (Minutes) |
| Width | 77px per digit card |
| Height | 123px per digit card |
| Background | `rgba(255,234,158,0.05)` (glassmorphism) |
| Border | `0.75px solid #FFEA9E` |
| Border radius | `12px` |
| Backdrop filter | `blur(24.96px)` |
| Display | flex, align-items: center, justify-content: center |

#### Digit Numeral (inside card)

| Property | Value |
|----------|-------|
| Font family | "Digital Numbers" |
| Font weight | 400 |
| Font size | 73.73px |
| Line height | 1 |
| Color | `#FFFFFF` |
| Text | `"00"` – `"99"` (or `"000"` for days > 99) |

#### Unit Label (below card)

| Property | Value |
|----------|-------|
| Font family | Montserrat |
| Font weight | 700 |
| Font size | 36px |
| Color | `#FFFFFF` |
| Text | NGÀY / GIỜ / PHÚT (VN) or DAYS / HOURS / MINUTES (EN) |
| Margin top | `12px` |

**Multi-digit layout**: For values ≥ 10, two digit cards are displayed side by side with a small gap (`4px`, matching `--gap-digit-cards`). For days ≥ 100, three cards.

---

## Layout Structure

```
┌──────────────────────────────────────────────────────────────┐  1512px wide
│  [Background Key Visual — full bleed, #00101A + BG image]    │
│  [Gradient overlay — 18deg from bottom-left]                 │
│                                                               │
│                                                               │
│          "Sự kiện sẽ bắt đầu sau"  [Montserrat 700 36px]     │
│                                                               │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│   │  [77×123]   │  │  [77×123]   │  │  [77×123]   │       │
│   │  Digit "D"  │  │  Digit "H"  │  │  Digit "M"  │       │
│   │  Digit "D"  │  │  Digit "H"  │  │  Digit "M"  │       │
│   └──────────────┘  └──────────────┘  └──────────────┘       │
│       NGÀY               GIỜ               PHÚT              │
│                                                               │
└──────────────────────────────────────────────────────────────┘
         [content center ~60% from top — ⚠️ CONFIRM EXACT VALUE WITH DESIGN TEAM]
```

---

## Responsive Specifications

| Breakpoint | Digit size | Card width | Card height | Title size | Unit label size |
|------------|-----------|------------|-------------|------------|-----------------|
| Desktop ≥ 1280px | 73.73px | 77px | 123px | 36px | 36px |
| Tablet 768–1279px | 52px | 60px | 96px | 28px | 28px |
| Mobile 320–767px | 36px | 44px | 72px | 20px | 20px |

- Digit blocks row wraps or scales via CSS `transform: scale()` on smaller viewports
- Unit label font size scales proportionally with digit size

---

## Component States

### Digit Block (`<DigitBlock />`)

The digit block is non-interactive (read-only display). No hover, focus, active, or disabled states apply. Keyboard users tab past it without focus stop.

### Countdown Container

| State | Behavior |
|-------|----------|
| Loading (SSR hydrating) | SSR-rendered static values shown; no visual loading spinner |
| Active (counting down) | Values update every 60s via `setInterval` |
| Expired (`isExpired = true`) | Immediately redirect to `/` (authenticated) or `/login` (unauthenticated); never display negative values |
| Misconfigured (`GET /api/campaigns/active` returns `null` or invalid `start_date`) | Each digit block shows `--` (double dash) instead of a number; server logs structured error |

---

## Animation

| Element | Animation | Duration |
|---------|-----------|----------|
| Digit change (flip) | Optional: CSS flip or fade transition | 300ms |
| None (reduced motion) | `@media (prefers-reduced-motion: reduce)` — skip transition | — |

---

## Implementation Mapping

| Figma Node | Component | CSS / Tailwind |
|------------|-----------|----------------|
| `2268:35127` (BG) | `<CountdownBackground />` | `relative w-full h-screen bg-[#00101A]` |
| *(content wrapper)* | `<CountdownContent />` | `absolute inset-0 flex flex-col items-center justify-center` — **⚠️ vertical offset TBD** (design shows content center ~60% from top; confirm exact value with design team before hardcoding `pt-*` offset) |
| `2268:35131` (Title) | `<CountdownTitle />` | `font-montserrat font-bold text-[36px] text-white text-center mb-[48px]` |
| `2268:35139` (Days) | `<DigitBlock unit="days" />` | `flex flex-col items-center gap-[12px]` |
| `2268:35144` (Hours) | `<DigitBlock unit="hours" />` | `flex flex-col items-center gap-[12px]` |
| `2268:35149` (Minutes) | `<DigitBlock unit="minutes" />` | `flex flex-col items-center gap-[12px]` |
| Digit card | `<DigitCard digit="0" />` | `w-[77px] h-[123px] rounded-[12px] border border-[#FFEA9E] backdrop-blur-[24.96px] bg-[rgba(255,234,158,0.05)] flex items-center justify-center` |
| Digit numeral | `<span>` inside card | `font-["Digital_Numbers"] text-[73.73px] text-white leading-none` |
| Unit label | `<CountdownLabel />` | `font-montserrat font-bold text-[36px] leading-[1.2] text-white mt-[12px]` |

---

## Design Notes

- **CSS variable mapping (Constitution Principle II)**: All hex values in this document MUST be declared as CSS variables in `app/globals.css`. Component files MUST reference `var(--token-name)` — never raw hex values.

- **"Digital Numbers" font**: Must be imported/self-hosted; not a Google Fonts standard. Place in `public/fonts/DigitalNumbers.woff2` and declare in `app/layout.tsx` via `@font-face`.
- **Digit card glassmorphism**: `backdrop-filter: blur(24.96px)` — requires `backdrop-blur` Tailwind plugin or inline style. Ensure `bg-clip-padding` is not stripping the blur.
- **No seconds**: Design intentionally omits seconds. Do NOT add a seconds block.
- **Two-digit display**: Zero-pad single-digit values (e.g., `05` not `5`).
