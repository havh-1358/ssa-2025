"use client";

import { useState, useEffect, useRef } from "react";
import type { RecipientOption } from "@/hooks/useKudosForm";

type RecipientSearchProps = {
  value: RecipientOption | null;
  error?: string;
  onSelect: (r: RecipientOption | null) => void;
};

export function RecipientSearch({ value, error, onSelect }: RecipientSearchProps) {
  const [allUsers, setAllUsers] = useState<RecipientOption[]>([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function loadUsers() {
    if (allUsers.length > 0) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/users/search");
      const json = await res.json();
      setAllUsers(json.data ?? []);
    } catch {
      // silent fail — list stays empty
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    setFilter("");
    void loadUsers();
  }

  function handleSelect(r: RecipientOption) {
    onSelect(r);
    setOpen(false);
    setFilter("");
  }

  function handleClear() {
    onSelect(null);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = filter.trim()
    ? allUsers.filter((u) => u.name.toLowerCase().includes(filter.toLowerCase()))
    : allUsers;

  const inputClass = [
    "w-full px-6 py-4 rounded-[var(--border-input-radius)]",
    "border bg-[var(--color-input-bg)]",
    "font-[family-name:var(--font-montserrat)] font-bold text-[16px]",
    "text-[var(--color-modal-text-dark)]",
    "placeholder:text-[var(--color-placeholder)] placeholder:font-bold",
    "outline-none focus:border-[var(--color-modal-text-dark)]",
    error ? "border-[var(--color-error)]" : "border-[var(--color-input-border)]",
  ].join(" ");

  return (
    /* B row: flex-row, gap 16px, align-items center */
    <div className="flex flex-row items-center relative" style={{ gap: "16px" }}>
      {/* B.1_Title */}
      <label
        className="shrink-0 font-[family-name:var(--font-montserrat)] font-bold
          text-[22px] leading-7 text-[var(--color-modal-text-dark)]"
        style={{ whiteSpace: "nowrap", minWidth: "150px" }}
      >
        Người nhận <span style={{ color: "var(--color-required-star)" }}>*</span>
      </label>

      {/* B.2 input + dropdown */}
      <div className="flex-1 relative" ref={dropdownRef}>
        {value ? (
          /* Selected state */
          <div className={[
            "flex items-center justify-between px-6 py-4",
            "rounded-[var(--border-input-radius)]",
            "border border-[var(--color-input-border)] bg-[var(--color-input-bg)]",
          ].join(" ")}>
            <span className="font-[family-name:var(--font-montserrat)] font-bold text-[16px] text-[var(--color-modal-text-dark)]">
              {value.name}
            </span>
            <button
              type="button"
              onClick={handleClear}
              aria-label="Xoá người nhận"
              className="text-[var(--color-placeholder)] hover:text-[var(--color-modal-text-dark)]
                focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
            >
              ×
            </button>
          </div>
        ) : (
          /* Dropdown trigger */
          <button
            type="button"
            onClick={handleOpen}
            className={[
              "w-full flex items-center justify-between px-6 py-4",
              "rounded-[var(--border-input-radius)]",
              "bg-[var(--color-input-bg)]",
              "font-[family-name:var(--font-montserrat)] font-bold text-[16px]",
              error ? "border border-[var(--color-error)]" : "border border-[var(--color-input-border)]",
              "focus-visible:outline-2 focus-visible:outline-[var(--color-modal-text-dark)]",
            ].join(" ")}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className="text-[var(--color-placeholder)]">Tìm kiếm</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9L12 15L18 9" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Dropdown panel */}
        {open && (
          <div
            role="listbox"
            className="absolute top-full left-0 right-0 mt-1 z-50
              bg-[var(--color-input-bg)] border border-[var(--color-input-border)]
              rounded-[var(--border-input-radius)] shadow-lg"
            style={{ maxHeight: "240px", overflowY: "auto" }}
          >
            {/* Filter input */}
            <div className="sticky top-0 bg-[var(--color-input-bg)] border-b border-[var(--color-input-border)] px-4 py-2">
              <input
                type="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Tìm kiếm..."
                autoFocus
                className="w-full bg-transparent outline-none
                  font-[family-name:var(--font-montserrat)] text-[14px]
                  text-[var(--color-modal-text-dark)] placeholder:text-[var(--color-placeholder)]"
              />
            </div>

            {isLoading ? (
              <p className="px-4 py-3 text-[14px] text-[var(--color-placeholder)] font-[family-name:var(--font-montserrat)]">
                Đang tải...
              </p>
            ) : filtered.length === 0 ? (
              <p className="px-4 py-3 text-center text-[14px] text-[var(--color-placeholder)] font-[family-name:var(--font-montserrat)]">
                Không tìm thấy
              </p>
            ) : (
              filtered.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => handleSelect(u)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3
                    hover:bg-[var(--color-suggestion-hover)]
                    font-[family-name:var(--font-montserrat)] font-bold text-[16px]
                    text-[var(--color-modal-text-dark)]
                    focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
                >
                  {u.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <span className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center
                      bg-[var(--color-accent-gold)] text-[var(--color-modal-text-dark)] font-bold text-[12px]">
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  {u.name}
                </button>
              ))
            )}
          </div>
        )}

        {error && (
          <p className="mt-1 font-[family-name:var(--font-montserrat)] text-[12px] leading-4 text-[var(--color-error)]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
