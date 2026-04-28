import Image from "next/image";

type AwardKeyvisualProps = {
  title: string;
  mainHeading: string;
};

export function AwardKeyvisual({ title, mainHeading }: AwardKeyvisualProps) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "547px" }}
    >
      <Image
        src="/assets/awards/keyvisual.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, #00101A -4.23%, rgba(0,19,32,0) 52.79%)",
          zIndex: 1,
        }}
      />

      {/* Content overlay: KV (logo) + A_Title — 1152px centered, flex-col gap-[40px] */}
      <div
        className="absolute inset-0 flex items-start"
        style={{ zIndex: 2, paddingLeft: "144px", paddingTop: "40px" }}
      >
        <div
          className="flex flex-col gap-[120px]"
          style={{ width: "1152px" }}
        >
          {/* KV — ROOT FURTHER logo, 338×150px */}
          <Image
            src="/assets/awards/root-further.svg"
            alt="Root Further"
            width={338}
            height={150}
            className="object-contain"
          />

          {/* A_Title — width: 1152px, height: 129px, gap: 16px */}
          <div className="flex flex-col gap-4 w-full">
            {/* "Sun* Annual Awards 2025" — 24px 700 white, text-center */}
            <p
              className="font-[family-name:var(--font-montserrat)] font-bold
                text-[24px] leading-8 text-[var(--color-text-primary)]
                text-center w-full"
            >
              {title}
            </p>

            {/* Rectangle 26 — divider #2E3940 */}
            <hr
              className="w-full border-0 border-t border-[var(--color-divider)]"
              aria-hidden="true"
            />

            {/* Frame 488 — "Hệ thống giải thưởng SAA 2025", 57px gold centered */}
            <div className="flex justify-center items-center w-full">
              <h1
                className="font-[family-name:var(--font-montserrat)] font-bold
                  text-[57px] leading-[64px] tracking-[-0.25px]
                  text-[var(--color-accent-gold)] text-center"
              >
                {mainHeading}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
