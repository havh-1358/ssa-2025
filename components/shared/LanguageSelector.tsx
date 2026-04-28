"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
  return (
    <li
      role="option"
      aria-selected={isSelected}
      aria-label={ariaLabel}
      tabIndex={0}
      ref={optionRef}
      className={`flex flex-row items-center justify-between px-4 py-0
        h-[56px] w-full cursor-pointer
        ${isSelected
          ? "bg-[var(--color-option-selected-bg)] rounded-[2px]"
          : "bg-transparent rounded-[4px]"
        }
        hover:bg-[var(--color-option-hover-bg)]
        focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]
        transition-colors duration-100 ease-out`}
      onClick={() => onSelect(locale)}
      onKeyDown={(e) => onKeyDown(e, locale)}
    >
      <span className="flex flex-row items-center gap-1">
        <Image
          src={FLAG_PATHS[locale]}
          alt=""
          aria-hidden="true"
          width={24}
          height={16}
          className="object-cover shrink-0"
        />
        <span className="font-[family-name:var(--font-montserrat)] font-bold
          text-[16px] leading-6 tracking-[0.15px] text-center
          text-[var(--color-text-option)]">
          {label}
        </span>
      </span>
    </li>
  );
}

export function LanguageSelector() {
  const t = useTranslations("languageSelector");
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLElement | null)[]>([]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const openDropdown = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleSelect = useCallback(
    (next: LocaleCode) => {
      setLocale(next);
      closeDropdown();
    },
    [setLocale, closeDropdown]
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen]);

  // Focus first/selected option after open
  useEffect(() => {
    if (!isOpen) return;
    const selectedIndex = SUPPORTED_LOCALES.indexOf(locale);
    const focusIndex = selectedIndex >= 0 ? selectedIndex : 0;
    // Defer to ensure DOM is committed
    const id = requestAnimationFrame(() => {
      optionRefs.current[focusIndex]?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen, locale]);

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isOpen) {
          closeDropdown();
        } else {
          openDropdown();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeDropdown();
      }
    },
    [isOpen, openDropdown, closeDropdown]
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
        case "Tab":
        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;
      }
    },
    [handleSelect, closeDropdown]
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t("ariaLabel")}
        className={`flex flex-row items-center justify-between gap-[2px]
          w-[108px] h-[56px] px-4 rounded-[4px] cursor-pointer
          hover:bg-white/10
          focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]
          transition-colors duration-100 ease-out
          ${isOpen ? "bg-white/10" : "bg-transparent"}`}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
      >
        {/* Frame 485 — flag + locale label, 53×24px, gap 4px */}
        <span className="flex flex-row items-center gap-1">
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
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[16px] leading-6 tracking-[0.15px] text-white text-center"
          >
            {t(`options.${locale}`)}
          </span>
        </span>
        <Chevron open={isOpen} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t("ariaLabel")}
          className="absolute right-0 top-full mt-1 z-[999]
            w-[122px] p-[6px]
            rounded-[8px] border border-[var(--color-dropdown-border)]
            bg-[var(--color-dropdown-bg)]"
        >
          <ul role="presentation" className="flex flex-col gap-0">
            {SUPPORTED_LOCALES.map((loc, i) => (
              <LocaleOption
                key={loc}
                locale={loc}
                isSelected={loc === locale}
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
      )}
    </div>
  );
}
