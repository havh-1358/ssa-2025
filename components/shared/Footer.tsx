"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";

type FooterNavItem = {
  key: string;
  labelKey: string;
  href: string;
};

const FOOTER_NAV_ITEMS: FooterNavItem[] = [
  { key: "home", labelKey: "nav.aboutSaa", href: ROUTES.HOME },
  { key: "awards", labelKey: "nav.awardInfo", href: ROUTES.AWARDS },
  { key: "kudos", labelKey: "nav.kudos", href: ROUTES.KUDOS },
  {
    key: "general-standards",
    labelKey: "nav.generalStandards",
    href: ROUTES.GENERAL_STANDARDS,
  },
];

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer
      className="w-full flex flex-row items-center justify-between
        px-[var(--spacing-footer-px)] py-[var(--spacing-footer-py)]
        bg-[var(--color-bg-base)]
        border-t border-[var(--color-divider)]"
    >
      {/* E.0 — Left group: Logo + Nav (gap 80px per Figma Frame 488) */}
      <div className="flex flex-row items-center gap-[80px]">
        {/* E.1 — Logo: MM_MEDIA_Logo 69×64px */}
        <Link href={ROUTES.HOME} aria-label={t("logoLabel")}>
          <Image
            src="/assets/auth/logos/mm-media-logo.png"
            alt="SAA 2025"
            width={69}
            height={64}
            className="object-contain"
          />
        </Link>

        {/* E.2 — Footer nav: 4 links, gap 48px, each 56px tall */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-row items-center gap-[48px]">
            {FOOTER_NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="h-[56px] px-[16px] flex items-center rounded-[4px]
                    font-[family-name:var(--font-montserrat)] font-bold
                    text-[16px] leading-[24px] tracking-[0.15px]
                    text-[var(--color-text-primary)]
                    hover:bg-[rgba(255,234,158,0.10)]
                    active:bg-[rgba(255,234,158,0.10)]
                    focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]
                    transition-colors duration-150"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* E.3 — Copyright: Montserrat Alternates 700 16px */}
      <p
        className="font-[family-name:var(--font-montserrat-alt)] font-bold
          text-[16px] leading-[24px] text-center text-[var(--color-text-primary)]"
      >
        {t("copyright")}
      </p>
    </footer>
  );
}
