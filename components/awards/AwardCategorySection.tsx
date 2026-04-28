import Image from "next/image";
import { useTranslations } from "next-intl";
import type { AwardCategory, AwardPrize } from "@/types/awards";
import { TargetIcon } from "./TargetIcon";

type AwardCategorySectionProps = {
  category: AwardCategory;
};

function SectionDivider() {
  return (
    <hr
      className="w-full border-0 border-t border-[var(--color-divider)]"
      aria-hidden="true"
    />
  );
}

function RecipientRow({
  count,
  unitKey,
  t,
}: {
  count: number;
  unitKey: string;
  t: ReturnType<typeof useTranslations<"awards">>;
}) {
  return (
    <div className="flex flex-row items-center gap-4">
      <Image
        src="/assets/awards/icons/icon-diamond.svg"
        alt=""
        width={24}
        height={24}
        aria-hidden="true"
      />
      <span
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[24px] leading-8 text-[var(--color-accent-gold)]"
      >
        {t("recipientCountLabel")}:
      </span>
      <span
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[36px] leading-[44px] text-[var(--color-text-primary)]"
      >
        {String(count).padStart(2, "0")}
      </span>
      <span
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[14px] leading-5 tracking-[0.1px]
          text-[var(--color-text-primary)]"
      >
        {t(unitKey as Parameters<typeof t>[0])}
      </span>
    </div>
  );
}

function PrizeValueBlock({
  prize,
  t,
}: {
  prize: AwardPrize;
  t: ReturnType<typeof useTranslations<"awards">>;
}) {
  const subLabelText = prize.noSubLabel
    ? null
    : prize.subLabel
      ? t(prize.subLabel as Parameters<typeof t>[0])
      : t("perPrize");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.00108 10.0008C9.01144 9.20834 9.33084 8.45128 9.89122 7.8909C10.4516 7.33053 11.2087 7.01113 12.0011 7.00077C12.7935 7.01113 13.5506 7.33053 14.1109 7.8909C14.6713 8.45128 14.9907 9.20834 15.0011 10.0008C14.9907 10.7932 14.6713 11.5503 14.1109 12.1106C13.5506 12.671 12.7935 12.9904 12.0011 13.0008C11.2087 12.9904 10.4516 12.671 9.89122 12.1106C9.33084 11.5503 9.01144 10.7932 9.00108 10.0008ZM12.0011 19.0008L16.0011 20.0008V16.9208C14.7948 17.6472 13.4091 18.0214 12.0011 18.0008C10.5931 18.0214 9.20741 17.6472 8.00108 16.9208V20.0008M12.0011 4.00077C11.2131 3.98639 10.4304 4.13333 9.70125 4.43256C8.9721 4.73179 8.31185 5.17698 7.76108 5.74077C7.1912 6.29214 6.74085 6.95487 6.43807 7.68774C6.13529 8.42061 5.98654 9.20795 6.00108 10.0008C5.99066 10.7886 6.14141 11.5702 6.44407 12.2976C6.74673 13.025 7.19491 13.6829 7.76108 14.2308C8.30928 14.8 8.96838 15.2507 9.69765 15.5552C10.4269 15.8596 11.2109 16.0113 12.0011 16.0008C12.7913 16.0113 13.5752 15.8596 14.3045 15.5552C15.0338 15.2507 15.6929 14.8 16.2411 14.2308C16.8073 13.6829 17.2554 13.025 17.5581 12.2976C17.8608 11.5702 18.0115 10.7886 18.0011 10.0008C18.0156 9.20795 17.8669 8.42061 17.5641 7.68774C17.2613 6.95487 16.811 6.29214 16.2411 5.74077C15.6903 5.17698 15.0301 4.73179 14.3009 4.43256C13.5718 4.13333 12.7891 3.98639 12.0011 4.00077ZM20.0011 10.0008C19.9798 10.9607 19.7867 11.909 19.4311 12.8008C19.1107 13.7082 18.6259 14.5489 18.0011 15.2808V23.0008L12.0011 21.0008L6.00108 23.0008V15.2808C4.70677 13.8272 3.99458 11.947 4.00108 10.0008C3.98346 8.95135 4.18112 7.90946 4.58187 6.93942C4.98261 5.96937 5.57793 5.09176 6.33108 4.36077C7.06479 3.60087 7.94645 2.9994 8.92165 2.5935C9.89684 2.1876 10.9449 1.98587 12.0011 2.00077C13.0573 1.98587 14.1053 2.1876 15.0805 2.5935C16.0557 2.9994 16.9374 3.60087 17.6711 4.36077C18.4242 5.09176 19.0196 5.96937 19.4203 6.93942C19.821 7.90946 20.0187 8.95135 20.0011 10.0008Z" fill="white"/>
        </svg>
        <span
          className="font-[family-name:var(--font-montserrat)] font-bold
            text-[24px] leading-8 text-[var(--color-accent-gold)]"
        >
          {t("prizeAmountLabel")}:
        </span>
      </div>
      <span
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[36px] leading-[44px] text-[var(--color-text-primary)]"
      >
        {prize.amount}
      </span>
      {subLabelText && (
        <span
          className="font-[family-name:var(--font-montserrat)]
            text-[14px] leading-5 text-[var(--color-text-primary)] opacity-70"
        >
          {subLabelText}
        </span>
      )}
    </div>
  );
}

function OrSeparator({ label }: { label: string }) {
  return (
    <div className="flex flex-row items-center gap-4 py-2">
      <span className="flex-1 h-px bg-[var(--color-divider)]" aria-hidden="true" />
      <span
        className="font-[family-name:var(--font-montserrat)]
          text-[14px] leading-5 text-[var(--color-text-primary)] opacity-70"
      >
        {label}
      </span>
      <span className="flex-1 h-px bg-[var(--color-divider)]" aria-hidden="true" />
    </div>
  );
}

export function AwardCategorySection({ category }: AwardCategorySectionProps) {
  const t = useTranslations("awards");
  const isImageLeft = category.imagePosition === "left";
  const headingId = `${category.slug}-heading`;
  const isDualPrize = category.prizes.length > 1;

  const imageEl = (
    <Image
      src={category.imageSrc}
      alt={t(`categories.${category.slug}`)}
      width={240}
      height={240}
      className="w-[240px] h-[240px] object-cover shrink-0"
      style={{
        mixBlendMode: "screen",
        boxShadow: "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287",
      }}
    />
  );

  const contentEl = (
    <div
      className="flex flex-col flex-1"
      style={{
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderRadius: "16px",
      }}
    >
      {/* D.x.2.a — target icon + category name + description */}
      <div className="flex flex-col gap-6 pb-6">
        <div className="flex flex-row items-center gap-4">
          <TargetIcon active={false} />
          <h2
            id={headingId}
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[24px] leading-8 text-[var(--color-accent-gold)]"
          >
            {t(`categories.${category.slug}`)}
          </h2>
        </div>

        {/* Description — full detail text */}
        <p
          className="font-[family-name:var(--font-montserrat)]
            text-[16px] leading-6 tracking-[0.5px]
            text-[var(--color-text-primary)] text-justify"
        >
          {t(`detailDescriptions.${category.slug}`)}
        </p>
      </div>

      {/* D.x.2.b — Divider 1 (between description and recipient count) */}
      <SectionDivider />

      {/* D.x.2.c — Recipient count row */}
      <div className="py-6">
        {isDualPrize ? (
          /* D.5 special: combined "01 Cá nhân hoặc Tập thể" */
          <RecipientRow
            count={category.prizes[0].recipientCount}
            unitKey="units.individual_or_team"
            t={t}
          />
        ) : (
          <RecipientRow
            count={category.prizes[0].recipientCount}
            unitKey={`units.${category.prizes[0].unit}`}
            t={t}
          />
        )}
      </div>

      {/* D.x.2.d — Divider 2 (between recipient count and prize value) */}
      <SectionDivider />

      {/* D.x.2.e — Prize value block(s) */}
      <div className="pt-6 flex flex-col gap-0">
        {isDualPrize ? (
          /* D.5: two prize blocks with "Hoặc" separator */
          category.prizes.map((prize, i) => (
            <div key={i}>
              <PrizeValueBlock prize={prize} t={t} />
              {i < category.prizes.length - 1 && (
                <OrSeparator label={t("orSeparator")} />
              )}
            </div>
          ))
        ) : (
          <PrizeValueBlock prize={category.prizes[0]} t={t} />
        )}
      </div>
    </div>
  );

  return (
    <section
      id={category.slug}
      role="region"
      aria-labelledby={headingId}
      className="flex flex-col gap-[80px] scroll-mt-[80px]"
    >
      {/* FR-011: image position driven by imagePosition prop */}
      <div className="flex flex-col md:flex-row gap-[40px] items-start">
        {isImageLeft ? (
          <>
            {imageEl}
            {contentEl}
          </>
        ) : (
          <>
            {contentEl}
            {imageEl}
          </>
        )}
      </div>
    </section>
  );
}
