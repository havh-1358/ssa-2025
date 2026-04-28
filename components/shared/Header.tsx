"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";
import { LanguageSelector } from "./LanguageSelector";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { UserProfileButton } from "./UserProfileButton";

type NavItem = {
  key: string;
  labelKey: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: "home", labelKey: "nav.aboutSaa", href: ROUTES.HOME },
  { key: "awards", labelKey: "nav.awardInfo", href: ROUTES.AWARDS },
  { key: "kudos", labelKey: "nav.kudos", href: ROUTES.KUDOS },
];

export type HeaderProps = {
  activeNav?: string;
  user?: { email: string } | null;
};

export function Header({ activeNav = "", user }: HeaderProps) {
  const t = useTranslations("homepage");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Close drawer when viewport crosses ≥768px (T017)
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  function openMenu() {
    setIsMenuOpen(true);
  }

  function closeMenu() {
    setIsMenuOpen(false);
    hamburgerRef.current?.focus();
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100]
          h-[var(--header-height)]
          flex items-center justify-between
          px-4 md:px-[var(--header-padding-x)]
          py-[var(--header-padding-y)]"
        style={{ background: "var(--color-header-bg)" }}
      >
        {/* Logo with a11y label (T015) */}
        <Link
          href={ROUTES.HOME}
          aria-label={t("nav.logoLabel")}
          className="flex items-center shrink-0
            focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]
            focus-visible:rounded-[4px]"
        >
          <Image
            src="/assets/auth/logos/mm-media-logo.png"
            alt="SSA 2025"
            width={52}
            height={48}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav — hidden on mobile (T039) */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={[
                  "font-[family-name:var(--font-montserrat)] font-bold",
                  "text-[14px] leading-5 tracking-[0.1px]",
                  "px-4 py-4 rounded-[4px]",
                  "transition-colors duration-150 ease-in-out",
                  "focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]",
                  isActive
                    ? "text-[var(--color-nav-active)] border-b border-[var(--color-nav-active)]"
                    : "text-[var(--color-nav-default)] hover:bg-white/10",
                ]
                  .join(" ")}
                aria-current={isActive ? "page" : undefined}
                style={
                  isActive
                    ? {
                        textShadow:
                          "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287",
                      }
                    : undefined
                }
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Right side: profile, language selector + hamburger (mobile only) */}
        <div className="flex items-center gap-3">
          {user && <UserProfileButton email={user.email} />}
          <LanguageSelector />

          {/* Hamburger button — visible only on mobile (T016, T039) */}
          <button
            ref={hamburgerRef}
            type="button"
            className="md:hidden flex items-center justify-center
              w-10 h-10 rounded-[4px]
              text-[var(--color-text-primary)]
              transition-colors duration-150 ease-in-out
              hover:bg-white/10
              focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]"
            aria-label={isMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-drawer"
            onClick={isMenuOpen ? closeMenu : openMenu}
          >
            {isMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 12h18M3 6h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile nav drawer (T022) */}
      <MobileNavDrawer
        id="mobile-nav-drawer"
        isOpen={isMenuOpen}
        activeNav={activeNav}
        onClose={closeMenu}
      />
    </>
  );
}
