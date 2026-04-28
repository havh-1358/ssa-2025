import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { KeyvisualSection } from "./KeyvisualSection";
import { HeroSection } from "./HeroSection";
import { AwardSummarySection } from "./AwardSummarySection";
import { KudosPromoSection } from "./KudosPromoSection";

type HomePageProps = {
  launchAtISO: string;
};

export function HomePage({ launchAtISO }: HomePageProps) {
  return (
    <>
      {/* Skip-to-content link — visually hidden, keyboard accessible (T012) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
          focus:z-[200] focus:px-4 focus:py-2
          focus:bg-[var(--color-accent-gold)] focus:text-[var(--color-bg-base)]
          focus:rounded-[var(--radius-btn)] focus:font-bold"
      >
        Skip to content
      </a>

      <Header activeNav="home" />

      <main
        className="relative overflow-x-hidden bg-[var(--color-bg-base)]"
        style={{ minHeight: "100vh" }}
      >
        {/* Hero section: keyvisual BG + hero content */}
        <div className="relative w-full" style={{ minHeight: "100vh" }}>
          <KeyvisualSection />
          <HeroSection launchAtISO={launchAtISO} />
        </div>

        {/* Sections with section-gap (T038) */}
        <AwardSummarySection />
        <KudosPromoSection />
      </main>

      <Footer />
    </>
  );
}
