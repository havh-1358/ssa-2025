"use client";

import { useEffect, useState } from "react";
import type { SpotlightNode } from "@/types/kudos";

type SpotlightBoardsProps = {
  initialError?: string | null;
};

type PlacedBox = { x: number; y: number; w: number; h: number };

/** Estimate SVG text bounding box for Montserrat 700 Vietnamese */
function estimateTextBox(name: string, fontSize: number): { w: number; h: number } {
  // Vietnamese chars + Latin: avg width ≈ 0.62× fontSize; add horizontal padding
  const w = name.length * fontSize * 0.62 + 10;
  const h = fontSize * 1.3 + 4;
  return { w, h };
}

/** Check if a candidate box (cx,cy,w,h) overlaps any already-placed box */
function hasOverlap(cx: number, cy: number, w: number, h: number, placed: PlacedBox[]): boolean {
  for (const p of placed) {
    const gapX = (w + p.w) / 2 + 4;   // 4px horizontal gap
    const gapY = (h + p.h) / 2 + 3;   // 3px vertical gap
    if (Math.abs(cx - p.x) < gapX && Math.abs(cy - p.y) < gapY) return true;
  }
  return false;
}

/** Check if a position is in a forbidden zone (search box, KUDOS title, pan/zoom) */
function isForbidden(cx: number, cy: number, w: number, h: number): boolean {
  const hw = w / 2, hh = h / 2;
  // Top-left: search input [25-244, 26-65]
  if (cx - hw < 250 && cy - hh < 70) return true;
  // Top-center: KUDOS title [470-700, 0-70]
  if (cx + hw > 465 && cx - hw < 705 && cy - hh < 75) return true;
  // Bottom-right: pan/zoom [1070-1120, 460-510]
  if (cx + hw > 1067 && cy + hh > 458) return true;
  // Bottom-left: activity feed [0-650, 390-548]
  if (cx - hw < 660 && cy + hh > 388) return true;
  return false;
}

/** Archimedean spiral placement — place each node once with no overlap */
function generatePositions(nodes: SpotlightNode[]): Array<SpotlightNode & { x: number; y: number; fontSize: number }> {
  if (nodes.length === 0) return [];

  const W = 1152;
  const H = 548;
  const maxCount = Math.max(...nodes.map(n => n.kudosCount));
  const cx = W / 2 + 40; // slight right bias (left has background art)
  const cy = H / 2 + 20;

  // Sort by kudos count desc — bigger names placed first (center)
  const sorted = [...nodes].sort((a, b) => b.kudosCount - a.kudosCount);
  const placed: PlacedBox[] = [];
  const result: Array<SpotlightNode & { x: number; y: number; fontSize: number }> = [];

  for (let i = 0; i < sorted.length; i++) {
    const node = sorted[i];
    const ratio = maxCount > 1 ? node.kudosCount / maxCount : 0.5;
    const fontSize = parseFloat((6.65 + ratio * (11.34 - 6.65)).toFixed(2));
    const { w, h } = estimateTextBox(node.recipientName, fontSize);

    // Archimedean spiral: r = a + b*θ, flatten vertically
    const a = 0;
    const b = 2.2;           // spiral pitch
    let placed_flag = false;

    // Start angle offset per node so they don't all start at same angle
    const startT = i * 0.35;

    for (let step = 0; step < 800; step++) {
      const t = startT + step * 0.18;
      const r = a + b * t;
      const x = cx + r * Math.cos(t);
      const y = cy + r * Math.sin(t) * 0.55; // flatten to ellipse

      // Clamp to canvas safe margin
      const px = Math.max(w / 2 + 8, Math.min(W - w / 2 - 8, x));
      const py = Math.max(h / 2 + 8, Math.min(H - h / 2 - 8, y));

      if (!isForbidden(px, py, w, h) && !hasOverlap(px, py, w, h, placed)) {
        placed.push({ x: px, y: py, w, h });
        result.push({ ...node, x: px, y: py, fontSize });
        placed_flag = true;
        break;
      }
    }

    // Fallback: place anywhere not overlapping (scan top-to-bottom)
    if (!placed_flag) {
      outer: for (let gy = 60; gy < H - 20; gy += 12) {
        for (let gx = 60; gx < W - 20; gx += 14) {
          if (!isForbidden(gx, gy, w, h) && !hasOverlap(gx, gy, w, h, placed)) {
            placed.push({ x: gx, y: gy, w, h });
            result.push({ ...node, x: gx, y: gy, fontSize });
            break outer;
          }
        }
      }
    }
  }

  return result;
}

export function SpotlightBoards({ initialError = null }: SpotlightBoardsProps) {
  const [nodes, setNodes] = useState<SpotlightNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(initialError);
  const [search, setSearch] = useState("");
  const [isPanMode, setIsPanMode] = useState(false);
  const [totalKudos, setTotalKudos] = useState(0);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  const W = 1152;
  const H = 548;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/kudos/spotlight")
      .then(r => r.json())
      .then(json => {
        if (cancelled) return;
        const data: SpotlightNode[] = json.data ?? [];
        setNodes(data);
        setTotalKudos(data.reduce((s, n) => s + n.kudosCount, 0));
        const recent = [...data]
          .sort((a, b) => new Date(b.latestKudosAt).getTime() - new Date(a.latestKudosAt).getTime())
          .slice(0, 6)
          .map(n => `${n.recipientName} đã nhận được một Kudos mới`);
        setRecentActivity(recent);
      })
      .catch(() => { if (!cancelled) setError("Không thể tải Spotlight Board."); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mx-auto"
        style={{ width: `${W}px`, height: `${H}px`, border: "1px solid #998C5F", borderRadius: "47px" }}>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="font-[family-name:var(--font-montserrat)] text-[14px] text-white opacity-60">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center mx-auto"
        style={{ width: `${W}px`, height: `${H}px`, border: "1px solid #998C5F", borderRadius: "47px" }}>
        <p className="font-[family-name:var(--font-montserrat)] text-[14px] text-white opacity-60">
          {error ?? "Chưa có dữ liệu"}
        </p>
      </div>
    );
  }

  const scattered = generatePositions(nodes);
  const totalKudosFormatted = new Intl.NumberFormat("vi-VN").format(totalKudos);

  // Activity feed opacity levels (newest first)
  const feedOpacities = [1, 0.7, 0.5, 0.3, 0.1];

  return (
    <div className="relative mx-auto" style={{ width: `${W}px` }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        style={{ borderRadius: "47px", border: "1px solid #998C5F", display: "block" }}
        aria-label="Spotlight Board word cloud"
      >
        {/* Background image */}
        <defs>
          <clipPath id="spotlight-clip">
            <rect x="0" y="0" width={W} height={H} rx="47" ry="47" />
          </clipPath>
        </defs>
        <image
          href="/assets/kudos/spotlight-bg.png"
          x="0" y="0"
          width={W} height={H}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#spotlight-clip)"
        />
        {/* Dark overlay */}
        <rect x="0" y="0" width={W} height={H} rx="47" ry="47"
          fill="rgba(0,0,0,0.5)" />

        {/* B.7.1 — Total KUDOS count — centered top */}
        <text
          x={W / 2} y={14 + 36}
          textAnchor="middle"
          fontFamily="Montserrat, sans-serif"
          fontWeight="700"
          fontSize="36"
          fill="#FFFFFF"
        >
          {totalKudosFormatted} KUDOS
        </text>

        {/* Connecting lines between spatially nearby nodes */}
        {scattered.map((node, i) =>
          scattered.slice(i + 1).map((other, j) => {
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 220) return null;
            return (
              <line
                key={`ln-${i}-${j}`}
                x1={node.x} y1={node.y}
                x2={other.x} y2={other.y}
                stroke="#FFFFFF"
                strokeWidth="0.4"
                strokeOpacity={Math.max(0.06, 0.25 - dist / 1000)}
              />
            );
          })
        )}

        {/* Dots at node positions */}
        {scattered.map((node, i) => (
          <circle key={`d-${i}`} cx={node.x} cy={node.y} r={1} fill="#FFFFFF" opacity={0.35} />
        ))}

        {/* Name labels */}
        {scattered.map((node, i) => {
          const isMatch = search.trim()
            ? node.recipientName.toLowerCase().includes(search.toLowerCase())
            : true;
          const opacity = search.trim() ? (isMatch ? 1 : 0.15) : 1;
          const color = search.trim() && isMatch ? "#FFEA9E" : "#FFFFFF";

          return (
            <text
              key={`t-${i}`}
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Montserrat, sans-serif"
              fontWeight="700"
              fontSize={node.fontSize}
              letterSpacing="0.208"
              fill={color}
              opacity={opacity}
              style={{ cursor: "pointer" }}
              aria-label={`${node.recipientName}`}
            >
              {node.recipientName}
            </text>
          );
        })}

        {/* B.7.3 — Search input — top-left: left:25, top:26, 219×39px */}
        <foreignObject x="25" y="26" width="219" height="39">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "5.46px",
              padding: "0 10.9px",
              width: "219px",
              height: "39px",
              background: "rgba(255,234,158,0.1)",
              border: "0.682px solid #998C5F",
              borderRadius: "46px",
              boxSizing: "border-box",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="search"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                flex: 1,
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 500,
                fontSize: "10.9px",
                lineHeight: "16px",
                letterSpacing: "0.1px",
                color: "#FFFFFF",
              }}
              aria-label="Tìm kiếm Sunner"
            />
          </div>
        </foreignObject>

        {/* B.7.2 — Pan/Zoom button — bottom-right: left:1084, top:471, 30×30 */}
        <g
          transform={`translate(1084, 471)`}
          style={{ cursor: "pointer" }}
          onClick={() => setIsPanMode(v => !v)}
          role="button"
          aria-pressed={isPanMode}
          aria-label="Bật/tắt chế độ zoom"
        >
          <rect width="30" height="30" rx="4" fill={isPanMode ? "rgba(255,234,158,0.2)" : "rgba(255,255,255,0.1)"} />
          <path d="M4 15l4-4 4 4M12 11v8M19 9l-4 4-4-4M15 13V5"
            stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            transform="translate(3,3)" />
        </g>

        {/* Activity feed — bottom-left, stacked, fading */}
        {recentActivity.slice(0, 5).map((text, i) => {
          const topPos = H - 43 - (recentActivity.length - 1 - i) * 19;
          const opacity = feedOpacities[recentActivity.length - 1 - i] ?? 0.1;
          return (
            <text
              key={`feed-${i}`}
              x="49"
              y={topPos}
              fontFamily="Montserrat, sans-serif"
              fontWeight="700"
              fontSize="14"
              letterSpacing="0.1"
              fill="#999999"
              opacity={opacity}
            >
              {text}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
