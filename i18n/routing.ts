import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"] as const,
  defaultLocale: "vi",
  localePrefix: "never",
});
