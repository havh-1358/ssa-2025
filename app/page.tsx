import { parseAndValidateLaunchDatetime, isPrelaunch } from "@/lib/launch";
import { createClient } from "@/lib/supabase/server";
import { CountdownPage } from "@/components/countdown/CountdownPage";
import { HomePage } from "@/components/homepage/HomePage";

export default async function RootPage() {
  let launchAt: Date | null = null;
  try {
    launchAt = parseAndValidateLaunchDatetime(process.env.LAUNCH_DATETIME);
  } catch {
    // Invalid/missing LAUNCH_DATETIME — fall through to homepage
  }

  if (launchAt && isPrelaunch(new Date(), launchAt)) {
    return <CountdownPage launchAt={launchAt} />;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <HomePage
      launchAtISO={(launchAt ?? new Date()).toISOString()}
      user={user ? { email: user.email ?? "" } : null}
    />
  );
}
