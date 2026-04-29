"use client";

import { useEffect } from "react";
import type { Kudos } from "@/types/kudos";
import { useKudosFeed } from "@/hooks/useKudosFeed";
import { KudosCard } from "./KudosCard";

type KudosFeedProps = {
  initialKudos: Kudos[];
  currentUserId?: string | null;
  onRegisterPrepend?: (fn: (k: Kudos) => void) => void;
  onHashtagClick?: (tag: string) => void;
  activeHashtag?: string | null;
  activeDepartment?: string | null;
};

export function KudosFeed({
  initialKudos,
  currentUserId,
  onRegisterPrepend,
  onHashtagClick,
  activeHashtag,
  activeDepartment,
}: KudosFeedProps) {
  const {
    kudosList,
    isRefreshing,
    feedError,
    hasMore,
    filterHashtag,
    setFilterHashtag,
    setFilterDepartment,
    loadMore,
    prependKudos,
  } = useKudosFeed(initialKudos);

  // Expose prepend function to parent
  useEffect(() => {
    onRegisterPrepend?.(prependKudos);
  }, [prependKudos, onRegisterPrepend]);

  // Sync external filters from parent
  useEffect(() => {
    if (activeHashtag !== undefined) setFilterHashtag(activeHashtag ?? null);
  }, [activeHashtag, setFilterHashtag]);

  useEffect(() => {
    if (activeDepartment !== undefined) setFilterDepartment(activeDepartment ?? null);
  }, [activeDepartment, setFilterDepartment]);

  // Deep-link scroll (T045)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(`kudos-${hash}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [kudosList]);

  function handleHashtagClick(tag: string) {
    setFilterHashtag(filterHashtag === tag ? null : tag);
    onHashtagClick?.(tag);
  }

  if (feedError) {
    return (
      <div className="flex flex-col items-center gap-4 py-12" role="alert">
        <p
          className="font-[family-name:var(--font-montserrat)] text-[16px]
            leading-6 text-[var(--color-text-primary)] opacity-70 text-center"
        >
          {feedError}
        </p>
      </div>
    );
  }

  if (kudosList.length === 0 && !isRefreshing) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <p
          className="font-[family-name:var(--font-montserrat)] text-[16px]
            leading-6 text-[var(--color-text-primary)] opacity-70 text-center"
        >
          Be the first to send a Kudos! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--feed-gap)]">
      {isRefreshing && (
        <div
          role="status"
          aria-label="Refreshing kudos"
          className="text-center py-2 opacity-60"
        >
          <span className="font-[family-name:var(--font-montserrat)] text-[14px]
            text-[var(--color-text-primary)]">
            ↻ Updating...
          </span>
        </div>
      )}

      {kudosList.map((kudos) => (
        <KudosCard
          key={kudos.id}
          kudos={kudos}
          currentUserId={currentUserId}
          onHashtagClick={handleHashtagClick}
          activeHashtag={filterHashtag}
        />
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          className="self-center h-[44px] px-6 rounded-[var(--radius-btn)]
            bg-[var(--color-btn-secondary-bg)]
            border border-[var(--color-btn-secondary-border)]
            text-[var(--color-text-primary)]
            font-[family-name:var(--font-montserrat)] font-bold text-[14px]
            transition-colors duration-150 ease-in-out
            hover:bg-[rgba(255,234,158,0.2)]
            focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]"
        >
          Load more
        </button>
      )}
    </div>
  );
}
