import Image from "next/image";

export function KeyVisual() {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{ backgroundColor: "var(--color-bg-fallback)" }}
    >
      {/* Background photo */}
      <Image
        src="/assets/auth/images/login-bg.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Left gradient overlay
          Desktop (≥ 1280px): solid 25.41%, then fade — matches Figma spec exactly
          Mobile/Tablet (< 1280px): solid 60%, then fade — wider coverage for narrow viewports
          End stop: rgba(0,16,26,0) keeps base hue at 0% alpha to avoid grey banding */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #00101A 0%, #00101A 60%, rgba(0,16,26,0) 100%)",
        }}
      />
      {/* Desktop override — narrower solid band */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden xl:block"
        style={{
          background:
            "linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0,16,26,0) 100%)",
        }}
      />

      {/* Bottom gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[55%]"
        style={{
          background:
            "linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%)",
        }}
      />
    </div>
  );
}
