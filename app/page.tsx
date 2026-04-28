import { parseAndValidateLaunchDatetime, isPrelaunch } from "@/lib/launch";
import { CountdownPage } from "@/components/countdown/CountdownPage";
import { HomePage } from "@/components/homepage/HomePage";

export default async function RootPage() {
  try {
    const launchAt = parseAndValidateLaunchDatetime(
      process.env.LAUNCH_DATETIME
    );
    if (isPrelaunch(new Date(), launchAt)) {
      return <CountdownPage launchAt={launchAt} />;
    }
    return <HomePage launchAtISO={launchAt.toISOString()} />;
  } catch {
    // Invalid/missing LAUNCH_DATETIME — fall through to homepage
  }

  return <HomePage launchAtISO={new Date().toISOString()} />;
}
