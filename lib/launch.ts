import { z } from "zod";

const datetimeSchema = z.string().datetime();

export function parseAndValidateLaunchDatetime(env: string | undefined): Date {
  const validated = datetimeSchema.parse(env);
  return new Date(validated);
}

export function isPrelaunch(now: Date, prelaunchAt: Date): boolean {
  return now.getTime() < prelaunchAt.getTime();
}
