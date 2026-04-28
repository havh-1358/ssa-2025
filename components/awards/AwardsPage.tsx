"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { AwardCategory } from "@/types/awards";
import { VALID_AWARD_HASHES } from "@/data/awards";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { KudosPromoSection } from "@/components/homepage/KudosPromoSection";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { AwardKeyvisual } from "./AwardKeyvisual";
import { AwardNavMenu } from "./AwardNavMenu";
import { AwardDetailPanel } from "./AwardDetailPanel";

type AwardsPageProps = {
  categories: AwardCategory[];
  user?: { email: string } | null;
};

export function AwardsPage({ categories, user }: AwardsPageProps) {
  const t = useTranslations("awards");
  const [activeSlug, setActiveSlug] = useState<string>(categories[0]?.slug ?? "top-talent");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const panelHeadingRef = useRef<HTMLElement | null>(null);

  // Hash pre-selection on mount — client-only to avoid hydration mismatch (T020)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const hashKey = `#${hash}`;
    if (hash && VALID_AWARD_HASHES.includes(hashKey)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSlug(hash);
      const idx = categories.findIndex((c) => c.slug === hash);
      if (idx !== -1) setFocusedIndex(idx);
    }
    // Invalid or absent hash → silently keep default 'top-talent' (T022, T023)
  }, [categories]);

  function handleActivate(slug: string, index: number) {
    setActiveSlug(slug);
    setFocusedIndex(index);
  }

  return (
    <>
      <Header activeNav="awards" user={user} />

      <main className="bg-[var(--color-bg-base)] min-h-screen">
        {/* Keyvisual banner */}
        <div className="pt-[var(--header-height)]">
          <AwardKeyvisual />
        </div>

        {/* Main content section */}
        <section
          className="px-4 md:px-[var(--content-padding-x)]
            pt-[var(--content-padding-y)] pb-[var(--content-padding-y)]"
        >
          <SectionTitle title={t("sectionTitle")} />

          {/* Two-column layout: 178px nav | flexible detail (T018, T031) */}
          <div
            className="flex flex-col md:flex-row
              gap-8 md:gap-12
              mt-10"
          >
            {/* Left nav — stacks above on mobile, sidebar on desktop */}
            <AwardNavMenu
              categories={categories}
              activeSlug={activeSlug}
              focusedIndex={focusedIndex}
              onActivate={handleActivate}
              onFocusChange={setFocusedIndex}
              panelHeadingRef={panelHeadingRef}
            />

            {/* Right detail panel */}
            <AwardDetailPanel
              categories={categories}
              activeSlug={activeSlug}
              isLoading={isLoading}
              error={error}
              onRetry={() => {}}
              headingRef={panelHeadingRef}
            />
          </div>
        </section>

        {/* Kudos promo (T029) */}
        <KudosPromoSection />
      </main>

      <Footer />
    </>
  );
}
