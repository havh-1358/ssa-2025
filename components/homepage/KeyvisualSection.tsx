import Image from "next/image";

export function KeyvisualSection() {
  return (
    <div
      className="absolute left-0 top-0 w-full overflow-hidden"
      aria-hidden="true"
      style={{ height: "1392px", zIndex: 0 }}
    >
      <Image
        src="/assets/homepage/keyvisual.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
        style={{ zIndex: 0 }}
      />
      {/* Gradient overlay — inline style justified: dynamic gradient cannot be a static Tailwind utility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)",
          zIndex: 1,
        }}
      />
    </div>
  );
}
