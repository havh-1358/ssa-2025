"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { KudosLocalState } from "@/types/kudos";

type LikeStateMap = Map<number, KudosLocalState>;

interface LikeStateContextValue {
  getState: (kudosId: number) => KudosLocalState | undefined;
  setState: (kudosId: number, update: Partial<KudosLocalState>) => void;
  initState: (kudosId: number, initial: KudosLocalState) => void;
}

const LikeStateContext = createContext<LikeStateContextValue | null>(null);

export function LikeStateProvider({
  children,
  initialMap = new Map(),
}: {
  children: ReactNode;
  initialMap?: LikeStateMap;
}) {
  const [map, setMap] = useState<LikeStateMap>(initialMap);

  const getState = useCallback(
    (kudosId: number) => map.get(kudosId),
    [map]
  );

  const setState = useCallback(
    (kudosId: number, update: Partial<KudosLocalState>) => {
      setMap((prev) => {
        const current = prev.get(kudosId) ?? {
          heartCount: 0,
          likedByMe: false,
          isLiking: false,
        };
        const next = new Map(prev);
        next.set(kudosId, { ...current, ...update });
        return next;
      });
    },
    []
  );

  const initState = useCallback(
    (kudosId: number, initial: KudosLocalState) => {
      setMap((prev) => {
        if (prev.has(kudosId)) return prev;
        const next = new Map(prev);
        next.set(kudosId, initial);
        return next;
      });
    },
    []
  );

  return (
    <LikeStateContext.Provider value={{ getState, setState, initState }}>
      {children}
    </LikeStateContext.Provider>
  );
}

export function useLikeState() {
  const ctx = useContext(LikeStateContext);
  if (!ctx) throw new Error("useLikeState must be inside LikeStateProvider");
  return ctx;
}
