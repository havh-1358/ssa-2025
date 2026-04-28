"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("auth");

  return (
    <footer
      className="w-full flex items-center justify-between
        px-[var(--spacing-footer-px)] py-[var(--spacing-footer-py)]
        border-t border-[var(--color-divider)]
        sm:px-5 sm:py-6"
    >
      <p
        className="font-[family-name:var(--font-montserrat-alt)] font-bold
          text-[16px] leading-6 text-[var(--color-text-primary)]"
      >
        {t("copyright")}
      </p>
    </footer>
  );
}
