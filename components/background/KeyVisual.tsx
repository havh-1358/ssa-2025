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

      {/* Left gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 sm:bg-gradient-to-r sm:from-[#00101A] sm:from-[60%] sm:to-transparent bg-gradient-to-r from-[#00101A] from-[25.41%] to-transparent"
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
