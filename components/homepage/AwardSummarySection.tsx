"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AWARD_CATEGORIES } from "@/data/awards";
import type { AwardCategory } from "@/types/awards";
import { AwardCategoryCard } from "./AwardCategoryCard";

function AwardGrid({ categories }: { categories: AwardCategory[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[108px] gap-y-[80px]">
      {categories.map((category) => (
        <AwardCategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

function AwardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[108px] gap-y-[80px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[var(--radius-card)] border border-[var(--color-divider)]
            bg-[var(--color-award-card-bg)] p-6 h-[504px]
            animate-pulse"
          aria-hidden="true"
        >
          <div className="h-[336px] bg-white/10 rounded mb-4" />
          <div className="h-6 bg-white/10 rounded mb-2 w-3/4" />
          <div className="h-4 bg-white/10 rounded w-full" />
        </div>
      ))}
    </div>
  );
}

export function AwardSummarySection() {
  const t = useTranslations("homepage");
  const ta = useTranslations("awards");
  const [categories] = useState<AwardCategory[]>(AWARD_CATEGORIES);
  const [isLoading] = useState(false);
  const [hasError] = useState(false);

  return (
    <section
      id="award-system"
      className="relative z-[2] w-full
        px-4 md:px-[var(--content-padding-x)]
        py-[var(--content-padding-y)]
        border-t border-[var(--color-divider)]"
    >
      {/* C1 — Section header */}
      <div className="flex flex-col gap-4 mb-[80px]">
        {/* C1 supertitle — 24px white */}
        <p
          className="font-[family-name:var(--font-montserrat)] font-bold
            text-[24px] leading-[32px] text-[var(--color-text-primary)]"
        >
          {ta("sectionTitle")}
        </p>

        {/* C1 divider */}
        <hr className="border-0 border-t border-[var(--color-divider)]" />

        {/* C1 main title — 57px gold */}
        <h2
          className="font-[family-name:var(--font-montserrat)] font-bold
            text-[57px] leading-[64px] tracking-[-0.25px]
            text-[var(--color-accent-gold)]"
        >
          {t("awardSectionTitle")}
        </h2>
      </div>

      {isLoading && <AwardSkeleton />}

      {!isLoading && hasError && (
        <div className="flex flex-col items-center gap-4 py-16">
          <p
            className="font-[family-name:var(--font-montserrat)]
              text-[16px] leading-6 text-[var(--color-text-primary)] opacity-60 text-center"
          >
            {t("awardsError")}
          </p>
          <button
            type="button"
            className="h-[44px] px-6 rounded-[var(--radius-btn)]
              bg-[var(--color-btn-secondary-bg)]
              border border-[var(--color-btn-secondary-border)]
              text-[var(--color-text-primary)]
              font-[family-name:var(--font-montserrat)] font-bold text-[14px]
              transition-colors duration-150 ease-in-out
              hover:bg-[var(--color-btn-secondary-hover)]
              focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]"
          >
            {t("awardsRetry")}
          </button>
        </div>
      )}

      {!isLoading && !hasError && <AwardGrid categories={categories} />}
    </section>
  );
}
