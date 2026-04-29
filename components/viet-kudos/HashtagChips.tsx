"use client";

import { useState, useEffect, useRef } from "react";

const MAX_HASHTAGS = 5;

type HashtagChipsProps = {
  selected: string[];
  onChange: (tags: string[]) => void;
  error?: string;
};

export function HashtagChips({ selected, onChange, error }: HashtagChipsProps) {
  const [available, setAvailable] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function doFetch() {
    try {
      const res = await fetch("/api/kudos/hashtags");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setAvailable(json.data ?? []);
      setFetchError(null);
    } catch {
      setFetchError("Không tải được hashtag.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchHashtags() {
    setIsLoading(true);
    setFetchError(null);
    await doFetch();
  }

  useEffect(() => {
    void doFetch();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function addTag(tag: string) {
    if (!selected.includes(tag) && selected.length < MAX_HASHTAGS) {
      onChange([...selected, tag]);
    }
    if (selected.length + 1 >= MAX_HASHTAGS) setOpen(false);
  }

  function removeTag(tag: string) {
    onChange(selected.filter((t) => t !== tag));
  }

  const canAddMore = selected.length < MAX_HASHTAGS;
  const unselected = available.filter((t) => !selected.includes(t));

  return (
    /* E row: flex-row, gap 16px, align-items flex-start */
    <div className="flex flex-row items-start" style={{ gap: "16px" }}>
      {/* E.1_Title — whitespace-nowrap */}
      <p
        className="shrink-0 font-[family-name:var(--font-montserrat)] font-bold
          text-[22px] leading-7 text-[var(--color-modal-text-dark)] mt-[10px]"
        style={{ whiteSpace: "nowrap" }}
      >
        Hashtag <span style={{ color: "var(--color-required-star)" }}>*</span>
      </p>

      {/* E.2 — chips row + add button */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex flex-row flex-wrap items-center gap-2">
          {/* Selected chips */}
          {selected.map((tag) => (
            <span
              key={tag}
              className="flex flex-row items-center gap-1
                font-[family-name:var(--font-montserrat)] font-bold text-[16px] leading-6
                text-[var(--color-modal-text-dark)] bg-[var(--color-accent-gold)]
                border border-[var(--color-input-border)]"
              style={{ padding: "4px 8px", borderRadius: "8px" }}
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove #${tag}`}
                className="ml-1 text-[var(--color-modal-text-dark)] hover:opacity-70
                  focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
              >
                ×
              </button>
            </span>
          ))}

          {/* + Hashtag button — hidden when 5 selected */}
          {canAddMore && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex flex-col items-center justify-center
                  border border-[var(--color-input-border)]
                  bg-[var(--color-input-bg)]
                  hover:opacity-80 transition-opacity
                  focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
                style={{
                  height: "48px",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  minWidth: "100px",
                  gap: "2px",
                }}
              >
                <span className="font-[family-name:var(--font-montserrat)] font-bold text-[14px] text-[var(--color-modal-text-dark)]">
                  + Hashtag
                </span>
                <span className="font-[family-name:var(--font-montserrat)] text-[11px] text-[var(--color-placeholder)]">
                  Tối đa {MAX_HASHTAGS}
                </span>
              </button>

              {/* Dropdown */}
              {open && (
                <div
                  className="absolute top-full left-0 mt-1 z-50
                    bg-[var(--color-input-bg)] border border-[var(--color-input-border)]
                    rounded-[var(--border-input-radius)] shadow-lg"
                  style={{ minWidth: "160px", maxHeight: "200px", overflowY: "auto" }}
                >
                  {isLoading ? (
                    <p className="px-4 py-3 text-[14px] text-[var(--color-placeholder)] font-[family-name:var(--font-montserrat)]">
                      Đang tải...
                    </p>
                  ) : fetchError ? (
                    <div className="px-4 py-3 flex flex-col gap-2">
                      <p className="text-[12px] text-[var(--color-error)] font-[family-name:var(--font-montserrat)]">{fetchError}</p>
                      <button
                        type="button"
                        onClick={fetchHashtags}
                        className="self-start text-[12px] font-bold underline text-[var(--color-modal-text-dark)]"
                      >
                        Thử lại
                      </button>
                    </div>
                  ) : unselected.length === 0 ? (
                    <p className="px-4 py-3 text-[14px] text-[var(--color-placeholder)] font-[family-name:var(--font-montserrat)]">
                      Đã chọn tất cả
                    </p>
                  ) : (
                    unselected.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="w-full text-left px-4 py-2
                          font-[family-name:var(--font-montserrat)] font-bold text-[16px]
                          text-[var(--color-modal-text-dark)]
                          hover:bg-[var(--color-suggestion-hover)]
                          focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
                      >
                        #{tag}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-[12px] text-[var(--color-error)] font-[family-name:var(--font-montserrat)]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
