import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getKudosFeed, getHighlights, getStats, getTopSunners } from "@/lib/kudos-service";
import { LikeStateProvider } from "@/components/shared/LikeStateContext";
import { SpecialDayProvider } from "@/components/shared/SpecialDayContext";
import { KudosPage } from "@/components/kudos/KudosPage";
import { ROUTES } from "@/lib/constants/routes";
import type { KudosLocalState } from "@/types/kudos";

export const metadata: Metadata = {
  title: "Sun* Kudos — SSA 2025",
  description: "Send and receive recognition in the SSA 2025 Kudos board",
};

export default async function KudosRoute() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Fetch all data in parallel; catch spotlight failure without crashing page
  const [highlightsResult, feedResult, statsResult, topSunnersResult] =
    await Promise.allSettled([
      getHighlights(),
      getKudosFeed({ page: 1, limit: 10 }),
      getStats(),
      getTopSunners(),
    ]);

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

  const spotlightError = null; // spotlight route returns empty array, no error

  // Build initial like state map from feed + highlights
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
    <SpecialDayProvider isSpecialDay={false}>
      <LikeStateProvider initialMap={initialLikeMap}>
        <KudosPage
          highlights={highlights}
          initialFeed={initialFeed}
          stats={stats}
          topSunners={topSunners}
          spotlightError={spotlightError}
          currentUserId={user.id}
        />
      </LikeStateProvider>
    </SpecialDayProvider>
  );
}
