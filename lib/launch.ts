import { z } from "zod";

const launchSchema = z.string().datetime();

export function parseAndValidateLaunchDatetime(env: string | undefined): Date {
  const validated = launchSchema.parse(env);
  return new Date(validated);
}

export function isPrelaunch(now: Date, launchAt: Date): boolean {
  return now.getTime() < launchAt.getTime();
}
