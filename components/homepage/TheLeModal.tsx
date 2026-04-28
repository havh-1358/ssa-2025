"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";

type TheLeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
};

export function TheLeModal({
  isOpen,
  onClose,
  isAuthenticated,
}: TheLeModalProps) {
  const t = useTranslations("theLeModal");
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleWriteKudos() {
    onClose();
    if (isAuthenticated) {
      router.push(ROUTES.KUDOS);
    } else {
      router.push(ROUTES.LOGIN);
    }
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[150] flex items-center justify-center
        bg-[var(--color-overlay)]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="the-le-title"
        className="relative w-full max-w-[680px] mx-4
          max-h-[90vh] overflow-y-auto
          rounded-[8px]
          bg-[var(--color-bg-base)]
          border border-[var(--color-divider)]
          p-8 flex flex-col gap-6"
      >
        {/* Title */}
        <h2
          id="the-le-title"
          className="font-[family-name:var(--font-montserrat)] font-bold
            text-[45px] leading-[56px]
            text-[var(--color-accent-gold)]"
        >
          {t("title")}
        </h2>

        {/* Section A — Người nhận */}
        <section className="flex flex-col gap-2">
          <h3
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[20px] leading-[28px] text-[var(--color-text-primary)]"
          >
            A. {t("sectionATitle")}
          </h3>
          <p
            className="font-[family-name:var(--font-montserrat)]
              text-[16px] leading-[24px] text-[var(--color-text-primary)] whitespace-pre-line"
          >
            {t("sectionABody")}
          </p>
        </section>

        {/* Section B — Người gửi */}
        <section className="flex flex-col gap-2">
          <h3
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[20px] leading-[28px] text-[var(--color-text-primary)]"
          >
            B. {t("sectionBTitle")}
          </h3>
          <p
            className="font-[family-name:var(--font-montserrat)]
              text-[16px] leading-[24px] text-[var(--color-text-primary)]"
          >
            {t("sectionBBody")}
          </p>
        </section>

        {/* Section C — Kudos Quốc Dân */}
        <section className="flex flex-col gap-2">
          <h3
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[20px] leading-[28px] text-[var(--color-text-primary)]"
          >
            C. {t("sectionCTitle")}
          </h3>
          <p
            className="font-[family-name:var(--font-montserrat)]
              text-[16px] leading-[24px] text-[var(--color-text-primary)]"
          >
            {t("sectionCBody")}
          </p>
        </section>

        {/* Footer buttons */}
        <div className="flex flex-row gap-4 justify-end pt-2">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="h-[48px] px-6 rounded-[4px]
              border border-[var(--color-btn-secondary-border)]
              font-[family-name:var(--font-montserrat)] font-bold
              text-[16px] tracking-[0.5px] text-[var(--color-text-primary)]
              hover:bg-[var(--color-btn-secondary-hover)]
              focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]
              transition-colors duration-150"
          >
            {t("closeBtn")}
          </button>

          <button
            type="button"
            onClick={handleWriteKudos}
            className="h-[48px] px-6 rounded-[4px]
              bg-[var(--color-accent-gold)]
              font-[family-name:var(--font-montserrat)] font-bold
              text-[16px] tracking-[0.5px] text-[var(--color-bg-base)]
              hover:opacity-90
              focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]
              transition-opacity duration-150"
          >
            {t("writeKudosBtn")}
          </button>
        </div>
      </div>
    </div>
  );
}
