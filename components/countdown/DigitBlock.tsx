import { DigitCard } from "./DigitCard";

type DigitBlockProps = {
  value: number;
  unit: string;
};

export function DigitBlock({ value, unit }: DigitBlockProps) {
  const clamped = Math.max(0, value);
  // 3-digit display for days ≥ 100, 2-digit (zero-padded) otherwise
  const digits =
    clamped >= 100
      ? String(clamped).split("")
      : String(clamped).padStart(2, "0").split("");

  return (
    <div
      className="flex flex-col items-center gap-[var(--gap-digit-label)]"
      aria-label={`${clamped} ${unit}`}
    >
      <div className="flex flex-row gap-[var(--gap-digit-cards)]">
        {digits.map((d, i) => (
          <DigitCard key={i} digit={d} />
        ))}
      </div>
      <span
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[18px] md:text-[25px] xl:text-[36px]
          leading-[1.2] text-[var(--color-text-primary)]"
      >
        {unit}
      </span>
    </div>
  );
}
