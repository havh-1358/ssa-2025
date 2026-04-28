"use client";

import type { Kudos } from "@/types/kudos";

type WriteKudosButtonProps = {
  onOpen: () => void;
  onSuccess?: (kudos: Kudos) => void;
};

export function WriteKudosButton({ onOpen }: WriteKudosButtonProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex items-center gap-2
        h-[72px] w-full md:w-auto md:min-w-[320px]
        px-4 py-6
        border border-[var(--color-btn-secondary-border)]
        bg-[var(--color-btn-secondary-bg)]
        rounded-lg
        font-[family-name:var(--font-montserrat)] font-bold
        text-[16px] leading-6 text-[var(--color-text-primary)]
        transition-colors duration-150 ease-in-out
        hover:bg-[rgba(255,234,158,0.2)]
        focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]"
      aria-label="Write a Kudos"
    >
      <span aria-hidden="true">✏️</span>
      Viết Kudos
    </button>
  );
}
