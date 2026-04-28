"use client";

import { useState, useEffect } from "react";

const MAX_HASHTAGS = 5;

type HashtagChipsProps = {
  selected: string[];
  onChange: (tags: string[]) => void;
};

export function HashtagChips({ selected, onChange }: HashtagChipsProps) {
  const [available, setAvailable] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hashtagsError, setHashtagsError] = useState<string | null>(null);

  async function fetchHashtags() {
    setIsLoading(true);
    setHashtagsError(null);
    try {
      const res = await fetch("/api/kudos/hashtags");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setAvailable(json.data ?? []);
    } catch {
      setHashtagsError("Failed to load hashtags.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHashtags();
  }, []);

  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else if (selected.length < MAX_HASHTAGS) {
      onChange([...selected, tag]);
    }
  }

  const atMax = selected.length >= MAX_HASHTAGS;

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 rounded-full bg-[rgba(0,16,26,0.1)] animate-pulse"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  if (hashtagsError) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-[12px] text-[var(--color-error)] font-[family-name:var(--font-montserrat)]">
          {hashtagsError}
        </p>
        <button
          type="button"
          onClick={fetchHashtags}
          className="self-start text-[12px] font-bold underline
            text-[var(--color-modal-text-dark)]
            focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {available.map((tag) => {
          const isSelected = selected.includes(tag);
          const isDisabled = atMax && !isSelected;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              disabled={isDisabled}
              className={[
                "px-3 py-1 rounded-full",
                "font-[family-name:var(--font-montserrat)] font-bold text-[14px]",
                "border transition-colors duration-100",
                "focus-visible:outline-2 focus-visible:outline-[var(--color-error)]",
                isDisabled
                  ? "opacity-50 cursor-not-allowed border-[#999999] text-[#999999]"
                  : isSelected
                  ? "bg-[var(--color-accent-gold)] border-[var(--color-accent-gold)] text-[var(--color-modal-text-dark)]"
                  : "border-[var(--color-input-border)] text-[var(--color-modal-text-dark)] hover:bg-[var(--color-suggestion-hover)]",
              ].join(" ")}
            >
              #{tag}
            </button>
          );
        })}
      </div>
      {atMax && (
        <p className="text-[12px] text-[var(--color-placeholder)] font-[family-name:var(--font-montserrat)]">
          Maximum 5 hashtags reached
        </p>
      )}
    </div>
  );
}
