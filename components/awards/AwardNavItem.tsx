import type { KeyboardEvent } from "react";

type AwardNavItemProps = {
  id: string;
  panelId: string;
  label: string;
  isActive: boolean;
  tabIndex: number;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
};

export function AwardNavItem({
  id,
  panelId,
  label,
  isActive,
  tabIndex,
  onClick,
  onKeyDown,
}: AwardNavItemProps) {
  return (
    <button
      type="button"
      id={id}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={[
        "w-full text-left rounded-[4px] p-[var(--left-nav-padding)]",
        "font-[family-name:var(--font-montserrat)] font-bold",
        "text-[16px] leading-6 tracking-[0.15px]",
        "whitespace-nowrap",
        "transition-colors duration-150 ease-in-out",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]",
        isActive
          ? "bg-[var(--color-nav-active-bg)] text-[var(--color-nav-active)]"
          : "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-nav-hover-bg)]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
