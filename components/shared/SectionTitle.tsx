type SectionTitleProps = {
  title: string;
};

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h1
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[24px] leading-8 text-[var(--color-text-primary)]"
      >
        {title}
      </h1>
      <hr
        className="w-full border-0 border-t border-[var(--color-divider)]"
        aria-hidden="true"
      />
    </div>
  );
}
