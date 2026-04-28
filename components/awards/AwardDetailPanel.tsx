"use client";

import { useRef, type RefObject } from "react";
import type { AwardCategory } from "@/types/awards";
import { AwardCategorySection } from "./AwardCategorySection";

type AwardDetailPanelProps = {
  categories: AwardCategory[];
  activeSlug: string;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  headingRef: RefObject<HTMLElement | null>;
};

function PanelSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse" aria-hidden="true">
      <div className="h-10 bg-white/10 rounded w-1/2" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 pb-6 border-b border-[var(--color-divider)]"
        >
          <div className="h-6 bg-white/10 rounded w-1/4" />
          <div className="h-4 bg-white/10 rounded w-1/6" />
          <div className="h-6 bg-white/10 rounded w-1/3 self-end" />
        </div>
      ))}
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-2/3" />
    </div>
  );
}

export function AwardDetailPanel({
  categories,
  activeSlug,
  isLoading,
  error,
  onRetry,
  headingRef,
}: AwardDetailPanelProps) {
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading award information"
        className="flex-1 min-w-0"
      >
        <PanelSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex-1 min-w-0 flex flex-col items-center justify-center gap-6 py-16"
      >
        <p
          className="font-[family-name:var(--font-montserrat)]
            text-[16px] leading-6 text-[var(--color-text-primary)] opacity-70 text-center"
        >
          {error}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="h-[44px] px-6 rounded-[var(--radius-btn)]
            bg-[var(--color-btn-secondary-bg)]
            border border-[var(--color-btn-secondary-border)]
            text-[var(--color-text-primary)]
            font-[family-name:var(--font-montserrat)] font-bold text-[14px]
            transition-colors duration-150 ease-in-out
            hover:bg-[rgba(255,234,158,0.2)]
            focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      {categories.map((cat) => {
        const panelId = `award-panel-${cat.slug}`;
        const tabId = `award-tab-${cat.slug}`;
        const headingId = `award-heading-${cat.slug}`;
        const isActive = cat.slug === activeSlug;

        return (
          <div
            key={cat.slug}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive}
            // 150ms fade-in on panel switch; disabled via prefers-reduced-motion (T036)
            className="award-panel-fade"
          >
            <AwardCategorySection
              category={cat}
              headingId={headingId}
              headingRef={isActive ? (headingRef as RefObject<HTMLHeadingElement>) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
