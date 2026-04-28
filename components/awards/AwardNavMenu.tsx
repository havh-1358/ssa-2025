"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { AwardCategory } from "@/types/awards";
import { AwardNavItem } from "./AwardNavItem";

type AwardNavMenuProps = {
  categories: AwardCategory[];
  activeSlug: string;
  focusedIndex: number;
  onActivate: (slug: string, index: number) => void;
  onFocusChange: (index: number) => void;
  panelHeadingRef: React.RefObject<HTMLElement | null>;
};

export function AwardNavMenu({
  categories,
  activeSlug,
  focusedIndex,
  onActivate,
  onFocusChange,
  panelHeadingRef,
}: AwardNavMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activate = useCallback(
    (slug: string, index: number) => {
      onActivate(slug, index);
      // router.replace — no new history entry (T021)
      router.replace(`${pathname}#${slug}`);
    },
    [onActivate, router, pathname]
  );

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = categories.length - 1;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = index < last ? index + 1 : 0;
        onFocusChange(next);
        itemRefs.current[next]?.focus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = index > 0 ? index - 1 : last;
        onFocusChange(prev);
        itemRefs.current[prev]?.focus();
        break;
      }
      case "Home": {
        e.preventDefault();
        onFocusChange(0);
        itemRefs.current[0]?.focus();
        break;
      }
      case "End": {
        e.preventDefault();
        onFocusChange(last);
        itemRefs.current[last]?.focus();
        break;
      }
      case "Enter": {
        e.preventDefault();
        const cat = categories[index];
        activate(cat.slug, index);
        // Move focus to panel heading after activation (T012, T025)
        requestAnimationFrame(() => {
          panelHeadingRef.current?.focus();
        });
        break;
      }
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Award categories"
      className="flex md:flex-col gap-[var(--left-nav-gap)]
        w-full md:w-[178px] shrink-0
        overflow-x-auto md:overflow-x-visible
        pb-2 md:pb-0"
    >
      {categories.map((cat, i) => {
        const tabId = `award-tab-${cat.slug}`;
        const panelId = `award-panel-${cat.slug}`;
        const isActive = cat.slug === activeSlug;
        return (
          <div
            key={cat.slug}
            ref={(el) => {
              itemRefs.current[i] =
                el?.querySelector("button") as HTMLButtonElement | null;
            }}
            className="shrink-0"
          >
            <AwardNavItem
              id={tabId}
              panelId={panelId}
              label={cat.name}
              isActive={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                onFocusChange(i);
                activate(cat.slug, i);
              }}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          </div>
        );
      })}
    </div>
  );
}
