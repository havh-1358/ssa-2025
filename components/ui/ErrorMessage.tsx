type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mt-3 px-4 py-3 rounded-lg border border-[var(--color-error-border)] bg-[var(--color-error-bg)] text-[var(--color-error-text)] text-sm font-medium leading-5 font-[family-name:var(--font-montserrat)]"
    >
      {message}
    </div>
  );
}
