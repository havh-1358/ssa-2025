"use client";

import { useState, useRef, useEffect } from "react";
import { ProfileDropdown } from "./ProfileDropdown";

type UserProfileButtonProps = {
  email: string;
};

export function UserProfileButton({ email }: UserProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={email}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center
          w-10 h-10 rounded-[4px]
          border border-[var(--color-btn-secondary-border)]
          text-[var(--color-text-primary)]
          hover:bg-[var(--color-btn-secondary-hover)]
          focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]
          transition-colors duration-150"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M2 18c0-4 3.582-7 8-7s8 3 8 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen && <ProfileDropdown onClose={() => setIsOpen(false)} />}
    </div>
  );
}
