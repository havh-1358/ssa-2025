# Implementation Plan: Homepage SAA

**Frame**: `i87tDx10uM-homepage-saa`
**Date**: 2026-04-28
**Spec**: `specs/i87tDx10uM-homepage-saa/spec.md`

---

## Already Implemented (this session — 2026-04-28)

The following items from Phase 3 and Phase 6 were completed before tasks breakdown:

| File | Status | Notes |
|------|--------|-------|
| `components/shared/UserProfileButton.tsx` | ✅ DONE | Person-icon button, `aria-haspopup="menu"`, closes on outside click |
| `components/shared/ProfileDropdown.tsx` | ✅ DONE | Profile → `/dashboard`, Logout → `supabase.auth.signOut()` + HOME redirect; `userMenu.*` i18n |
| `components/shared/Header.tsx` | ✅ DONE | Added `user?: { email: string } \| null` prop; renders `<UserProfileButton>` when authenticated |
| `app/page.tsx` | ✅ DONE | Fetches Supabase session server-side; passes `user` to `<HomePage>` |
| `app/awards/page.tsx` | ✅ DONE | Fetches Supabase session server-side; passes `user` to `<AwardsPage>` |
| `app/kudos/page.tsx` | ✅ DONE | Passes `userEmail` to `<KudosPage>` |
| `components/homepage/HomePage.tsx` | ✅ PARTIAL | Added `user` prop and passes to Header; still needs `<RootFurtherSection />` + `<FloatingWidget />` |
| `components/awards/AwardsPage.tsx` | ✅ PARTIAL | Added `user` prop and passes to Header; card design unchanged |
| `components/kudos/KudosPage.tsx` | ✅ PARTIAL | Added `userEmail` prop and passes to Header |
| `app/globals.css` | ✅ PARTIAL | Added `--color-btn-secondary-hover`, `--color-profile-dropdown-bg`, `--color-profile-dropdown-border` |

---

## Summary

Refactor and complete the Homepage SAA to match the final Figma design. Most infrastructure already exists (`HomePage`, `HeroSection`, `AwardSummarySection`, `KudosPromoSection`, `CTAButtons`, `Header`), but several components are incorrect or missing:

- `CTAButtons` navigates with scroll instead of `router.push('/awards')`, uses wrong font size (16px → 22px), and has hardcoded `rgba` hover/active states
- `HeroSection` uses a plain `t("tagline")` paragraph where the design has a structured **EventInfoBlock** (time/venue/livestream)
- `HomePage` is missing the **Root Further Theme** section (RF) between hero and awards, and the **Floating Widget** (F)
- `AwardSummarySection` is missing the C1 section header (supertitle + divider + 57px gold title)
- `AwardCategoryCard` needs a full redesign — wrong dimensions, missing award image, uses hardcoded descriptions instead of i18n
- `KudosPromoSection` needs a full redesign to match D1/D2/D2.1 spec (dark `#0F0F0F` bg, two-column layout)
- `Footer` uses wrong i18n namespace (`auth` → `footer`) and is missing all 4 nav links (E.2)
- `Header` still needs **NotificationBell** (A.4)
- Award card images need to be copied from `.momorph/specs/assets/` to `public/assets/awards/`
- RF logo assets and D2 illustration/logo need Figma download

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 App Router
**Primary Dependencies**: React, TailwindCSS, next-intl, @supabase/ssr, next/image
**Database**: Supabase (PostgreSQL) — read-only for this page
**Testing**: Vitest (unit), Playwright (e2e)
**State Management**: React local state + Supabase Auth global session (server-side fetch)
**API Style**: Next.js Server Components + static data (`data/awards.ts`)

---

## Constitution Compliance Check

| Requirement | Constitution Rule | Status |
|-------------|-------------------|--------|
| TypeScript strict mode, no `any` | Principle I | ✅ Existing code is strict |
| CSS variables only (no hardcoded hex) | Principle II | ⚠️ Multiple violations — see below |
| Immutable data patterns | Principle I | ✅ Compliant |
| i18n for all strings | Principle II | ⚠️ Multiple violations — see below |
| WCAG 2.1 AA accessibility | Principle II | 📋 Planned for new components |
| Test-first (TDD) | Principle III | 📋 Unit tests planned |
| Clean function / file size ≤ 400 lines | Principle IV | 📋 Enforce in new files |
| OWASP security | Principle VI | ✅ Read-only page, Supabase Auth used correctly |

**Violations to fix:**

| Violation | File | Fix |
|-----------|------|-----|
| Hardcoded `rgba(255,234,158,0.2)` in hover | `CTAButtons.tsx:36` | Use `hover:bg-[var(--color-btn-secondary-hover)]` |
| Hardcoded `rgba(255,234,158,0.15)` in active | `CTAButtons.tsx:38` | Use `active:bg-[var(--color-btn-secondary-active)]` |
| Hardcoded Vietnamese string | `KudosPromoSection.tsx:27` | Replace with `t("kudosPromoBody")` |
| Wrong i18n namespace `"auth"` | `Footer.tsx:6` | Change to `useTranslations("footer")` |
| Hardcoded `rgba(255,234,158,0.03/0.06)` | `AwardCategoryCard.tsx` | Add `--color-award-card-bg` + `--color-award-card-hover` CSS vars |
| `category.name` and `category.description` not from i18n | `AwardCategoryCard.tsx` | Use `t("categories.${slug}")` and `t("descriptions.${slug}")` |
| Font size `text-[16px]` hardcoded in button | `CTAButtons.tsx` | Use `text-[var(--text-btn-size)] leading-[var(--text-btn-line)]` |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — `components/homepage/` for page sections, `components/shared/` for cross-page elements
- **Styling Strategy**: Tailwind utilities + CSS variables; all colors via `var(--token)`, no raw hex in components
- **Data Fetching**: Static data (`data/awards.ts`); award images from `public/assets/awards/`; all text via `next-intl`
- **Auth propagation**: Server components read session → pass `isAuthenticated: boolean` as prop to client components (already implemented for Header → UserProfileButton)

### Integration Points

| Existing Component | Action |
|-------------------|--------|
| `<Header />` | Modify — add `<NotificationBell />` to right group (UserProfileButton ✅ DONE) |
| `<HeroSection />` | Modify — replace tagline div with `<EventInfoBlock />` |
| `<CTAButtons />` | Modify — fix navigation + font size + CSS vars |
| `<AwardSummarySection />` | Modify — add C1 header (supertitle + divider + 57px title); fix card grid layout |
| `<AwardCategoryCard />` | Full redesign — 336×504px card with award image, i18n name/description, CTA label |
| `<KudosPromoSection />` | Full redesign per D1/D2/D2.1 spec |
| `<HomePage />` | Modify — insert `<RootFurtherSection />` + `<FloatingWidget />` (user prop ✅ DONE) |
| `<Footer />` | Modify — fix namespace, add logo + 4 nav links, add `activeNav` prop |
| `<CountdownTimer />` | No change — `isLaunched` guard already fixed ✓ |

---

## Project Structure

### Documentation

```text
.momorph/specs/i87tDx10uM-homepage-saa/
├── spec.md           ✅ Ready
├── design-style.md   ✅ Ready
├── plan.md           ← This file
├── tasks.md          ← Next step
└── assets/           ✅ Award images + header.png
```

### New Files to Create

| File | Purpose | Status |
|------|---------|--------|
| `components/homepage/EventInfoBlock.tsx` | B.3 — structured event info (time/venue/livestream) | 📋 TODO |
| `components/homepage/RootFurtherSection.tsx` | RF — Root Further theme story section | 📋 TODO |
| `components/shared/FloatingWidget.tsx` | F — fixed floating Write Kudos + SAA Rules widget | 📋 TODO |
| `components/shared/NotificationBell.tsx` | A.4 — bell icon with badge dot (click action TBD) | 📋 TODO |
| `components/shared/UserProfileButton.tsx` | A.5 — profile icon button + dropdown trigger | ✅ DONE |
| `components/shared/ProfileDropdown.tsx` | A.5 dropdown — Profile link + Logout | ✅ DONE |
| `components/homepage/TheLeModal.tsx` | Thể lệ SAA rules modal (F widget SAA Rules) | 📋 TODO |
| `public/assets/awards/award-top-talent.png` | Award card image (copy from spec assets) | 📋 TODO |
| `public/assets/awards/award-top-project.png` | — | 📋 TODO |
| `public/assets/awards/award-top-project-leader.png` | — | 📋 TODO |
| `public/assets/awards/award-best-manager.png` | — | 📋 TODO |
| `public/assets/awards/award-signature-2025.png` | — | 📋 TODO |
| `public/assets/awards/award-mvp.png` | — | 📋 TODO |
| `public/assets/homepage/root-text.png` | RF.1 — `MM_MEDIA_Root Text` logo | 📋 TODO (Figma export needed) |
| `public/assets/homepage/further-text.png` | RF.1 — `MM_MEDIA_Further Text` logo | 📋 TODO (Figma export needed) |
| `public/assets/homepage/kudos-illustration.png` | D2 — 264×219px decorative illustration (Node `I3390:10349;313:8417`) | 📋 TODO (Figma export needed) |
| `public/assets/homepage/kudos-logo.png` | D2 — 364×72px "KUDOS" logo (Node `I3390:10349;329:2948`) | 📋 TODO (Figma export needed) |

### Modified Files

| File | Changes | Status |
|------|---------|--------|
| `components/homepage/CTAButtons.tsx` | Fix: `handleAboutSAA` scroll → `router.push(ROUTES.AWARDS)`; font `text-[var(--text-btn-size)]`; CSS vars for hover/active | 📋 TODO |
| `components/homepage/HeroSection.tsx` | Replace tagline + livestream div with `<EventInfoBlock />` | 📋 TODO |
| `components/homepage/HomePage.tsx` | Add `<RootFurtherSection />` + `<FloatingWidget isAuthenticated={!!user} />`; user prop ✅ DONE | 📋 TODO |
| `components/homepage/AwardSummarySection.tsx` | Add C1 header (supertitle + divider + 57px gold title); update grid layout to match Figma (col-gap 80px, card 336×504px) | 📋 TODO |
| `components/homepage/AwardCategoryCard.tsx` | Full redesign: 336×504px, award image 336×336px, i18n name/description, CTA "Chi tiết", `router.push(ROUTES.AWARDS)` on click | 📋 TODO |
| `components/homepage/KudosPromoSection.tsx` | Full redesign — D1/D2/D2.1 layout (`#0F0F0F` bg, two-column, gold CTA) | 📋 TODO |
| `components/shared/Header.tsx` | Add `<NotificationBell unreadCount={0} />`; user prop ✅ DONE | 📋 TODO |
| `components/shared/Footer.tsx` | Change namespace `"auth"` → `"footer"`; add logo + 4 nav links (E.2) + `activeNav` prop; copyright font Montserrat Alternates 700 | 📋 TODO |
| `data/awards.ts` | Add `imageSrc: "/assets/awards/award-{slug}.png"` per category | 📋 TODO |
| `types/awards.ts` | Add `imageSrc: string` to `AwardCategory` interface | 📋 TODO |
| `app/globals.css` | Add CSS vars (see Phase 1); profile dropdown vars ✅ DONE | 📋 TODO |
| `app/page.tsx` | Fetch Supabase session, pass `user` to `<HomePage>` | ✅ DONE |
| `app/awards/page.tsx` | Fetch Supabase session, pass `user` to `<AwardsPage>` | ✅ DONE |
| `app/kudos/page.tsx` | Pass `userEmail` to `<KudosPage>` | ✅ DONE |

---

## Implementation Strategy

### Phase 0: Asset Preparation

```bash
mkdir -p public/assets/awards
cp .momorph/specs/i87tDx10uM-homepage-saa/assets/award-*.png public/assets/awards/
```

Also download from Figma (use `mcp__momorph__get_media_files`):
- `MM_MEDIA_Root Text` → `public/assets/homepage/root-text.png`
- `MM_MEDIA_Further Text` → `public/assets/homepage/further-text.png`
- Node `I3390:10349;313:8417` (D2 illustration, 264×219px) → `public/assets/homepage/kudos-illustration.png`
- Node `I3390:10349;329:2948` (D2 Kudos logo, 364×72px) → `public/assets/homepage/kudos-logo.png`

Verify existing: `public/assets/homepage/saa-2025-logo.png` and `keyvisual.jpg` ✓

### Phase 1: Foundation — Types + Tokens

1. Add `imageSrc: string` to `AwardCategory` (`types/awards.ts`)
2. Update `data/awards.ts` with `imageSrc: "/assets/awards/award-{slug}.png"` for all 6 categories
3. Add CSS variables to `app/globals.css` (in Homepage SAA tokens section):
   ```css
   /* CTA button typography */
   --text-btn-size: 22px;
   --text-btn-line: 28px;
   /* Button states */
   --color-btn-secondary-active: rgba(255, 234, 158, 0.15);
   /* Kudos promo section */
   --color-kudos-promo-bg: #0f0f0f;
   /* Award card */
   --color-award-card-bg: rgba(255, 234, 158, 0.03);
   --color-award-card-hover: rgba(255, 234, 158, 0.06);
   ```
   (CSS vars already added this session: `--color-btn-secondary-hover`, `--color-profile-dropdown-bg`, `--color-profile-dropdown-border`)
4. Verify all i18n keys exist — all keys verified present in `vi.json` + `en.json` ✓

### Phase 2: Fix Existing Components [US1 + US2 — P1]

**CTAButtons.tsx** (4 changes):
- Remove `handleAboutSAA` scroll logic → `router.push(ROUTES.AWARDS)`
- Change `text-[16px] leading-6` → `text-[var(--text-btn-size)] leading-[var(--text-btn-line)]`
- Replace hardcoded `hover:bg-[rgba(255,234,158,0.2)]` → `hover:bg-[var(--color-btn-secondary-hover)]`
- Replace hardcoded `active:bg-[rgba(255,234,158,0.15)]` → `active:bg-[var(--color-btn-secondary-active)]`

**HeroSection.tsx** (1 change):
- Remove `<div className="flex flex-col gap-2">` containing tagline + livestream paragraphs
- Replace with `<EventInfoBlock />` (new component, Phase 3)

### Phase 3: New Components

**3.1 EventInfoBlock** (`components/homepage/EventInfoBlock.tsx`)
- Server Component — no "use client" needed (pure render, no interactivity)
- Props: none (reads from `useTranslations("homepage")`)
- Layout: `flex flex-col gap-2` (width 637px on desktop)
- Row 1: `flex flex-row gap-[60px]` — Time group + Venue group
  - Group: `flex flex-row gap-2 items-baseline`
  - Label: `font-bold text-[16px] leading-[24px] tracking-[0.15px] text-[var(--color-text-primary)]`
  - Value: `font-bold text-[24px] leading-[32px] text-[var(--color-accent-gold)]`
- Row 2: Livestream note — `font-bold text-[16px] leading-[24px] tracking-[0.5px] text-[var(--color-text-primary)]`
- i18n keys used: `eventTimeLabel`, `eventDate`, `eventVenueLabel`, `eventVenue`, `livestream`

**3.2 NotificationBell** (`components/shared/NotificationBell.tsx`)
- Client Component (`"use client"`)
- Props: `unreadCount?: number` (default `0`)
- Renders: `<button>` (40×40px) containing bell SVG icon; badge dot when `unreadCount > 0`
- States: default/hover (`bg-white/10`)/focus (`outline-2 solid gold`)/active (`bg-white/15`)
- **Click action: TBD — renders as non-interactive bell icon for now** (`onClick` omitted or no-op)
- `aria-label="Notifications"`, `aria-disabled` when no action

**3.3 UserProfileButton + ProfileDropdown** — ✅ **ALREADY DONE**
See "Already Implemented" section above.

**3.4 RootFurtherSection** (`components/homepage/RootFurtherSection.tsx`)
- Server Component — no "use client" (no state/events)
- Container: `w-full px-[104px] py-[120px]`, flex column, gap `32px`, max-width 1152px centered
- RF.1 Logos: `<Image src="/assets/homepage/root-text.png" />` + `<Image src="/assets/homepage/further-text.png" />` side by side
- RF.2 Opening paragraph (`homepage.rootFurtherParagraph1`): `font-bold text-[24px] leading-[32px] text-[var(--color-text-primary)] text-justify`
- RF.3 Quote (`homepage.rootFurtherQuote`): `font-bold text-[20px] leading-[32px] text-[var(--color-text-primary)] text-center`
- RF.4 Closing paragraph (`homepage.rootFurtherParagraph2`): `font-bold text-[24px] leading-[32px] text-[var(--color-text-primary)] text-justify`
- All text via `useTranslations("homepage")`

**3.5 FloatingWidget** (`components/shared/FloatingWidget.tsx`)
- Client Component (`"use client"`)
- Props: `isAuthenticated: boolean`
- Position: `position: fixed; right: 19px; bottom: 120px` — `bottom` chosen over Figma's `top: 830px` (safer for varying viewport heights; see Risk)
- `z-[90]` (below header at 100)
- Box shadow: `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` (inline style — no CSS variable needed for one-off)
- Layout: `flex flex-row items-center` (106×64px, 2 buttons + divider)
- Write Kudos button (pen icon `MM_MEDIA_Pen`, or inline SVG pen):
  - If `isAuthenticated` → `router.push(ROUTES.KUDOS)` (Write Kudos is an in-page modal on `/kudos`)
  - If not → `router.push(ROUTES.LOGIN)`
  - **`ROUTES.WRITE_KUDOS` does not exist** — Write Kudos is a modal triggered by `WriteKudosButton` on the `/kudos` page, not a separate route. Correct action: `router.push(ROUTES.KUDOS)`.
- SAA Rules button (kudos logo icon `MM_MEDIA_Kudos Logo`):
  - Opens `<TheLeModal isOpen onClose />` — no auth required
  - Local state: `const [theLeOpen, setTheLeOpen] = useState(false)`
- Hover state on each button: `hover:bg-white/10`, `focus-visible:outline-2 outline-gold`

**3.6 TheLeModal** (`components/homepage/TheLeModal.tsx`)
- Client Component (`"use client"`)
- Props: `isOpen: boolean`, `onClose: () => void`, `isAuthenticated: boolean`
- Backdrop: `fixed inset-0 z-[150] bg-[var(--color-overlay)]` — closes on backdrop click
- Modal: centered, `max-h-[90vh] overflow-y-auto`, `max-w-[680px]`
- Title: "Thể lệ" — Montserrat 700, 45px, `text-[var(--color-accent-gold)]`
- 3 sections: (A) Người nhận — Hero badge rules; (B) Người gửi — 6 icons; (C) Kudos Quốc Dân
- Footer buttons:
  - "Đóng" → `onClose()` — Montserrat 700, 16px, `#FFFFFF`, ls 0.5px
  - "Viết KUDOS" → if `isAuthenticated`: `router.push(ROUTES.KUDOS)`; else: `router.push(ROUTES.LOGIN)` — Montserrat 700, 16px, `#00101A` on gold bg
- **i18n**: Modal text is Vietnamese-only content per Figma design. Add `theLeModal.*` keys to `vi.json` + `en.json` in Phase 1 for: `title`, `closeBtn`, `writeKudosBtn`, section headers and content descriptions (see spec `design-style.md` F section)

### Phase 4: KudosPromoSection Redesign [US4 — P3]

Full rewrite of `KudosPromoSection.tsx`:
- Outer: `w-full px-4 md:px-[var(--content-padding-x)]`
- Inner `div`: `relative w-full max-w-[1120px] h-[500px]` rounded-[16px] `bg-[var(--color-kudos-promo-bg)]`
- D2 left column: `w-[457px] flex flex-col gap-8 pl-[64px] justify-center`
  - Section label: `t("kudosPromoLabel")` — 24px white bold
  - Feature name: `t("kudosSectionTitle")` — 57px gold, ls `-0.25px`
  - Body copy: `t("kudosPromoBody")` — 16px white bold, ls 0.5px, justified
- D2.1 CTA: `w-[127px] h-[56px]` gold bg `#FFEA9E`, text `t("kudosCtaLabel")` (16px dark, ls 0.15px) + `MM_MEDIA_Up` icon → `router.push(ROUTES.KUDOS)`
- D2 right: illustration `<Image src="/assets/homepage/kudos-illustration.png" width={264} height={219} />` + Kudos logo `<Image src="/assets/homepage/kudos-logo.png" width={364} height={72} />`
- Both right elements: `absolute` positioned within inner div

### Phase 5: AwardCategoryCard + AwardSummarySection Update [US3 — P2]

**5.1 AwardCategoryCard full redesign** (`AwardCategoryCard.tsx`):
- Remove `<Link>` wrapper → use `<button type="button" onClick={() => router.push(ROUTES.AWARDS)}>`
- Card size: `w-[336px]` — flex column
- Image area (C2.x.1_Picture-Award): `<Image src={category.imageSrc} width={336} height={336} alt={t("categories.${category.slug}")} />`
  - Style: `mix-blend-mode: screen`, `box-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` (inline style)
- Content area (336×144px, gap 24px from image):
  - Category name: `t("categories.${category.slug}")` — Montserrat 400, 24px, `text-[var(--color-accent-gold)]`, lh 32px
  - Description: `t("descriptions.${category.slug}")` — Montserrat 400, 16px, `text-[var(--color-text-primary)]`, lh 24px, ls 0.5px
  - CTA label: `t("ctaLabel")` — Montserrat 500, 16px, `text-[var(--color-text-primary)]`, lh 24px, ls 0.15px
- Remove `topPrize` display (not in Figma design)
- Remove hardcoded rgba values → use CSS vars `--color-award-card-bg`, `--color-award-card-hover`
- `useTranslations("awards")` inside component

**5.2 AwardSummarySection C1 header**:
- Add above grid: supertitle `t("awardSectionTitle", { ns: "awards" })` (`awards.sectionTitle`) — Montserrat 700, 24px, white
- Add `<hr>` divider — 1px `bg-[var(--color-divider)]`
- Update main title to use `t("awardSectionTitle")` — Montserrat 700, **57px**, gold, lh 64px, ls `-0.25px`
- Grid: `grid-cols-3` fixed (not responsive 1→2→3); gap `80px` per Figma
- Remove `gap-6` — use `gap-[80px]`

### Phase 6: Header Update [US2 — P1]

In `Header.tsx` right group:
1. Add `<NotificationBell unreadCount={0} />` — renders between LanguageSelector and UserProfileButton
2. `<UserProfileButton>` — ✅ DONE (renders only when `user` prop is provided)
3. Right group order: LanguageSelector → NotificationBell → UserProfileButton
4. Pass `session` from server components — ✅ DONE

### Phase 6b: Footer Update

Full fix of `Footer.tsx`:
- Add `activeNav?: string` prop (same convention as Header)
- Change `useTranslations("auth")` → `useTranslations("footer")`
- Layout: `flex flex-row justify-between items-center`
- Add logo `<Image src="/assets/auth/logos/mm-media-logo.png" width={52} height={48} />`
- Add `<nav>` with 4 links (from `footer.nav.*` i18n keys):
  - `footer.nav.aboutSaa` → `/`
  - `footer.nav.awardInfo` → `/awards`
  - `footer.nav.kudos` → `/kudos`
  - `footer.nav.generalStandards` → `#` (TBD route)
- Footer nav link active state: gold text-shadow when `activeNav` matches
- Update copyright: `t("copyright")`, `font-[family-name:var(--font-montserrat-alt)] font-bold text-[16px]`, center
- Pass `activeNav` from `HomePage`, `AwardsPage`, `KudosPage` to `<Footer>`

### Phase 7: Polish

- Responsive overrides for all new sections (mobile ≥ 320px, tablet ≥ 768px)
- Add `aria-*` labels to modal, dropdown, floating widget
- Run `pnpm tsc --noEmit` — zero errors
- Run `pnpm vitest run` — all existing tests pass

---

## Testing Strategy

| Type | Focus | Coverage Goal |
|------|-------|---------------|
| Unit (Vitest) | `EventInfoBlock` render, `FloatingWidget` auth logic, `CTAButtons` navigation | 80% |
| Integration | `ProfileDropdown` logout flow (✅ component exists), `TheLeModal` open/close | Key flows |
| E2E (Playwright) | Homepage render, nav links, B4.1 → /awards, F widget | Critical paths |

### Key Test Scenarios

1. `CTAButtons`: click "About SAA" → URL becomes `/awards`
2. `FloatingWidget` unauthenticated → click Write Kudos → redirect to `/login`
3. `FloatingWidget` → click SAA Rules → `TheLeModal` visible
4. `UserProfile` dropdown → click Logout → session cleared → URL becomes `/` (✅ implemented)
5. `EventInfoBlock` locale switch VN/EN → labels update
6. `RootFurtherSection` → 3 text blocks visible in DOM

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| KudosPromoSection redesign breaks mobile layout | Med | Med | Test all 3 breakpoints; wrap with `overflow-x-hidden` |
| `TheLeModal` content overflow on short mobile screens | Med | Low | `max-h-[90vh] overflow-y-auto` |
| `FloatingWidget` `top: 830px` wrong on short viewports | Med | Low | Use `bottom: 120px` — plan decision; closed (see Open Questions) |
| Award card `mix-blend-mode: screen` on non-dark bg | Low | Low | Only on `#00101A` bg — expected |
| `--text-btn-size: 22px` oversized on mobile | Low | Low | Responsive: `sm:text-[18px]` override |
| D2/RF assets not exported from Figma yet | High | High | Phase 0 explicitly includes Figma export step; block Phase 4/RF until assets available |
| AwardCategoryCard redesign breaks Awards page (reused component) | Med | Med | `AwardCategoryCard` is only used in `AwardSummarySection` (homepage) — not shared with `AwardDetailPanel` on `/awards` page |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `spec.md` Ready ✓
- [x] `design-style.md` Ready ✓
- [x] Award card images in `.momorph/specs/i87tDx10uM-homepage-saa/assets/` ✓
- [x] i18n keys added (vi.json + en.json) ✓
- [x] `ROUTES.AWARDS`, `ROUTES.KUDOS`, `ROUTES.LOGIN`, `ROUTES.HOME` exist ✓
- [x] `ROUTES.WRITE_KUDOS` — **NOT needed**: Write Kudos uses `ROUTES.KUDOS` (in-page modal on /kudos) ✓ RESOLVED
- [ ] RF logo assets downloaded from Figma to `public/assets/homepage/`
- [ ] D2 illustration + logo downloaded from Figma to `public/assets/homepage/`
- [ ] `theLeModal.*` i18n keys added for modal title/sections/buttons

### External Dependencies

- No new npm packages required
- All Figma assets need export (Phase 0)

---

## Open Questions

- [x] `ROUTES.WRITE_KUDOS` — **RESOLVED**: Write Kudos is an in-page modal on `/kudos`; FloatingWidget → `router.push(ROUTES.KUDOS)`
- [x] `FloatingWidget` position — **RESOLVED**: Use `bottom: 120px` (not Figma `top: 830px`) — safer for viewports < 830px tall
- [x] Award card click: `/awards` general vs `/awards#top-talent` anchor — **RESOLVED**: Use `router.push(ROUTES.AWARDS)` without anchor (spec US3 Scenario 2; existing card uses anchor which conflicts with plan)
- [ ] **TheLeModal i18n**: Modal content ("Thể lệ", sections A/B/C, button labels) — should these be i18n keys or accepted as VN-only content? Constitution requires locale support for all UI text.
- [ ] **RF logos asset path**: Are `MM_MEDIA_Root Text` / `MM_MEDIA_Further Text` assets already in `public/` anywhere, or must they be exported from Figma?
- [ ] **NotificationBell click action**: Deferred by user — render as visible but non-interactive until notification system is designed.

---

## Next Steps

1. Answer open questions (TheLeModal i18n, RF logos) before Phase 3.4 and 3.6
2. **Run Phase 0**: Copy award images + export Figma assets (RF logos, D2 assets)
3. **Run Phase 1**: Add CSS vars to globals.css + imageSrc to data/types
4. **Run `/momorph.tasks`** to generate task breakdown from this plan
