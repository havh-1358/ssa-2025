"use client";

import { useState } from "react";
import type { Kudos } from "@/types/kudos";
import { KudosCard } from "./KudosCard";

type HighlightKudosProps = {
  highlights: Kudos[];
  currentUserId?: string | null;
  filterHashtag?: string | null;
  filterDepartment?: string | null;
};

function LeftIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RightIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HighlightKudos({
  highlights,
  currentUserId,
  filterHashtag,
  filterDepartment,
}: HighlightKudosProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Client-side filter on the passed highlights
  const filtered = highlights.filter((k) => {
    if (filterHashtag && !k.hashtags.includes(filterHashtag)) return false;
    if (filterDepartment) {
      // department filter would need server-side data; skip client-side for now
      void filterDepartment;
    }
    return true;
  });

  const displayList = filterHashtag || filterDepartment ? filtered : highlights;

  if (displayList.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="font-[family-name:var(--font-montserrat)] text-[16px] leading-6 text-[var(--color-text-primary)] opacity-60">
          Chưa có Highlight Kudos
        </p>
      </div>
    );
  }

  // Reset slide index when filtered list shrinks
  const clampedSlide = activeSlide >= displayList.length ? 0 : activeSlide;
  const total = displayList.length;
  const current = displayList[clampedSlide];
  const prevIdx = (clampedSlide - 1 + total) % total;
  const nextIdx = (clampedSlide + 1) % total;
  const prevCard = displayList[prevIdx];
  const nextCard = displayList[nextIdx];

  function prev() {
    setActiveSlide((i) => (i - 1 + total) % total);
  }

  function next() {
    setActiveSlide((i) => (i + 1) % total);
  }

  return (
    <div className="flex flex-col" style={{ gap: "0px" }}>
      {/* B.2 carousel area — 1440px × 525px relative */}
      <div className="relative w-full overflow-hidden" style={{ height: "525px" }}>
        {/* Prev card — partially visible on left */}
        {total > 1 && prevCard && (
          <div className="absolute top-0 flex items-center" style={{ height: "525px", left: "calc(50% - 264px - 24px - 528px)" }}>
            <KudosCard kudos={prevCard} currentUserId={currentUserId} onHashtagClick={() => {}} variant="highlight" />
          </div>
        )}

        {/* Current card — centered */}
        {current && (
          <div className="absolute top-0 flex items-center" style={{ height: "525px", left: "calc(50% - 264px)" }}>
            <KudosCard kudos={current} currentUserId={currentUserId} onHashtagClick={() => {}} variant="highlight" />
          </div>
        )}

        {/* Next card — partially visible on right */}
        {total > 1 && nextCard && (
          <div className="absolute top-0 flex items-center" style={{ height: "525px", left: "calc(50% + 264px + 24px)" }}>
            <KudosCard kudos={nextCard} currentUserId={currentUserId} onHashtagClick={() => {}} variant="highlight" />
          </div>
        )}

        {/* Left gradient overlay + prev button */}
        <div
          className="absolute left-0 top-0 flex flex-row items-center pointer-events-none"
          style={{
            width: "400px",
            height: "525px",
            background: "linear-gradient(90deg, #00101A 50%, rgba(255,255,255,0) 100%)",
            padding: "186px 161px 186px 80px",
          }}
        >
          <button
            type="button"
            onClick={prev}
            aria-label="Previous kudos"
            className="pointer-events-auto flex items-center justify-center rounded"
            style={{ width: "80px", height: "80px" }}
          >
            <LeftIcon />
          </button>
        </div>

        {/* Right gradient overlay + next button */}
        <div
          className="absolute right-0 top-0 flex flex-row items-center justify-end pointer-events-none"
          style={{
            width: "400px",
            height: "525px",
            background: "linear-gradient(270deg, #00101A 50%, rgba(255,255,255,0) 100%)",
            padding: "186px 40px 186px 80px",
          }}
        >
          <button
            type="button"
            onClick={next}
            aria-label="Next kudos"
            className="pointer-events-auto flex items-center justify-center rounded"
            style={{ width: "80px", height: "80px" }}
          >
            <RightIcon />
          </button>
        </div>
      </div>

      {/* B.5 slide indicator — padding 0 144px, gap 32px */}
      <div
        className="flex flex-row justify-center items-center w-full"
        style={{ padding: "0 144px", gap: "32px", height: "52px" }}
        role="group"
        aria-label="Carousel navigation"
      >
        {/* Prev button — 48×48px */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          style={{ width: "48px", height: "48px" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Page number — current/total */}
        <span
          className="font-[family-name:var(--font-montserrat)] font-bold flex items-baseline gap-0.5"
          aria-live="polite"
          aria-label={`Slide ${activeSlide + 1} of ${total}`}
        >
          <span style={{ fontSize: "45px", lineHeight: "52px", color: "#FFEA9E" }}>{activeSlide + 1}</span>
          <span style={{ fontSize: "24px", lineHeight: "32px", color: "#FFFFFF", opacity: 0.7 }}>/{total}</span>
        </span>

        {/* Next button — 48×48px */}
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          style={{ width: "48px", height: "48px" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
