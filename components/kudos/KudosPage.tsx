"use client";

import { useRef, useState } from "react";
import type { Kudos, KudosStats, TopSunner } from "@/types/kudos";
import { SectionTitle } from "@/components/shared/SectionTitle";
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

type KudosPageProps = {
  highlights: Kudos[];
  initialFeed: Kudos[];
  stats: KudosStats;
  topSunners: TopSunner[];
  spotlightError: string | null;
  currentUserId: string | null;
};

export function KudosPage({
  highlights,
  initialFeed,
  stats,
  topSunners,
  spotlightError,
  currentUserId,
}: KudosPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prependFnRef = useRef<((k: Kudos) => void) | null>(null);

  function handleRegisterPrepend(fn: (k: Kudos) => void) {
    prependFnRef.current = fn;
  }

  function handleKudosSuccess(kudos: Kudos) {
    prependFnRef.current?.(kudos);
  }

  return (
    <>
      <Header activeNav="kudos" />

      <main className="bg-[var(--color-bg-base)] min-h-screen">
        {/* Keyvisual */}
        <div className="pt-[var(--header-height)]">
          <KudosKeyvisual />
        </div>

        {/* Write + Search bar */}
        <section
          className="px-4 md:px-[var(--content-padding-x)]
            pt-10 pb-0 flex flex-col md:flex-row gap-4"
        >
          <WriteKudosButton onOpen={() => setIsModalOpen(true)} />
          <SearchSunnerInput
            onDepartmentChange={() => {}}
            activeDepartment={null}
          />
        </section>

        {/* Highlight Kudos */}
        <section
          className="px-4 md:px-[var(--content-padding-x)]
            pt-10 pb-0"
        >
          <SectionTitle title="Highlight Kudos" />
          <div className="mt-6">
            <HighlightKudos highlights={highlights} currentUserId={currentUserId} />
          </div>
        </section>

        {/* Spotlight Boards */}
        <section
          className="px-4 md:px-[var(--content-padding-x)]
            pt-10 pb-0"
        >
          <SectionTitle title="Spotlight Boards" />
          <div className="mt-6">
            <SpotlightBoards initialError={spotlightError} />
          </div>
        </section>

        {/* Feed + Sidebar */}
        <section
          className="px-4 md:px-[var(--content-padding-x)]
            pt-10 pb-[var(--content-padding-y)]
            flex flex-col lg:flex-row gap-8"
        >
          <div className="flex-1 min-w-0">
            <SectionTitle title="Sun* Kudos" />
            <div className="mt-6">
              <KudosFeed
                initialKudos={initialFeed}
                currentUserId={currentUserId}
                onRegisterPrepend={handleRegisterPrepend}
              />
            </div>
          </div>
          <div className="w-full lg:w-[320px] shrink-0">
            <StatsPanel stats={stats} topSunners={topSunners} />
          </div>
        </section>
      </main>

      <Footer />

      {/* Viet Kudos Modal (T059) */}
      <WriteKudosModal
        isOpen={isModalOpen}
        currentUserId={currentUserId}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleKudosSuccess}
      />
    </>
  );
}
