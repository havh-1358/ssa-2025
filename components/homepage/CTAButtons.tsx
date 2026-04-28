"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";

export function CTAButtons() {
  const router = useRouter();
  const t = useTranslations("homepage");

  function handleAboutSAA() {
    const target = document.getElementById("award-system");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleKudos() {
    router.push(ROUTES.KUDOS);
  }

  return (
    <div
      className="flex flex-row flex-wrap gap-[var(--btn-gap)]
        justify-center md:justify-start"
    >
      <button
        type="button"
        onClick={handleAboutSAA}
        className="h-[60px] min-w-[276px] rounded-[var(--radius-btn)]
          bg-[var(--color-accent-gold)] text-[var(--color-bg-base)]
          px-[var(--btn-padding-x)] py-[var(--btn-padding-y)]
          font-[family-name:var(--font-montserrat)] font-bold
          text-[16px] leading-6
          transition-all duration-150 ease-in-out
          hover:opacity-90 hover:scale-[1.02]
          active:opacity-80 active:scale-[0.98]
          focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)] focus-visible:outline-offset-2"
      >
        {t("ctaAboutSaa")}
      </button>

      <button
        type="button"
        onClick={handleKudos}
        className="h-[60px] min-w-[180px] rounded-[var(--radius-btn)]
          bg-[var(--color-btn-secondary-bg)]
          border border-[var(--color-btn-secondary-border)]
          text-[var(--color-text-primary)]
          px-[var(--btn-padding-x)] py-[var(--btn-padding-y)]
          font-[family-name:var(--font-montserrat)] font-bold
          text-[16px] leading-6
          transition-all duration-150 ease-in-out
          hover:bg-[rgba(255,234,158,0.2)]
          active:bg-[rgba(255,234,158,0.15)]
          focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)] focus-visible:outline-offset-2"
      >
        {t("ctaKudos")}
      </button>
    </div>
  );
}
