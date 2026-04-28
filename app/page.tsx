import { redirect } from "next/navigation";
import { parseAndValidateLaunchDatetime, isPrelaunch } from "@/lib/launch";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants/routes";
import { CountdownPage } from "@/components/countdown/CountdownPage";
import { HomePage } from "@/components/homepage/HomePage";

export default async function RootPage() {
  const now = new Date();

  // Prelaunch gate: show countdown while now < PRELAUNCH_DATETIME
  let prelaunchAt: Date | null = null;
  try {
    prelaunchAt = parseAndValidateLaunchDatetime(
      process.env.PRELAUNCH_DATETIME
    );
  } catch {
    // Missing/invalid PRELAUNCH_DATETIME — skip prelaunch gate
  }

  if (prelaunchAt && isPrelaunch(now, prelaunchAt)) {
    return <CountdownPage launchAt={prelaunchAt} />;
  }

  // Post-prelaunch: require authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // LAUNCH_DATETIME drives the homepage event-start countdown
  let launchAtISO = process.env.NEXT_PUBLIC_LAUNCH_DATETIME ?? "";
  try {
    const launchAt = parseAndValidateLaunchDatetime(
      process.env.NEXT_PUBLIC_LAUNCH_DATETIME
    );
    launchAtISO = launchAt.toISOString();
  } catch {
    launchAtISO = now.toISOString();
  }

  return (
    <HomePage
      launchAtISO={launchAtISO}
      eventEndAtISO={launchAtISO}
      user={{ email: user.email ?? "" }}
    />
  );
}
