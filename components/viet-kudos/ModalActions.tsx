function SendIcon() {
  return (
    <svg
      width="20"
      height="17"
      viewBox="0 0 26 22"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 21.3333V0L25.3333 10.6667M2.66667 17.3333L18.4667 10.6667L2.66667 4V8.66667L10.6667 10.6667L2.66667 12.6667M2.66667 17.3333V4V12.6667V17.3333Z"
        fill="#00101A"
      />
    </svg>
  );
}

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
    /* H — Frame 538: flex row, gap 24px, height 60px */
    <div className="flex flex-row items-start" style={{ gap: "24px", height: "60px" }}>
      {/* H.1 — Hủy: width 146px, height 60px, padding 16px 40px, gap 8px, radius 4px, align-self stretch */}
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="flex flex-row items-center justify-center shrink-0
          border border-[var(--color-btn-secondary-border)]
          bg-[var(--color-btn-secondary-bg)]
          transition-colors duration-150 ease-in-out
          hover:bg-[rgba(255,234,158,0.2)]
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
        style={{
          width: "146px",
          height: "60px",
          padding: "16px 40px",
          gap: "8px",
          borderRadius: "4px",
          alignSelf: "stretch",
        }}
      >
        {/* Text: Montserrat 700 16px #00101A letter-spacing 0.15px */}
        <span
          className="font-[family-name:var(--font-montserrat)] font-bold text-[16px] leading-6"
          style={{ color: "#00101A", letterSpacing: "0.15px" }}
        >
          Hủy
        </span>
        {/* MM_MEDIA_Close × icon — 24×24px, #00101A */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="#00101A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* H.2 — Gửi: background #FFEA9E, padding 16px, gap 8px, radius 8px, flex-grow 1, height 60px */}
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting || !isValid}
        className="flex flex-row items-center justify-center flex-1
          bg-[var(--color-accent-gold)] text-[var(--color-modal-text-dark)]
          font-[family-name:var(--font-montserrat)] font-bold
          text-[22px] leading-7
          transition-all duration-150 ease-in-out
          hover:opacity-90 active:opacity-80
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
        style={{ padding: "16px", gap: "8px", borderRadius: "8px", height: "60px" }}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <span aria-hidden="true" className="animate-spin text-[16px]">⟳</span>
        ) : (
          <SendIcon />
        )}
        Gửi
      </button>
    </div>
  );
}
