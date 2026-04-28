import { z } from "zod";

export const LOCALE_COOKIE_KEY = "locale";

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

export const SUPPORTED_LOCALES = ["vi", "en"] as const;

export const localeSchema = z.enum(SUPPORTED_LOCALES);

export type LocaleCode = z.infer<typeof localeSchema>;

export const DEFAULT_LOCALE: LocaleCode = "vi";

export function parseLocale(value: string | undefined): LocaleCode {
  const result = localeSchema.safeParse(value);
  return result.success ? result.data : DEFAULT_LOCALE;
}
