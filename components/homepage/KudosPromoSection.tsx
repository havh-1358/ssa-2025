"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ROUTES } from "@/lib/constants/routes";

export function KudosPromoSection() {
  const t = useTranslations("homepage");
  const router = useRouter();

  return (
    <section
      className="relative z-[2] w-full
        px-4 md:px-[var(--content-padding-x)]
        py-[var(--content-padding-y)]"
    >
      {/* D1_Sunkudos — 1152×500px, full background image */}
      <div
        className="relative w-full max-w-[1152px] mx-auto rounded-[16px] overflow-hidden"
        style={{ height: "500px" }}
      >
        <Image
          src="/assets/kudos/keyvisual.jpg"
          alt={t("kudosSectionTitle")}
          fill
          className="object-cover"
        />

        {/* D2.1_Button-IC — overlay, left: 65.83px, bottom: 46px */}
        <div className="absolute" style={{ left: "65.83px", bottom: "46px" }}>
          <button
            type="button"
            onClick={() => router.push(ROUTES.KUDOS)}
            className="flex items-center gap-2
              h-[56px] px-4 rounded-[4px]
              bg-[var(--color-accent-gold)]
              font-[family-name:var(--font-montserrat)] font-bold
              text-[16px] leading-6 tracking-[0.15px]
              text-[var(--color-bg-base)]
              hover:opacity-90 active:opacity-80
              focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]
              transition-opacity duration-150"
            style={{ width: "126px" }}
          >
            {t("kudosCtaLabel")}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.49945 18.3095L5.68945 15.4995L12.0595 9.11945H7.10945V5.68945H18.3095V16.8895H14.8895V11.9395L8.49945 18.3095Z"
                fill="#00101A"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
