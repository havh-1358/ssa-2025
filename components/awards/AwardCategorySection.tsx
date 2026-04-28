import type { RefObject } from "react";
import type { AwardCategory } from "@/types/awards";

type AwardCategorySectionProps = {
  category: AwardCategory;
  headingId: string;
  headingRef?: RefObject<HTMLHeadingElement>;
};

export function AwardCategorySection({
  category,
  headingId,
  headingRef,
}: AwardCategorySectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[32px] leading-10 text-[var(--color-text-primary)]
          focus-visible:outline-none"
      >
        {category.name}
      </h2>

      <div className="flex flex-col">
        {category.prizes.map((prize) => (
          <div
            key={prize.rank}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between
              gap-2 py-6 border-b border-[var(--color-divider)] first:pt-0"
          >
            <div className="flex flex-col gap-1">
              <span
                className="font-[family-name:var(--font-montserrat)] font-bold
                  text-[16px] leading-6 text-[var(--color-accent-gold)]"
              >
                {prize.rank}
              </span>
              <span
                className="font-[family-name:var(--font-montserrat)]
                  text-[14px] leading-5 text-[var(--color-text-primary)] opacity-70"
              >
                {prize.recipientCount} người
              </span>
            </div>
            <span
              className="font-[family-name:var(--font-montserrat)] font-bold
                text-[20px] leading-7 text-[var(--color-text-primary)]"
            >
              {prize.amount}
            </span>
          </div>
        ))}
      </div>

      <p
        className="font-[family-name:var(--font-montserrat)]
          text-[16px] leading-6 text-[var(--color-text-primary)] opacity-70"
      >
        {category.description}
      </p>
    </div>
  );
}
