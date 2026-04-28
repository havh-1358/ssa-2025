import type { Metadata } from "next";
import { AWARD_CATEGORIES } from "@/data/awards";
import { AwardsPage } from "@/components/awards/AwardsPage";

export const metadata: Metadata = {
  title: "Award System — SSA 2025",
  description: "Explore all SSA 2025 award categories and prize details",
};

export default function AwardsRoute() {
  return <AwardsPage categories={AWARD_CATEGORIES} />;
}
