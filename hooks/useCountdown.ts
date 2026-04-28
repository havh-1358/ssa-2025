"use client";

import { useState, useEffect } from "react";

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
}

function computeRemaining(launchAt: Date): CountdownState {
  const diff = launchAt.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }
  const totalMinutes = Math.floor(diff / 60000);
  return {
    days: Math.max(0, Math.floor(totalMinutes / 1440)),
    hours: Math.max(0, Math.floor((totalMinutes % 1440) / 60)),
    minutes: Math.max(0, totalMinutes % 60),
    isExpired: false,
  };
}

export function useCountdown(launchAt: Date): CountdownState {
  // Lazy initializer runs synchronously — detects past date on first render (FR-005a)
  const [state, setState] = useState<CountdownState>(() =>
    computeRemaining(launchAt)
  );

  useEffect(() => {
    if (state.isExpired) return;
    const id = setInterval(() => setState(computeRemaining(launchAt)), 60000);
    return () => clearInterval(id);
  }, [launchAt, state.isExpired]);

  return state;
}
