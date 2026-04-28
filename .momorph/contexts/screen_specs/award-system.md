# Screen: Award System (Hệ thống giải)

## Screen Info

| Property | Value |
|----------|-------|
| **Figma Frame ID** | `zFYDgyj_pD` |
| **Figma Link** | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD |
| **Screen Group** | Main Application |
| **Route** | `/awards` |
| **Status** | analyzed |
| **Discovered At** | 2026-04-29 |
| **Last Updated** | 2026-04-29 |
| **Auth Required** | No (public) |

---

## Description

Read-only page listing all SSA 2025 award categories. Left nav (6 items) lets users switch between award panels. Each panel shows award image, criteria description, recipient count, and prize amount. Footer of the page includes a Sun* Kudos promo block.

---

## Navigation Analysis

### Incoming Navigations (From)

| Source Screen | Trigger | Condition |
|---|---|---|
| Homepage SAA (`/`) | Header "Award Information" nav | Click |
| Homepage SAA (`/`) | Award section CTA button | Click |
| Sun* Kudos (`/kudos`) | Header "Award Information" nav | Click |

### Outgoing Navigations (To)

| Target Screen | Trigger Element | Node ID | Confidence | Notes |
|---|---|---|---|---|
| Homepage (`/`) | Header "About SAA 2025" button | `I313:8440;186:1579` | High | Header nav button 1 |
| Sun* Kudos (`/kudos`) | Header "Sun* Kudos" button | `I313:8440;186:1593` | High | Header nav button 3 |
| Sun* Kudos (`/kudos`) | D2.1 "Chi tiết" button | `I335:12023;313:8426` | High | Kudos promo CTA |
| Self (hash change) | Left nav items C.1–C.6 | `313:8460`–`313:8465` | High | `router.replace()` `/awards#{slug}` |

### Navigation Rules
- **Back behavior**: Browser back → previous page in history
- **Deep link support**: Yes — `/awards#top-talent`, `/awards#top-project`, `/awards#top-project-leader`, `/awards#best-manager`, `/awards#signature-2025`, `/awards#mvp`
- **Auth required**: No
- **Default hash**: If missing or invalid → fallback to `#top-talent`

---

## Component Schema

### Layout Structure

```
┌────────────────────────────────── 1440px ──────────────────────────────┐
│  Header (313:8440) — fixed 80px, rgba(16,20,23,0.8)                    │
│  [Logo] [About SAA] [Award Info*] [Sun*Kudos] [VN ▾] [🔔] [👤]        │
├────────────────────────────────────────────────────────────────────────┤
│  Keyvisual (313:8437) — 1440×547px + gradient overlay                  │
├────────────────────────────────────────────────────────────────────────┤
│  padding: 96px 144px                                                   │
│  ┌── Section Title (313:8453) ──────────────────────────────────────┐  │
│  │  "Sun* Annual Awards 2025" (24px)                                │  │
│  │  ─────────── [divider] ───────────────────────────────────────   │  │
│  │  "Hệ thống giải thưởng SAA 2025" (large heading)                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌── Left Nav (313:8459) ──┐  ┌── Detail Panel (313:8466) ─────────┐  │
│  │  178px, flex col         │  │  853px, flex col gap-80px          │  │
│  │  C.1 Top Talent [active] │  │  D.1–D.6 award category panels    │  │
│  │  C.2 Top Project         │  │  (shown/hidden per active nav)     │  │
│  │  C.3 Top Project Leader  │  │                                    │  │
│  │  C.4 Best Manager        │  │  Each panel:                       │  │
│  │  C.5 Signature 2025      │  │  [Image 336×336] [Content block]  │  │
│  │  C.6 MVP                 │  │  Title · Description · Count · $$  │  │
│  └──────────────────────────┘  └────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│  D1_Sunkudos (335:12023) — 1152×500px, bg #0F0F0F + image             │
│  "Phong trào ghi nhận" | "Sun* Kudos" (57px gold) | description        │
│  [Chi tiết →] (gold primary button)                                    │
├────────────────────────────────────────────────────────────────────────┤
│  Footer (354:4323) — shared, 4 nav links + copyright                   │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
Screen (zFYDgyj_pD)
├── Header (313:8440) — INSTANCE, Organism
│   ├── LOGO (I313:8440;178:1033) — Atom
│   ├── NavGroup (I313:8440;186:2166) — Molecule
│   │   ├── Button-IC "About SAA 2025" (I313:8440;186:1579) — Atom
│   │   ├── Button-IC "Award Information" [active] (I313:8440;186:1587) — Atom
│   │   └── Button-IC "Sun* Kudos" (I313:8440;186:1593) — Atom
│   ├── Language dropdown (I313:8440;186:1696) — Molecule
│   ├── Notification bell (I313:8440;186:2101) — Atom
│   └── User profile button (I313:8440;186:1597) — Atom
├── Keyvisual (313:8437) — GROUP, background image
├── Bìa (313:8449) — FRAME
│   ├── KV (313:8450) — Logo overlay on keyvisual
│   └── Section Title (313:8453) — Organism
│       ├── "Sun* Annual Awards 2025" (313:8454) — TEXT
│       ├── Divider (313:8455) — RECTANGLE
│       └── "Hệ thống giải thưởng SAA 2025" (313:8457) — TEXT
├── B_Hệ thống giải thưởng (313:8458) — FRAME, Organism
│   ├── C_Menu list (313:8459) — FRAME, tablist nav
│   │   ├── C.1 Top Talent (313:8460) — INSTANCE, tab
│   │   ├── C.2 Top Project (313:8461) — INSTANCE, tab
│   │   ├── C.3 Top Project Leader (313:8462) — INSTANCE, tab
│   │   ├── C.4 Best Manager (313:8463) — INSTANCE, tab
│   │   ├── C.5 Signature 2025 (313:8464) — INSTANCE, tab
│   │   └── C.6 MVP (313:8465) — INSTANCE, tab
│   └── D.Danh sách giải thưởng (313:8466) — FRAME, tabpanel container
│       ├── D.1 Top Talent (313:8467) — INSTANCE
│       ├── D.2 Top Project (313:8468) — INSTANCE
│       ├── D.3 Top Project Leader (313:8469) — INSTANCE
│       ├── D.4 Best Manager (313:8470) — INSTANCE
│       ├── D.5 Signature 2025 (313:8471) — FRAME (2 prize tiers)
│       └── D.6 MVP (313:8510) — INSTANCE
├── D1_Sunkudos (335:12023) — INSTANCE, Organism
│   ├── Rectangle 12 bg (I335:12023;313:8416) — RECTANGLE
│   ├── D2_Content (I335:12023;313:8419) — FRAME
│   │   ├── "Phong trào ghi nhận" (I335:12023;313:8421) — TEXT
│   │   ├── "Sun* Kudos" (I335:12023;313:8422) — TEXT (57px gold)
│   │   └── Description (I335:12023;313:8423) — TEXT
│   └── D2.1 Button "Chi tiết" (I335:12023;313:8426) — INSTANCE, CTA
└── Footer (354:4323) — INSTANCE, Organism
    ├── LOGO (I354:4323;342:1408)
    ├── Nav links ×4 (342:1410–1412, 1161:9487)
    └── Copyright text "Bản quyền thuộc về Sun* © 2025"
```

### Main Components

| Component | Type | Node ID | Description | Reusable |
|---|---|---|---|---|
| Header | Organism (Instance) | `313:8440` | Fixed top nav with active "Award Information" state | Yes |
| AwardNavMenu | Organism | `313:8459` | Vertical tablist — 6 category items | No |
| AwardNavItem | Molecule (Instance) | `313:8460`–`313:8465` | Single tab item with icon + label | Yes |
| AwardDetailPanel | Organism | `313:8466` | Container for all 6 award panels | No |
| AwardCategorySection | Molecule (Instance/Frame) | `313:8467`–`313:8510` | Single award card: image + content | Yes |
| AwardImage | Atom (Instance) | `I313:8467;214:2525` | 336×336 award icon, mix-blend screen | Yes |
| AwardContent | Molecule (Frame) | `I313:8467;214:2526` | Title + desc + count + prize | Yes |
| KudosPromoBlock | Organism (Instance) | `335:12023` | Sun* Kudos promo with CTA | Yes |
| Footer | Organism (Instance) | `354:4323` | Shared footer | Yes |

---

## Form Fields

N/A — read-only display screen, no user input forms.

---

## API Mapping

### On Screen Load

| API | Method | Purpose | Response Usage |
|---|---|---|---|
| Static data (`data/awards.ts`) | — | Load all 6 award categories | Populate left nav + detail panels |
| `GET /api/awards` *(predicted, if dynamic)* | GET | Load award categories from CMS | Populate all award panels |

### On User Action

| Action | API | Method | Notes |
|---|---|---|---|
| Click left nav item | — | — | Client-side tab switch + `router.replace()` hash update |
| Click "Chi tiết" (Kudos CTA) | — | — | Navigate to `/kudos` |
| Click header nav | — | — | Navigate to target route |

### Error Handling

| Error | Message | UI Action |
|---|---|---|
| Award data fetch fails | "Không thể tải thông tin giải thưởng" | Error state in detail panel + Retry button |
| Loading | — | Skeleton placeholder in detail panel |

---

## State Management

### Local State

| State | Type | Initial | Purpose |
|---|---|---|---|
| `activeSlug` | `string` | `"top-talent"` | Currently selected nav category |
| `isLoading` | `boolean` | `false` | Award data loading (SSR: not needed) |
| `error` | `string \| null` | `null` | Error message from data fetch |
| `focusedIndex` | `number` | `0` | Keyboard focus position in nav |

### Global State

None — this page has no global state needs; award data is static/read-only.

---

## UI States

### Loading State
- Left nav items: rendered and clickable
- Detail panel: shows `PanelSkeleton` (animated pulse placeholders)
- `aria-busy="true"` on panel container

### Error State
- Detail panel shows error message + "Thử lại" (Retry) button
- Left nav remains interactive

### Success/Default State
- First category (Top Talent) active by default
- Detail panel shows selected category's full content

### Empty State
- Not applicable (static data always present)

---

## Accessibility

| Requirement | Implementation |
|---|---|
| Tab list pattern | `role="tablist"` on `C_Menu list`; each item `role="tab"` + `aria-selected` + `aria-controls="{panel-id}"` |
| Tab panel | Detail panel `role="tabpanel"` + `aria-labelledby="{tab-id}"` |
| Keyboard nav | ArrowUp/Down between nav items; Enter selects; Home/End jump to first/last |
| Focus management | On Enter: focus moves to panel heading `h2` via `ref.current.focus()` |
| Screen reader | Keyvisual `alt=""` (decorative); award images `alt="{category name}"` |
| WCAG AA | All text on dark background passes ≥ 4.5:1 contrast |
| Touch targets | Nav items 56px height — satisfies ≥ 44px requirement |
| Reduced motion | Panel fade animation disabled via `prefers-reduced-motion` media query |

---

## Responsive Behavior

| Breakpoint | Layout Changes |
|---|---|
| Desktop ≥ 1280px | 2-column: 178px left nav + 853px detail panel |
| Tablet 768–1279px | Left nav → horizontal scrollable tab row; 1-column content |
| Mobile 320–767px | Left nav → horizontal scrollable tabs (no dropdown); 1-column; touch targets ≥ 44px |

---

## Analytics Events

| Event | Trigger | Properties |
|---|---|---|
| `page_view` | On mount | `{screen: "awards"}` |
| `award_category_view` | Nav item click | `{category: slug}` |
| `kudos_cta_click` | "Chi tiết" button | `{source: "awards_page"}` |

---

## Design Tokens (Screen-specific)

See full token reference: `.momorph/specs/zFYDgyj_pD-he-thong-giai/design-style.md`

| Token | Value | Usage |
|---|---|---|
| `--color-bg-base` | `#00101A` | Page background |
| `--color-accent-gold` | `#FFEA9E` | Active nav, prize labels, Kudos title |
| `--color-divider` | `rgba(46,57,64,1)` | Section dividers |
| `--text-kudos-title-size` | `57px` | Sun* Kudos title |

---

## Implementation Notes

### Key Files
- `app/awards/page.tsx` — server component page
- `components/awards/AwardNavMenu.tsx` — tablist nav
- `components/awards/AwardNavItem.tsx` — individual tab
- `components/awards/AwardDetailPanel.tsx` — tabpanel container
- `components/awards/AwardCategorySection.tsx` — award card
- `components/awards/AwardKeyvisual.tsx` — keyvisual with gradient
- `data/awards.ts` — static award data
- `types/awards.ts` — TypeScript types

### Special Considerations
- D.5 Signature 2025 has **two prize tiers** (individual 5M + team 8M) — uses `"Hoặc"` separator between them; all other categories have one prize tier
- Footer has **4 nav links** (not 3): confirmed from node tree — nodes `342:1410`, `342:1411`, `342:1412`, `1161:9487`
- Left nav uses WAI-ARIA tabs pattern (automatic activation on click, manual on Arrow key)
- URL hash update uses `router.replace()` — no history entry per click

---

## Analysis Metadata

| Property | Value |
|---|---|
| Analyzed By | momorph.screenflow |
| Analysis Date | 2026-04-29 |
| Needs Deep Analysis | No — full spec at `.momorph/specs/zFYDgyj_pD-he-thong-giai/spec.md` |
| Confidence Score | High |

### Next Steps
- [x] Full spec at `spec.md`
- [x] Full design tokens at `design-style.md`
- [x] Implementation complete (components exist in `components/awards/`)
- [ ] E2E tests pending
