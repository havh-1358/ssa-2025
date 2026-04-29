"use client";

import { useState } from "react";

type ModalOverlayProps = {
  isDirty: boolean;
  onClose: () => void;
  onConfirmDiscard: () => void;
};

export function ModalOverlay({ isDirty, onClose, onConfirmDiscard }: ModalOverlayProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  function handleBackdropClick() {
    if (!isDirty) {
      onClose();
    } else {
      setShowConfirm(true);
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[190]"
        style={{ background: "var(--color-overlay)" }}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {showConfirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="discard-dialog-title"
        >
          <div
            className="bg-[var(--color-modal-bg)] rounded-[var(--border-modal)]
              p-8 flex flex-col gap-6 max-w-[400px] w-full shadow-xl"
          >
            <h2
              id="discard-dialog-title"
              className="font-[family-name:var(--font-montserrat)] font-bold
                text-[20px] leading-7 text-[var(--color-modal-text-dark)]"
            >
              Bạn có chắc chắn không?
            </h2>
            <p
              className="font-[family-name:var(--font-montserrat)]
                text-[16px] leading-6 text-[var(--color-modal-text-dark)] opacity-70"
            >
              Kudos của bạn sẽ không được lưu.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-6 py-3 rounded-[var(--border-input-radius)]
                  border border-[var(--color-input-border)]
                  font-[family-name:var(--font-montserrat)] font-bold text-[14px]
                  text-[var(--color-modal-text-dark)]
                  hover:bg-[var(--color-suggestion-hover)]
                  focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
              >
                Tiếp tục viết
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  onConfirmDiscard();
                }}
                className="px-6 py-3 rounded-[var(--border-input-radius)]
                  bg-[var(--color-error)] text-white
                  font-[family-name:var(--font-montserrat)] font-bold text-[14px]
                  hover:opacity-90
                  focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
              >
                Hủy Kudos
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
