"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import FocusTrap from "focus-trap-react";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/useLocale";
import { SUPPORTED_LOCALES, LocaleCode } from "@/lib/locale";

const FLAG_PATHS: Record<LocaleCode, string> = {
  vi: "/assets/flags/vn.svg",
  en: "/assets/flags/en.svg",
};

type ChevronProps = { open: boolean };

function Chevron({ open }: ChevronProps) {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-150 ease-out ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LocaleOptionProps = {
  locale: LocaleCode;
  isSelected: boolean;
  isFocused: boolean;
  label: string;
  ariaLabel: string;
  onSelect: (locale: LocaleCode) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>, locale: LocaleCode) => void;
  optionRef: (el: HTMLElement | null) => void;
};

function LocaleOption({
  locale,
  isSelected,
  label,
  ariaLabel,
  onSelect,
  onKeyDown,
  optionRef,
}: LocaleOptionProps) {
  const selectedBg = isSelected
    ? "bg-[var(--color-option-selected-bg)]"
    : "bg-transparent";

  return (
    <li
      role="option"
      aria-selected={isSelected}
      aria-label={ariaLabel}
      tabIndex={isSelected ? 0 : -1}
      ref={optionRef}
      className={`flex items-center gap-3 px-4 py-4 rounded-[4px] cursor-pointer
        ${selectedBg}
        hover:bg-[var(--color-option-hover-bg)]
        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]
        transition-colors duration-100 ease-out`}
      onClick={() => onSelect(locale)}
      onKeyDown={(e) => onKeyDown(e, locale)}
    >
      <Image
        src={FLAG_PATHS[locale]}
        alt=""
        aria-hidden="true"
        width={24}
        height={16}
        className="object-cover shrink-0"
      />
      <span
        className="font-[family-name:var(--font-montserrat)] font-bold text-[16px] leading-6 text-[var(--color-text-option)]"
      >
        {label}
      </span>
    </li>
  );
}

export function LanguageSelector() {
  const t = useTranslations("languageSelector");
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLElement | null)[]>([]);

  const openDropdown = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const handleSelect = useCallback(
    (next: LocaleCode) => {
      setLocale(next);
      closeDropdown();
    },
    [setLocale, closeDropdown]
  );

  // Close on outside click/focus-out
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current?.parentElement?.contains(target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen, closeDropdown]);

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDropdown();
        // Move focus to currently selected or first option after open
        requestAnimationFrame(() => {
          const selectedIndex = SUPPORTED_LOCALES.indexOf(locale);
          const focusIndex = selectedIndex >= 0 ? selectedIndex : 0;
          optionRefs.current[focusIndex]?.focus();
        });
      }
    },
    [openDropdown, locale]
  );

  const handleOptionKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>, optionLocale: LocaleCode) => {
      const currentIndex = SUPPORTED_LOCALES.indexOf(optionLocale);
      const total = SUPPORTED_LOCALES.length;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          handleSelect(optionLocale);
          break;
        case "ArrowDown":
          e.preventDefault();
          optionRefs.current[(currentIndex + 1) % total]?.focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          optionRefs.current[(currentIndex - 1 + total) % total]?.focus();
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;
      }
    },
    [handleSelect, closeDropdown]
  );

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t("ariaLabel")}
        className={`flex items-center gap-2 px-2 py-2 rounded-[4px] cursor-pointer
          min-w-[44px] min-h-[44px]
          hover:bg-white/10
          focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]
          transition-colors duration-100 ease-out
          ${isOpen ? "bg-white/10" : "bg-transparent"}`}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
      >
        <Image
          src={FLAG_PATHS[locale]}
          alt=""
          aria-hidden="true"
          width={24}
          height={16}
          className="object-cover shrink-0"
          suppressHydrationWarning
        />
        <span
          suppressHydrationWarning
          className="font-[family-name:var(--font-montserrat)] font-bold text-[16px] leading-6 text-white"
        >
          {t(`options.${locale}`)}
        </span>
        <Chevron open={isOpen} />
      </button>

      {isOpen && (
        <FocusTrap
          active={isOpen}
          focusTrapOptions={{
            allowOutsideClick: true,
            escapeDeactivates: false,
            onDeactivate: closeDropdown,
          }}
        >
          <div
            className={`absolute right-0 top-full mt-1 z-[999]
              w-[215px] min-h-[304px]
              rounded-[8px] border border-[var(--color-dropdown-border)]
              bg-[var(--color-dropdown-bg)]
              shadow-[0_8px_32px_rgba(0,0,0,0.48)]
              py-3
              animate-in fade-in zoom-in-95 duration-150 ease-out`}
          >
            <ul
              role="listbox"
              aria-label={t("ariaLabel")}
              className="flex flex-col gap-0"
            >
              {SUPPORTED_LOCALES.map((loc, i) => (
                <LocaleOption
                  key={loc}
                  locale={loc}
                  isSelected={loc === locale}
                  isFocused={false}
                  label={t(`options.${loc}`)}
                  ariaLabel={t(`optionAriaLabel.${loc}`)}
                  onSelect={handleSelect}
                  onKeyDown={handleOptionKeyDown}
                  optionRef={(el) => {
                    optionRefs.current[i] = el;
                  }}
                />
              ))}
            </ul>
          </div>
        </FocusTrap>
      )}
    </div>
  );
}
