import { useTranslations } from "next-intl";

export function EventInfoBlock() {
  const t = useTranslations("homepage");

  return (
    <div className="flex flex-col gap-2">
      {/* Row 1: Time + Venue */}
      <div className="flex flex-row flex-wrap gap-[60px]">
        {/* Time group */}
        <div className="flex flex-row items-baseline gap-2">
          <span
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[16px] leading-[24px] tracking-[0.15px]
              text-[var(--color-text-primary)]"
          >
            {t("eventTimeLabel")}
          </span>
          <span
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[24px] leading-[32px]
              text-[var(--color-accent-gold)]"
          >
            {t("eventDate")}
          </span>
        </div>

        {/* Venue group */}
        <div className="flex flex-row items-baseline gap-2">
          <span
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[16px] leading-[24px] tracking-[0.15px]
              text-[var(--color-text-primary)]"
          >
            {t("eventVenueLabel")}
          </span>
          <span
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[24px] leading-[32px]
              text-[var(--color-accent-gold)]"
          >
            {t("eventVenue")}
          </span>
        </div>
      </div>

      {/* Row 2: Livestream note */}
      <p
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[16px] leading-[24px] tracking-[0.5px]
          text-[var(--color-text-primary)]"
      >
        {t("livestream")}
      </p>
    </div>
  );
}
