import Link from "next/link";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";

export function KudosPromoSection() {
  const t = useTranslations("homepage");

  return (
    <section
      className="relative z-[2] w-full
        px-4 md:px-[var(--content-padding-x)]
        py-[var(--content-padding-y)]
        border-t border-[var(--color-divider)]"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h2
            className="font-[family-name:var(--font-montserrat)] font-bold
              text-[24px] md:text-[32px] leading-10 text-[var(--color-text-primary)]"
          >
            {t("kudosSectionTitle")}
          </h2>
          <p
            className="font-[family-name:var(--font-montserrat)]
              text-[16px] leading-6 text-[var(--color-text-primary)] opacity-80 max-w-[480px]"
          >
            Gửi lời khen và ghi nhận đóng góp của đồng nghiệp trong SSA 2025
          </p>
        </div>

        <Link
          href={ROUTES.KUDOS}
          className="inline-flex items-center justify-center
            h-[60px] min-w-[180px] rounded-[var(--radius-btn)]
            bg-[var(--color-accent-gold)] text-[var(--color-bg-base)]
            px-[var(--btn-padding-x)] py-[var(--btn-padding-y)]
            font-[family-name:var(--font-montserrat)] font-bold
            text-[16px] leading-6
            transition-all duration-150 ease-in-out
            hover:opacity-90 hover:scale-[1.02]
            active:opacity-80 active:scale-[0.98]
            focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)] focus-visible:outline-offset-2"
        >
          {t("ctaKudos")}
        </Link>
      </div>
    </section>
  );
}
