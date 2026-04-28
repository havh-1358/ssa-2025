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
};

export function CountdownTimer({
  launchAtISO,
  dayUnit,
  hourUnit,
  minuteUnit,
}: CountdownTimerProps) {
  const t = useTranslations("countdown");
  const router = useRouter();
  const launchAt = new Date(launchAtISO);
  const { days, hours, minutes, isExpired } = useCountdown(launchAt);

  // Redirect immediately when countdown expires (FR-005, FR-005a)
  useEffect(() => {
    if (isExpired) {
      router.push(ROUTES.LOGIN);
    }
  }, [isExpired, router]);

  return (
    <div aria-label={t("ariaLabel")}>
      <div
        aria-live="polite"
        className="flex flex-row gap-[var(--gap-digit-blocks)] flex-wrap justify-center items-start"
      >
        <DigitBlock value={days} unit={dayUnit} />
        <DigitBlock value={hours} unit={hourUnit} />
        <DigitBlock value={minutes} unit={minuteUnit} />
      </div>
    </div>
  );
}
