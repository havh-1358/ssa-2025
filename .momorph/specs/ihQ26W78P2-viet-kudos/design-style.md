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
| `--color-accent-gold` | `#FFEA9E` | Primary submit button |
| `--color-btn-secondary-bg` | `rgba(255, 234, 158, 0.1)` | Cancel button background |
| `--color-btn-secondary-border` | `#998C5F` | Cancel button border |
| `--color-checkbox-border` | `#999999` | Anonymous checkbox border |
| `--color-checkbox-bg` | `#FFFFFF` | Checkbox background |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-body` | `"Montserrat", sans-serif` | All modal text |
| `--text-modal-title-size` | `32px` | Modal heading |
| `--text-modal-title-weight` | `700` | Modal heading weight |
| `--text-modal-title-color` | `#00101A` | Modal heading on cream bg |
| `--text-input-size` | `16px` | Input/textarea text |
| `--text-placeholder-size` | `16px` | Placeholder text |
| `--text-placeholder-color` | `#999999` | Placeholder color |
| `--text-anon-size` | `22px` | "Gui an danh" label size |
| `--text-anon-weight` | `700` | "Gui an danh" label weight |
| `--text-label-size` | `14px` | Field labels (Title, Recipient labels) |
| `--text-label-weight` | `700` | Field label weight |

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
| `--border-input-radius` | `8px` | Input border radius (assumed) |
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
| Height | 268px |
| Border | `1px solid #998C5F` |
| Background | `#FFFFFF` |
| Padding | `16px 24px` |

**Hashtag chips row (Node: `I520:11647;520:9890` — 672×48px)**:
| Property | Value |
|----------|-------|
| Display | flex, row, gap 16px, flex-wrap |
| Chip height | `48px` |
| Chip border radius | `24px` (pill shape) |

**Image upload (Node: `I520:11647;520:9896` — 672×80px)**:
| Property | Value |
|----------|-------|
| Display | flex, row, gap 16px |
| Border | `1px solid #998C5F` (dashed) |

---

### F.G — Anonymous Toggle (Node: `I520:11647;520:14099`)

| Property | Value |
|----------|-------|
| Width | 672px |
| Height | 28px |
| Display | flex, row, gap 16px, align-items center |

**Checkbox (Node: `I520:11647;520:14099;520:14097`)**:
| Property | Value |
|----------|-------|
| Width | 24px |
| Height | 24px |
| Border | `1px solid #999999` |
| Background | `#FFFFFF` |
| Border radius | `4px` |

**Label text (Node: `I520:11647;520:14099;520:14095`)**:
| Property | Value |
|----------|-------|
| Font | Montserrat 700 22px |
| Color | `#999999` (placeholder-like style, becomes dark when checked) |
| Text | "Gui loi cam on va ghi nhan an danh" |

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
| Color | `#00101A` or white |
| Border radius | `8px` |

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
| Default | `rgba(255,234,158,0.1)` bg + `#998C5F` border |
| Loading (disabled) | `opacity: 0.5`, `cursor: not-allowed` |
| Hover | border color brightens |

### Input Fields

| State | Visual |
|-------|--------|
| Default | `1px solid #998C5F`, white bg |
| Focus | `outline: 2px solid #FFEA9E`, `outline-offset: 2px` |
| Error | `border-color: #EF4444` (red) + error message below |
| Filled | Same as default |

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

| Figma Node | Component | CSS / Tailwind |
|------------|-----------|----------------|
| `520:11646` | `<ModalOverlay />` | `fixed inset-0 bg-[rgba(0,16,26,0.8)] z-10` |
| `520:11647` | `<WriteKudosModal />` | `w-[752px] rounded-[24px] bg-[#FFF8E1] p-10 flex flex-col gap-8 z-20` |
| `I520:11647;520:9870` | `<h2 id="modal-title">` | `font-montserrat font-bold text-[32px] text-[#00101A]` |
| `I520:11647;520:9873` | `<RecipientSearch />` | `border border-[#998C5F] bg-white px-6 py-4 rounded-lg` |
| `I520:11647;1688:10437` | `<TitleInput />` | `border border-[#998C5F] bg-white px-6 py-4 rounded-lg` |
| `I520:11647;520:9875` | `<MessageEditor />` | Rich text editor; `border border-[#998C5F] bg-white px-6 py-4 rounded-lg h-[268px]` |
| `I520:11647;520:9890` | `<HashtagChips />` | `flex flex-wrap gap-4 h-[48px]` |
| `I520:11647;520:9896` | `<ImageUpload />` | `flex gap-4 h-[80px] border border-dashed border-[#998C5F]` |
| `I520:11647;520:14097` | `<input type="checkbox" />` | `w-6 h-6 border border-[#999] rounded` |
| `I520:11647;520:9906` | `<Button variant="cancel" />` | `border border-[#998C5F] bg-[rgba(255,234,158,0.1)] px-10 py-4 rounded-lg` |
| `I520:11647;520:9907` | `<Button variant="primary" />` | `w-[502px] h-[60px] bg-[#FFEA9E] text-[#00101A] font-bold rounded-lg` |

---

## Design Notes

- **CSS variable mapping (Constitution Principle II)**: All hex values in this document MUST be declared as CSS variables in `app/globals.css`. Component files MUST reference `var(--token-name)` — never raw hex values. Example: `--color-modal-bg: #FFF8E1` → use `bg-[var(--color-modal-bg)]` in Tailwind.

- **Modal bg is cream (#FFF8E1)**: Different from the site's dark theme — the modal is a light overlay on a dark page. All text inside the modal must be dark-colored (not white).
- **Submit button text**: Likely "Gui" (VN) / "Send" (EN). The gold button (H.2) is significantly wider (502px) than the cancel button, emphasizing it as the primary action.
- **Anonymous label color**: The label uses `#999999` in the design — this looks like placeholder styling. In implementation, use this color for the unchecked state; when checked, the label may darken to `#00101A`.
- **Rich text editor**: Use a library like Tiptap or Quill that matches the design's textarea appearance. Ensure XSS sanitization server-side.
- **Recipient search**: Debounce the search input (300ms) to avoid flooding the API.
