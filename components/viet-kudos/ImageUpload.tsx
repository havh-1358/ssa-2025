"use client";

import { useRef } from "react";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;

type ImageUploadProps = {
  previewUrl: string | null;
  uploadedUrl: string | null;
  isUploading: boolean;
  onFileSelect: (file: File, previewUrl: string) => void;
  onUploadComplete: (url: string) => void;
  onUploadError: (msg: string) => void;
  onRemove: () => void;
};

export function ImageUpload({
  previewUrl,
  uploadedUrl,
  isUploading,
  onFileSelect,
  onUploadComplete,
  onUploadError,
  onRemove,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentFileRef = useRef<File | null>(null);

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

    if (!ALLOWED_MIME.includes(file.type)) {
      onUploadError("File type not allowed. Use JPEG, PNG, GIF, or WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      onUploadError(`File too large. Maximum size is ${MAX_MB}MB.`);
      return;
    }

    const preview = URL.createObjectURL(file);
    currentFileRef.current = file;
    onFileSelect(file, preview);
    doUpload(file);
  }

  function handleRetry() {
    if (currentFileRef.current) doUpload(currentFileRef.current);
  }

  if (previewUrl) {
    return (
      <div className="flex flex-col gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Upload preview"
          className="w-[120px] h-[120px] rounded-lg object-cover border border-[var(--color-input-border)]"
        />
        {isUploading && (
          <p className="text-[12px] text-[var(--color-placeholder)] font-[family-name:var(--font-montserrat)]">
            Uploading...
          </p>
        )}
        {uploadedUrl && !isUploading && (
          <p className="text-[12px] text-[var(--color-modal-text-dark)] font-[family-name:var(--font-montserrat)]">
            ✓ Uploaded
          </p>
        )}
        {!uploadedUrl && !isUploading && (
          <button
            type="button"
            onClick={handleRetry}
            className="self-start text-[12px] font-bold underline
              text-[var(--color-modal-text-dark)]"
          >
            Retry upload
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="self-start text-[12px] font-bold text-[var(--color-error)]
            underline focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
        >
          Remove image
        </button>
      </div>
    );
  }

  return (
    <div>
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
        className="w-full py-8 rounded-[var(--border-input-radius)]
          border-2 border-dashed border-[var(--color-input-border)]
          bg-transparent
          font-[family-name:var(--font-montserrat)] text-[14px]
          text-[var(--color-placeholder)]
          hover:border-[var(--color-modal-text-dark)] hover:text-[var(--color-modal-text-dark)]
          transition-colors duration-150
          focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
      >
        ＋ Thêm ảnh (tùy chọn, tối đa 5MB)
      </button>
    </div>
  );
}
