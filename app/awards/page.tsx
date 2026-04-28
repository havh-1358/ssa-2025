import type { Metadata } from "next";
import { AWARD_CATEGORIES } from "@/data/awards";
import { createClient } from "@/lib/supabase/server";
import { AwardsPage } from "@/components/awards/AwardsPage";

export const metadata: Metadata = {
  title: "Award System — SSA 2025",
  description: "Explore all SSA 2025 award categories and prize details",
};

export default async function AwardsRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AwardsPage
      categories={AWARD_CATEGORIES}
      user={user ? { email: user.email ?? "" } : null}
    />
  );
}
