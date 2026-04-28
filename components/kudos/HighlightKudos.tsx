"use client";

import { useState } from "react";
import type { Kudos } from "@/types/kudos";
import { KudosCard } from "./KudosCard";

type HighlightKudosProps = {
  highlights: Kudos[];
  currentUserId?: string | null;
};

export function HighlightKudos({ highlights, currentUserId }: HighlightKudosProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (highlights.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <p
          className="font-[family-name:var(--font-montserrat)]
            text-[16px] leading-6 text-[var(--color-text-primary)] opacity-60"
        >
          No highlighted Kudos yet
        </p>
      </div>
    );
  }

  const current = highlights[activeSlide];

  return (
    <div className="flex flex-col gap-[var(--highlight-gap)]">
      <div className="max-w-[680px] mx-auto w-full">
        {current && (
          <KudosCard
            kudos={current}
            currentUserId={currentUserId}
            onHashtagClick={() => {}}
          />
        )}
      </div>

      {/* Dot indicators */}
      <div
        className="flex justify-center gap-2"
        role="tablist"
        aria-label="Highlight kudos navigation"
      >
        {highlights.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === activeSlide}
            aria-label={`Kudos ${i + 1} of ${highlights.length}`}
            onClick={() => setActiveSlide(i)}
            className={[
              "w-2 h-2 rounded-full transition-all duration-150",
              i === activeSlide
                ? "bg-[var(--color-accent-gold)] w-4"
                : "bg-[var(--color-text-primary)] opacity-30 hover:opacity-60",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
