import { DigitCard } from "./DigitCard";

type DigitBlockProps = {
  value: number;
  unit: string;
  variant?: "prelaunch" | "homepage";
};

export function DigitBlock({
  value,
  unit,
  variant = "prelaunch",
}: DigitBlockProps) {
  const clamped = Math.max(0, value);
  // 3-digit display for days ≥ 100, 2-digit (zero-padded) otherwise
  const digits =
    clamped >= 100
      ? String(clamped).split("")
      : String(clamped).padStart(2, "0").split("");

  const unitSize =
    variant === "homepage"
      ? "text-[24px] leading-[32px]"
      : "text-[20px] md:text-[28px] xl:text-[36px] leading-[1.2]";

  return (
    <div
      className="flex flex-col items-center gap-[var(--gap-digit-label)]"
      aria-label={`${clamped} ${unit}`}
    >
      <div className="flex flex-row gap-[var(--gap-digit-cards)]">
        {digits.map((d, i) => (
          <DigitCard key={i} digit={d} variant={variant} />
        ))}
      </div>
      <span
        className={`font-[family-name:var(--font-montserrat)] font-bold ${unitSize}
          text-[var(--color-text-primary)]`}
      >
        {unit}
      </span>
    </div>
  );
}
