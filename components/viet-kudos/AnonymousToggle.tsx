type AnonymousToggleProps = {
  isAnonymous: boolean;
  onChange: (v: boolean) => void;
};

export function AnonymousToggle({ isAnonymous, onChange }: AnonymousToggleProps) {
  return (
    <label
      className="flex items-center gap-3 cursor-pointer select-none"
      htmlFor="anonymous-toggle"
    >
      <input
        id="anonymous-toggle"
        type="checkbox"
        checked={isAnonymous}
        onChange={(e) => onChange(e.target.checked)}
        className="w-6 h-6 rounded border border-[var(--color-checkbox-border)]
          bg-[var(--color-checkbox-bg)] accent-[var(--color-modal-text-dark)]
          cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
      />
      <span
        className={[
          "font-[family-name:var(--font-montserrat)] font-bold text-[22px] leading-7",
          isAnonymous
            ? "text-[var(--color-modal-text-dark)]"
            : "text-[var(--color-placeholder)]",
        ].join(" ")}
      >
        Gửi ẩn danh
      </span>
    </label>
  );
}
