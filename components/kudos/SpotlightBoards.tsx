"use client";

import { useState } from "react";

type SpotlightBoardsProps = {
  initialError?: string | null;
};

export function SpotlightBoards({ initialError = null }: SpotlightBoardsProps) {
  const [isLoading] = useState(false);
  const [spotlightError] = useState<string | null>(initialError);
  const boards: unknown[] = [];

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading spotlight boards"
        className="flex flex-col gap-4 animate-pulse"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-white/10 rounded-lg" aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (spotlightError) {
    return (
      <div role="alert" className="flex flex-col gap-4 py-8 text-center">
        <p
          className="font-[family-name:var(--font-montserrat)]
            text-[16px] leading-6 text-[var(--color-text-primary)] opacity-60"
        >
          Spotlight boards are temporarily unavailable.
        </p>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="py-8 text-center">
        <p
          className="font-[family-name:var(--font-montserrat)]
            text-[16px] leading-6 text-[var(--color-text-primary)] opacity-60"
        >
          No spotlights yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Spotlight board list renders here once implemented */}
    </div>
  );
}
