import type { AwardCategory } from "@/types/awards";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

type AwardCategoryCardProps = {
  category: AwardCategory;
};

export function AwardCategoryCard({ category }: AwardCategoryCardProps) {
  const topPrize = category.prizes[0];

  return (
    <Link
      href={`${ROUTES.AWARDS}#${category.slug}`}
      className="block rounded-[var(--radius-card)] border border-[var(--color-divider)]
        bg-[rgba(255,234,158,0.03)] hover:bg-[rgba(255,234,158,0.06)]
        p-6 transition-colors duration-150 ease-in-out
        focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]"
    >
      <h3
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[16px] leading-6 text-[var(--color-text-primary)] mb-2"
      >
        {category.name}
      </h3>
      <p
        className="font-[family-name:var(--font-montserrat)]
          text-[14px] leading-5 text-[var(--color-text-primary)] opacity-70 mb-4 line-clamp-2"
      >
        {category.description}
      </p>
      {topPrize && (
        <div className="flex items-center justify-between">
          <span
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[14px] leading-5 text-[var(--color-accent-gold)]"
          >
            {topPrize.amount}
          </span>
          <span
            className="font-[family-name:var(--font-montserrat)]
              text-[12px] leading-4 text-[var(--color-text-primary)] opacity-60"
          >
            {topPrize.recipientCount} người
          </span>
        </div>
      )}
    </Link>
  );
}
