import type { KudosStats, TopSunner } from "@/types/kudos";

type StatsPanelProps = {
  stats: KudosStats;
  topSunners: TopSunner[];
};

function fmt(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n);
}

export function StatsPanel({ stats, topSunners }: StatsPanelProps) {
  return (
    <aside className="flex flex-col gap-[var(--sidebar-gap)]">
      {/* Stats numbers */}
      <div className="flex flex-col gap-4">
        <StatItem
          value={fmt(stats.totalKudosSent)}
          label="Tổng kudos đã gửi"
        />
        <StatItem
          value={fmt(stats.totalHeartsGiven)}
          label="Tổng số tim đã nhận"
          gold
        />
        <StatItem
          value={fmt(stats.totalParticipants)}
          label="Tổng người tham gia"
        />
      </div>

      {/* Top 10 Sunners */}
      <div className="flex flex-col gap-3">
        <h2
          className="font-[family-name:var(--font-montserrat)] font-bold
            text-[22px] leading-7 text-[var(--color-text-primary)]"
        >
          Top 10 Sunners
        </h2>
        <ol className="flex flex-col gap-2">
          {topSunners.map((sunner) => (
            <li
              key={sunner.userId}
              className="flex items-center gap-3"
            >
              <span
                className="font-[family-name:var(--font-montserrat)] font-bold
                  text-[16px] leading-6 text-[var(--color-accent-gold)] w-6 shrink-0"
              >
                {sunner.rank}
              </span>
              <span
                className="font-[family-name:var(--font-montserrat)]
                  text-[14px] leading-5 text-[var(--color-text-primary)] truncate"
              >
                {sunner.name}
              </span>
              <span
                className="font-[family-name:var(--font-montserrat)] font-bold
                  text-[14px] leading-5 text-[var(--color-heart-count-gold)] ml-auto shrink-0"
              >
                ♥ {fmt(sunner.heartsReceived)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

function StatItem({
  value,
  label,
  gold,
}: {
  value: string;
  label: string;
  gold?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={[
          "font-[family-name:var(--font-montserrat)] font-bold",
          "text-[32px] leading-10",
          gold
            ? "text-[var(--color-heart-count-gold)]"
            : "text-[var(--color-text-primary)]",
        ].join(" ")}
      >
        {value}
      </span>
      <span
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[22px] leading-7 text-[var(--color-text-primary)] opacity-70"
      >
        {label}
      </span>
    </div>
  );
}
