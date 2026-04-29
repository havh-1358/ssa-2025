const MAX_LEN = 100;
const WARN_LEN = 80;

type TitleInputProps = {
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

export function TitleInput({ value, onChange, error }: TitleInputProps) {
  const len = value.length;
  const showCounter = len > WARN_LEN;
  const counterColor = len >= MAX_LEN ? "var(--color-error)" : "var(--color-placeholder)";

  return (
    /* Danh hiệu row: flex-row, gap 16px, align-items flex-start */
    <div className="flex flex-row items-start" style={{ gap: "16px" }}>
      {/* Label — 139px shrink-0, vertically centered with input (input is 56px, label 28px → mt ~14px) */}
      <label
        className="shrink-0 font-[family-name:var(--font-montserrat)] font-bold
          text-[22px] leading-7 text-[var(--color-modal-text-dark)] mt-[14px]"
        style={{ whiteSpace: "nowrap", minWidth: "150px" }}
      >
        Danh hiệu <span style={{ color: "var(--color-required-star)" }}>*</span>
      </label>

      {/* Right column: input + hint + error */}
      <div className="flex-1 flex flex-col" style={{ gap: "4px" }}>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={MAX_LEN}
            placeholder="Dành tặng một danh hiệu cho đồng đội"
            className={[
              "w-full px-6 py-4 rounded-[var(--border-input-radius)]",
              "border bg-[var(--color-input-bg)]",
              "font-[family-name:var(--font-montserrat)] font-bold text-[16px]",
              "text-[var(--color-modal-text-dark)] placeholder:text-[var(--color-placeholder)] placeholder:font-bold",
              "outline-none focus:border-[var(--color-modal-text-dark)]",
              error
                ? "border-[var(--color-error)]"
                : "border-[var(--color-input-border)]",
            ].join(" ")}
            aria-invalid={!!error}
          />
          {showCounter && (
            <span
              className="absolute right-3 bottom-2 text-[12px] font-[family-name:var(--font-montserrat)]"
              style={{ color: counterColor }}
              aria-live="polite"
            >
              {len}/{MAX_LEN}
            </span>
          )}
        </div>

        {/* Hint text — Montserrat 700 16px #999999 */}
        <p
          className="font-[family-name:var(--font-montserrat)] font-bold
            text-[16px] leading-6 text-[var(--color-placeholder)]"
        >
          Ví dụ: Người truyền động lực cho tôi.<br />
          Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn.
        </p>

        {error && (
          <p className="font-[family-name:var(--font-montserrat)] text-[12px] leading-4 text-[var(--color-error)]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
