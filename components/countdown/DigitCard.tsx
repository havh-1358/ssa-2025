type DigitCardProps = {
  digit: string;
  /**
   * "prelaunch" (default) — large responsive sizes for the standalone CountdownPage.
   * "homepage" — fixed 51.2×81.92px per Homepage SAA Figma spec (Group 5).
   */
  variant?: "prelaunch" | "homepage";
};

const DIGIT_TEXT_SHADOW =
  "0 2px 4px rgba(0,0,0,0.6), 0 1px 2px rgba(255,255,255,0.3)";

export function DigitCard({ digit, variant = "prelaunch" }: DigitCardProps) {
  if (variant === "homepage") {
    return (
      <div
        aria-hidden="true"
        className="relative w-[51.2px] h-[81.92px] rounded-[8px]
          border-[0.5px] border-[var(--color-accent-gold)]
          flex items-center justify-center overflow-hidden"
        style={{
          // Glassmorphism: white gradient at 50% opacity over dark page bg
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(16.64px)",
          WebkitBackdropFilter: "blur(16.64px)",
        }}
      >
        <span
          className="font-[family-name:var(--font-display)]
            text-[49.152px] leading-[63px]
            text-[var(--color-text-primary)] select-none"
          style={{ textShadow: DIGIT_TEXT_SHADOW }}
        >
          {digit}
        </span>
      </div>
    );
  }

  // Prelaunch variant — original responsive design
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
        style={{ textShadow: DIGIT_TEXT_SHADOW }}
      >
        {digit}
      </span>
    </div>
  );
}
