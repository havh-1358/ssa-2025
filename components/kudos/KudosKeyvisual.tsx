import Image from "next/image";

export function KudosKeyvisual() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "512px" }}
    >
      {/* Background art */}
      <Image
        src="/assets/kudos/keyvisual.png"
        alt=""
        width={1440}
        height={512}
        priority
        className="object-cover w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Dark gradient overlay — left dark, right transparent */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0) 47.8%)",
          zIndex: 1,
        }}
      />

      {/* Title overlay — left: 144px, top: 104px (= Figma y:184 − header 80px) */}
      <div
        className="absolute flex flex-col"
        style={{ left: "144px", top: "104px", gap: "10px", zIndex: 2 }}
      >
        {/* Subtitle — 559×44px, Montserrat 700 36px #FFEA9E */}
        <p
          className="font-[family-name:var(--font-montserrat)] font-bold"
          style={{
            width: "559px",
            height: "44px",
            fontSize: "36px",
            lineHeight: "44px",
            color: "#FFEA9E",
            letterSpacing: "0px",
            whiteSpace: "nowrap",
          }}
        >
          Hệ thống ghi nhận và cảm ơn
        </p>

        {/* KUDOS logo — 592.84 × 103.61px from Figma */}
        <Image
          src="/assets/kudos/MM_MEDIA_Kudos logo.png"
          alt="Sun* Kudos"
          width={593}
          height={104}
          priority
          style={{ width: "592.84px", height: "103.61px", flexShrink: 0 }}
        />
      </div>
    </div>
  );
}
