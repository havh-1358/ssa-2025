import Image from "next/image";
import { useTranslations } from "next-intl";
import { CountdownTimer } from "@/components/countdown/CountdownTimer";
import { CTAButtons } from "./CTAButtons";
import { EventInfoBlock } from "./EventInfoBlock";

type HeroSectionProps = {
  /** When platform opens — kept for future use; not used by homepage countdown */
  launchAtISO: string;
  /** Homepage countdown target — when the SAA event ends */
  eventEndAtISO: string;
};

export function HeroSection({ eventEndAtISO }: HeroSectionProps) {
  const t = useTranslations("homepage");
  const tc = useTranslations("countdown");

  return (
    <section
      id="main-content"
      className="relative z-[2] flex flex-col items-center md:items-start
        px-4 md:px-[var(--content-padding-x)]
        pt-[calc(var(--header-height)+var(--content-padding-y))]
        pb-[var(--content-padding-y)]
        gap-10"
    >
      {/* B.1 — SAA 2025 brand logo (Root Further) */}
      <Image
        src="/assets/homepage/root_thurther-logo.svg"
        alt="SAA 2025 — Root Further"
        width={451}
        height={200}
        priority
        className="w-[451px] h-[200px] object-contain flex-none"
      />

      {/* Frame 523 — Coming Soon + Countdown + Event Info (internal gap 16px) */}
      <div
        className="flex flex-col gap-4
          items-center md:items-start w-full"
      >
        {/* B1_Countdown time — Coming Soon label + Countdown digits */}
        <div
          className="flex flex-col gap-4
            items-center md:items-start w-full"
        >
          {/* B.0 — Coming Soon label */}
          <p
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[24px] leading-[32px]
              text-[var(--color-text-primary)]
              w-full flex items-center"
          >
            {t("comingSoon")}
          </p>

          {/* B.2 — Countdown digits */}
          <CountdownTimer
            launchAtISO={eventEndAtISO}
            dayUnit={tc("days")}
            hourUnit={tc("hours")}
            minuteUnit={tc("minutes")}
            redirectOnExpire={false}
            variant="homepage"
          />
        </div>

        {/* B.3 — Event info block (time / venue / livestream) */}
        <EventInfoBlock />
      </div>

      {/* B.4 — CTA buttons */}
      <CTAButtons />
    </section>
  );
}
