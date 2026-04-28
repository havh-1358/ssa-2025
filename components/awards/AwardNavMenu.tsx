"use client";

import { useTranslations } from "next-intl";
import type { AwardCategory } from "@/types/awards";
import { AwardNavItem } from "./AwardNavItem";

type AwardNavMenuProps = {
  categories: AwardCategory[];
  activeSlug: string;
};

export function AwardNavMenu({ categories, activeSlug }: AwardNavMenuProps) {
  const t = useTranslations("awards");

  return (
    <nav
      role="navigation"
      aria-label={t("navAriaLabel")}
      className="flex md:flex-col gap-[var(--left-nav-gap)]
        w-full md:w-[178px] shrink-0
        overflow-x-auto md:overflow-x-visible
        pb-2 md:pb-0
        md:sticky md:top-[var(--header-height)]
        md:self-start"
    >
      {categories.map((cat) => (
        <div key={cat.slug} className="shrink-0">
          <AwardNavItem
            href={`#${cat.slug}`}
            label={t(`categories.${cat.slug}`)}
            isActive={cat.slug === activeSlug}
          />
        </div>
      ))}
    </nav>
  );
}
