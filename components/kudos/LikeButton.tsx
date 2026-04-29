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
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={likedByMe ? "like-btn-bounce" : ""}
      >
        <path
          d="M16.4505 28.1424L14.5172 26.3825C7.65052 20.1558 3.11719 16.0358 3.11719 11.0091C3.11719 6.88911 6.34385 3.67578 10.4505 3.67578C12.7705 3.67578 14.9972 4.75578 16.4505 6.44911C17.9039 4.75578 20.1305 3.67578 22.4505 3.67578C26.5572 3.67578 29.7839 6.88911 29.7839 11.0091C29.7839 16.0358 25.2505 20.1558 18.3839 26.3825L16.4505 28.1424Z"
          fill="#D4271D"
        />
      </svg>
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
