"use client";

import { useRef } from "react";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const MAX_IMAGES = 5;

type ImageUploadProps = {
  previewUrls: string[];
  uploadedUrls: string[];
  isUploading: boolean;
  onFileAdd: (file: File, previewUrl: string) => void;
  onUploadComplete: (url: string) => void;
  onUploadError: (msg: string) => void;
  onRemove: (index: number) => void;
};

export function ImageUpload({
  previewUrls,
  uploadedUrls,
  isUploading,
  onFileAdd,
  onUploadComplete,
  onUploadError,
  onRemove,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function doUpload(file: File) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onUploadComplete(json.data.url);
    } catch (err) {
      clearTimeout(timeoutId);
      const msg =
        err instanceof Error && err.name === "AbortError"
          ? "Upload timed out — please try again"
          : "Upload failed — please try again";
      onUploadError(msg);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (!ALLOWED_MIME.includes(file.type)) {
      onUploadError("File type not allowed. Use JPEG, PNG, GIF, or WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      onUploadError(`File too large. Maximum size is ${MAX_MB}MB.`);
      return;
    }

    const preview = URL.createObjectURL(file);
    onFileAdd(file, preview);
    doUpload(file);
  }

  const canAddMore = previewUrls.length < MAX_IMAGES;

  return (
    /* F row: flex-row, gap 16px, align-items center */
    <div className="flex flex-row items-center" style={{ gap: "16px" }}>
      {/* F.1_Title — 74px, "Image" (no asterisk — optional field) */}
      <p
        className="shrink-0 font-[family-name:var(--font-montserrat)] font-bold
          text-[22px] leading-7 text-[var(--color-modal-text-dark)]"
        style={{ whiteSpace: "nowrap" }}
      >
        Image
      </p>

      {/* Thumbnails + add button */}
      <div className="flex flex-row items-center flex-wrap gap-4">
      {/* Thumbnails */}
      {previewUrls.map((url, i) => (
        <div key={url} className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={`Image ${i + 1}`}
            className="object-cover"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "18px",
              border: "1px solid var(--color-input-border)",
            }}
          />
          {/* Uploading overlay */}
          {isUploading && i === previewUrls.length - 1 && !uploadedUrls[i] && (
            <div
              className="absolute inset-0 flex items-center justify-center
                bg-black/40 rounded-[18px]"
            >
              <span className="text-white text-[10px] font-bold">...</span>
            </div>
          )}
          {/* Remove button */}
          <button
            type="button"
            onClick={() => onRemove(i)}
            aria-label={`Remove image ${i + 1}`}
            className="absolute -top-2 -right-2 flex items-center justify-center
              focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#D4271D",
              color: "white",
              fontSize: "12px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      ))}

      {/* Add image button — hidden when 5 images attached */}
      {canAddMore && (
        <div className="shrink-0 flex-shrink-0">
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_MIME.join(",")}
            className="sr-only"
            onChange={handleFileChange}
            aria-label="Upload image"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-0.5
              font-[family-name:var(--font-montserrat)] font-bold
              border border-[var(--color-input-border)]
              bg-[var(--color-input-bg)]
              hover:opacity-80 transition-opacity
              focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "8px",
            }}
          >
            <span className="text-[20px] text-[var(--color-modal-text-dark)]">+</span>
            <span className="text-[11px] text-[var(--color-modal-text-dark)]">Image</span>
            <span className="text-[10px] text-[var(--color-placeholder)]">Tối đa {MAX_IMAGES}</span>
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
