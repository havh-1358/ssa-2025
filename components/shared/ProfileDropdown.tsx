"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { ROUTES } from "@/lib/constants/routes";

type ProfileDropdownProps = {
  onClose: () => void;
};

export function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const t = useTranslations("userMenu");
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onClose();
    router.push(ROUTES.HOME);
  }

  const itemClass =
    "w-full flex items-center justify-between gap-1 h-14 px-4 rounded-[4px] " +
    "text-[14px] leading-5 font-semibold text-[var(--color-text-primary)] " +
    "hover:bg-[rgba(255,234,158,0.1)] " +
    "focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)] " +
    "transition-colors duration-150 cursor-pointer";

  return (
    <div
      role="menu"
      aria-label={t("profile")}
      className="absolute right-0 top-[calc(100%+8px)] z-[110]
        p-[6px] rounded-[8px]
        border border-[var(--color-profile-dropdown-border)]"
      style={{ background: "var(--color-profile-dropdown-bg)" }}
    >
      <Link
        href={ROUTES.DASHBOARD}
        role="menuitem"
        onClick={onClose}
        className={itemClass}
      >
        <span>{t("profile")}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
          <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 18c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </Link>
      <button
        type="button"
        role="menuitem"
        onClick={handleLogout}
        className={itemClass}
      >
        <span>{t("logout")}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
          <path d="M7 10h9m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
