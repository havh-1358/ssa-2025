import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants/routes";
import {
  getKudosFeed,
  getHighlights,
  getStats,
  getTopSunners,
  getUserStats,
  getRecentGiftRecipients,
} from "@/lib/kudos-service";
import { LikeStateProvider } from "@/components/shared/LikeStateContext";
import { SpecialDayProvider } from "@/components/shared/SpecialDayContext";
import { KudosPage } from "@/components/kudos/KudosPage";
import type { KudosLocalState } from "@/types/kudos";

export const metadata: Metadata = {
  title: "Sun* Kudos — SSA 2025",
  description: "Send and receive recognition in the SSA 2025 Kudos board",
};

export default async function KudosRoute({
  searchParams,
}: {
  searchParams: Promise<{ hashtag?: string; department?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { hashtag, department } = await searchParams;

  // if (!user) { redirect(ROUTES.LOGIN); } // temp for screenshot

  const [
    highlightsResult,
    feedResult,
    statsResult,
    topSunnersResult,
    userStatsResult,
    recentGiftsResult,
  ] = await Promise.allSettled([
    getHighlights(),
    getKudosFeed({ page: 1, limit: 10, hashtag, department }),
    getStats(),
    getTopSunners(),
    getUserStats(user?.id ?? ""),
    getRecentGiftRecipients(10),
  ]);

  // Debug: log any failures
  const results = { highlightsResult, feedResult, statsResult, topSunnersResult, userStatsResult, recentGiftsResult };
  for (const [key, result] of Object.entries(results)) {
    if (result.status === "rejected") {
      const err = result.reason;
      console.error(`[kudos/page] ${key} failed:`, err?.message ?? err?.code ?? String(err));
    }
  }

  const highlights =
    highlightsResult.status === "fulfilled" ? highlightsResult.value : [];
  const { data: initialFeed } =
    feedResult.status === "fulfilled"
      ? feedResult.value
      : { data: [] };
  const stats =
    statsResult.status === "fulfilled"
      ? statsResult.value
      : { totalKudosSent: 0, totalHeartsGiven: 0, totalParticipants: 0 };
  const topSunners =
    topSunnersResult.status === "fulfilled" ? topSunnersResult.value : [];
  const personalStats =
    userStatsResult.status === "fulfilled"
      ? userStatsResult.value
      : { kudosReceived: 0, kudosSent: 0, heartsReceived: 0, secretBoxesOpened: 0, secretBoxesUnopened: 0 };
  const recentGifts =
    recentGiftsResult.status === "fulfilled" ? recentGiftsResult.value : [];

  // Check if today is a special day
  let isSpecialDay = false;
  try {
    const specialDayRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/admin/special-days`,
      { cache: "no-store" }
    );
    if (specialDayRes.ok) {
      const json = await specialDayRes.json();
      isSpecialDay = json.isSpecialDay === true;
    }
  } catch {
    // Fail-open: default to false
  }

  const initialLikeMap = new Map<number, KudosLocalState>();
  for (const kudos of [...highlights, ...initialFeed]) {
    if (!initialLikeMap.has(kudos.id)) {
      initialLikeMap.set(kudos.id, {
        heartCount: kudos.heartCount,
        likedByMe: false,
        isLiking: false,
      });
    }
  }

  return (
    <SpecialDayProvider isSpecialDay={isSpecialDay}>
      <LikeStateProvider initialMap={initialLikeMap}>
        <KudosPage
          highlights={highlights}
          initialFeed={initialFeed}
          stats={stats}
          topSunners={topSunners}
          personalStats={personalStats}
          recentGifts={recentGifts}
          spotlightError={null}
          currentUserId={user?.id ?? null}
          userEmail={user?.email ?? null}
        />
      </LikeStateProvider>
    </SpecialDayProvider>
  );
}
