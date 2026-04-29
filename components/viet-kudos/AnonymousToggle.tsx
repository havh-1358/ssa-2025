type AnonymousToggleProps = {
  isAnonymous: boolean;
  onChange: (v: boolean) => void;
};

export function AnonymousToggle({ isAnonymous, onChange }: AnonymousToggleProps) {
  return (
    /* G_Gửi ẩn danh: flex row, gap 16px, width 672px, height 28px, align-items center */
    <label
      className="flex flex-row items-center cursor-pointer select-none"
      style={{ gap: "16px" }}
    >
      {/* Hidden native checkbox for accessibility */}
      <input
        type="checkbox"
        checked={isAnonymous}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
        aria-label="Gửi lời cảm ơn và ghi nhận ẩn danh"
      />

      {/*
        Custom checkbox: 24×24px, border-radius 4px
        Unchecked: border 1px solid #999999, background #FFFFFF
        Checked:   border 1px solid #998C5F, background #FFEA9E, checkmark #00101A
        Focus:     outline 2px solid #FFEA9E via peer-focus-visible
      */}
      <span
        aria-hidden="true"
        className="shrink-0 flex items-center justify-center
          peer-focus-visible:outline peer-focus-visible:outline-2
          peer-focus-visible:outline-[#FFEA9E] peer-focus-visible:outline-offset-2
          transition-colors duration-150"
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "4px",
          border: isAnonymous ? "1px solid #998C5F" : "1px solid #999999",
          background: isAnonymous ? "#FFEA9E" : "#FFFFFF",
        }}
      >
        {isAnonymous && (
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden="true">
            <path
              d="M1 5L5.5 9.5L13 1"
              stroke="#00101A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      {/* Label: Montserrat 700 22px/28px, #999999 unchecked → #00101A checked */}
      <span
        className="font-[family-name:var(--font-montserrat)] font-bold"
        style={{
          fontSize: "22px",
          lineHeight: "28px",
          color: isAnonymous ? "#00101A" : "#999999",
        }}
      >
        Gửi lời cảm ơn và ghi nhận ẩn danh
      </span>
    </label>
  );
}
