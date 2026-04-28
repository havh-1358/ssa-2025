"use client";

import { useEffect } from "react";
import { useLike } from "@/hooks/useLike";
import { useLikeState } from "@/components/shared/LikeStateContext";
import { useSpecialDay } from "@/components/shared/SpecialDayContext";
import type { KudosLocalState } from "@/types/kudos";

type LikeButtonProps = {
  kudosId: number;
  initialHeartCount: number;
  isOwnKudos: boolean;
  likedByMeInitial?: boolean;
};

export function LikeButton({
  kudosId,
  initialHeartCount,
  isOwnKudos,
  likedByMeInitial = false,
}: LikeButtonProps) {
  const { initState } = useLikeState();
  const isSpecialDay = useSpecialDay();

  useEffect(() => {
    initState(kudosId, {
      heartCount: initialHeartCount,
      likedByMe: likedByMeInitial,
      isLiking: false,
    } satisfies KudosLocalState);
  }, [kudosId, initialHeartCount, likedByMeInitial, initState]);

  const { heartCount, likedByMe, isLiking, toggleLike } = useLike(
    kudosId,
    isOwnKudos
  );

  const formatted = new Intl.NumberFormat("vi-VN").format(heartCount);
  const disabled = isOwnKudos || isLiking;

  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={disabled}
      aria-pressed={likedByMe}
      aria-label={`${likedByMe ? "Unlike" : "Like"} kudos. ${formatted} hearts${isSpecialDay ? " (x2 on special day)" : ""}`}
      className={[
        "flex items-center gap-2 min-h-[44px] px-3 py-2",
        "rounded-[var(--radius-btn)] transition-colors duration-150 ease-in-out",
        "font-[family-name:var(--font-montserrat)] font-bold text-[16px] leading-6",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
        likedByMe
          ? "text-[var(--color-accent-gold)]"
          : "text-[var(--color-kudos-text)] hover:text-[var(--color-accent-gold)]",
      ].join(" ")}
    >
      <span aria-hidden="true" className={likedByMe ? "like-btn-bounce" : ""}>
        ♥
      </span>
      <span aria-live="polite">{formatted}</span>
      {isSpecialDay && (
        <span
          className="text-[12px] font-bold text-[var(--color-accent-gold)] leading-4"
          aria-hidden="true"
        >
          ×2
        </span>
      )}
    </button>
  );
}
