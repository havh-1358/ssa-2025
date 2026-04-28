type DigitCardProps = {
  digit: string;
};

export function DigitCard({ digit }: DigitCardProps) {
  return (
    <div
      aria-hidden="true"
      className="digit-card-glass
        w-[44px] h-[72px] md:w-[60px] md:h-[96px] xl:w-[77px] xl:h-[123px]
        rounded-[var(--radius-card)] border-[0.75px] border-[var(--color-accent-gold)]
        flex items-center justify-center"
    >
      <span
        className="font-[family-name:var(--font-display)]
          text-[36px] md:text-[52px] xl:text-[73.73px]
          text-[var(--color-text-primary)] leading-none select-none"
      >
        {digit}
      </span>
    </div>
  );
}
