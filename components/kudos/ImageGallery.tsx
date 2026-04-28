import Image from "next/image";

type ImageGalleryProps = {
  imageUrls: string[];
};

export function ImageGallery({ imageUrls }: ImageGalleryProps) {
  if (imageUrls.length === 0) return null;

  const visible = imageUrls.slice(0, 5);

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((url, i) => (
        <div
          key={i}
          className="relative w-[88px] h-[88px] rounded-lg overflow-hidden shrink-0"
        >
          <Image
            src={url}
            alt={`Kudos image ${i + 1}`}
            fill
            className="object-cover"
            sizes="88px"
          />
        </div>
      ))}
    </div>
  );
}
