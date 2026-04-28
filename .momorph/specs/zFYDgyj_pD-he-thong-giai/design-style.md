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
| `--text-section-title-weight` | `700` | Section title font weight |
| `--text-section-title-line` | `32px` | Section title line height (1.33× size) |
| `--text-award-heading-size` | `24px` | Award category name in section title row (gold, with icon) |
| `--text-award-heading-weight` | `700` | Award heading font weight |
| `--text-award-heading-line` | `32px` | Award heading line height (1.33× size) |
| `--text-body-size` | `16px` | Award description text |
| `--text-body-weight` | `700` | Body text font weight (descriptions are bold Montserrat 700) |
| `--text-body-line` | `24px` | Body text line height (1.5× size) |
| `--text-main-heading-size` | `57px` | "Hệ thống giải thưởng SAA 2025" main section heading |
| `--text-main-heading-weight` | `700` | Main heading font weight |
| `--text-main-heading-line` | `64px` | Main heading line height |
| `--text-main-heading-letter` | `-0.25px` | Main heading letter spacing |
| `--text-kudos-title-size` | `57px` | "Sun* Kudos" promo block title |
| `--text-kudos-title-weight` | `700` | Kudos title font weight |
| `--text-kudos-title-line` | `64px` | Kudos title line height |
| `--text-kudos-title-letter` | `-0.25px` | Kudos title letter spacing |

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
| Asset path | `public/assets/awards/keyvisual.jpg` → import as `/assets/awards/keyvisual.jpg` |
| Gradient | `linear-gradient(0deg, #00101A -4.23%, rgba(0,19,32,0) 52.79%)` |

---

### T — Section Title (Node: `313:8453`)

| Property | Value |
|----------|-------|
| Width | 1152px |
| Height | 129px |
| Gap | `16px` |

**Sub-title text (Node: `313:8454`)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700 24px |
| Line height | 32px |
| Color | `#FFFFFF` |
| Text | "Sun* Annual Awards 2025" |
| Render order | First (top) — renders ABOVE the main heading |

**Main heading "Hệ thống giải thưởng SAA 2025" (Node: `313:8457`)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700 |
| Size | 48px |
| Line height | 56px |
| Color | `#FFEA9E` (gold) |
| Text align | `center` |
| Render order | Second — renders BELOW the subtitle text |

> ⚠️ **Implementation Note**: The `<SectionTitle>` component MUST render both text elements. It currently only renders the subtitle. Add a `mainHeading` prop (or rename the existing props) to accept "Hệ thống giải thưởng SAA 2025" and render it in 48px gold below "Sun* Annual Awards 2025".

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
| Width | 853px |
| Display | `flex flex-col gap-[80px]` |

---

### D.x — Award Category Section (shared structure for D.1–D.6)

Each award category follows one of two layout variants that **alternate** between sections. Node IDs per category:

| ID | Node | Award name | Recipients | Prize | Layout variant |
|----|------|-----------|-----------|-------|---------------|
| D.1 | `313:8467` | Top Talent | 10 Cá nhân | 7.000.000 VNĐ | **Frame 506** — Image LEFT |
| D.2 | `313:8468` | Top Project | 02 Tập thể | 15.000.000 VNĐ | **Frame 507** — Image RIGHT |
| D.3 | `313:8469` | Top Project Leader | 03 Cá nhân | 7.000.000 VNĐ | **Frame 506** — Image LEFT |
| D.4 | `313:8470` | Best Manager | 01 Cá nhân | 10.000.000 VNĐ | **Frame 507** — Image RIGHT |
| D.5 | `313:8471` | Signature 2025 - Creator | 01 Cá nhân hoặc Tập thể | 5.000.000 (cá nhân) / 8.000.000 (tập thể) VNĐ | **Frame 506** — Image LEFT |
| D.6 | `313:8510` | MVP (Most Valuable Person) | 01 Cá nhân | 15.000.000 VNĐ | **Frame 507** — Image RIGHT |

> **Alternating rule**: Odd-numbered sections (D.1, D.3, D.5) use Frame 506 — image on the LEFT, content on the RIGHT. Even-numbered sections (D.2, D.4, D.6) use Frame 507 — content on the LEFT, image on the RIGHT. Implement via `imagePosition: "left" | "right"` prop on `<AwardCategorySection />`.

**D.x outer container:**
| Property | Value |
|----------|-------|
| Width | 856px |
| Display | `flex flex-col gap-[80px]` |
| Bottom divider | `Rectangle 14` — `853×1px` `background: rgba(46,57,64,1)` |

---

#### Frame 506 — Image LEFT layout (D.1, D.3, D.5; Node e.g. `I313:8467;214:2803`)

| Property | Value |
|----------|-------|
| Width | 856px |
| Display | `flex flex-row gap-[40px] items-start` |
| Child order | 1st: D.x.1 Picture-Award (image) · 2nd: D.x.2 Content |

#### Frame 507 — Image RIGHT layout (D.2, D.4, D.6; Node e.g. `I313:8468;214:2928`)

| Property | Value |
|----------|-------|
| Width | 856px |
| Display | `flex flex-row gap-[40px] items-start` |
| Child order | 1st: D.x.2 Content · 2nd: D.x.1 Picture-Award (image) |

---

#### D.x.1 — Picture-Award (Node e.g. `I313:8467;214:2525`)

| Property | Value |
|----------|-------|
| Width | 240px |
| Height | 240px |
| mix-blend-mode | `screen` |
| box-shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` (gold glow) |
| Asset | `/assets/awards/award-{slug}.png` (336×336px image) |

> ⚠️ **IMPORTANT — Do NOT remove `mix-blend-mode: screen`**: The award images are pre-designed circular badge PNGs with dark/transparent backgrounds. They are intentionally created to be used with `mix-blend-mode: screen` on the `#00101A` dark navy page background. Dark pixels in the image become transparent; golden elements glow through. Rendering them as standard opaque images (without screen blend) is INCORRECT. T061 removed this property — that change must be reverted (see FR-015 in spec.md).

---

#### D.x.2 — Content block (Node e.g. `I313:8467;214:2526`)

| Property | Value |
|----------|-------|
| Width | 480px |
| Display | `flex flex-col gap-[32px]` |
| backdrop-filter | `blur(32px)` — `backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px)` |
| border-radius | `16px` |

> **Implementation note**: `backdrop-filter: blur(32px)` is a CSS property, NOT a Tailwind class. Apply via `style={{ backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)" }}` or via a Tailwind `backdrop-blur-[32px]` class. Use `@supports (backdrop-filter: blur(1px))` fallback for browsers that don't support it.

**D.x.2.a — Title + description block** (top group, `flex flex-col gap-[24px]`):

Sub-row — Title row (`flex flex-row items-center gap-[16px]`, height 32px):
| Element | Spec |
|---------|------|
| Icon | `MM_MEDIA_Target` 24×24px — download via MoMorph media tools or use inline SVG target/aim symbol |
| Category name text | Montserrat 700, **24px**, line-height **32px**, color `#FFEA9E` (gold) |

> ⚠️ **Typography correction**: Category name is **24px GOLD** (`#FFEA9E`), NOT 32px white. The `--text-award-heading-size` token has been corrected to `24px`. Current implementation renders h2 at 32px white — must be corrected to 24px gold per this spec.

Description text (`I313:8467;214:2531`):
| Property | Value |
|----------|-------|
| Font | Montserrat 700 |
| Size | 16px |
| Line height | 24px |
| Letter spacing | 0.5px |
| Color | `#FFFFFF` |
| Text align | `justify` |
| Width | 480px |

**D.x.2.b — Divider 1** (`Rectangle 8`): `480×1px` `background: rgba(46,57,64,1)`

**D.x.2.c — Số lượng giải thưởng row** (`flex flex-row items-center gap-[16px]`, height 44px):
| Element | Spec |
|---------|------|
| Icon | `MM_MEDIA_Diamond` 24×24px — diamond/gem symbol; download via MoMorph media tools |
| Label "Số lượng giải thưởng:" | Montserrat 700, **24px**, line-height **32px**, color `#FFEA9E` (gold) |
| Count value (e.g. "10") | Montserrat 700, **36px**, line-height **44px**, color `#FFFFFF` |
| Unit (e.g. "Cá nhân") | Montserrat 700, **14px**, line-height **20px**, letter-spacing **0.1px**, color `#FFFFFF` |

**D.x.2.d — Divider 2**: `480×1px` `background: rgba(46,57,64,1)`

**D.x.2.e — Giá trị giải thưởng block** (standard, `flex flex-col gap-[16px]`):
| Element | Spec |
|---------|------|
| Row 1 (label row) | `MM_MEDIA_License` icon 24×24px (certificate/ribbon symbol) + label "Giá trị giải thưởng:" — Montserrat 700 **24px** lh 32px color `#FFEA9E` |
| Row 2 (amount) | Prize amount (e.g. "7.000.000 VNĐ") — Montserrat 700 **36px** lh 44px color `#FFFFFF` |
| Row 3 (sub-label) | "cho mỗi giải thưởng" — Montserrat 400, **14px**, lh 20px, color `#FFFFFF` opacity 70% |

> **Icon sourcing**: `MM_MEDIA_Target`, `MM_MEDIA_Diamond`, `MM_MEDIA_License` are Figma component icons from the MM_MEDIA library. Download them as SVG via MoMorph `get_media_file` tool or `get_figma_image` with their node IDs, then save as SVG files to `public/assets/awards/icons/` and use as `<img>` or inline SVG in the component. If Figma API is unavailable, use equivalent SVG icons (target crosshair, diamond gem, certificate ribbon) as a fallback.

---

#### D.5 Signature 2025 — Special 2-prize layout (Node: `313:8471`)

D.5 differs from other sections: it has **two separate prize tiers** (individual + team) separated by an "Hoặc" divider. Replace the standard D.x.2.e block with:

**D.5.2.c — Số lượng row:**
| Element | Spec |
|---------|------|
| Unit text | "Cá nhân hoặc tập thể" (not "Cá nhân" or "Tập thể") |
| Count | "01" |

**D.5.2.e — Prize block 1** (individual prize):
| Element | Spec |
|---------|------|
| Label | "Giá trị giải thưởng:" |
| Amount | "5.000.000 VNĐ" |
| Sub-label | "cho giải cá nhân" — Montserrat 400 14px, `#FFFFFF` opacity 70% |

**D.5 — "Hoặc" separator** (Node: `313:8498`–`313:8500`, between prize blocks):
| Property | Value |
|----------|-------|
| Layout | `flex flex-row items-center gap-?` |
| Text | "Hoặc" — Montserrat 700 14px, `#FFFFFF` opacity 70% |
| Lines | Two `1px` divider lines flanking the text |

**D.5.2.e — Prize block 2** (team prize):
| Element | Spec |
|---------|------|
| Label | "Giá trị giải thưởng:" |
| Amount | "8.000.000 VNĐ" |
| Sub-label | "cho giải tập thể" — Montserrat 400 14px, `#FFFFFF` opacity 70% |

---

### D1 — Sun* Kudos Promo Block (Node: `335:12023`)

| Property | Value |
|----------|-------|
| Width | 1152px |
| Height | 500px |
| Display | `flex flex-col items-center justify-center gap-[10px]` |
| Background | `#0F0F0F` + kudos image (bg cover) |
| Border radius | `16px` |

**D1 background rectangle (Node: `I335:12023;313:8416`)**:
| Property | Value |
|----------|-------|
| Width | 1152px |
| Height | 500px |
| Background | `#0F0F0F` solid + `radial-gradient(ellipse 60% 80% at 90% 10%, rgba(180,120,30,0.45) 0%, rgba(140,90,20,0.2) 40%, transparent 70%)` overlay — use inline CSS `background` property (no Tailwind arbitrary url() class) |
| Border radius | `16px` |

**D2_Content block (Node: `I335:12023;313:8419`)**:
| Property | Value |
|----------|-------|
| Width | 470px |
| Height | 408px |
| Display | `flex flex-col items-flex-start justify-center gap-[32px]` |

**"Phong trào ghi nhận" label (Node: `I335:12023;313:8421`)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700, 24px, line-height 32px |
| Color | `#FFFFFF` |

**"Sun* Kudos" title (Node: `I335:12023;313:8422`)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700, **57px**, line-height 64px, letter-spacing -0.25px |
| Color | `#FFEA9E` (gold) |
| Width | 340px |

**Description text (Node: `I335:12023;313:8423`)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700, 16px, line-height 24px, letter-spacing 0.5px |
| Color | `#FFFFFF` |
| Width | 457px |
| Text align | `justify` |

**D2.1_Button-IC "Chi tiết" (Node: `I335:12023;313:8426`)**:
| Property | Value |
|----------|-------|
| Width | 127px |
| Height | 56px |
| Padding | 16px |
| Gap | 8px |
| Background | `#FFEA9E` (gold — PRIMARY CTA) |
| Border radius | `4px` |
| Font | Montserrat 700, 16px, line-height 24px, letter-spacing 0.15px |
| Text color | `#00101A` (dark navy) |

**States for D2.1 button**:
| State | Background | Text |
|-------|-----------|------|
| Default | `#FFEA9E` | `#00101A` |
| Hover | `rgba(255,234,158,0.85)` | `#00101A` |
| Focus | outline `2px solid #FFEA9E` | — |

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
| Mobile 320–767px | Horizontal scroll tabs (no dropdown) | 1-column | 13px |

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

> **Constitution II compliance**: The Tailwind classes listed below show the DESIGN INTENT values for reference. In actual component code, all hex values MUST be replaced with CSS variable references (e.g., `bg-[var(--color-accent-gold-bg)]`). Raw hex is FORBIDDEN in component files.

| Figma Node | Component | CSS / Tailwind (reference values — use CSS vars in code) |
|------------|-----------|----------------------------------------------------------|
| `313:8440` | `<Header activeNav="awards" />` | Shared header component |
| `313:8437` | `<KeyvisualBackground />` | `h-[547px] bg-cover` + gradient overlay |
| `313:8453` | `<AwardsSectionTitle />` | `flex flex-col gap-4` — renders subtitle (24px white) + main heading (48px gold) + divider |
| `313:8459` | `<AwardNavMenu />` | `role="navigation"` container · `flex flex-col gap-4 w-[178px]` · sticky positioning |
| Nav item active (scroll-spy) | `<a href="#slug" aria-current="true">` | `bg-[var(--color-nav-active-bg)] text-[var(--color-nav-active)] rounded p-4` |
| Nav item default | `<a href="#slug">` | `text-[var(--color-text-primary)] rounded p-4 hover:bg-[var(--color-nav-hover-bg)]` |
| `313:8466` | Award sections wrapper | `flex flex-col gap-[80px]` — all 6 sections always visible |
| `313:8467`–`313:8510` | `<AwardCategorySection id="{slug}" category={...} imagePosition="left\|right" />` | `scroll-mt-[var(--header-height)]` on each section for offset-corrected anchor scroll |
| Frame 506 row (D.1,D.3,D.5) | Inner row image-left | `flex flex-row gap-[40px] items-start` · order: image first |
| Frame 507 row (D.2,D.4,D.6) | Inner row image-right | `flex flex-row gap-[40px] items-start` · order: content first |
| `I313:8467;214:2525` | `<Image>` award badge | `w-[336px] h-[336px] object-cover shrink-0` + `style={{ mixBlendMode: "screen", boxShadow: "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287" }}` — ⚠️ mix-blend-mode: screen is REQUIRED |
| `I313:8467;214:2526` | Content block | `flex flex-col gap-[32px] w-[480px]` + `style={{ backdropFilter: "blur(32px)", borderRadius: "16px" }}` |
| Title row | Category name + icon | `flex flex-row items-center gap-[16px]` · `<img>` target icon 24×24px · name: Montserrat 700 **24px** gold `#FFEA9E` |
| Description | Award criteria | Montserrat 700 16px white text-justify ls-[0.5px] |
| Số lượng row | Recipients count | icon + 24px gold label + 36px white count + 14px white unit |
| Giá trị row (standard) | Prize amount | icon + 24px gold label + 36px white amount + 14px white opacity-70 sub-label |
| D.5 prize tier 1 | 5.000.000 VNĐ individual | Standard row + "cho giải cá nhân" sub-label |
| D.5 "Hoặc" separator | `313:8498` | `flex flex-row items-center gap-4` · "Hoặc" text + two `1px` hr lines |
| D.5 prize tier 2 | 8.000.000 VNĐ team | Standard row + "cho giải tập thể" sub-label |
| Section divider (`Rectangle 14`) | `<hr />` | `w-[853px] h-px border-0 bg-[var(--color-divider)]` |
| `313:8455` (title divider) | `<hr />` | `border-t border-[var(--color-divider)] w-full` |
| `335:12023` | `<KudosPromoSection />` | `w-[1152px] h-[500px] rounded-[16px] flex flex-col items-center justify-center` |
| `I335:12023;313:8416` | Background rectangle | `w-full h-full rounded-[16px]` + inline style object with background property — use CSS variables or inline styles only, never Tailwind arbitrary url() classes |
| `I335:12023;313:8419` | `<KudosContent />` | `flex flex-col gap-[32px] w-[470px]` |
| `I335:12023;313:8421` | Label "Phong trào ghi nhận" | `text-[var(--color-text-primary)] font-bold text-[24px] leading-[32px]` |
| `I335:12023;313:8422` | Title "Sun* Kudos" | `text-[var(--color-accent-gold)] font-bold text-[57px] leading-[64px] tracking-[-0.25px]` |
| `I335:12023;313:8423` | Description text | `text-[var(--color-text-primary)] font-bold text-[16px] leading-[24px] tracking-[0.5px] text-justify` |
| `I335:12023;313:8426` | `<Button>Chi tiết</Button>` | `w-[127px] h-[56px] px-[16px] rounded-[4px] bg-[var(--color-accent-gold)] text-[var(--color-bg-base)] font-bold text-[16px]` |
| Footer | `<Footer />` | Shared component |

**Additional CSS variables needed** (not yet defined in shared tokens above — add to `app/globals.css`):
| Variable | Value | Purpose |
|----------|-------|---------|
| `--color-nav-active-bg` | `rgba(255, 234, 158, 0.2)` | Nav item active background |
| `--color-nav-hover-bg` | `rgba(255, 234, 158, 0.1)` | Nav item hover background |

---

## Design Notes

- **CSS variable mapping (Constitution Principle II)**: All hex values in this document are the source-of-truth values that MUST be declared as CSS variables in `app/globals.css` (e.g., `--color-bg-base: #00101A`). Component files MUST use `bg-[var(--color-bg-base)]` or mapped Tailwind tokens — never raw hex values.

- **Nav font size 16px**: This page uses 16px nav links (vs 14px on Homepage). The `<Header />` component should accept a `navFontSize` prop or use page-specific Tailwind overrides.
- **Left nav width**: 178px is the maximum item width (Signature 2025 item). Other items may be narrower but the column should be fixed at 178px for visual consistency.
- **Active nav item**: The first item (Top Talent `C.1`) is selected by default. The left nav is NOT scroll-linked — it requires a user click to change the active item.
- **Divider**: Between each award category section in the detail panel, there is a 1px divider using `rgba(46,57,64,1)`.
- **Prize amounts**: These are design-time values. Implement as data, not hardcoded strings, to allow future updates without code changes.
