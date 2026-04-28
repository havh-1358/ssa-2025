type SectionTitleProps = {
  title: string;
  mainHeading?: string;
};

export function SectionTitle({ title, mainHeading }: SectionTitleProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* "Sun* Annual Awards 2025" — 24px white centered */}
      <p
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[24px] leading-8 text-[var(--color-text-primary)]
          text-center w-full"
      >
        {title}
      </p>

      {/* Divider (Rectangle 26) — between subtitle and main heading */}
      <hr
        className="w-full border-0 border-t border-[var(--color-divider)]"
        aria-hidden="true"
      />

      {/* "Hệ thống giải thưởng SAA 2025" — 57px gold centered (Frame 488) */}
      {mainHeading && (
        <div className="flex flex-row justify-center items-center w-full">
          <h1
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[57px] leading-[64px] tracking-[-0.25px]
              text-[var(--color-accent-gold)] text-center"
          >
            {mainHeading}
          </h1>
        </div>
      )}
    </div>
  );
}
