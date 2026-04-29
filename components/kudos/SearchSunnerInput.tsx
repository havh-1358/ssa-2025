"use client";

type SearchSunnerInputProps = {
  onDepartmentChange: (dept: string | null) => void;
  activeDepartment?: string | null;
};

function SearchIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchSunnerInput({
  onDepartmentChange,
  activeDepartment,
}: SearchSunnerInputProps) {
  return (
    <div
      className="flex items-center w-full h-[72px] rounded-[68px]"
      style={{
        padding: "24px 16px",
        gap: "8px",
        background: "rgba(255, 234, 158, 0.1)",
        border: "1px solid #998C5F",
        boxSizing: "border-box",
      }}
    >
      {/* Inner frame: icon + text, gap 16px */}
      <div className="flex items-center flex-1 min-w-0" style={{ gap: "16px", height: "24px" }}>
        <SearchIcon />
        <input
          type="search"
          placeholder="Tìm kiếm profile Sunner"
          value={activeDepartment ?? ""}
          onChange={(e) => onDepartmentChange(e.target.value || null)}
          className="bg-transparent outline-none flex-1 min-w-0 placeholder:text-white placeholder:opacity-100 text-white"
          style={{
            fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.15px",
            textAlign: "center",
            color: "#FFFFFF",
            height: "24px",
          }}
          aria-label="Tìm kiếm profile Sunner"
        />
      </div>
    </div>
  );
}
