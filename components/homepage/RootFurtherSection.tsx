import Image from "next/image";
import { useTranslations } from "next-intl";

export function RootFurtherSection() {
  const t = useTranslations("homepage");

  return (
    <section
      className="relative z-[2] w-full max-w-[1152px] mx-auto
        px-4 md:px-[104px] py-[120px]
        flex flex-col items-center gap-8"
    >
      {/* RF.1 — Root Further theme logo */}
      <Image
        src="/assets/homepage/root_thurther-logo-center.svg"
        alt="Root Further"
        width={290}
        height={134}
        className="object-contain"
      />

      {/* RF.2 — Opening paragraph — 24px white bold justified */}
      <p
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[16px] md:text-[24px] leading-[32px]
          text-[var(--color-text-primary)] text-justify w-full"
      >
        {t("rootFurtherParagraph1")}
      </p>

      {/* RF.3 — Quote — 20px white bold centered */}
      <blockquote
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[18px] md:text-[20px] leading-[32px]
          text-[var(--color-text-primary)] text-center"
      >
        {t("rootFurtherQuote")}
      </blockquote>

      {/* RF.4 — Closing paragraph — 24px white bold justified */}
      <p
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[16px] md:text-[24px] leading-[32px]
          text-[var(--color-text-primary)] text-justify w-full"
      >
        {t("rootFurtherParagraph2")}
      </p>
    </section>
  );
}
