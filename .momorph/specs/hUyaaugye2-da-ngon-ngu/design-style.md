# Design Style: Language Selector Dropdown

**Frame ID**: `hUyaaugye2`
**Frame Name**: `Dropdown-ngôn ngữ`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Last Updated**: 2026-04-22

---

## Design Tokens

### Colors

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| `--color-dropdown-bg` | `#00070C` | Dropdown container background |
| `--color-dropdown-border` | `#998C5F` | Dropdown container border |
| `--color-option-selected-bg` | `rgba(255, 234, 158, 0.2)` | VN option (currently selected) highlight |
| `--color-option-hover-bg` | `rgba(255, 234, 158, 0.1)` | Option hover state |
| `--color-text-option` | `#FFFFFF` | Option text color |
| `--color-accent-gold` | `#FFEA9E` | Accent / highlight color |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-body` | `"Montserrat", sans-serif` | Option locale labels |
| `--text-option-size` | `16px` | VN / EN label size |
| `--text-option-weight` | `700` | Option label weight |
| `--text-option-color` | `#FFFFFF` | Option label color |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--dropdown-padding-x` | `16px` | Horizontal padding inside dropdown |
| `--dropdown-padding-y` | `12px` | Vertical padding inside dropdown |
| `--option-padding-x` | `16px` | Option horizontal padding |
| `--option-padding-y` | `16px` | Option vertical padding |
| `--option-gap` | `12px` | Gap between flag icon and locale label |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border-dropdown` | `1px solid #998C5F` | Dropdown container border |
| `--radius-dropdown` | `8px` | Dropdown container border radius |
| `--radius-option` | `4px` | Option hover border radius |

---

## Component Style Details

### Trigger Button (in `<Header />` — NOT part of this Figma frame)

The trigger button is rendered inside the Header component. These styles are derived from the Login and Homepage header designs.

| Property | Value |
|----------|-------|
| Layout | flex, row, gap: 8px, align-items: center |
| Background | transparent (inherits header background) |
| Padding | `8px` |
| Border radius | `4px` |
| Cursor | pointer |

**Sub-elements:**
| Element | Asset | Size | Style |
|---------|-------|------|-------|
| Flag icon | `/assets/flags/vn.svg` or `/assets/flags/en.svg` | 24×16px | `object-cover` |
| Locale text | "VN" or "EN" | — | Montserrat 700 14px `#FFFFFF` |
| Chevron | `MM_MEDIA_Down` | 24×24px | `#FFFFFF`; rotated 180° when dropdown open |

**States:**
| State | Visual |
|-------|--------|
| Default | Transparent bg, white text |
| Hover | `rgba(255,255,255,0.1)` background |
| Active (open) | `rgba(255,255,255,0.1)` background; chevron rotated 180° |
| Focus (keyboard) | outline `2px solid #FFEA9E` |

> **Note**: On screens with 16px nav font (Awards, Kudos), the locale text in the trigger matches that screen's nav font size. On screens with 14px nav font (Homepage, Login), it uses 14px.

---

### A — Dropdown Container (Node: `525:11713`)

| Property | Value |
|----------|-------|
| Width | 215px |
| Height | 304px |
| Background | `#00070C` |
| Border | `1px solid #998C5F` |
| Border radius | `8px` |
| Display | flex, flex-direction: column |
| Padding | `12px 0` |
| Box shadow | `0 8px 32px rgba(0,0,0,0.48)` |
| z-index | 999 |

---

### A.1 — VN Option (Selected State)

| Property | Value |
|----------|-------|
| Width | 108px (content) / full dropdown width |
| Height | 56px |
| Background | `rgba(255, 234, 158, 0.2)` |
| Border radius | `4px` |
| Padding | `16px` |
| Display | flex, flex-direction: row, align-items: center |
| Gap | `12px` |

**Flag icon:**
| Property | Value |
|----------|-------|
| Asset | `/assets/flags/vn.svg` |
| Size | 24×16px |

**Label:**
| Property | Value |
|----------|-------|
| Text | "VN" |
| Font | Montserrat 700 16px |
| Color | `#FFFFFF` |

**States:**
| State | Background |
|-------|-----------|
| Default (selected) | `rgba(255,234,158,0.2)` |
| Hover | `rgba(255,234,158,0.25)` |
| Focus | outline `2px solid #FFEA9E` |

---

### A.2 — EN Option (Unselected State)

| Property | Value |
|----------|-------|
| Width | 110px (content) / full dropdown width |
| Height | 56px |
| Background | transparent (inherits `#00070C`) |
| Border radius | `4px` |
| Padding | `16px` |
| Display | flex, flex-direction: row, align-items: center |
| Gap | `12px` |

**Flag icon:**
| Property | Value |
|----------|-------|
| Asset | `/assets/flags/en.svg` |
| Size | 24×16px |

**Label:**
| Property | Value |
|----------|-------|
| Text | "EN" |
| Font | Montserrat 700 16px |
| Color | `#FFFFFF` |

**States:**
| State | Background |
|-------|-----------|
| Default (unselected) | transparent |
| Hover | `rgba(255,234,158,0.1)` |
| Focus | outline `2px solid #FFEA9E` |
| Selected | `rgba(255,234,158,0.2)` |

---

## Layout Structure

```
┌─────────────────────────────────┐  215px wide
│  padding-y: 12px                │
│  ┌────────────────────────────┐ │
│  │ [VN flag 24x16]  VN        │ │  56px tall — SELECTED (golden highlight)
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │ [EN flag 24x16]  EN        │ │  56px tall — unselected (dark)
│  └────────────────────────────┘ │
│                                 │
│  (remaining 304-12-12-56-56     │
│   = 168px padding/future use)   │
└─────────────────────────────────┘
```

> Note: The 304px height accommodates future locale additions without redesign. With only 2 options, extra whitespace appears below. Consider `height: auto` in implementation unless Figma specifies fixed height as a design constraint.

---

## Animation

| Event | Animation | Duration |
|-------|-----------|----------|
| Dropdown open | Fade in + scale from 0.95 to 1.0 | 150ms ease-out |
| Dropdown close | Fade out + scale to 0.95 | 100ms ease-in |
| Option hover | Background color transition | 100ms |
| Reduced motion | No scale animation | — |

---

## Implementation Mapping

| Figma Node | Component | CSS / Tailwind |
|------------|-----------|----------------|
| `525:11713` | `<LanguageDropdown />` | `absolute z-[999] w-[215px] rounded-[8px] border border-[#998C5F] bg-[#00070C] py-3 shadow-[0_8px_32px_rgba(0,0,0,0.48)]` |
| VN option | `<LocaleOption locale="vi" />` | `flex items-center gap-3 px-4 py-4 rounded-[4px] bg-[rgba(255,234,158,0.2)] cursor-pointer` |
| EN option | `<LocaleOption locale="en" />` | `flex items-center gap-3 px-4 py-4 rounded-[4px] hover:bg-[rgba(255,234,158,0.1)] cursor-pointer` |
| Flag icon | `<Image src="/assets/flags/vn.svg" />` | `w-6 h-4 object-cover` |
| Locale label | `<span>` | `font-montserrat font-bold text-[16px] text-white` |

---

## Design Notes

- **CSS variable mapping (Constitution Principle II)**: All hex values in this document MUST be declared as CSS variables in `app/globals.css`. Component files MUST reference `var(--token-name)` — never raw hex values.

- **Fixed vs auto height**: Figma shows 304px. In implementation, prefer `min-height: 304px; height: auto` to gracefully support future locale additions.
- **Dropdown position**: Float below-right of the trigger button in the header. Use absolute positioning relative to the trigger's parent container.
- **Flag assets**: Export from Figma or use open-source SVG flag icons. Store in `public/assets/flags/vn.svg` and `public/assets/flags/en.svg`.
- **Divider between options**: Not visible in design; do NOT add a divider line between VN and EN.
- **Selected state tracking**: When locale is `"vi"`, VN option shows selected style; when `"en"`, EN option shows selected style. Swap dynamically.
