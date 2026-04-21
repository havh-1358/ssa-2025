# Design Style: Login

**Frame ID**: `GzbNeVGJHz` (Figma node: `662:14387`)
**Frame Name**: `Login`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/GzbNeVGJHz
**Frame Image**: https://momorph.ai/api/images/9ypp4enmFmdK3YAFJLIu6C/662:14387/127763e01fa1f7169aaf137bf06f7bb4.png
**Extracted At**: 2026-04-22

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-bg-primary` | #00101A | 100% | Screen / page background |
| `--color-bg-header` | #0B0F12 | 80% | Header bar (semi-transparent) |
| `--color-btn-google-bg` | #FFEA9E | 100% | "Login with Google" button background |
| `--color-btn-google-text` | #00101A | 100% | "Login with Google" button text & icon |
| `--color-text-primary` | #FFFFFF | 100% | Tagline, language label, footer text |
| `--color-divider` | #2E3940 | 100% | Footer top-border |
| `--color-gradient-left-solid` | #00101A | 100% | Left overlay gradient (0%–25.41% solid) |
| `--color-gradient-overlay-end` | transparent | 0% | Fade-out end stop of both gradient overlays (`rgba(0,16,26,0)`) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-tagline` | Montserrat | 20px | 700 | 40px | 0.5px |
| `--text-btn-google` | Montserrat | 22px | 700 | 28px | 0px |
| `--text-language` | Montserrat | 16px | 700 | 24px | 0.15px |
| `--text-footer` | Montserrat Alternates | 16px | 700 | 24px | 0px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-header-px` | 144px | Header horizontal padding |
| `--spacing-header-py` | 12px | Header vertical padding |
| `--spacing-content-px` | 144px | Main content horizontal padding |
| `--spacing-content-pt` | 96px | Main content top padding |
| `--spacing-content-pb` | 96px | Main content bottom padding |
| `--spacing-footer-px` | 90px | Footer horizontal padding |
| `--spacing-footer-py` | 40px | Footer vertical padding |
| `--spacing-content-gap` | 24px | Gap between tagline and login button |
| `--spacing-sections-gap` | 80px | Gap between Key Visual and content block |
| `--spacing-btn-px` | 24px | Login button horizontal padding |
| `--spacing-btn-py` | 16px | Login button vertical padding |
| `--spacing-content-left-pad` | 16px | Left padding of content block (B.3) |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-btn-google` | 8px | Login with Google button |
| `--radius-lang-btn` | 4px | Language selector button |
| `--border-footer` | 1px solid #2E3940 | Footer top divider |
| `--border-footer-var` | `var(--Details-Divider, #2E3940)` | CSS variable form |

### Shadows

No shadows defined for this screen.

---

## Layout Specifications

### Frame Container

| Property | Value |
|----------|-------|
| width | 1440px |
| height | 1024px |
| background | #00101A |
| position | relative |
| overflow | hidden |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Screen (1440×1024px, bg: #00101A)                                  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  [C] Background Image (1441×1022px, absolute, z=1)          │    │
│  │  Full-bleed key visual photo                                 │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  [overlay] Left gradient: #00101A → transparent (left→right)        │
│  [overlay] Bottom gradient: #00101A → transparent (bottom→top)      │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  [A] Header (1440×80px, absolute top:0, bg: #0B0F12 80%)    │    │
│  │  padding: 12px 144px                                         │    │
│  │  ┌───────────────┐  238px gap  ┌──────────────────────────┐ │    │
│  │  │ [A.1] Logo    │             │ [A.2] Language (108×56px)│ │    │
│  │  │ (52×56px)     │             │  [flag 24px] [VN] [▾]    │ │    │
│  │  └───────────────┘             └──────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  [B] Content area (1440×845px, absolute top:88px)           │    │
│  │  padding: 96px 144px                                         │    │
│  │                                                              │    │
│  │  ┌────────────────────────────────────────────────────────┐  │    │
│  │  │  [B.1] Key Visual (1152×200px)                         │  │    │
│  │  │  Logo image (451×200px)                                │  │    │
│  │  └────────────────────────────────────────────────────────┘  │    │
│  │                                  80px gap                    │    │
│  │  ┌────────────────────────────────────────────────────────┐  │    │
│  │  │  Frame 550 (496×164px, flex col, gap: 24px)            │  │    │
│  │  │  padding-left: 16px                                    │  │    │
│  │  │                                                        │  │    │
│  │  │  [B.2] Tagline (480×80px)                              │  │    │
│  │  │  "Bắt đầu hành trình của bạn cùng SAA 2025.           │  │    │
│  │  │   Đăng nhập để khám phá!"                              │  │    │
│  │  │  Montserrat 700, 20px, lh:40px, #FFFFFF                │  │    │
│  │  │                                  24px gap              │  │    │
│  │  │  [B.3] Login Button (305×60px)                         │  │    │
│  │  │  ┌──────────────────────────────────────────────────┐  │  │    │
│  │  │  │ bg: #FFEA9E, radius: 8px, pad: 16px 24px         │  │  │    │
│  │  │  │ [LOGIN With Google  22px 700] [Google icon 24px]  │  │  │    │
│  │  │  └──────────────────────────────────────────────────┘  │  │    │
│  │  └────────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  [D] Footer (1440×91px, absolute top:933px)                 │    │
│  │  padding: 40px 90px                                          │    │
│  │  border-top: 1px solid #2E3940                               │    │
│  │  "Bản quyền thuộc về Sun* © 2025"                           │    │
│  │  Montserrat Alternates 700, 16px, lh:24px, #FFFFFF           │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### [A] Header — `mms_A_Header`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14391` | — |
| width | 1440px | `width: 100%` |
| height | 80px | `height: 80px` |
| position | absolute, top: 0 | `position: absolute; top: 0; left: 0` |
| background | rgba(11, 15, 18, 0.80) | `background-color: rgba(11, 15, 18, 0.80)` |
| padding | 12px 144px | `padding: 12px 144px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| gap | 238px (desktop only) | `gap: 238px` — this is the rendered gap at 1440px with `space-between`; do NOT apply as a hard gap on smaller viewports. The `justify-content: space-between` rule handles narrower widths automatically. |
| z-index | 1 | `z-index: 1` |

### [A.1] Logo — `mms_A.1_Logo`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I662:14391;186:2166` | — |
| width | 52px | `width: 52px` |
| height | 56px | `height: 56px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |

### [A.2] Language Selector — `mms_A.2_Language`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I662:14391;186:1601` | — |
| width | 108px | `width: 108px` |
| height | 56px | `height: 56px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 16px | `gap: 16px` |

**Inner button (border-radius: 4px, padding: 16px):**

| Property | Value |
|----------|-------|
| border-radius | 4px |
| padding | 16px |
| display | flex, row, space-between |

**Country code text "VN":**

| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 16px |
| font-weight | 700 |
| line-height | 24px |
| letter-spacing | 0.15px |
| color | #FFFFFF |

**States:**
| State | Property | Value |
|-------|----------|-------|
| Default | background | transparent |
| Hover | background | rgba(255,255,255,0.08) |
| Active | background | rgba(255,255,255,0.12) |
| Focus | outline | 2px solid rgba(255,234,158,0.5) |

---

### [B.2] Tagline — `mms_B.2_content`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14753` | — |
| width | 480px | `width: 480px` |
| height | 80px | `height: 80px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 20px | `font-size: 20px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 40px | `line-height: 40px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #FFFFFF | `color: #FFFFFF` |
| text-align | left | `text-align: left` |

---

### [B.3] Login with Google Button — `mms_B.3_Login` / `Button-IC About`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14426` | — |
| width | 305px | `width: 305px` |
| height | 60px | `height: 60px` |
| background | #FFEA9E | `background-color: var(--color-btn-google-bg)` |
| border-radius | 8px | `border-radius: 8px` |
| padding | 16px 24px | `padding: 16px 24px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| justify-content | flex-start | `justify-content: flex-start` |
| gap | 8px | `gap: 8px` |
| cursor | pointer | `cursor: pointer` |

**Child order**: text label (`225px`) renders on the **left**, Google icon (`24px`) renders on the **right**.
Verified from Figma positions: text endX=409, icon startX=417 (8px gap), within button endX=465.

**Button label text:**
| Property | Value |
|----------|-------|
| **Node ID** | `I662:14426;186:1568` |
| width | 225px |
| height | 28px |
| font-family | Montserrat |
| font-size | 22px |
| font-weight | 700 |
| line-height | 28px |
| letter-spacing | 0px |
| color | #00101A |
| text-align | center |

**Google icon:**
| Property | Value |
|----------|-------|
| **Node ID** | `I662:14426;186:1766` |
| width | 24px |
| height | 24px |

**States:**
| State | Property | Value |
|-------|----------|-------|
| Default | background | #FFEA9E |
| Hover | background | #FFE07A |
| Active | background | #FFD44D |
| Focus | outline | 2px solid #FFEA9E; outline-offset: 2px |
| Disabled | background | rgba(255,234,158,0.4); cursor: not-allowed |
| Loading | background | rgba(255,234,158,0.6); cursor: wait; pointer-events: none |

**Loading state UI**: While OAuth redirect is in progress (`isLoading: true`), the button MUST be
disabled and display a spinner or skeleton indicator in place of the Google icon to prevent
double-submission. The button text changes to "Đang đăng nhập..." or equivalent locale string.

---

### [D] Footer — `mms_D_Footer`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14447` | — |
| width | 1440px | `width: 100%` |
| position | absolute, top: 933px | `position: absolute; bottom: 0; left: 0` |
| padding | 40px 90px | `padding: 40px 90px` |
| border-top | 1px solid #2E3940 | `border-top: 1px solid var(--color-divider)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | space-between | `justify-content: space-between` |

**Copyright text:**
| Property | Value |
|----------|-------|
| **Node ID** | `I662:14447;342:1413` |
| font-family | Montserrat Alternates |
| font-size | 16px |
| font-weight | 700 |
| line-height | 24px |
| letter-spacing | 0px |
| color | #FFFFFF |
| text-align | center |

---

### [C] Background Key Visual — `mms_C_Keyvisual`

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14388` → `662:14389` | — |
| width | 1441px | `width: 100%` |
| height | 1022px | `height: 100%` |
| position | absolute, z-index: 1 | `position: absolute; inset: 0` |
| background | full-bleed cover image | `background-size: cover; background-position: center` |

**Left gradient overlay (662:14392):**
```css
background: linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0,16,26,0) 100%);
```

**Bottom gradient overlay (662:14390):**
```css
background: linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%);
```

---

## Component Hierarchy with Styles

```
Login (1440×1024px, bg: #00101A)
├── [C] mms_C_Keyvisual (absolute, full-bleed, z:1)
│   └── image 1 (background cover photo)
│
├── [overlay] Rectangle 57 — left gradient (90deg, #00101A → transparent)
├── [overlay] Cover — bottom gradient (0deg, #00101A → transparent)
│
├── [A] mms_A_Header (absolute, 1440×80px, top:0, bg:rgba(11,15,18,0.80), px:144px, py:12px, z:1)
│   ├── [A.1] mms_A.1_Logo (52×56px, flex-row)
│   │   └── MM_MEDIA_Logo (52×48px, cover image)
│   └── [A.2] mms_A.2_Language (108×56px, flex-row, gap:16px)
│       └── Button (108×56px, radius:4px, pad:16px)
│           ├── MM_MEDIA_VN flag (24×24px)
│           ├── "VN" (Montserrat 700, 16px, #FFF)
│           └── MM_MEDIA_Down chevron (24×24px)
│
├── [B] mms_B_Bìa (absolute, 1440×845px, top:88px, pad:96px 144px, flex-col)
│   └── Frame 487 (1152×653px, flex-col, gap:80px)
│       ├── [B.1] mms_B.1_Key Visual (1152×200px)
│       │   └── MM_MEDIA_Root Further Logo (451×200px, cover image)
│       └── Frame 550 (496×164px, flex-col, gap:24px, pl:16px)
│           ├── [B.2] mms_B.2_content (480×80px)
│           │   Text: "Bắt đầu hành trình của bạn cùng SAA 2025.
│           │          Đăng nhập để khám phá!"
│           │   (Montserrat 700, 20px, lh:40px, ls:0.5px, #FFF)
│           └── [B.3] mms_B.3_Login (305×60px, flex-row)
│               └── Button-IC About (305×60px, bg:#FFEA9E, radius:8px, pad:16px 24px, gap:8px)
│                   ├── Frame 483 (225×28px) → "LOGIN With Google" (Montserrat 700, 22px, #00101A)
│                   └── MM_MEDIA_Google icon (24×24px)  ← icon is on the RIGHT of the text
│
└── [D] mms_D_Footer (absolute, top:933px, 1440px, pad:40px 90px, border-top:#2E3940)
    └── "Bản quyền thuộc về Sun* © 2025"
        (Montserrat Alternates 700, 16px, lh:24px, #FFF)
```

---

## Responsive Specifications

This screen is designed at **1440px desktop**. Responsive adaptations required per Constitution Principle II:

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 320px | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

#### Mobile (< 768px)

| Component | Desktop Value | Mobile Value |
|-----------|--------------|--------------|
| Header padding | 12px 144px | 12px 20px |
| Content padding | 96px 144px | 80px 24px |
| Footer padding | 40px 90px | 24px 20px |
| Tagline font-size | 20px | 16px |
| Tagline line-height | 40px | 28px |
| Login button width | 305px | 100% |
| Login button font-size | 22px | 18px |
| Key Visual logo | 451×200px | 240×106px |
| Left gradient | 90deg, 25% solid | 90deg, 60% solid |

#### Tablet (768px–1023px)

| Component | Desktop Value | Tablet Value |
|-----------|--------------|--------------|
| Header padding | 12px 144px | 12px 48px |
| Content padding | 96px 144px | 80px 48px |
| Footer padding | 40px 90px | 32px 48px |
| Login button width | 305px | 260px |

#### Desktop (≥ 1024px)

Default — matches Figma spec exactly.

---

## Icon Specifications

| Icon Name | Node ID | Size | Color | Usage |
|-----------|---------|------|-------|-------|
| MM_MEDIA_Logo | `I662:14391;178:1033;178:1030` | 52×48px | — | Site logo in header |
| MM_MEDIA_VN (flag) | `I662:14391;186:1696;186:1821;186:1709` | 24×24px | — | Vietnam flag in language selector |
| MM_MEDIA_Down | `I662:14391;186:1696;186:1821;186:1441` | 24×24px | #FFFFFF | Dropdown chevron in language selector |
| MM_MEDIA_Google | `I662:14426;186:1766` | 24×24px | — | Google brand icon in login button |
| MM_MEDIA_Root Further Logo | `2939:9548` | 451×200px | — | SAA 2025 brand logo in main content |

All icons MUST be implemented as Icon Components (not `<img>` tags or raw SVG files).

---

### [E] Error Message — Auth Failure Feedback

> **`TODO(DESIGN)`**: No error state visible in the Figma frame. The following spec is
> inferred from constitution requirements (FR-006, Principle VI). Confirm visual design
> (toast vs. inline banner) with the design team before implementation.

| Property | Proposed Value | Notes |
|----------|----------------|-------|
| **Node ID** | — | Not in Figma — needs design |
| type | Inline banner below button OR toast | `TODO(DESIGN)`: confirm preference |
| background | rgba(239, 68, 68, 0.15) | Subtle red tint on dark bg |
| border | 1px solid rgba(239, 68, 68, 0.4) | Matches error red |
| border-radius | 8px | Consistent with button radius |
| padding | 12px 16px | Comfortable reading |
| font-family | Montserrat | Consistent with screen |
| font-size | 14px | Smaller than body to indicate secondary info |
| font-weight | 500 | Readable without dominating |
| line-height | 20px | Standard |
| color | #FCA5A5 | Accessible red on dark bg |
| role | `alert` | Required for screen reader announcement |
| aria-live | `assertive` | Announces immediately on error |

**Trigger**: Appears when `error !== null` (OAuth failure, network error, misconfigured key).
**Dismiss**: Auto-clears when user clicks "LOGIN With Google" again.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Login button | background-color | 150ms | ease-in-out | Hover |
| Language button | background-color | 150ms | ease-in-out | Hover |
| Login button | transform: scale(0.98) | 100ms | ease-in | Active/press |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Classes | React Component |
|----------------|---------------|-----------------|-----------------|
| Screen wrapper | `662:14387` | `relative w-full h-screen bg-[#00101A] overflow-hidden` | `<LoginPage />` |
| Background image | `662:14389` | `absolute inset-0 w-full h-full object-cover` | `<Image />` (Next.js) |
| Left gradient overlay | `662:14392` | `absolute inset-0 bg-gradient-to-r from-[#00101A] via-[#00101A]/[0.25] to-transparent` | `<div>` |
| Bottom gradient overlay | `662:14390` | `absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-[#00101A] to-transparent` | `<div>` |
| Header | `662:14391` | `absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-36 py-3 bg-[#0B0F12]/80` | `<Header />` |
| Logo area | `I662:14391;186:2166` | `flex items-center w-[52px] h-14` | `<Logo />` |
| Language selector | `I662:14391;186:1601` | `flex items-center gap-4` | `<LanguageSelector />` |
| Main content | `662:14393` | `absolute top-[88px] left-0 right-0 px-36 pt-24 pb-24` | `<LoginContent />` |
| Brand logo | `2939:9548` | `w-[451px] h-[200px] object-cover` | `<Image />` (Next.js) |
| Tagline | `662:14753` | `w-[480px] font-bold text-[20px] leading-[40px] tracking-[0.5px] text-white` | `<p>` |
| Google login button | `662:14426` | `w-[305px] h-[60px] bg-[#FFEA9E] rounded-lg px-6 py-4 flex items-center gap-2 hover:bg-[#FFE07A] active:bg-[#FFD44D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed` | `<GoogleLoginButton />` |
| Button label (text) | `I662:14426;186:1568` | `font-bold text-[22px] leading-7 text-[#00101A] text-center` | inner `<span>` (LEFT child) |
| Button Google icon | `I662:14426;186:1766` | `w-6 h-6 shrink-0` | `<GoogleIcon />` (RIGHT child) |
| Error message | *(no Figma node)* | `mt-3 px-4 py-3 rounded-lg border border-red-400/40 bg-red-500/15 text-[#FCA5A5] text-sm font-medium leading-5` + `role="alert"` | `<AuthErrorMessage />` — `TODO(DESIGN)` |
| Footer | `662:14447` | `absolute bottom-0 left-0 right-0 px-[90px] py-10 border-t border-[#2E3940] flex items-center justify-between` | `<Footer />` |
| Copyright text | `I662:14447;342:1413` | `font-bold text-base leading-6 text-white text-center` | `<p>` |
