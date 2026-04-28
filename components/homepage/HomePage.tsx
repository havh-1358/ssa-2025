import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { FloatingWidget } from "@/components/shared/FloatingWidget";
import { KeyvisualSection } from "./KeyvisualSection";
import { HeroSection } from "./HeroSection";
import { RootFurtherSection } from "./RootFurtherSection";
import { AwardSummarySection } from "./AwardSummarySection";
import { KudosPromoSection } from "./KudosPromoSection";

type HomePageProps = {
  launchAtISO: string;
  eventEndAtISO: string;
  user?: { email: string } | null;
};

export function HomePage({ launchAtISO, eventEndAtISO, user }: HomePageProps) {
  return (
    <>
      <Header activeNav="home" user={user} />

      <main
        className="relative overflow-x-hidden bg-[var(--color-bg-base)]"
        style={{ minHeight: "100vh" }}
      >
        {/* Hero section: keyvisual BG + hero content */}
        <div className="relative w-full" style={{ minHeight: "100vh" }}>
          <KeyvisualSection />
          <HeroSection
            launchAtISO={launchAtISO}
            eventEndAtISO={eventEndAtISO}
          />
        </div>

        {/* RF — Root Further theme section (between hero and awards) */}
        <RootFurtherSection />

        {/* C — Award system section */}
        <AwardSummarySection />
        <KudosPromoSection />

        {/* F — Floating quick-action widget */}
        <FloatingWidget isAuthenticated={!!user} />
      </main>

      <Footer />
    </>
  );
}
