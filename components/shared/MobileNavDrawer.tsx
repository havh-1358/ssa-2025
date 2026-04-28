"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";
import { LanguageSelector } from "./LanguageSelector";
import { useFocusTrap } from "@/hooks/useFocusTrap";

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

type MobileNavDrawerProps = {
  id: string;
  isOpen: boolean;
  activeNav: string;
  onClose: () => void;
};

export function MobileNavDrawer({
  id,
  isOpen,
  activeNav,
  onClose,
}: MobileNavDrawerProps) {
  const t = useTranslations("homepage");

  // Focus trap: activated when drawer is open (T020)
  const drawerRef = useFocusTrap(isOpen);

  // Escape key close (T021c)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    /* Backdrop — click outside to close (T021b) */
    <div
      className="md:hidden fixed inset-0 z-[99]"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
      aria-hidden="true"
    >
      {/* Drawer panel — stop propagation so click inside doesn't close */}
      <nav
        id={id}
        ref={drawerRef as React.RefObject<HTMLElement>}
        className="absolute top-[var(--header-height)] left-0 right-0
          w-full p-4 flex flex-col gap-2"
        style={{ background: "rgba(16, 20, 23, 0.95)" }}
        aria-label="Mobile navigation"
        onClick={(e) => e.stopPropagation()}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={onClose}
              className={[
                "font-[family-name:var(--font-montserrat)] font-bold",
                "text-[14px] leading-5 tracking-[0.1px]",
                "px-4 py-4 rounded-[4px]",
                "transition-colors duration-150 ease-in-out",
                "focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]",
                isActive
                  ? "text-[var(--color-nav-active)] border-b border-[var(--color-nav-active)]"
                  : "text-[var(--color-nav-default)] hover:bg-white/10",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              {t(item.labelKey)}
            </Link>
          );
        })}

        <div className="mt-2 px-4">
          <LanguageSelector />
        </div>
      </nav>
    </div>
  );
}
