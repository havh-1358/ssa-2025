# Tasks: Homepage SAA

**Frame**: `i87tDx10uM-homepage-saa`
**Prerequisites**: plan.md ✅ · spec.md ✅ · design-style.md ✅
**Generated**: 2026-04-28

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this belongs to (US1–US6)
- **|**: Primary file affected by this task
- **[x]**: Task already completed in prior session

---

## Phase 1: Setup (Asset Preparation)

**Purpose**: Download and copy all visual assets required by new components. No component can reference images before they exist on disk.

> T002 and T003 require Figma MCP (`mcp__momorph__get_media_files`). If assets already exist in `public/`, skip the export step.

- [ ] T001 Copy award images from spec assets to public — `mkdir -p public/assets/awards && cp .momorph/specs/i87tDx10uM-homepage-saa/assets/award-*.png public/assets/awards/` | `public/assets/awards/`
- [ ] T002 [P] Export RF logos from Figma: `MM_MEDIA_Root Text` → `public/assets/homepage/root-text.png`, `MM_MEDIA_Further Text` → `public/assets/homepage/further-text.png` | `public/assets/homepage/`
- [ ] T003 [P] Export D2 assets from Figma: node `I3390:10349;313:8417` (264×219px) → `public/assets/homepage/kudos-illustration.png`; node `I3390:10349;329:2948` (364×72px) → `public/assets/homepage/kudos-logo.png` | `public/assets/homepage/`

**Checkpoint**: `public/assets/awards/award-*.png` (×6) and `public/assets/homepage/root-text.png`, `further-text.png`, `kudos-illustration.png`, `kudos-logo.png` all present.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Types, CSS tokens, and i18n additions that every user story depends on.

⚠️ **CRITICAL**: Complete all Phase 2 tasks before beginning any user story work.

- [ ] T004 Add `imageSrc: string` field to `AwardCategory` interface | `types/awards.ts`
- [ ] T005 Add `imageSrc: "/assets/awards/award-{slug}.png"` to all 6 entries in `AWARD_CATEGORIES` (slugs: top-talent, top-project, top-project-leader, best-manager, signature-2025, mvp) | `data/awards.ts`
- [ ] T006 [P] Add missing CSS variables to Homepage SAA tokens section: `--text-btn-size: 22px`, `--text-btn-line: 28px`, `--color-btn-secondary-active: rgba(255,234,158,0.15)`, `--color-kudos-promo-bg: #0f0f0f`, `--color-award-card-bg: rgba(255,234,158,0.03)`, `--color-award-card-hover: rgba(255,234,158,0.06)` | `app/globals.css`
- [ ] T007 [P] Add `theLeModal.*` i18n keys to `vi.json` and `en.json` — keys: `title` ("Thể lệ"), `sectionATitle` ("Người nhận"), `sectionBTitle` ("Người gửi"), `sectionCTitle` ("Kudos Quốc Dân"), `closeBtn` ("Đóng"), `writeKudosBtn` ("Viết KUDOS"); body text for each section from design-style.md F section | `i18n/messages/vi.json`, `i18n/messages/en.json`

> T007 is conditional: if team decides TheLeModal is VN-only, skip T007 and hardcode strings in T017.

**Checkpoint**: `npx tsc --noEmit` passes; all CSS vars resolve; i18n keys accessible via `useTranslations`.

---

## Phase 3: US1 — View Event Info and Countdown (Priority: P1) 🎯 MVP

**Goal**: Replace the tagline placeholder in the hero section with the structured Event Info Block and fix both CTA buttons (navigation, font size, CSS var hover/active states).

**Independent Test**: Navigate to `/` (post-launch) → (1) "Thời gian: 26/12/2025" and "Địa điểm: Âu Cơ Art Center" visible in two columns; (2) livestream note below; (3) "About SAA 2025" click → URL `/awards`; (4) "Sun* Kudos" click → URL `/kudos`; (5) button text is 22px.

- [ ] T008 [P] [US1] Create `EventInfoBlock` Server Component: `flex flex-col gap-2`; Row 1 — `flex flex-row gap-[60px]`: time group (label `t("eventTimeLabel")` 16px white bold ls 0.15px + value `t("eventDate")` 24px gold bold), venue group (label `t("eventVenueLabel")` + value `t("eventVenue")` same sizes); Row 2 — livestream `t("livestream")` 16px white bold ls 0.5px; `useTranslations("homepage")` | `components/homepage/EventInfoBlock.tsx`
- [ ] T009 [US1] In `HeroSection`, remove `<div className="flex flex-col gap-2">` containing tagline paragraph + livestream paragraph; replace with `<EventInfoBlock />` | `components/homepage/HeroSection.tsx`
- [ ] T010 [US1] Fix `CTAButtons` — 4 changes: (1) replace `handleAboutSAA` scrollIntoView body with `router.push(ROUTES.AWARDS)`; (2) change `text-[16px] leading-6` → `text-[var(--text-btn-size)] leading-[var(--text-btn-line)]` on both buttons; (3) replace `hover:bg-[rgba(255,234,158,0.2)]` → `hover:bg-[var(--color-btn-secondary-hover)]`; (4) replace `active:bg-[rgba(255,234,158,0.15)]` → `active:bg-[var(--color-btn-secondary-active)]` | `components/homepage/CTAButtons.tsx`

**Checkpoint**: Event info block renders in hero; "About SAA 2025" navigates to `/awards`; buttons use CSS var font size.

---

## Phase 4: US2 — Navigate to Platform Sections (Priority: P1)

**Goal**: Complete the header right-group (add NotificationBell) and fix Footer to use the correct i18n namespace with all 4 nav links and proper active state.

**Independent Test**: (1) Header right-group order: LanguageSelector → NotificationBell → UserProfileButton (when authenticated); (2) Footer shows MM_MEDIA_Logo + 4 nav links + copyright; (3) "About SAA 2025" footer link has gold glow on homepage; (4) all footer text from `footer.*` i18n namespace.

- [ ] T011 [P] [US2] Create `NotificationBell` Client Component — 40×40px `<button>`, bell SVG icon (inline), badge dot `w-2 h-2 bg-[var(--color-accent-gold)] rounded-full absolute top-1 right-1` when `unreadCount > 0`; states: hover `bg-white/10`, focus `outline-2 solid gold`, active `bg-white/15`; `aria-label="Notifications"`; no onClick handler (TBD); Props: `unreadCount?: number` (default 0) | `components/shared/NotificationBell.tsx`
- [ ] T012 [US2] In `Header` right group, add `<NotificationBell unreadCount={0} />` between `<LanguageSelector />` and `{user && <UserProfileButton>}` | `components/shared/Header.tsx`
- [ ] T013 [P] [US2] Rewrite `Footer`: (1) add `activeNav?: string` prop; (2) change `useTranslations("auth")` → `useTranslations("footer")`; (3) layout `flex flex-row justify-between items-center px-[var(--spacing-footer-px)] py-[var(--spacing-footer-py)]`; (4) left: `<Image src="/assets/auth/logos/mm-media-logo.png" width={52} height={48} alt="SSA 2025" />`; (5) center: `<nav>` with 4 links — `t("nav.aboutSaa")`→`/`, `t("nav.awardInfo")`→`/awards`, `t("nav.kudos")`→`/kudos`, `t("nav.generalStandards")`→`#`; active link: style `textShadow: "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287"`; (6) right: copyright `t("copyright")` Montserrat Alternates 700 16px | `components/shared/Footer.tsx`
- [ ] T014 [US2] Pass `activeNav` prop to `<Footer>` from `HomePage` (`"home"`), `AwardsPage` (`"awards"`), `KudosPage` (`"kudos"`) | `components/homepage/HomePage.tsx`, `components/awards/AwardsPage.tsx`, `components/kudos/KudosPage.tsx`

**Already completed (no action needed):**
- [x] T-A1 [US2] `UserProfileButton` + `ProfileDropdown` created (auth-gated, logout via Supabase) | `components/shared/UserProfileButton.tsx`, `components/shared/ProfileDropdown.tsx`
- [x] T-A2 [US2] `Header` accepts `user?: {email}` prop and renders `<UserProfileButton>` | `components/shared/Header.tsx`
- [x] T-A3 [US2] Server pages fetch session, pass `user` to page components | `app/page.tsx`, `app/awards/page.tsx`, `app/kudos/page.tsx`

**Checkpoint**: Header: LanguageSelector + NotificationBell + UserProfileButton; Footer: logo + 4 nav + copyright; active page nav link has gold glow.

---

## Phase 5: US3 — Browse Award System Summary (Priority: P2)

**Goal**: Award section renders the correct C1 section header and each card shows the Figma award image with i18n text in a 336×504px layout.

**Independent Test**: Scroll to award section → (1) supertitle "Sun* Annual Awards 2025" (24px white) + 1px divider + "Hệ thống giải thưởng" (57px gold); (2) 6 cards in 3-column grid with 80px gap; (3) each card has award image (336×336px); (4) category name and description from i18n; (5) click any card → URL `/awards`.

- [ ] T015 [P] [US3] Full redesign of `AwardCategoryCard`: (1) `<button type="button" onClick={() => router.push(ROUTES.AWARDS)}>` wrapper (no `<Link>`); (2) image area `<Image src={category.imageSrc} width={336} height={336} alt={t(\`categories.${category.slug}\`)} style={{mixBlendMode:"screen",boxShadow:"0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287"}} />`; (3) text area (336×144px): name `t(\`categories.${category.slug}\`)` 24px gold 400 lh 32px, description `t(\`descriptions.${category.slug}\`)` 16px white 400 lh 24px ls 0.5px, CTA `t("ctaLabel")` 16px white 500 ls 0.15px; (4) remove `topPrize` display; (5) replace hardcoded rgba with `bg-[var(--color-award-card-bg)] hover:bg-[var(--color-award-card-hover)]`; (6) add `useTranslations("awards")` | `components/homepage/AwardCategoryCard.tsx`
- [ ] T016 [US3] Update `AwardSummarySection`: (1) add C1 header above grid — supertitle `t("sectionTitle", {ns:"awards"})` → use second `useTranslations("awards")` for `awards.sectionTitle` 24px white 700; 1px `<hr className="border-[var(--color-divider)]">`; main title `t("awardSectionTitle")` from `homepage` namespace 57px gold 700 lh 64px ls -0.25px; (2) update grid gap from `gap-6` → `gap-[80px]`; (3) grid stays `grid-cols-3` on desktop | `components/homepage/AwardSummarySection.tsx`

**Checkpoint**: Award section shows correct header hierarchy; 6 cards have award images; clicking navigates to `/awards`.

---

## Phase 6: US6 — Floating Quick-Action Widget (Priority: P2)

**Goal**: A fixed floating widget visible at all scroll positions, with Write Kudos (auth-gated) and SAA Rules (opens modal) actions.

**Independent Test**: (1) Widget visible at `fixed right-[19px] bottom-[120px]` with gold glow shadow; (2) unauthenticated + Write Kudos click → `/login`; (3) authenticated + Write Kudos click → `/kudos`; (4) SAA Rules click → TheLeModal visible; (5) "Đóng" in modal → modal closes.

- [ ] T017 [P] [US6] Create `TheLeModal` Client Component — Props: `isOpen: boolean`, `onClose: () => void`, `isAuthenticated: boolean`; backdrop `fixed inset-0 z-[150] bg-[var(--color-overlay)]` (click closes); modal `relative max-w-[680px] w-full max-h-[90vh] overflow-y-auto rounded-[8px]` centered; title `t("theLeModal.title")` 45px `text-[var(--color-accent-gold)]` 700; 3 sections A/B/C with headers from `t("theLeModal.section*")`; footer buttons: "Đóng" `onClick={onClose}` and "Viết KUDOS" `onClick={() => isAuthenticated ? router.push(ROUTES.KUDOS) : router.push(ROUTES.LOGIN)}`; `role="dialog" aria-modal="true" aria-labelledby="the-le-title"` | `components/homepage/TheLeModal.tsx`
- [ ] T018 [US6] Create `FloatingWidget` Client Component — Props: `isAuthenticated: boolean`; `fixed right-[19px] bottom-[120px] z-[90]`; inline style `boxShadow: "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287"`; layout `flex flex-row items-center` (106×64px); local state `const [theLeOpen, setTheLeOpen] = useState(false)`; Write Kudos button (pen SVG, 40×40px): `onClick={() => isAuthenticated ? router.push(ROUTES.KUDOS) : router.push(ROUTES.LOGIN)}`; divider `/` text; SAA Rules button (kudos logo icon): `onClick={() => setTheLeOpen(true)}`; renders `<TheLeModal isOpen={theLeOpen} onClose={() => setTheLeOpen(false)} isAuthenticated={isAuthenticated} />`; both buttons: `hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)] aria-label` | `components/shared/FloatingWidget.tsx`
- [ ] T019 [US6] Add `<FloatingWidget isAuthenticated={!!user} />` inside `<main>` in `HomePage` (after all sections) | `components/homepage/HomePage.tsx`

**Checkpoint**: Widget at bottom-right with gold glow; all 3 button interaction scenarios work; modal opens/closes.

---

## Phase 7: US4 — Sun* Kudos Promo Block (Priority: P3)

**Goal**: Replace simple KudosPromoSection with the D1/D2/D2.1 two-column dark-background Figma layout.

**Independent Test**: Scroll to Kudos promo → (1) `#0F0F0F` bg, 16px radius visible; (2) left: "Phong trào ghi nhận" 24px + "Sun* Kudos" 57px gold + body copy; (3) right: illustration + KUDOS logo; (4) "Chi tiết" → URL `/kudos`.

- [ ] T020 [US4] Full rewrite of `KudosPromoSection`: outer `w-full px-4 md:px-[var(--content-padding-x)] py-[var(--content-padding-y)]`; inner `relative w-full max-w-[1120px] h-[500px] mx-auto rounded-[16px] bg-[var(--color-kudos-promo-bg)]`; D2 left `absolute left-[64px] top-1/2 -translate-y-1/2 w-[457px] flex flex-col gap-8`: label `t("kudosPromoLabel")` 24px white 700, title `t("kudosSectionTitle")` 57px `text-[var(--color-accent-gold)]` 700 ls -0.25px, body `t("kudosPromoBody")` 16px white 700 ls 0.5px text-justify; D2.1 CTA `<button onClick={() => router.push(ROUTES.KUDOS)} className="flex items-center gap-2 w-[127px] h-[56px] px-4 rounded-[4px] bg-[var(--color-accent-gold)]">` — label `t("kudosCtaLabel")` 16px `text-[var(--color-bg-base)]` 700 ls 0.15px + MM_MEDIA_Up SVG 24×24 `#00101A`; D2 right assets: illustration `absolute right-[148px] top-1/2 -translate-y-1/2 <Image src="/assets/homepage/kudos-illustration.png" width={264} height={219} />` + logo `absolute right-[20px] top-1/2 -translate-y-1/2 <Image src="/assets/homepage/kudos-logo.png" width={364} height={72} />` | `components/homepage/KudosPromoSection.tsx`

**Checkpoint**: Kudos promo has dark `#0F0F0F` bg with two-column layout; "Chi tiết" → `/kudos`.

---

## Phase 8: US5 — Root Further Theme Story (Priority: P3)

**Goal**: Insert the RF section between the hero and awards sections showing theme logos and 3 text blocks in the correct locale.

**Independent Test**: Scroll to RF section → (1) root-text + further-text images visible side-by-side; (2) 3 text blocks render; (3) locale switch VN→EN updates all text; (4) quote is center-aligned, paragraphs are justified.

- [ ] T021 [P] [US5] Create `RootFurtherSection` Server Component — `w-full px-4 md:px-[104px] py-[120px] flex flex-col items-center gap-8 max-w-[1152px] mx-auto`; RF.1 logos: `<div className="flex flex-row gap-4">` with `<Image src="/assets/homepage/root-text.png" alt="Root" />` + `<Image src="/assets/homepage/further-text.png" alt="Further" />`; RF.2 opening `<p className="text-[24px] leading-[32px] font-bold text-[var(--color-text-primary)] text-justify w-full">{t("rootFurtherParagraph1")}</p>`; RF.3 quote `<blockquote className="text-[20px] leading-[32px] font-bold text-[var(--color-text-primary)] text-center">{t("rootFurtherQuote")}</blockquote>`; RF.4 closing `<p>` same as RF.2 using `t("rootFurtherParagraph2")`; `useTranslations("homepage")` | `components/homepage/RootFurtherSection.tsx`
- [ ] T022 [US5] In `HomePage`, add `<RootFurtherSection />` in the sections area between the hero wrapper `</div>` and `<AwardSummarySection />` | `components/homepage/HomePage.tsx`

**Checkpoint**: RF section visible between hero and awards; all 3 text blocks render; locale switch works.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, accessibility, type-checking, and linting across all new components.

- [ ] T023 [P] Add responsive overrides for new sections: `AwardSummarySection` grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; `KudosPromoSection` inner switches from fixed `h-[500px]` to flex-col at mobile with reduced padding; `RootFurtherSection` padding reduces at sm (`px-4 md:px-[104px]`) | `components/homepage/AwardSummarySection.tsx`, `components/homepage/KudosPromoSection.tsx`, `components/homepage/RootFurtherSection.tsx`
- [ ] T024 [P] Add ARIA attributes: `FloatingWidget` buttons — `aria-label="Write Kudos"` / `aria-label="SAA Rules"`; `TheLeModal` — `role="dialog" aria-modal="true" aria-labelledby="the-le-title"`; `NotificationBell` — `aria-label="Notifications"` + `aria-live="polite"` on badge | `components/shared/FloatingWidget.tsx`, `components/homepage/TheLeModal.tsx`, `components/shared/NotificationBell.tsx`
- [ ] T025 [P] Write Vitest unit tests: (a) `EventInfoBlock` — renders `eventTimeLabel`, `eventDate`, `eventVenueLabel`, `eventVenue`, `livestream` from i18n; (b) `CTAButtons` — About SAA calls `router.push("/awards")`, not `scrollIntoView`; (c) `FloatingWidget` — unauthenticated click → `router.push("/login")`, authenticated → `router.push("/kudos")` | `__tests__/EventInfoBlock.test.tsx`, `__tests__/CTAButtons.test.tsx`, `__tests__/FloatingWidget.test.tsx`
- [ ] T026 Run `npx tsc --noEmit` — must pass with zero errors | (all modified files)
- [ ] T027 Run `pnpm lint` (or `npx next lint`) — must pass with zero warnings | (all modified files)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Assets)
  └──► Phase 2 (Foundation)
         └──► Phase 3 (US1 — P1)  ──┐
         └──► Phase 4 (US2 — P1)  ──┤
         └──► Phase 5 (US3 — P2)  ──┼──► Phase 9 (Polish)
         └──► Phase 6 (US6 — P2)  ──┤
         └──► Phase 7 (US4 — P3)  ──┤
         └──► Phase 8 (US5 — P3)  ──┘
```

- **Phase 1**: No dependencies — start immediately; T002 and T003 can run in parallel
- **Phase 2**: Depends on Phase 1 (T001 needed for T005 imageSrc paths); T004/T006/T007 can run in parallel after T001
- **Phases 3–8**: All depend on Phase 2; can begin in priority order or in parallel if staffed
  - **Phase 5** additionally depends on T001 (award images) and T004/T005 (imageSrc type/data)
  - **Phase 7** additionally depends on T003 (D2 assets)
  - **Phase 8** additionally depends on T002 (RF logo assets)
- **Phase 9**: Depends on Phases 3–8 complete

### Within Each Phase

- T008 (EventInfoBlock create) can start in parallel with T009 prep, but T009 needs T008 to exist before import
- T011 (NotificationBell) and T013 (Footer) are independent — run in parallel; T012/T014 wait for T011/T013
- T017 (TheLeModal) should complete before T018 (FloatingWidget imports it)
- T021 (RootFurtherSection create) before T022 (insert into HomePage)

### Parallel Opportunities

| Set | Tasks | Condition |
|-----|-------|-----------|
| Phase 1 exports | T002, T003 | Both simultaneous |
| Phase 2 foundations | T004, T006, T007 | Different files |
| US1 components | T008, then T009+T010 | T008 first; T009/T010 independent after |
| US2 components | T011, T013 | Different files |
| US3 + US6 stories | Phases 5 and 6 | Both P2, independent files |
| Phase 9 polish | T023, T024, T025 | All independent |

---

## Implementation Strategy

### MVP First (Recommended)

1. Phase 1 + Phase 2 → Foundation done
2. Phase 3 (US1) → Event info + CTA buttons → **VALIDATE**: navigation works
3. Phase 4 (US2) → Header NotificationBell + Footer → **VALIDATE**: full navigation
4. Deploy P1 features

### Incremental Delivery

1. Phase 1 + 2 → Setup complete
2. Phase 3 (US1) + Phase 4 (US2) → P1 complete → deployable core
3. Phase 5 (US3) + Phase 6 (US6) → P2 complete
4. Phase 7 (US4) + Phase 8 (US5) → P3 complete
5. Phase 9 → Polish → PR ready

### Task Count Summary

| Phase | Tasks | Story / Priority |
|-------|-------|-----------------|
| Phase 1 (Setup) | 3 | — |
| Phase 2 (Foundation) | 4 | — |
| Phase 3 | 3 | US1 — P1 |
| Phase 4 | 4 (+3 done) | US2 — P1 |
| Phase 5 | 2 | US3 — P2 |
| Phase 6 | 3 | US6 — P2 |
| Phase 7 | 1 | US4 — P3 |
| Phase 8 | 2 | US5 — P3 |
| Phase 9 (Polish) | 5 | — |
| **Total** | **27** | +3 done in prior session |

---

## Notes

- Mark tasks complete with `[x]` as you go
- Commit after each phase checkpoint
- Run `npx tsc --noEmit` before moving to the next phase
- **T007**: If team decides `TheLeModal` is VN-only content, skip T007 and hardcode strings in T017. Otherwise add i18n keys first.
- **T002/T003**: If Figma export is blocked (rate limit), implement component with correct `width`/`height` dimensions and a placeholder src; swap the real asset path once exported.
- **T015**: `AwardCategoryCard` is only used in `AwardSummarySection` (homepage grid) — the `/awards` page uses `AwardDetailPanel` separately. Safe to redesign without breaking the awards page.
- **T016**: `AwardSummarySection` uses two `useTranslations` calls — one for `"homepage"` (main title), one for `"awards"` (supertitle).
