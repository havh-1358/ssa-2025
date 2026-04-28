"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCountdown } from "@/hooks/useCountdown";
import { DigitBlock } from "./DigitBlock";
import { ROUTES } from "@/lib/constants/routes";

type CountdownTimerProps = {
  launchAtISO: string;
  dayUnit: string;
  hourUnit: string;
  minuteUnit: string;
  /**
   * When true (default — used by the pre-launch CountdownPage), redirect to
   * /login when the countdown expires. The HomePage HeroSection MUST set this
   * to false to avoid a redirect loop (the homepage countdown targets the
   * event end, not the platform launch).
   */
  redirectOnExpire?: boolean;
  /** Visual variant — "homepage" uses 51.2×82 cards per Homepage SAA spec. */
  variant?: "prelaunch" | "homepage";
};

export function CountdownTimer({
  launchAtISO,
  dayUnit,
  hourUnit,
  minuteUnit,
  redirectOnExpire = true,
  variant = "prelaunch",
}: CountdownTimerProps) {
  const t = useTranslations("countdown");
  const router = useRouter();
  const { days, hours, minutes, isExpired } = useCountdown(launchAtISO);

  useEffect(() => {
    if (isExpired && redirectOnExpire) {
      router.push(ROUTES.LOGIN);
    }
  }, [isExpired, redirectOnExpire, router]);

  return (
    <div aria-label={t("ariaLabel")}>
      <div
        aria-live="polite"
        className="flex flex-row gap-[var(--gap-digit-blocks)] flex-wrap justify-center items-start"
      >
        <DigitBlock value={days} unit={dayUnit} variant={variant} />
        <DigitBlock value={hours} unit={hourUnit} variant={variant} />
        <DigitBlock value={minutes} unit={minuteUnit} variant={variant} />
      </div>
    </div>
  );
}
