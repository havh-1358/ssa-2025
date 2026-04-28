"use client";

import { useState, useEffect } from "react";

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
}

const ZERO_STATE: CountdownState = {
  days: 0,
  hours: 0,
  minutes: 0,
  isExpired: false,
};

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

/**
 * Accepts an ISO string (not a Date) so the dependency is a stable primitive —
 * passing `new Date(iso)` as a dep caused a new object reference every render
 * which triggered an infinite useEffect re-run loop.
 */
export function useCountdown(launchAtISO: string): CountdownState {
  const [state, setState] = useState<CountdownState>(ZERO_STATE);

  useEffect(() => {
    const launchAt = new Date(launchAtISO);
    const current = computeRemaining(launchAt);
    setState(current);
    if (current.isExpired) return;
    const id = setInterval(() => setState(computeRemaining(launchAt)), 60000);
    return () => clearInterval(id);
  }, [launchAtISO]); // string primitive — stable reference, no infinite loop

  return state;
}
