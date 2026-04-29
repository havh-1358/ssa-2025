"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FocusTrap } from "focus-trap-react";
import type { Kudos } from "@/types/kudos";
import { useKudosForm } from "@/hooks/useKudosForm";
import { RecipientSearch } from "./RecipientSearch";
import { TitleInput } from "./TitleInput";
import { HashtagChips } from "./HashtagChips";
import { ImageUpload } from "./ImageUpload";
import { AnonymousToggle } from "./AnonymousToggle";
import { ModalActions } from "./ModalActions";
import { ModalOverlay } from "./ModalOverlay";
import type { RecipientOption } from "@/hooks/useKudosForm";

// T033 — dynamic import to prevent SSR errors from Tiptap browser APIs
const MessageEditor = dynamic(
  () => import("./MessageEditor").then((m) => ({ default: m.MessageEditor })),
  { ssr: false, loading: () => <div className="h-[268px] bg-[var(--color-input-bg)] rounded-[var(--border-input-radius)] border border-[var(--color-input-border)] animate-pulse" /> }
);

type WriteKudosModalProps = {
  isOpen: boolean;
  currentUserId: string | null;
  onClose: () => void;
  onSuccess: (kudos: Kudos) => void;
};

export function WriteKudosModal({
  isOpen,
  currentUserId,
  onClose,
  onSuccess,
}: WriteKudosModalProps) {
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSuccess = useCallback(
    (kudos: Kudos) => {
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
      onSuccess(kudos);
    },
    [onSuccess]
  );

  const { state, patch, resetForm, setTitle, setMessage, handleSubmit } =
    useKudosForm(currentUserId, handleSuccess, handleClose);

  // Escape key handler (T021)
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (!state.isDirty) {
          handleClose();
          resetForm();
        }
        // If dirty, ModalOverlay handles confirmation via click-outside / it won't close
      }
    },
    [isOpen, state.isDirty, handleClose, resetForm]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  // Recipient search with debounce (T025)
  function handleSearchQueryChange(q: string) {
    patch({ searchQuery: q, searchResults: [], searchError: null });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) return;

    debounceRef.current = setTimeout(async () => {
      patch({ isSearching: true });
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error("Search failed");
        const json = await res.json();
        patch({ searchResults: json.data ?? [], isSearching: false });
      } catch {
        patch({ isSearching: false, searchError: "Unable to search" });
      }
    }, 300);
  }

  function handleRecipientSelect(r: RecipientOption) {
    if (!r.id) {
      patch({ recipient: null, searchQuery: "" });
    } else {
      patch({ recipient: r, searchQuery: r.name });
    }
  }

  function handleImageAdd(file: File, previewUrl: string) {
    patch({
      images: [...state.images, file],
      imagePreviewUrls: [...state.imagePreviewUrls, previewUrl],
      isUploading: true,
    });
  }

  function handleUploadComplete(url: string) {
    patch({ uploadedImageUrls: [...state.uploadedImageUrls, url], isUploading: false });
  }

  function handleUploadError(msg: string) {
    patch({ isUploading: false });
    setErrorToast(true);
    setTimeout(() => setErrorToast(false), 3000);
    void msg;
  }

  function handleImageRemove(index: number) {
    patch({
      images: state.images.filter((_, i) => i !== index),
      imagePreviewUrls: state.imagePreviewUrls.filter((_, i) => i !== index),
      uploadedImageUrls: state.uploadedImageUrls.filter((_, i) => i !== index),
      isUploading: false,
    });
  }

  const isFormValid =
    !!state.recipient &&
    state.title.trim().length > 0 &&
    state.message.trim().length > 0 &&
    state.message.length <= 1000 &&
    state.title.length <= 100 &&
    state.hashtags.length > 0;

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay
        isDirty={state.isDirty}
        onClose={() => {
          handleClose();
          resetForm();
        }}
        onConfirmDiscard={() => {
          handleClose();
          resetForm();
        }}
      />

      <FocusTrap
        focusTrapOptions={{
          escapeDeactivates: false,
          allowOutsideClick: true,
        }}
      >
        {/* T019 — Modal container */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="write-kudos-title"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="relative w-full max-w-[752px] max-h-[95vh] overflow-y-auto
              bg-[var(--color-modal-bg)] rounded-[var(--border-modal)] p-[var(--modal-padding)]
              flex flex-col gap-[var(--modal-gap)]
              modal-slide-up"
            style={{ pointerEvents: "all" }}
          >
            {/* Title — 32px 700 centered */}
            <h2
              id="write-kudos-title"
              className="font-[family-name:var(--font-montserrat)] font-bold
                text-[32px] leading-10 text-[var(--color-modal-text-dark)] text-center"
            >
              Gửi lời cảm ơn và ghi nhận đến đồng đội
            </h2>

            {/* Recipient dropdown */}
            <RecipientSearch
              value={state.recipient}
              error={state.errors.recipient}
              onSelect={(r) => patch({ recipient: r })}
            />

            {/* Title input */}
            <TitleInput
              value={state.title}
              onChange={setTitle}
              error={state.errors.title}
            />

            {/* Message editor (SSR-safe dynamic import) */}
            <MessageEditor
              onChange={setMessage}
              error={state.errors.message}
            />

            {/* Hashtags */}
            <HashtagChips
              selected={state.hashtags}
              onChange={(tags) => patch({ hashtags: tags })}
              error={state.errors.hashtags}
            />

            {/* Image upload */}
            <ImageUpload
              previewUrls={state.imagePreviewUrls}
              uploadedUrls={state.uploadedImageUrls}
              isUploading={state.isUploading}
              onFileAdd={handleImageAdd}
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              onRemove={handleImageRemove}
            />

            {/* Anonymous toggle */}
            <AnonymousToggle
              isAnonymous={state.isAnonymous}
              onChange={(v) => patch({ isAnonymous: v })}
            />

            {/* Actions */}
            <ModalActions
              isSubmitting={state.isSubmitting}
              isValid={isFormValid}
              onCancel={() => {
                if (!state.isDirty) {
                  handleClose();
                  resetForm();
                }
              }}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </FocusTrap>

      {/* Toast notifications (T064) */}
      {successToast && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[100]
            bg-[var(--color-accent-gold)] text-[var(--color-modal-text-dark)]
            px-6 py-3 rounded-[var(--border-input-radius)] shadow-lg
            font-[family-name:var(--font-montserrat)] font-bold text-[14px]"
        >
          Your Kudos has been sent! 🎉
        </div>
      )}
      {errorToast && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed bottom-6 right-6 z-[100]
            bg-[var(--color-error)] text-white
            px-6 py-3 rounded-[var(--border-input-radius)] shadow-lg
            font-[family-name:var(--font-montserrat)] font-bold text-[14px]"
        >
          Failed to send Kudos — please try again
        </div>
      )}
    </>
  );
}
