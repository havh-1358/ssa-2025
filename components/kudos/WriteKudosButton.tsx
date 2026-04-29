"use client";

type WriteKudosButtonProps = {
  onOpen: () => void;
};

function PenIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function WriteKudosButton({ onOpen }: WriteKudosButtonProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Ghi nhận kudos"
      className="flex items-center gap-2
        h-[72px] w-full
        px-4
        border border-[var(--color-btn-secondary-border)]
        bg-[var(--color-btn-secondary-bg)]
        rounded-[68px]
        transition-colors duration-150 ease-in-out
        hover:bg-[rgba(255,234,158,0.15)]
        active:bg-[rgba(255,234,158,0.2)] active:border-[var(--color-accent-gold)]
        focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]"
    >
      <PenIcon />
      <span
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[16px] leading-6 tracking-[0.15px] text-[var(--color-text-primary)]
          truncate"
      >
        Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?
      </span>
    </button>
  );
}
