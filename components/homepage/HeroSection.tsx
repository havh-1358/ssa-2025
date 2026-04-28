import Image from "next/image";
import { useTranslations } from "next-intl";
import { CountdownTimer } from "@/components/countdown/CountdownTimer";
import { CTAButtons } from "./CTAButtons";

type HeroSectionProps = {
  launchAtISO: string;
};

export function HeroSection({ launchAtISO }: HeroSectionProps) {
  const t = useTranslations("homepage");
  const tc = useTranslations("countdown");

  return (
    <section
      id="main-content"
      className="relative z-[2] flex flex-col items-center md:items-start
        px-4 md:px-[var(--content-padding-x)]
        pt-[calc(var(--header-height)+var(--content-padding-y))]
        pb-[var(--content-padding-y)]
        gap-8"
    >
      {/* SAA 2025 brand logo */}
      <Image
        src="/assets/homepage/saa-2025-logo.png"
        alt="SAA 2025"
        width={451}
        height={200}
        priority
        className="w-[200px] h-auto md:w-[300px] xl:w-[451px] object-contain"
      />

      {/* Coming soon label */}
      <p
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[20px] md:text-[24px] leading-8 text-[var(--color-text-primary)] text-center md:text-left"
      >
        {t("comingSoon")}
      </p>

      {/* Countdown timer */}
      <CountdownTimer
        launchAtISO={launchAtISO}
        dayUnit={tc("days")}
        hourUnit={tc("hours")}
        minuteUnit={tc("minutes")}
      />

      {/* Event info */}
      <div className="flex flex-col gap-2 text-center md:text-left">
        <p
          className="font-[family-name:var(--font-montserrat)]
            text-[16px] md:text-[18px] leading-7 text-[var(--color-text-primary)]"
        >
          {t("tagline")}
        </p>
        <p
          className="font-[family-name:var(--font-montserrat)]
            text-[14px] leading-5 text-[var(--color-text-primary)] opacity-80"
        >
          {t("livestream")}
        </p>
      </div>

      {/* CTA buttons */}
      <CTAButtons />
    </section>
  );
}
