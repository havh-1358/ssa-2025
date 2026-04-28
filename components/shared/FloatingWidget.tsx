"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TheLeModal } from "@/components/homepage/TheLeModal";
import { ROUTES } from "@/lib/constants/routes";

type FloatingWidgetProps = {
  isAuthenticated: boolean;
};

export function FloatingWidget({ isAuthenticated }: FloatingWidgetProps) {
  const router = useRouter();
  const [theLeOpen, setTheLeOpen] = useState(false);

  function handleWriteKudos() {
    if (isAuthenticated) {
      router.push(ROUTES.KUDOS);
    } else {
      router.push(ROUTES.LOGIN);
    }
  }

  const btnClass =
    "flex items-center justify-center w-10 h-10 rounded-[4px] " +
    "text-[var(--color-text-primary)] " +
    "hover:bg-white/10 active:bg-white/15 " +
    "focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)] " +
    "transition-colors duration-150";

  return (
    <>
      <div
        className="fixed right-[19px] bottom-[120px] z-[90]
          flex flex-row items-center
          rounded-[8px]
          bg-[var(--color-bg-base)]
          border border-[var(--color-divider)]
          px-2 py-2 gap-1"
        style={{
          boxShadow: "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287",
        }}
      >
        {/* Write Kudos button — pen icon */}
        <button
          type="button"
          aria-label="Write Kudos"
          onClick={handleWriteKudos}
          className={btnClass}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M13.5 3.5a2.121 2.121 0 0 1 3 3L6 17l-4 1 1-4L13.5 3.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Divider */}
        <span
          className="text-[var(--color-divider)] font-bold select-none"
          aria-hidden="true"
        >
          /
        </span>

        {/* SAA Rules button — kudos logo icon */}
        <button
          type="button"
          aria-label="SAA Rules"
          onClick={() => setTheLeOpen(true)}
          className={btnClass}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="10"
              cy="10"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10 7v3l2 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <TheLeModal
        isOpen={theLeOpen}
        onClose={() => setTheLeOpen(false)}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
