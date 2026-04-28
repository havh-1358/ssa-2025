"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { AwardCategory } from "@/types/awards";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { KudosPromoSection } from "@/components/homepage/KudosPromoSection";
import { AwardKeyvisual } from "./AwardKeyvisual";
import { AwardNavMenu } from "./AwardNavMenu";
import { AwardCategorySection } from "./AwardCategorySection";

type AwardsPageProps = {
  categories: AwardCategory[];
  user?: { email: string } | null;
};

export function AwardsPage({ categories, user }: AwardsPageProps) {
  const t = useTranslations("awards");
  const [activeSlug, setActiveSlug] = useState<string>(
    categories[0]?.slug ?? "top-talent"
  );

  // Scroll-spy: highlight the last section whose top has scrolled past the trigger point
  useEffect(() => {
    const HEADER_HEIGHT = 80;
    const TRIGGER_OFFSET = 120; // px below header where a section becomes "active"

    const update = () => {
      let current = categories[0]?.slug ?? "";
      for (const cat of categories) {
        const el = document.getElementById(cat.slug);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= HEADER_HEIGHT + TRIGGER_OFFSET) {
          current = cat.slug;
        }
      }
      setActiveSlug(current);
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [categories]);

  return (
    <>
      <Header activeNav="awards" user={user} />

      <main className="bg-[var(--color-bg-base)] min-h-screen">
        {/* Keyvisual banner — includes ROOT FURTHER logo + title overlay */}
        <div className="pt-[var(--header-height)]">
          <AwardKeyvisual
            title={t("sectionTitle")}
            mainHeading={t("mainHeading")}
          />
        </div>

        {/* Main content */}
        <section
          className="px-4 md:px-[var(--content-padding-x)]
            pt-[120px] pb-[var(--content-padding-y)]"
        >

          {/* Two-column layout: sticky 178px nav | scrollable sections */}
          <div
            className="flex flex-col md:flex-row
              gap-8 md:gap-12"
          >
            <AwardNavMenu
              categories={categories}
              activeSlug={activeSlug}
            />

            {/* All 6 sections — always visible, vertically stacked */}
            {/* D.Danh sách giải thưởng: width 853px, margin 0 auto, gap 80px */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col gap-[80px] w-full max-w-[853px] mx-auto">
                {categories.map((cat) => (
                  <AwardCategorySection key={cat.slug} category={cat} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Kudos promo */}
        <KudosPromoSection />
      </main>

      <Footer />
    </>
  );
}
