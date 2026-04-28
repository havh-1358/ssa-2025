"use client";

import { useCallback } from "react";
import type { RecipientOption } from "@/hooks/useKudosForm";

type RecipientSearchProps = {
  value: RecipientOption | null;
  searchQuery: string;
  searchResults: RecipientOption[];
  isSearching: boolean;
  searchError: string | null;
  error?: string;
  onQueryChange: (q: string) => void;
  onSelect: (r: RecipientOption) => void;
  onRetrySearch: () => void;
};

export function RecipientSearch({
  value,
  searchQuery,
  searchResults,
  isSearching,
  searchError,
  error,
  onQueryChange,
  onSelect,
  onRetrySearch,
}: RecipientSearchProps) {
  // Derive open state directly — no effect needed
  const open = searchQuery.length >= 2;

  const handleSelect = useCallback(
    (r: RecipientOption) => {
      onSelect(r);
    },
    [onSelect]
  );

  return (
    <div className="flex flex-col gap-[var(--field-gap)] relative">
      <label
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[14px] leading-5 text-[var(--color-modal-text-dark)]"
      >
        Người nhận *
      </label>

      {value ? (
        <div
          className="flex items-center justify-between
            px-6 py-4 rounded-[var(--border-input-radius)]
            border border-[var(--color-input-border)] bg-[var(--color-input-bg)]"
        >
          <span
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[16px] text-[var(--color-modal-text-dark)]"
          >
            {value.name}
          </span>
          <button
            type="button"
            onClick={() => onSelect({ id: "", name: "", avatarUrl: null })}
            className="text-[var(--color-placeholder)] hover:text-[var(--color-modal-text-dark)]
              focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
            aria-label="Clear recipient"
          >
            ×
          </button>
        </div>
      ) : (
        <>
          {/* combobox wrapper carries aria-expanded (not the input) */}
          <div
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls="recipient-listbox"
            aria-owns="recipient-listbox"
            className="relative"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Tìm đồng nghiệp..."
              aria-autocomplete="list"
              aria-controls="recipient-listbox"
              autoComplete="off"
              className="w-full px-6 py-4 rounded-[var(--border-input-radius)]
                border border-[var(--color-input-border)] bg-[var(--color-input-bg)]
                font-[family-name:var(--font-montserrat)] text-[16px]
                text-[var(--color-modal-text-dark)] placeholder:text-[var(--color-placeholder)]
                outline-none focus:border-[var(--color-modal-text-dark)]"
            />
            {isSearching && (
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2
                  text-[var(--color-placeholder)] text-[14px]"
                aria-hidden="true"
              >
                ⟳
              </span>
            )}
          </div>

          {open && (
            <div
              id="recipient-listbox"
              role="listbox"
              className="absolute top-full left-0 right-0 mt-1
                max-h-[240px] overflow-y-auto
                bg-[var(--color-input-bg)] border border-[var(--color-input-border)]
                rounded-[var(--border-input-radius)] z-50 shadow-lg"
            >
              {searchError ? (
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-[14px] text-[var(--color-error)] font-[family-name:var(--font-montserrat)]">
                    Unable to search right now — try again
                  </p>
                  <button
                    type="button"
                    onClick={onRetrySearch}
                    className="self-start text-[14px] font-bold text-[var(--color-modal-text-dark)]
                      underline focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
                  >
                    Retry
                  </button>
                </div>
              ) : searchResults.length === 0 && !isSearching ? (
                <p
                  className="p-4 text-center text-[14px] text-[var(--color-placeholder)]
                    font-[family-name:var(--font-montserrat)]"
                >
                  No results found
                </p>
              ) : (
                searchResults.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => handleSelect(r)}
                    className="w-full text-left px-4 py-3 flex items-center gap-3
                      hover:bg-[var(--color-suggestion-hover)]
                      font-[family-name:var(--font-montserrat)] text-[14px]
                      text-[var(--color-modal-text-dark)]
                      focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
                  >
                    <div
                      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center
                        bg-[var(--color-accent-gold)] text-[var(--color-modal-text-dark)] font-bold text-[12px]"
                    >
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    {r.name}
                  </button>
                ))
              )}
            </div>
          )}
        </>
      )}

      {error && (
        <p
          className="font-[family-name:var(--font-montserrat)]
            text-[12px] leading-4 text-[var(--color-error)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
