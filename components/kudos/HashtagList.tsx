type HashtagListProps = {
  hashtags: string[];
  activeHashtag?: string | null;
  onHashtagClick: (tag: string) => void;
};

export function HashtagList({
  hashtags,
  activeHashtag,
  onHashtagClick,
}: HashtagListProps) {
  if (hashtags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {hashtags.map((tag, i) => {
        const isActive = tag === activeHashtag;
        return (
          <button
            key={`${tag}-${i}`}
            type="button"
            onClick={() => onHashtagClick(tag)}
            className={[
              "font-[family-name:var(--font-montserrat)] font-bold",
              "text-[16px] leading-6",
              "px-2 py-0.5 rounded",
              "transition-colors duration-150 ease-in-out",
              "focus-visible:outline-2 focus-visible:outline-[var(--color-hashtag)]",
              isActive
                ? "text-[var(--color-hashtag)] underline"
                : "text-[var(--color-hashtag)] hover:opacity-80",
            ].join(" ")}
          >
            #{tag}
          </button>
        );
      })}
    </div>
  );
}
