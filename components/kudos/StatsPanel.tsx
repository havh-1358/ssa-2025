import type { KudosStats, TopSunner } from "@/types/kudos";

type PersonalStats = {
  kudosReceived: number;
  kudosSent: number;
  heartsReceived: number;
  secretBoxesOpened: number;
  secretBoxesUnopened: number;
};

type RecentGift = {
  userId: string;
  name: string;
  avatar: string | null;
  giftDescription: string;
};

type StatsPanelProps = {
  stats: KudosStats;
  topSunners: TopSunner[];
  personalStats: PersonalStats;
  recentGifts: RecentGift[];
};

function fmt(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n);
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-row items-center justify-between" style={{ height: "40px", gap: "8px" }}>
      <span
        className="font-[family-name:var(--font-montserrat)] font-bold"
        style={{ fontSize: "22px", lineHeight: "28px", color: "#FFFFFF" }}
      >
        {label}
      </span>
      <span
        className="font-[family-name:var(--font-montserrat)] font-bold shrink-0"
        style={{ fontSize: "32px", lineHeight: "40px", color: "#FFEA9E" }}
      >
        {value}
      </span>
    </div>
  );
}

function GiftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 12V22H4V12" stroke="#00101A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 7H2V12H22V7Z" stroke="#00101A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22V7" stroke="#00101A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#00101A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="#00101A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function StatsPanel({
  personalStats,
  recentGifts,
}: StatsPanelProps) {
  const canOpenBox = personalStats.secretBoxesUnopened > 0;

  return (
    <aside
      className="flex flex-col"
      style={{ width: "422px", gap: "24px" }}
    >
      {/* D.1 — Thống kê tổng quát */}
      <div
        className="flex flex-col"
        style={{
          padding: "24px",
          gap: "10px",
          background: "#00070C",
          border: "1px solid #998C5F",
          borderRadius: "17px",
          width: "422px",
        }}
      >
        {/* Nội dung — inner content wrapper */}
        <div className="flex flex-col" style={{ gap: "16px", width: "374px" }}>
          {/* D.1.2 — Số kudos nhận được */}
          <StatRow label="Số Kudos bạn nhận được:" value={fmt(personalStats.kudosReceived)} />

          {/* D.1.3 — Số kudos đã gửi */}
          <StatRow label="Số Kudos bạn đã gửi:" value={fmt(personalStats.kudosSent)} />

          {/* D.1.4 — Số tim */}
          <div className="flex flex-row items-center justify-between" style={{ height: "40px", gap: "8px" }}>
            <div className="flex flex-row items-center" style={{ gap: "8px" }}>
              <span
                className="font-[family-name:var(--font-montserrat)] font-bold"
                style={{ fontSize: "22px", lineHeight: "28px", color: "#FFFFFF" }}
              >
                Số tim bạn nhận được:
              </span>
              {/* Fire icon + x2 badge */}
              <div className="relative shrink-0" style={{ width: "34px", height: "40px" }}>
                <svg width="34" height="40" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path d="M16.4505 28.1424L14.5172 26.3825C7.65052 20.1558 3.11719 16.0358 3.11719 11.0091C3.11719 6.88911 6.34385 3.67578 10.4505 3.67578C12.7705 3.67578 14.9972 4.75578 16.4505 6.44911C17.9039 4.75578 20.1305 3.67578 22.4505 3.67578C26.5572 3.67578 29.7839 6.88911 29.7839 11.0091C29.7839 16.0358 25.2505 20.1558 18.3839 26.3825L16.4505 28.1424Z" fill="#D4271D"/>
                </svg>
                <span
                  className="absolute font-[family-name:var(--font-montserrat)] font-bold"
                  style={{
                    bottom: "0px",
                    right: "-8px",
                    fontSize: "11px",
                    lineHeight: "14px",
                    color: "#FFFFFF",
                    background: "#000",
                    border: "1px solid #000",
                    borderRadius: "2px",
                    padding: "0 2px",
                  }}
                >
                  x2
                </span>
              </div>
            </div>
            <span
              className="font-[family-name:var(--font-montserrat)] font-bold shrink-0"
              style={{ fontSize: "32px", lineHeight: "40px", color: "#FFEA9E", width: "80px", textAlign: "right" }}
            >
              {fmt(personalStats.heartsReceived)}
            </span>
          </div>

          {/* D.1.5 — Divider */}
          <div style={{ width: "374px", height: "1px", background: "#2E3940" }} />

          {/* D.1.6 — Số secret box đã mở */}
          <StatRow label="Số Secret Box bạn đã mở:" value={fmt(personalStats.secretBoxesOpened)} />

          {/* D.1.7 — Số secret box chưa mở */}
          <StatRow label="Số Secret Box chưa mở:" value={fmt(personalStats.secretBoxesUnopened)} />

          {/* D.1.8 — Button mở quà */}
          <button
            type="button"
            disabled={!canOpenBox}
            aria-disabled={!canOpenBox}
            className="flex flex-row items-center justify-center transition-opacity duration-150"
            style={{
              width: "374px",
              height: "60px",
              padding: "16px",
              gap: "8px",
              background: canOpenBox ? "#FFEA9E" : "rgba(255,234,158,0.3)",
              borderRadius: "8px",
              cursor: canOpenBox ? "pointer" : "not-allowed",
              border: "none",
            }}
          >
            <span
              className="font-[family-name:var(--font-montserrat)] font-bold"
              style={{ fontSize: "22px", lineHeight: "28px", color: "#00101A" }}
            >
              Mở Secret Box
            </span>
            <GiftIcon />
          </button>
        </div>
      </div>

      {/* D.3 — 10 Sunner nhận quà mới nhất */}
      <div
        className="flex flex-col"
        style={{
          padding: "24px 16px 24px 24px",
          gap: "10px",
          background: "#00070C",
          border: "1px solid #998C5F",
          borderRadius: "17px",
          width: "422px",
        }}
      >
        <div className="flex flex-col" style={{ gap: "16px", width: "382px" }}>
          {/* D.3.1 — Title */}
          <h2
            className="font-[family-name:var(--font-montserrat)] font-bold text-center uppercase"
            style={{
              fontSize: "22px",
              lineHeight: "28px",
              color: "#FFEA9E",
              width: "382px",
            }}
          >
            10 Sunner Nhận Quà Mới Nhất
          </h2>

          {/* Sunner list */}
          {recentGifts.length === 0 ? (
            <p
              className="font-[family-name:var(--font-montserrat)]"
              style={{ fontSize: "14px", color: "#FFFFFF", opacity: 0.5 }}
            >
              Chưa có dữ liệu
            </p>
          ) : (
            <div className="flex flex-col" style={{ gap: "16px", width: "364px" }}>
              {recentGifts.map((gift, i) => (
                <div
                  key={`${gift.userId}-${i}`}
                  className="flex flex-row items-center"
                  style={{ gap: "8px", height: "64px", width: "364px" }}
                >
                  {/* Avatar */}
                  {gift.avatar ? (
                    <img
                      src={gift.avatar}
                      alt=""
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1.87px solid #FFFFFF",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center font-[family-name:var(--font-montserrat)] font-bold shrink-0"
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        border: "1.87px solid #FFFFFF",
                        background: "var(--color-accent-gold)",
                        color: "var(--color-bg-base)",
                        fontSize: "22px",
                      }}
                      aria-hidden="true"
                    >
                      {gift.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Name + description */}
                  <div className="flex flex-col" style={{ gap: "2px", width: "230px" }}>
                    <span
                      className="font-[family-name:var(--font-montserrat)] font-bold truncate"
                      style={{ fontSize: "22px", lineHeight: "28px", color: "#FFEA9E", width: "230px" }}
                    >
                      {gift.name}
                    </span>
                    <span
                      className="font-[family-name:var(--font-montserrat)] font-bold truncate"
                      style={{
                        fontSize: "16px",
                        lineHeight: "24px",
                        letterSpacing: "0.15px",
                        color: "#FFFFFF",
                        width: "230px",
                      }}
                    >
                      {gift.giftDescription}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
