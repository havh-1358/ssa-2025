import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { parseLocale } from "@/lib/locale";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "vi" | "en")) {
    locale = parseLocale(locale);
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
