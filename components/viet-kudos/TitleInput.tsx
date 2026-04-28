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
    <div className="flex flex-col gap-[var(--field-gap)]">
      <label
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[14px] leading-5 text-[var(--color-modal-text-dark)]"
      >
        Tiêu đề *
      </label>

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={MAX_LEN}
          placeholder="Nhập tiêu đề Kudos..."
          className={[
            "w-full px-6 py-4 rounded-[var(--border-input-radius)]",
            "border bg-[var(--color-input-bg)]",
            "font-[family-name:var(--font-montserrat)] text-[16px]",
            "text-[var(--color-modal-text-dark)] placeholder:text-[var(--color-placeholder)]",
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

      {error && (
        <p
          className="font-[family-name:var(--font-montserrat)]
            text-[12px] leading-4 text-[var(--color-error)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
