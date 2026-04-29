"use client";

import { useCallback } from "react";
import { useLikeState } from "@/components/shared/LikeStateContext";
import { useSpecialDay } from "@/components/shared/SpecialDayContext";

export function useLike(
  kudosId: number,
  isOwnKudos: boolean,
  onError?: () => void
) {
  const { getState, setState } = useLikeState();
  const isSpecialDay = useSpecialDay();

  const state = getState(kudosId);
  const heartCount = state?.heartCount ?? 0;
  const likedByMe = state?.likedByMe ?? false;
  const isLiking = state?.isLiking ?? false;

  const toggleLike = useCallback(async () => {
    if (isOwnKudos || isLiking) return;

    const prevCount = heartCount;
    const prevLiked = likedByMe;
    const delta = isSpecialDay ? 2 : 1;

    setState(kudosId, {
      heartCount: likedByMe ? heartCount - delta : heartCount + delta,
      likedByMe: !likedByMe,
      isLiking: true,
    });

    try {
      const endpoint = `/api/kudos/${kudosId}/like`;
      const method = likedByMe ? "DELETE" : "POST";
      const res = await fetch(endpoint, { method });

      if (!res.ok) {
        setState(kudosId, { heartCount: prevCount, likedByMe: prevLiked, isLiking: false });
        onError?.();
        return;
      }

      const json = await res.json();
      setState(kudosId, {
        heartCount: json.data?.heartCount ?? prevCount,
        likedByMe: !prevLiked,
        isLiking: false,
      });
    } catch {
      setState(kudosId, { heartCount: prevCount, likedByMe: prevLiked, isLiking: false });
      onError?.();
    }
  }, [kudosId, isOwnKudos, isLiking, heartCount, likedByMe, isSpecialDay, setState, onError]);

  return { heartCount, likedByMe, isLiking, toggleLike };
}
