import { TargetIcon } from "./TargetIcon";

type AwardNavItemProps = {
  href: string;
  label: string;
  isActive: boolean;
};

export function AwardNavItem({ href, label, isActive }: AwardNavItemProps) {
  return (
    <a
      href={href}
      aria-current={isActive ? "true" : undefined}
      className={[
        "flex flex-row items-center gap-1",
        "w-full p-4 no-underline",
        "font-[family-name:var(--font-montserrat)] font-bold",
        "text-[14px] leading-5 tracking-[0.25px]",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]",
        isActive
          ? "border-b border-[var(--color-accent-gold)] text-[var(--color-accent-gold)]"
          : "rounded-[4px] text-[var(--color-text-primary)] hover:bg-[var(--color-nav-hover-bg)]",
      ].join(" ")}
      style={
        isActive
          ? { textShadow: "0px 4px 4px rgba(0,0,0,0.25), 0px 0px 6px #FAE287" }
          : undefined
      }
    >
      <TargetIcon active={isActive} />
      <span>{label}</span>
    </a>
  );
}
