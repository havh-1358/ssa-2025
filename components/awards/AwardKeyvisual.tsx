import Image from "next/image";

export function AwardKeyvisual() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "547px" }}
      aria-hidden="true"
    >
      <Image
        src="/assets/awards/keyvisual.jpg"
        alt=""
        width={1440}
        height={547}
        priority
        className="object-cover w-full h-full"
        style={{ zIndex: 0 }}
      />
      {/* Gradient overlay per design spec */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, #00101A -4.23%, rgba(0,19,32,0) 52.79%)",
          zIndex: 1,
        }}
      />
    </div>
  );
}
