"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { AwardCategory } from "@/types/awards";
import { ROUTES } from "@/lib/constants/routes";

type AwardCategoryCardProps = {
  category: AwardCategory;
};

export function AwardCategoryCard({ category }: AwardCategoryCardProps) {
  const router = useRouter();
  const t = useTranslations("awards");

  const categoryKey =
    `categories.${category.slug}` as Parameters<typeof t>[0];
  const descriptionKey =
    `descriptions.${category.slug}` as Parameters<typeof t>[0];

  return (
    <button
      type="button"
      onClick={() => router.push(ROUTES.AWARDS)}
      className="flex flex-col text-left w-full
        bg-[var(--color-award-card-bg)] hover:bg-[var(--color-award-card-hover)]
        rounded-[var(--radius-card)]
        transition-colors duration-150 ease-in-out
        focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]"
    >
      {/* C2.x.1 — Award image 336×336px */}
      <div className="w-full overflow-hidden rounded-t-[var(--radius-card)]">
        <Image
          src={category.imageSrc}
          alt={t(categoryKey)}
          width={336}
          height={336}
          className="w-full h-auto object-cover"
          style={{
            mixBlendMode: "screen",
            boxShadow: "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287",
          }}
        />
      </div>

      {/* Card text area */}
      <div className="flex flex-col gap-3 p-4">
        {/* Category name — 24px gold 400 */}
        <h3
          className="font-[family-name:var(--font-montserrat)]
            text-[24px] leading-[32px] font-normal
            text-[var(--color-accent-gold)]"
        >
          {t(categoryKey)}
        </h3>

        {/* Description — 16px white 400 ls 0.5px */}
        <p
          className="font-[family-name:var(--font-montserrat)]
            text-[16px] leading-[24px] font-normal tracking-[0.5px]
            text-[var(--color-text-primary)]"
        >
          {t(descriptionKey)}
        </p>

        {/* C2.1.4 — CTA button: 88×56px, padding 16px 0px, gap 4px */}
        <span
          className="inline-flex flex-row items-center
            w-[88px] h-[56px] py-4 px-0 gap-1"
        >
          {/* Frame 485 — text+icon row: 60px text + 4px gap + 24px icon */}
          <span
            className="inline-flex flex-row items-center gap-1"
          >
            <span
              className="w-[60px] h-[24px] flex items-center justify-center
                font-[family-name:var(--font-montserrat)] font-medium
                text-[16px] leading-[24px] tracking-[0.15px]
                text-[var(--color-text-primary)] text-center"
            >
              {t("ctaLabel")}
            </span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.49945 18.3095L5.68945 15.4995L12.0595 9.11945H7.10945V5.68945H18.3095V16.8895H14.8895V11.9395L8.49945 18.3095Z" fill="white"/>
            </svg>
          </span>
        </span>
      </div>
    </button>
  );
}
