import Image from "next/image";
import { useTranslations } from "next-intl";
import { CountdownTimer } from "./CountdownTimer";

type CountdownPageProps = {
  launchAt: Date;
};

export function CountdownPage({ launchAt }: CountdownPageProps) {
  const t = useTranslations("countdown");

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[var(--color-bg-base)]"
    >
      {/* Background key visual (z:0) */}
      <Image
        src="/assets/countdown/keyvisual.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="object-cover"
        sizes="100vw"
        style={{ zIndex: 0 }}
      />

      {/* Gradient overlay (z:1) */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: "var(--color-gradient-overlay)",
          zIndex: 1,
        }}
      />

      {/* Content (z:2) */}
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-4"
        style={{ zIndex: 2 }}
      >
        <h1
          className="font-[family-name:var(--font-montserrat)] font-bold
            text-[20px] md:text-[28px] xl:text-[36px]
            text-[var(--color-text-primary)] text-center
            mb-[var(--gap-title-blocks)]"
        >
          {t("title")}
        </h1>

        <CountdownTimer
          launchAtISO={launchAt.toISOString()}
          dayUnit={t("days")}
          hourUnit={t("hours")}
          minuteUnit={t("minutes")}
        />
      </div>
    </div>
  );
}
