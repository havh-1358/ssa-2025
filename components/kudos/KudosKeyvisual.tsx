import Image from "next/image";

export function KudosKeyvisual() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "512px" }}
      aria-hidden="true"
    >
      <Image
        src="/assets/kudos/keyvisual.jpg"
        alt=""
        width={1440}
        height={512}
        priority
        className="object-cover w-full h-full"
        style={{ zIndex: 0 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0) 47.8%)",
          zIndex: 1,
        }}
      />
    </div>
  );
}
