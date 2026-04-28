"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";

const UpArrow = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.49945 18.3095L5.68945 15.4995L12.0595 9.11945H7.10945V5.68945H18.3095V16.8895H14.8895V11.9395L8.49945 18.3095Z"
      fill="currentColor"
    />
  </svg>
);

export function CTAButtons() {
  const router = useRouter();
  const t = useTranslations("homepage");

  return (
    <div
      className="flex flex-row flex-wrap gap-[var(--btn-gap)]
        justify-center md:justify-start"
    >
      {/* B3.1 — Primary: ABOUT AWARDS → /awards — 276×60px gold */}
      <button
        type="button"
        onClick={() => router.push(ROUTES.AWARDS)}
        className="inline-flex items-center gap-2 whitespace-nowrap
          w-[276px] h-[60px] rounded-[8px]
          bg-[var(--color-accent-gold)] text-[var(--color-bg-base)]
          px-6 py-4
          font-[family-name:var(--font-montserrat)] font-bold
          text-[22px] leading-[28px]
          transition-all duration-150 ease-in-out
          hover:opacity-90 hover:scale-[1.02]
          active:opacity-80 active:scale-[0.98]
          focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)] focus-visible:outline-offset-2"
      >
        {t("ctaAboutSaa")}
        <UpArrow />
      </button>

      {/* B3.2 — Secondary: ABOUT KUDOS → /kudos — 254×60px outlined */}
      <button
        type="button"
        onClick={() => router.push(ROUTES.KUDOS)}
        className="inline-flex items-center gap-2 whitespace-nowrap
          w-[254px] h-[60px] rounded-[8px]
          bg-[var(--color-btn-secondary-bg)]
          border border-[var(--color-btn-secondary-border)]
          text-[var(--color-text-primary)]
          px-6 py-4
          font-[family-name:var(--font-montserrat)] font-bold
          text-[22px] leading-[28px]
          transition-all duration-150 ease-in-out
          hover:bg-[var(--color-btn-secondary-hover)]
          active:bg-[var(--color-btn-secondary-active)]
          focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)] focus-visible:outline-offset-2"
      >
        {t("ctaKudos")}
        <UpArrow />
      </button>
    </div>
  );
}
