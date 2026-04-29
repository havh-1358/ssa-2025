"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type FilterDropdownProps = {
  label: string;
  options: string[];
  value: string | null;
  width: number;
  dropdownWidth: number;
  onChange: (val: string | null) => void;
  prefix?: string;
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M7 10l5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FilterDropdown({
  label,
  options,
  value,
  width,
  dropdownWidth,
  onChange,
  prefix = "",
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLElement | null)[]>([]);

  const hasValue = value !== null;

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Focus first/selected option after open
  useEffect(() => {
    if (!isOpen) return;
    const selectedIdx = value ? options.indexOf(value) : -1;
    const focusIdx = selectedIdx >= 0 ? selectedIdx : 0;
    const id = requestAnimationFrame(() => {
      optionRefs.current[focusIdx]?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen, value, options]);

  function handleSelect(opt: string) {
    onChange(value === opt ? null : opt);
    close();
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((v) => !v);
    } else if (e.key === "Escape") {
      close();
    }
  }

  function handleOptionKeyDown(e: React.KeyboardEvent<HTMLElement>, idx: number) {
    const total = options.length;
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        handleSelect(options[idx]);
        break;
      case "ArrowDown":
        e.preventDefault();
        optionRefs.current[(idx + 1) % total]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        optionRefs.current[(idx - 1 + total) % total]?.focus();
        break;
      case "Escape":
      case "Tab":
        e.preventDefault();
        close();
        break;
    }
  }

  const triggerText = hasValue ? `${prefix}${value}` : label;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Lọc theo ${label}`}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
        style={{
          width: `${width}px`,
          height: "56px",
          padding: "16px",
          gap: "8px",
          borderRadius: "4px",
          border: hasValue || isOpen ? "1px solid #FFEA9E" : "1px solid #998C5F",
          background: isOpen
            ? "rgba(255,234,158,0.2)"
            : hasValue
              ? "rgba(255,234,158,0.15)"
              : "rgba(255,234,158,0.1)",
        }}
        className="flex flex-row items-center cursor-pointer transition-colors duration-100
          hover:bg-[rgba(255,234,158,0.2)]
          focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]"
      >
        <span
          className="font-[family-name:var(--font-montserrat)] font-bold whitespace-nowrap"
          style={{
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: hasValue || isOpen ? "#FFEA9E" : "#FFFFFF",
          }}
        >
          {triggerText}
        </span>
        <span style={{ color: hasValue || isOpen ? "#FFEA9E" : "#FFFFFF" }}>
          <ChevronIcon open={isOpen} />
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={label}
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            minWidth: `${width}px`,
            maxHeight: "348px",
            overflowY: "auto",
            padding: "6px",
            background: "#00070C",
            border: "1px solid #998C5F",
            borderRadius: "8px",
            zIndex: 999,
          }}
        >
          {/* Clear option */}
          {hasValue && (
            <div
              role="option"
              aria-selected={false}
              tabIndex={0}
              ref={(el) => { optionRefs.current[-1 + options.length + 1] = el; }}
              style={{
                height: "40px",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              className="hover:bg-[rgba(255,234,158,0.1)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]"
              onClick={() => { onChange(null); close(); }}
            >
              <span
                className="font-[family-name:var(--font-montserrat)] font-bold"
                style={{ fontSize: "14px", color: "rgba(255,234,158,0.6)", letterSpacing: "0.5px" }}
              >
                Xoá lọc ×
              </span>
            </div>
          )}

          {options.map((opt, i) => {
            const isSelected = opt === value;
            return (
              <div
                key={opt}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                ref={(el) => { optionRefs.current[i] = el; }}
                style={{
                  height: "56px",
                  padding: "16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  background: isSelected ? "rgba(255,234,158,0.1)" : "transparent",
                  textShadow: isSelected
                    ? "0px 4px 4px rgba(0,0,0,0.25), 0px 0px 6px #FAE287"
                    : "none",
                }}
                className="hover:bg-[rgba(255,234,158,0.1)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-gold)]"
                onClick={() => handleSelect(opt)}
                onKeyDown={(e) => handleOptionKeyDown(e, i)}
              >
                <span
                  className="font-[family-name:var(--font-montserrat)] font-bold"
                  style={{
                    fontSize: "16px",
                    lineHeight: "24px",
                    letterSpacing: "0.5px",
                    color: "#FFFFFF",
                  }}
                >
                  {prefix}{opt}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
