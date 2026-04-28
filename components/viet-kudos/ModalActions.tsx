type ModalActionsProps = {
  isSubmitting: boolean;
  isValid: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export function ModalActions({
  isSubmitting,
  isValid,
  onCancel,
  onSubmit,
}: ModalActionsProps) {
  return (
    <div className="flex items-center justify-end gap-6">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-10 py-4 rounded-[var(--border-input-radius)]
          border border-[var(--color-btn-secondary-border)]
          bg-[var(--color-btn-secondary-bg)]
          font-[family-name:var(--font-montserrat)] font-bold
          text-[16px] leading-6 text-[var(--color-modal-text-dark)]
          transition-colors duration-150 ease-in-out
          hover:bg-[rgba(255,234,158,0.2)]
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
      >
        Hủy
      </button>

      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting || !isValid}
        className="px-4 py-4 rounded-[var(--border-input-radius)]
          bg-[var(--color-accent-gold)] text-[var(--color-modal-text-dark)]
          font-[family-name:var(--font-montserrat)] font-bold
          text-[16px] leading-6 min-w-[120px] flex items-center justify-center gap-2
          transition-all duration-150 ease-in-out
          hover:opacity-90 active:opacity-80
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
        aria-busy={isSubmitting}
      >
        {isSubmitting && (
          <span aria-hidden="true" className="animate-spin text-[16px]">⟳</span>
        )}
        Gửi
      </button>
    </div>
  );
}
