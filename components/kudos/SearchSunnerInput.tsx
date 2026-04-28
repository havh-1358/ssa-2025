"use client";

type SearchSunnerInputProps = {
  onDepartmentChange: (dept: string | null) => void;
  activeDepartment?: string | null;
};

export function SearchSunnerInput({
  onDepartmentChange,
  activeDepartment,
}: SearchSunnerInputProps) {
  return (
    <div
      className="flex items-center gap-2
        h-[72px] w-full md:w-[381px]
        px-4 py-6
        border border-[var(--color-btn-secondary-border)]
        bg-[var(--color-btn-secondary-bg)]
        rounded-lg"
    >
      <span
        className="font-[family-name:var(--font-montserrat)]
          text-[16px] leading-6 text-[var(--color-text-primary)] opacity-60"
        aria-hidden="true"
      >
        🔍
      </span>
      <input
        type="search"
        placeholder="Tìm Sunner..."
        value={activeDepartment ?? ""}
        onChange={(e) => onDepartmentChange(e.target.value || null)}
        className="flex-1 bg-transparent
          font-[family-name:var(--font-montserrat)] text-[16px] leading-6
          text-[var(--color-text-primary)] placeholder:opacity-50
          outline-none"
        aria-label="Search for a Sunner or department"
      />
      {activeDepartment && (
        <button
          type="button"
          onClick={() => onDepartmentChange(null)}
          className="text-[var(--color-text-primary)] opacity-60 hover:opacity-100
            focus-visible:outline-2 focus-visible:outline-[var(--color-accent-gold)]"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
