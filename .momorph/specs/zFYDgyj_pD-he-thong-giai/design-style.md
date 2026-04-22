# Design Style: Award System (He Thong Giai)

**Frame ID**: `zFYDgyj_pD`
**Frame Name**: `He Thong Giai`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Last Updated**: 2026-04-22

---

## Design Tokens

### Colors

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| `--color-bg-base` | `#00101A` | Page background |
| `--color-header-bg` | `rgba(16, 20, 23, 0.8)` | Header background |
| `--color-text-primary` | `#FFFFFF` | Body text |
| `--color-accent-gold` | `#FFEA9E` | Active nav, highlights |
| `--color-nav-active` | `#FFEA9E` | Active nav link text + underline |
| `--color-divider` | `rgba(46, 57, 64, 1)` = `#2E3940` | Section dividers (1px height) |
| `--color-btn-secondary-border` | `#998C5F` | Secondary button borders |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-body` | `"Montserrat", sans-serif` | All text |
| `--text-nav-size` | `16px` | Nav links (larger than homepage) |
| `--text-nav-weight` | `700` | Nav weight |
| `--text-nav-line` | `24px` | Nav line height |
| `--text-nav-letter` | `0.15px` | Nav letter spacing |
| `--text-section-title-size` | `24px` | Section title "Sun* Annual Awards 2025" |
| `--text-section-title-weight` | `700` | Same |
| `--text-award-heading-size` | `32px` | Award category heading |
| `--text-award-heading-weight` | `700` | Same |
| `--text-body-size` | `16px` | Award description text |
| `--text-body-weight` | `400` | Same |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--header-height` | `80px` | Fixed header |
| `--header-padding-x` | `144px` | Header horizontal padding |
| `--content-padding-x` | `144px` | Main content horizontal padding |
| `--content-padding-y` | `96px` | Main content top/bottom padding |
| `--section-gap` | `120px` | Gap between major page sections |
| `--award-gap` | `80px` | Gap between award category panels |
| `--left-nav-gap` | `16px` | Gap between nav items |
| `--left-nav-padding` | `16px` | Nav item padding |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border-nav-item` | `4px` radius | Nav item border radius |
| `--border-divider` | `1px solid #2E3940` | Horizontal divider between sections |
| `--border-nav-active` | `1px solid #FFEA9E` (bottom) | Active nav link underline |

---

## Component Style Details

### A — Header (Node: `313:8440`)

| Property | Value |
|----------|-------|
| Width | 1440px |
| Height | 80px |
| Background | `rgba(16, 20, 23, 0.8)` |
| Padding | `12px 144px` |
| Display | flex, row, justify-content: space-between |
| Position | fixed, top: 0 |

**Active Nav Link ("Award Information") — Node: `I313:8440;186:1587`**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700 16px |
| Color | `#FFEA9E` |
| Text shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` |
| Border bottom | `1px solid #FFEA9E` |

---

### KV — Keyvisual (Node: `313:8437`)

| Property | Value |
|----------|-------|
| Width | 1440px |
| Height | 547px |
| Background | Image (cover) + gradient overlay |
| Gradient | `linear-gradient(0deg, #00101A -4.23%, rgba(0,19,32,0) 52.79%)` |

---

### T — Section Title (Node: `313:8453`)

| Property | Value |
|----------|-------|
| Width | 1152px |
| Height | 129px |
| Gap | `16px` |

**Title text (Node: `313:8454`)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700 24px |
| Color | `#FFFFFF` |
| Text | "Sun* Annual Awards 2025" |

**Divider (Node: `313:8455`)**:
| Property | Value |
|----------|-------|
| Width | 1152px |
| Height | 1px |
| Background | `rgba(46, 57, 64, 1)` = `#2E3940` |

---

### C — Left Navigation Menu (Node: `313:8459`)

| Property | Value |
|----------|-------|
| Width | 178px |
| Height | 448px |
| Display | flex column, gap 16px |

**Nav item (default, e.g., `313:8461`):**
| Property | Value |
|----------|-------|
| Border radius | `4px` |
| Padding | `16px` |
| Font | Montserrat 700 16px |
| Color | `#FFFFFF` |
| Background | transparent |

**Nav item (active state):**
| Property | Value |
|----------|-------|
| Background | `rgba(255, 234, 158, 0.2)` |
| Color | `#FFEA9E` |
| Border radius | `4px` |

**Nav Categories:**
| ID | Text |
|----|------|
| C.1 `313:8460` | Top Talent |
| C.2 `313:8461` | Top Project |
| C.3 `313:8462` | Top Project Leader |
| C.4 `313:8463` | Best Manager |
| C.5 `313:8464` | Signature 2025 |
| C.6 `313:8465` | MVP |

---

### D — Detail Panel (Node: `313:8466`)

| Property | Value |
|----------|-------|
| Width | 853px (856 approx) |
| Display | flex column, gap 80px |

**Each award detail section (e.g., D.1 Top Talent `313:8467`):**
| Property | Value |
|----------|-------|
| Width | 856px |
| Display | flex column, gap 80px |
| Bottom divider | `1px solid #2E3940` (from `Rectangle 14`) |

---

## Layout Structure

```
┌───────────────────────────────────────────────────────┐  1440px
│  [Header — fixed 80px — rgba(16,20,23,0.8)]           │
│  Logo | About SAA | Award Info* | Kudos | VN  [icon]  │
├───────────────────────────────────────────────────────┤
│  [Keyvisual — 1440×547px + gradient]                   │
├───────────────────────────────────────────────────────┤
│  padding: 96px 144px                                   │
│  ┌── Section Title ──────────────────────────────┐    │
│  │ Sun* Annual Awards 2025    [Montserrat 700 24] │    │
│  │ ─────────────────────────── [divider #2E3940]  │    │
│  └───────────────────────────────────────────────┘    │
│                                                        │
│  ┌─── Left Nav ─┐  ┌──── Detail Panel ────────────┐   │
│  │ Top Talent   │  │ [Award category details]      │   │
│  │ Top Project  │  │ Title, recipients, prize $$   │   │
│  │ Top Project  │  │ ─────────────────────────── │   │
│  │   Leader     │  │ [Next category]               │   │
│  │ Best Manager │  └──────────────────────────────┘   │
│  │ Signature 25 │                                      │
│  │ MVP          │                                      │
│  └──────────────┘                                      │
├───────────────────────────────────────────────────────┤
│  [Sun* Kudos promo block — 1152×500px]                 │
├───────────────────────────────────────────────────────┤
│  [Footer — shared]                                     │
└───────────────────────────────────────────────────────┘
```

---

## Responsive Specifications

| Breakpoint | Left nav | Content layout | Nav font |
|------------|---------|----------------|----------|
| Desktop ≥ 1280px | 178px sidebar | 2-column row | 16px |
| Tablet 768–1279px | Horizontal scroll tabs | 1-column | 14px |
| Mobile 320–767px | Horizontal scroll tabs / dropdown | 1-column | 13px |

---

## Component States

### Left Nav Item

| State | Background | Color | Transition |
|-------|-----------|-------|-----------|
| Default | transparent | `#FFFFFF` | — |
| Hover | `rgba(255,234,158,0.1)` | `#FFFFFF` | 150ms ease-in-out |
| Active (selected) | `rgba(255,234,158,0.2)` | `#FFEA9E` | — |
| Focus (keyboard) | outline `2px solid #FFEA9E` | — | — |

**Touch target**: Left nav items use `padding: 16px` with Montserrat 700 16px text (~24px line height) = ~56px height, which satisfies the ≥ 44px touch target requirement.

---

## Animation

| Element | Animation | Duration |
|---------|-----------|----------|
| Detail panel switch | Fade in | 150ms ease-out |
| Nav item hover bg | Background color change | 150ms ease-in-out |
| Reduced motion | No animation | — |

---

## Implementation Mapping

| Figma Node | Component | CSS / Tailwind |
|------------|-----------|----------------|
| `313:8440` | `<Header activeNav="awards" />` | Shared header component |
| `313:8437` | `<KeyvisualBackground />` | `h-[547px] bg-cover + gradient` |
| `313:8453` | `<SectionTitle />` | `flex flex-col gap-4` |
| `313:8459` | `<AwardNavMenu />` | `flex flex-col gap-4 w-[178px]` |
| Nav item active | `<AwardNavItem active />` | `bg-[rgba(255,234,158,0.2)] text-[#FFEA9E] rounded p-4` |
| Nav item | `<AwardNavItem />` | `text-white rounded p-4 hover:bg-[rgba(255,234,158,0.1)]` |
| `313:8466` | `<AwardDetailPanel />` | `flex flex-col gap-20 w-[856px]` |
| Category section | `<AwardCategorySection category={...} />` | `flex flex-col gap-20` |
| `313:8455` (divider) | `<hr />` | `border-t border-[#2E3940] w-full` |
| Footer | `<Footer />` | Shared component |

---

## Design Notes

- **CSS variable mapping (Constitution Principle II)**: All hex values in this document are the source-of-truth values that MUST be declared as CSS variables in `app/globals.css` (e.g., `--color-bg-base: #00101A`). Component files MUST use `bg-[var(--color-bg-base)]` or mapped Tailwind tokens — never raw hex values.

- **Nav font size 16px**: This page uses 16px nav links (vs 14px on Homepage). The `<Header />` component should accept a `navFontSize` prop or use page-specific Tailwind overrides.
- **Left nav width**: 178px is the maximum item width (Signature 2025 item). Other items may be narrower but the column should be fixed at 178px for visual consistency.
- **Active nav item**: The first item (Top Talent `C.1`) is selected by default. The left nav is NOT scroll-linked — it requires a user click to change the active item.
- **Divider**: Between each award category section in the detail panel, there is a 1px divider using `rgba(46,57,64,1)`.
- **Prize amounts**: These are design-time values. Implement as data, not hardcoded strings, to allow future updates without code changes.
