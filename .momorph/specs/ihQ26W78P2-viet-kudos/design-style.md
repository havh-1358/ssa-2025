# Design Style: Viet Kudos (Write Kudos Modal)

**Frame ID**: `ihQ26W78P2`
**Frame Name**: `Viet Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Last Updated**: 2026-04-22

---

## Design Tokens

### Colors

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| `--color-bg-base` | `#00101A` | Page background beneath overlay |
| `--color-overlay` | `rgba(0, 16, 26, 0.8)` | Modal overlay |
| `--color-modal-bg` | `rgba(255, 248, 225, 1)` = `#FFF8E1` | Modal container background (warm cream) |
| `--color-modal-text-dark` | `rgba(0, 16, 26, 1)` = `#00101A` | Modal title text (dark) |
| `--color-input-bg` | `#FFFFFF` | Input background |
| `--color-input-border` | `#998C5F` | Input border |
| `--color-placeholder` | `rgba(153, 153, 153, 1)` = `#999999` | Placeholder text |
| `--color-accent-gold` | `#FFEA9E` | Primary submit button background |
| `--color-accent-gold-hover` | `rgba(255, 234, 158, 0.3)` | Rich text toolbar button active background |
| `--color-accent-gold-subtle` | `rgba(255, 234, 158, 0.15)` | Rich text toolbar button hover background |
| `--color-btn-secondary-bg` | `rgba(255, 234, 158, 0.1)` | Cancel button background |
| `--color-btn-secondary-border` | `#998C5F` | Cancel button border |
| `--color-checkbox-border` | `#999999` | Anonymous checkbox border (unchecked state) |
| `--color-checkbox-bg` | `#FFFFFF` | Checkbox background |
| `--color-error` | `#EF4444` | Validation error border, character counter over limit |
| `--color-toolbar-bg` | `#F5F5F5` | Rich text toolbar background |
| `--color-suggestion-hover` | `rgba(255, 234, 158, 0.1)` | Recipient dropdown suggestion hover |
| `--color-suggestion-selected` | `rgba(255, 234, 158, 0.2)` | Recipient dropdown suggestion selected |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-body` | `"Montserrat", sans-serif` | All modal text |
| `--text-modal-title-size` | `32px` | Modal heading font size |
| `--text-modal-title-weight` | `700` | Modal heading font weight |
| `--text-modal-title-line-height` | `TODO(value needed)` | Modal heading line-height |
| `--text-modal-title-color` | `#00101A` | Modal heading on cream bg |
| `--text-input-size` | `16px` | Input/textarea text size |
| `--text-input-weight` | `400` | Input/textarea text weight |
| `--text-input-line-height` | `TODO(value needed)` | Input/textarea line-height |
| `--text-placeholder-size` | `16px` | Placeholder text size |
| `--text-placeholder-weight` | `400` | Placeholder text weight |
| `--text-placeholder-color` | `#999999` | Placeholder color |
| `--text-label-size` | `14px` | Field labels (Title, Recipient labels) |
| `--text-label-weight` | `700` | Field label weight |
| `--text-label-line-height` | `TODO(value needed)` | Field label line-height |
| `--text-anon-size` | `22px` | "Gui an danh" label size |
| `--text-anon-weight` | `700` | "Gui an danh" label weight |
| `--text-anon-line-height` | `TODO(value needed)` | Anonymous label line-height |
| `--text-btn-size` | `TODO(value needed)` | Button text font size |
| `--text-btn-weight` | `700` | Button text font weight |
| `--text-counter-size` | `12px` | Character counter font size |
| `--text-counter-weight` | `400` | Character counter font weight |
| `--text-suggestion-size` | `14px` | Dropdown suggestion item text size |
| `--text-suggestion-weight` | `400` | Dropdown suggestion item text weight |
| `--text-chip-size` | `TODO(value needed)` | Hashtag chip text size |
| `--text-chip-weight` | `TODO(value needed)` | Hashtag chip text weight |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--modal-padding` | `40px` | Modal container padding |
| `--modal-gap` | `32px` | Gap between modal sections |
| `--field-gap` | `16px` | Gap between label and input |
| `--input-padding` | `16px 24px` | Input field padding |
| `--btn-cancel-padding` | `16px 40px` | Cancel button padding |
| `--btn-submit-padding` | `16px` | Submit button padding |
| `--btn-gap` | `24px` | Gap between action buttons |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border-modal` | `24px` | Modal container border radius |
| `--border-input` | `1px solid #998C5F` | All input fields |
| `--border-input-radius` | `8px` | Input border radius (consistent with button radius; confirm with Figma) |
| `--border-btn-submit` | `8px` | Submit button radius |
| `--border-checkbox` | `1px solid #999999` | Anonymous checkbox border |
| `--checkbox-size` | `24px × 24px` | Checkbox dimensions |

---

## Component Style Details

### BG — Page Overlay (Node: `520:11646`)

| Property | Value |
|----------|-------|
| Width | 1440px |
| Height | 1024px |
| Background | `rgba(0, 16, 26, 0.8)` |
| Position | absolute, covers full page |
| z-index | 10 |

---

### F — Modal Container (Node: `520:11647`)

| Property | Value |
|----------|-------|
| Width | 752px |
| Height | 1012px (or auto with max-height) |
| Background | `rgba(255, 248, 225, 1)` = `#FFF8E1` |
| Border radius | `24px` |
| Padding | `40px` |
| Gap | `32px` |
| Display | flex, column |
| Position | centered (margin auto or absolute center) |
| z-index | 20 |

---

### F.A — Modal Title (Node: `I520:11647;520:9870`)

| Property | Value |
|----------|-------|
| Width | 672px |
| Height | 80px |
| Font | Montserrat 700 32px |
| Color | `#00101A` |
| Text | "Gui loi cam on va ghi nhan den dong doi" |

---

### F.B — Recipient Selector (Node: `I520:11647;520:9871`)

| Property | Value |
|----------|-------|
| Width | 672px |
| Height | 56px |
| Display | flex, row, gap 16px |

**B.2 Search input (Node: `I520:11647;520:9873`)**:
| Property | Value |
|----------|-------|
| Border | `1px solid #998C5F` |
| Padding | `16px 24px` |
| Background | `#FFFFFF` |
| Placeholder color | `#999999` |
| Border radius | `8px` |

**B.3 Recipient search suggestions dropdown (appears below B.2 on user input)**:
| Property | Value |
|----------|-------|
| Width | match B.2 input width |
| Background | `#FFFFFF` |
| Border | `1px solid #998C5F` |
| Border radius | `8px` |
| Max height | `240px` (scroll beyond 5 results) |
| `overflow-y` | `auto` |
| z-index | 50 |

**Suggestion item**:
| Property | Value |
|----------|-------|
| Padding | `12px 16px` |
| Font | Montserrat 400 14px, `#00101A` |
| Hover background | `rgba(255, 234, 158, 0.1)` |
| Selected (chips) background | `rgba(255, 234, 158, 0.2)` |
| Empty state text | "No results found" — Montserrat 400 14px `#999999`, centered |

---

### F.C — Kudos Title Input (Node: `I520:11647;1688:10448`)

| Property | Value |
|----------|-------|
| Width | 672px |
| Height | 104px |
| Display | flex, column |

**Title text input (Node: `I520:11647;1688:10437`)**:
| Property | Value |
|----------|-------|
| Width | 514px (approx) |
| Border | `1px solid #998C5F` |
| Padding | `16px 24px` |
| Background | `#FFFFFF` |

**Placeholder example text (Node: `I520:11647;1688:10447`)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700 16px |
| Color | `#999999` |
| Text | "Vi du: Nguoi truyen dong luc cho toi.\nDanh hieu se hien thi lam tieu de Kudos..." |

---

### F.D — Message + Hashtags + Image (Node: `I520:11647;520:9874`)

| Property | Value |
|----------|-------|
| Width | 672px |
| Height | 444px |
| Display | flex, column, gap 24px |

**Message editor (Node: `I520:11647;520:9875` — 672×268px)**:
| Property | Value |
|----------|-------|
| Width | 672px |
| Height | 268px (fixed — content is scrollable inside; `overflow-y: auto`) |
| Border | `1px solid #998C5F` |
| Background | `#FFFFFF` |
| Padding | `16px 24px` |

**Character counter (below message editor)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 400 12px |
| Color | `#999999` (normal, 0–799 chars) / `#EF4444` (at or over 800-char warning threshold, and at/over 1000-char limit) |
| Position | Bottom-right of message editor area, `text-align: right` |
| Format | `{current}/{max}` e.g. `"0/1000"` |

> **Note**: Counter is hidden until the user starts typing, OR always visible — `TODO(confirm visibility behavior)`. Max for message is 1000 chars (per spec.md data requirements). Counter turns red at ≥ 800 chars (warning threshold). Submit blocked at > 1000 chars.

**Character counter (below title input)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 400 12px |
| Color | `#999999` (normal, 0–79 chars) / `#EF4444` (at or over 80-char warning threshold, and at/over 100-char limit) |
| Position | Bottom-right of title input area, `text-align: right` |
| Format | `{current}/{max}` e.g. `"0/100"` |
| Visibility | Shown when > 80 chars used (per spec.md: "Character counter shown when > 80 chars used") |

**Rich text toolbar (above message editor, anchored to top of F.D)**:
| Property | Value |
|----------|-------|
| Height | `40px` |
| Background | `#F5F5F5` (light grey) |
| Border-bottom | `1px solid #998C5F` |
| Display | flex, row, gap 8px, align-items center, padding 0 8px |

Toolbar action buttons (Bold, Italic, Underline — minimum set):
| Property | Value |
|----------|-------|
| Size | `24×24px` |
| Icon color | `#00101A` |
| Active state | `rgba(255, 234, 158, 0.3)` background |
| Hover state | `rgba(255, 234, 158, 0.15)` background |

> **Implementation note**: Use Tiptap (preferred) or Quill. Sanitize output with DOMPurify before submission. Toolbar shows Bold / Italic / Underline at minimum; additional formatting as needed.

**Hashtag chips row (Node: `I520:11647;520:9890` — 672×48px)**:
| Property | Value |
|----------|-------|
| Display | flex, row, gap 16px, flex-wrap |
| Chip height | `48px` |
| Chip border radius | `24px` (pill shape) |
| Chip padding | `TODO(value needed)` |
| Chip font | Montserrat `TODO(weight needed)` `TODO(size needed)` |

**Hashtag chip states**:
| State | Background | Border | Text color |
|-------|-----------|--------|-----------|
| Default (unselected) | `TODO(value needed)` | `1px solid #998C5F` | `#00101A` |
| Selected | `#FFEA9E` | `1px solid #998C5F` | `#00101A` |
| Disabled (max reached) | `TODO(value needed)` | `1px solid #999999` | `#999999` |
| Hover (unselected) | `rgba(255, 234, 158, 0.15)` | `1px solid #998C5F` | `#00101A` |

> `TODO(confirm chip default background and disabled state colors from Figma)`.

**Image upload (Node: `I520:11647;520:9896` — 672×80px)**:
| Property | Value |
|----------|-------|
| Display | flex, row, gap 16px |
| Border | `1px solid #998C5F` (dashed) |
| Border radius | `8px` |
| Background | `#FFFFFF` |
| Padding | `TODO(value needed)` |
| Label text | `TODO(confirm upload label text from Figma, e.g., "Tap to upload image" or icon only)` |
| Accepted formats shown | JPG, PNG, GIF, WebP — max 5MB |
| Progress indicator | Linear progress bar or percentage text while uploading |
| Preview state | Shows thumbnail image with an "×" remove button overlay |

---

### F.G — Anonymous Toggle (Node: `I520:11647;520:14099`)

| Property | Value |
|----------|-------|
| Width | 672px |
| Height | 28px |
| Display | flex, row, gap 16px, align-items center |

**Checkbox (Node: `I520:11647;520:14099;520:14097`)**:

| State | Property | Value |
|-------|----------|-------|
| Unchecked | Border | `1px solid #999999` |
| Unchecked | Background | `#FFFFFF` |
| Unchecked | Border radius | `4px` |
| Unchecked | Checkmark | Hidden |
| Checked | Border | `1px solid #998C5F` |
| Checked | Background | `#FFEA9E` (gold, consistent with accent) |
| Checked | Checkmark color | `#00101A` (dark) |
| Checked | Border radius | `4px` |
| Focus | Outline | `2px solid #FFEA9E`, `outline-offset: 2px` |

> **Note**: Checked state colors are derived from the design's gold accent system. `TODO(confirm checked background and checkmark color from Figma)`.

**Label text (Node: `I520:11647;520:14099;520:14095`)**:
| State | Property | Value |
|-------|----------|-------|
| Unchecked | Font | Montserrat 700 22px |
| Unchecked | Color | `#999999` |
| Checked | Color | `#00101A` |
| Both | Text | "Gui loi cam on va ghi nhan an danh" |

---

### F.H — Action Buttons (Node: `I520:11647;520:9905`)

| Property | Value |
|----------|-------|
| Width | 672px |
| Height | 60px |
| Display | flex, row, gap 24px |

**H.1 Cancel button (Node: `I520:11647;520:9906`)**:
| Property | Value |
|----------|-------|
| Border | `1px solid #998C5F` |
| Padding | `16px 40px` |
| Background | `rgba(255, 234, 158, 0.1)` |
| Color | `#00101A` (dark text; modal is cream bg — do not use white) |
| Border radius | `8px` |
| Font | Montserrat 700, `TODO(size needed)` |

**H.2 Submit button (Node: `I520:11647;520:9907`)**:
| Property | Value |
|----------|-------|
| Width | 502px |
| Height | 60px |
| Background | `rgba(255, 234, 158, 1)` = `#FFEA9E` |
| Border radius | `8px` |
| Padding | `16px` |
| Font | Montserrat 700 |
| Color | `#00101A` (dark text on gold) |

---

## Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  [Overlay — rgba(0,16,26,0.8) — full page]                  │
│                                                              │
│  ┌──────────────────────────────────────┐  752px × 1012px  │
│  │  Modal bg: #FFF8E1, radius 24px      │                  │
│  │  padding: 40px, gap: 32px            │                  │
│  │                                      │                  │
│  │  [F.A] Title — 32px 700 dark        │  672px × 80px    │
│  │                                      │                  │
│  │  [F.B] Recipient                     │  672px × 56px    │
│  │    [Label] [Search Input]            │                  │
│  │                                      │                  │
│  │  [F.C] Kudos Title                  │  672px × 104px   │
│  │    [Label] [Input]                   │                  │
│  │    [placeholder example]             │                  │
│  │                                      │                  │
│  │  [F.D] Content — 672×444px          │                  │
│  │    [Message textarea — 672×268px]   │                  │
│  │    [Hashtag chips row — 672×48px]   │                  │
│  │    [Image upload — 672×80px]        │                  │
│  │                                      │                  │
│  │  [F.G] Anonymous toggle             │  672px × 28px    │
│  │    [□] Gui an danh label            │                  │
│  │                                      │                  │
│  │  [F.H] Actions — 672×60px          │                  │
│  │    [Huy — secondary]  [Gui — gold] │                  │
│  └──────────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────┘
```

---

## Interactive States

### Submit Button

| State | Visual |
|-------|--------|
| Default (valid) | `#FFEA9E` background, dark text |
| Default (invalid) | `opacity: 0.5`, `cursor: not-allowed` |
| Loading | Disabled + spinner icon |
| Hover | `opacity: 0.9` |

### Cancel Button

| State | Visual |
|-------|--------|
| Default | `rgba(255,234,158,0.1)` bg + `1px solid #998C5F` border, text `#00101A` |
| Hover | `rgba(255,234,158,0.2)` bg + `1px solid #998C5F` border (slightly brighter bg) |
| Focus | `outline: 2px solid #FFEA9E`, `outline-offset: 2px` |
| Loading (disabled) | `opacity: 0.5`, `cursor: not-allowed` |

### Input Fields (Recipient search, Title input, Message editor)

| State | Visual |
|-------|--------|
| Default | `1px solid #998C5F`, white bg, text `#00101A` |
| Focus | `outline: 2px solid #FFEA9E`, `outline-offset: 2px`, border unchanged |
| Error | `border: 1px solid #EF4444` (red border replaces default) + error message in `#EF4444` below field |
| Filled | Same as default |
| Disabled | `opacity: 0.5`, `cursor: not-allowed`, `background: #F5F5F5` |

**Inline error message style** (below each field on validation failure):
| Property | Value |
|----------|-------|
| Font | Montserrat 400 12px |
| Color | `#EF4444` |
| Margin-top | `4px` |
| Role | `aria-live="polite"` or linked via `aria-describedby` |

### Anonymous Checkbox

| State | Visual |
|-------|--------|
| Unchecked | `1px solid #999999` border, white bg, label `#999999` |
| Checked | `1px solid #998C5F` border, `#FFEA9E` bg, dark checkmark, label `#00101A` |
| Focus | `outline: 2px solid #FFEA9E`, `outline-offset: 2px` |
| Hover | `border-color: #998C5F` |

---

## Responsive Specifications

| Breakpoint | Modal width | Layout |
|------------|-------------|--------|
| Desktop ≥ 1280px | 752px | Full modal centered |
| Tablet 768–1279px | 90vw | Same layout, narrower |
| Mobile 320–767px | 100vw, full screen | Full-screen sheet from bottom |

On mobile:
- Modal becomes a bottom sheet (slides up from bottom)
- `max-height: 95vh`, `overflow-y: scroll`
- Border radius only on top corners (24px top-left, top-right, 0 bottom)

---

## Animation

| Event | Animation | Duration |
|-------|-----------|----------|
| Modal open | Fade in + slide up | 250ms ease-out |
| Modal close | Fade out + slide down | 200ms ease-in |
| Overlay | Fade in/out | 200ms |
| Reduced motion | Fade only (no slide) | 200ms |

---

## Implementation Mapping

> **CSS Variable Rule (Constitution Principle II)**: All Tailwind color classes MUST use CSS variable references (`bg-[var(--token)]`), never raw hex values. Raw hex values are shown in comments below for clarity only — the actual code MUST use the token.

| Figma Node | Component | CSS / Tailwind (use `var(--token)` — never raw hex) |
|------------|-----------|----------------|
| `520:11646` | `<ModalOverlay />` | `fixed inset-0 bg-[var(--color-overlay)] z-10` |
| `520:11647` | `<WriteKudosModal />` | `w-[752px] rounded-[var(--border-modal)] bg-[var(--color-modal-bg)] p-[var(--modal-padding)] flex flex-col gap-[var(--modal-gap)] z-20` |
| `I520:11647;520:9870` | `<h2 id="modal-title">` | `font-montserrat font-bold text-[var(--text-modal-title-size)] text-[var(--color-modal-text-dark)]` |
| `I520:11647;520:9873` | `<RecipientSearch />` | `border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-6 py-4 rounded-[var(--border-input-radius)]` |
| `I520:11647;1688:10437` | `<TitleInput />` | `border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-6 py-4 rounded-[var(--border-input-radius)]` |
| `I520:11647;520:9875` | `<MessageEditor />` | Rich text editor; `border border-[var(--color-input-border)] bg-[var(--color-input-bg)] px-6 py-4 rounded-[var(--border-input-radius)] h-[268px]` |
| `I520:11647;520:9890` | `<HashtagChips />` | `flex flex-wrap gap-4 h-[48px]` |
| `I520:11647;520:9896` | `<ImageUpload />` | `flex gap-4 h-[80px] border border-dashed border-[var(--color-input-border)]` |
| `I520:11647;520:14097` | `<input type="checkbox" />` | `w-6 h-6 border border-[var(--color-checkbox-border)] rounded bg-[var(--color-checkbox-bg)]` |
| `I520:11647;520:9906` | `<Button variant="cancel" />` | `border border-[var(--color-btn-secondary-border)] bg-[var(--color-btn-secondary-bg)] px-[var(--btn-cancel-padding)] rounded-[var(--border-btn-submit)] text-[var(--color-modal-text-dark)]` |
| `I520:11647;520:9907` | `<Button variant="primary" />` | `w-[502px] h-[60px] bg-[var(--color-accent-gold)] text-[var(--color-modal-text-dark)] font-bold rounded-[var(--border-btn-submit)]` |

---

## Design Notes

- **CSS variable mapping (Constitution Principle II)**: All hex values in this document MUST be declared as CSS variables in `app/globals.css`. Component files MUST reference `var(--token-name)` — never raw hex values. Example: `--color-modal-bg: #FFF8E1` → use `bg-[var(--color-modal-bg)]` in Tailwind.

- **Modal bg is cream (#FFF8E1)**: Different from the site's dark theme — the modal is a light overlay on a dark page. All text inside the modal must be dark-colored (not white).
- **Submit button text**: Likely "Gui" (VN) / "Send" (EN). The gold button (H.2) is significantly wider (502px) than the cancel button, emphasizing it as the primary action.
- **Anonymous label color**: The label uses `#999999` for the unchecked state and darkens to `#00101A` when checked (see F.G interactive states table). `TODO(confirm checked label and checkbox background colors from Figma)`.
- **Submit button font size**: Button font size is not confirmed in Figma; `TODO(confirm --text-btn-size from Figma)`. Use Montserrat 700 at the confirmed size.
- **Scroll behavior on tall content**: If the form content exceeds `1012px` (e.g., when hashtag chips wrap to multiple rows), the modal MUST scroll internally (`overflow-y: auto`) rather than expand beyond viewport height.
- **Rich text editor**: Use a library like Tiptap or Quill that matches the design's textarea appearance. Ensure XSS sanitization server-side.
- **Recipient search**: Debounce the search input (300ms) to avoid flooding the API.
