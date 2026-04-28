"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Kudos } from "@/types/kudos";

const PAGE_SIZE = 10;
const POLL_INTERVAL_MS = 60_000;

export function useKudosFeed(initialKudos: Kudos[] = []) {
  const [kudosList, setKudosList] = useState<Kudos[]>(initialKudos);
  // Track current page via ref — avoids synchronous setState in filter-change effect
  const currentPageRef = useRef(1);
  const [total, setTotal] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [filterHashtag, setFilterHashtag] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function buildQuery(page: number) {
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
    if (filterHashtag) params.set("hashtag", filterHashtag);
    if (filterDepartment) params.set("department", filterDepartment);
    return `/api/kudos?${params.toString()}`;
  }

  const fetchPage = useCallback(
    async (page: number, replace: boolean) => {
      try {
        const res = await fetch(buildQuery(page));
        if (!res.ok) throw new Error("Failed to fetch kudos");
        const json = await res.json();
        const newItems: Kudos[] = json.data ?? [];
        setTotal(json.meta?.total ?? 0);
        if (replace) {
          setKudosList(newItems);
        } else {
          setKudosList((prev) => {
            const existingIds = new Set(prev.map((k) => k.id));
            const deduped = newItems.filter((k) => !existingIds.has(k.id));
            return [...prev, ...deduped];
          });
        }
        setFeedError(null);
      } catch {
        setFeedError("Failed to load kudos. Please try again.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterHashtag, filterDepartment]
  );

  // Polling — page 1 merge (dedup), no page reset
  const pollFeed = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(buildQuery(1));
      if (!res.ok) return;
      const json = await res.json();
      const fresh: Kudos[] = json.data ?? [];
      setKudosList((prev) => {
        const existingIds = new Set(prev.map((k) => k.id));
        const newItems = fresh.filter((k) => !existingIds.has(k.id));
        if (newItems.length === 0) return prev;
        return [...newItems, ...prev];
      });
    } finally {
      setIsRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterHashtag, filterDepartment]);

  // Start / stop polling based on visibility
  useEffect(() => {
    function startPolling() {
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(pollFeed, POLL_INTERVAL_MS);
    }
    function stopPolling() {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }
    function handleVisibility() {
      if (document.hidden) stopPolling();
      else startPolling();
    }

    startPolling();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pollFeed]);

  // Re-fetch page 1 when filters change — use ref mutation instead of setState
  useEffect(() => {
    currentPageRef.current = 1;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchPage(1, true);
  }, [filterHashtag, filterDepartment, fetchPage]);

  const loadMore = useCallback(async () => {
    const nextPage = currentPageRef.current + 1;
    currentPageRef.current = nextPage;
    await fetchPage(nextPage, false);
  }, [fetchPage]);

  const prependKudos = useCallback((kudos: Kudos) => {
    setKudosList((prev) => {
      const existingIds = new Set(prev.map((k) => k.id));
      if (existingIds.has(kudos.id)) return prev;
      return [kudos, ...prev];
    });
    setTotal((t) => t + 1);
  }, []);

  const hasMore = kudosList.length < total;

  return {
    kudosList,
    isRefreshing,
    feedError,
    hasMore,
    total,
    filterHashtag,
    filterDepartment,
    setFilterHashtag,
    setFilterDepartment,
    loadMore,
    prependKudos,
  };
}
