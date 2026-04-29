"use client";

import { useEffect, useState } from "react";

const FALLBACK_OPTIONS = ["Dedicated", "Inspiring", "Teamwork", "Creative", "Leadership"];

export function useHashtagOptions(): string[] {
  const [options, setOptions] = useState<string[]>(FALLBACK_OPTIONS);

  useEffect(() => {
    fetch("/api/kudos/hashtags")
      .then((res) => {
        if (!res.ok) return;
        return res.json();
      })
      .then((json) => {
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          setOptions(json.data as string[]);
        }
      })
      .catch(() => {
        // Silently keep fallback options
      });
  }, []);

  return options;
}
