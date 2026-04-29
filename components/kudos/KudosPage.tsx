"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Kudos, KudosStats, TopSunner } from "@/types/kudos";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { WriteKudosModal } from "@/components/viet-kudos/WriteKudosModal";
import { KudosKeyvisual } from "./KudosKeyvisual";
import { HighlightKudos } from "./HighlightKudos";
import { SpotlightBoards } from "./SpotlightBoards";
import { KudosFeed } from "./KudosFeed";
import { StatsPanel } from "./StatsPanel";
import { WriteKudosButton } from "./WriteKudosButton";
import { SearchSunnerInput } from "./SearchSunnerInput";
import { FilterDropdown } from "./FilterDropdown";
import { useHashtagOptions } from "@/hooks/useHashtagOptions";

const DEPARTMENT_OPTIONS = ["CEVC1", "CEVC2", "CEVC3", "CEVC4", "OPD", "Infra"];

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

type KudosPageProps = {
  highlights: Kudos[];
  initialFeed: Kudos[];
  stats: KudosStats;
  topSunners: TopSunner[];
  personalStats: PersonalStats;
  recentGifts: RecentGift[];
  spotlightError: string | null;
  currentUserId: string | null;
  userEmail?: string | null;
};

export function KudosPage({
  highlights,
  initialFeed,
  stats,
  topSunners,
  personalStats,
  recentGifts,
  spotlightError,
  currentUserId,
  userEmail,
}: KudosPageProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterHashtag, setFilterHashtag] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const prependFnRef = useRef<((k: Kudos) => void) | null>(null);
  const hashtagOptions = useHashtagOptions();

  // T057a — read initial filter values from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashtag = params.get("hashtag");
    const department = params.get("department");
    if (hashtag) setFilterHashtag(hashtag);
    if (department) setFilterDepartment(department);
  }, []);

  // T057b — write filter changes to URL (shallow replace, no scroll)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filterHashtag) params.set("hashtag", filterHashtag);
    if (filterDepartment) params.set("department", filterDepartment);
    const qs = params.toString();
    router.replace(qs ? `/kudos?${qs}` : "/kudos", { scroll: false });
  }, [filterHashtag, filterDepartment, router]);

  function handleRegisterPrepend(fn: (k: Kudos) => void) {
    prependFnRef.current = fn;
  }

  function handleKudosSuccess(kudos: Kudos) {
    prependFnRef.current?.(kudos);
  }

  return (
    <>
      <Header activeNav="kudos" user={userEmail ? { email: userEmail } : null} />

      <main className="bg-[var(--color-bg-base)] min-h-screen">
        <div className="max-w-[1440px] mx-auto">
        {/* Keyvisual + action bar overlay */}
        <div className="relative pt-[var(--header-height)]">
          <KudosKeyvisual />

          {/* Action bar — Figma y:408 → top = 408 − 80(header) = 328px from keyvisual top */}
          <div
            className="absolute"
            style={{
              top: "calc(var(--header-height) + 328px)",
              left: 0,
              width: "100%",
              height: "72px",
              zIndex: 10,
            }}
          >
            {/* Write Kudos — left:144px, width:738px */}
            <div className="absolute" style={{ left: "144px", width: "738px" }}>
              <WriteKudosButton onOpen={() => setIsModalOpen(true)} />
            </div>
            {/* Search Sunner — left:914px, width:381px */}
            <div className="absolute" style={{ left: "914px", width: "381px" }}>
              <SearchSunnerInput
                onDepartmentChange={() => {}}
                activeDepartment={null}
              />
            </div>
          </div>
        </div>

        {/* Highlight Kudos — gap 64px from keyvisual bottom */}
        <section className="pt-16 flex flex-col gap-[40px]">
          {/* B.1_header — padding 0 144px, flex col, gap 40px */}
          <div
            className="flex flex-col"
            style={{ padding: "0 144px", gap: "40px" }}
          >
            {/* Header Giải thưởng — flex col, gap 16px */}
            <div className="flex flex-col" style={{ gap: "16px" }}>
              {/* "Sun* Annual Awards 2025" */}
              <p
                className="font-[family-name:var(--font-montserrat)] font-bold"
                style={{ fontSize: "24px", lineHeight: "32px", color: "#FFFFFF" }}
              >
                Sun* Annual Awards 2025
              </p>
              {/* Divider #2E3940 */}
              <hr style={{ border: "none", height: "1px", background: "#2E3940" }} />
              {/* Frame 488: HIGHLIGHT KUDOS + filter buttons */}
              <div className="flex flex-row justify-between items-center" style={{ gap: "32px" }}>
                <h2
                  className="font-[family-name:var(--font-montserrat)] font-bold uppercase"
                  style={{ fontSize: "57px", lineHeight: "64px", letterSpacing: "-0.25px", color: "#FFEA9E" }}
                >
                  HIGHLIGHT KUDOS
                </h2>
                {/* Filter dropdowns */}
                <div className="flex flex-row items-center" style={{ gap: "8px" }}>
                  <FilterDropdown
                    label="Hashtag"
                    prefix="#"
                    options={hashtagOptions}
                    value={filterHashtag}
                    width={136}
                    dropdownWidth={103}
                    onChange={setFilterHashtag}
                  />
                  <FilterDropdown
                    label="Phòng ban"
                    prefix=""
                    options={DEPARTMENT_OPTIONS}
                    value={filterDepartment}
                    width={158}
                    dropdownWidth={147}
                    onChange={setFilterDepartment}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* B.2 Carousel — full width */}
          <HighlightKudos
            highlights={highlights}
            currentUserId={currentUserId}
            filterHashtag={filterHashtag}
            filterDepartment={filterDepartment}
          />
        </section>

        {/* Spotlight Boards */}
        <section className="pt-[120px]">
          {/* Section header */}
          <div className="px-[var(--content-padding-x)] pb-6">
            <p className="font-[family-name:var(--font-montserrat)] font-bold text-[24px] leading-8 text-[var(--color-text-primary)]">
              Sun* Annual Awards 2025
            </p>
            <h2
              className="font-[family-name:var(--font-montserrat)] font-bold uppercase"
              style={{ fontSize: "57px", lineHeight: "64px", letterSpacing: "-0.25px", color: "#FFEA9E" }}
            >
              Spotlight Board
            </h2>
          </div>
          {/* Canvas + controls (total count, search, zoom) rendered inside component */}
          <SpotlightBoards initialError={spotlightError} />
        </section>

        {/* Feed + Sidebar */}
        <section className="px-[var(--content-padding-x)] pt-[120px] pb-[var(--content-padding-y)]">
          {/* Section header — above both columns */}
          <div className="pb-6">
            <p className="font-[family-name:var(--font-montserrat)] font-bold text-[24px] leading-8 text-[var(--color-text-primary)]">
              Sun* Annual Awards 2025
            </p>
            <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-[32px] leading-10 text-[var(--color-accent-gold)] uppercase tracking-wider mt-1">
              All Kudos
            </h2>
          </div>

          {/* Two-column: feed + sidebar — both start at the same top */}
          <div className="flex flex-row gap-8 items-start">
            {/* All Kudos feed — 680px */}
            <div className="w-[680px] shrink-0">
              <KudosFeed
                initialKudos={initialFeed}
                currentUserId={currentUserId}
                onRegisterPrepend={handleRegisterPrepend}
                activeHashtag={filterHashtag}
                activeDepartment={filterDepartment}
              />
            </div>

            {/* Right sidebar — 422px */}
            <div className="w-[422px] shrink-0 sticky top-[calc(var(--header-height)+24px)]">
              <StatsPanel
                stats={stats}
                topSunners={topSunners}
                personalStats={personalStats}
                recentGifts={recentGifts}
              />
            </div>
          </div>
        </section>
        </div>
      </main>

      <Footer />

      <WriteKudosModal
        isOpen={isModalOpen}
        currentUserId={currentUserId}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleKudosSuccess}
      />
    </>
  );
}
