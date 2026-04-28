import { parseAndValidateLaunchDatetime, isPrelaunch } from "@/lib/launch";
import { CountdownPage } from "@/components/countdown/CountdownPage";
import { HomePage } from "@/components/homepage/HomePage";

export default async function RootPage() {
  // Resolve launch state outside JSX to avoid JSX-in-try/catch lint error
  let launchAt: Date | null = null;
  try {
    launchAt = parseAndValidateLaunchDatetime(process.env.LAUNCH_DATETIME);
  } catch {
    // Invalid/missing LAUNCH_DATETIME — fall through to homepage
  }

  if (launchAt && isPrelaunch(new Date(), launchAt)) {
    return <CountdownPage launchAt={launchAt} />;
  }

  return <HomePage launchAtISO={(launchAt ?? new Date()).toISOString()} />;
}
