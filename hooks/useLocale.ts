"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  LOCALE_COOKIE_MAX_AGE,
  LocaleCode,
  parseLocale,
} from "@/lib/locale";

const LOCALE_STORAGE_KEY = "locale_fallback";

function readLocaleFromCookie(): LocaleCode {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE_KEY}=`));
  return parseLocale(match?.split("=")[1]);
}

function writeLocaleToCookie(locale: LocaleCode): void {
  document.cookie = `${LOCALE_COOKIE_KEY}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

function readLocaleFromStorage(): LocaleCode {
  try {
    return parseLocale(localStorage.getItem(LOCALE_STORAGE_KEY) ?? undefined);
  } catch {
    return DEFAULT_LOCALE;
  }
}

function writeLocaleToStorage(locale: LocaleCode): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function isCookieWritable(): boolean {
  try {
    const testKey = "__cookie_test__";
    document.cookie = `${testKey}=1; SameSite=Lax`;
    const writable = document.cookie.includes(testKey);
    document.cookie = `${testKey}=; max-age=0`;
    return writable;
  } catch {
    return false;
  }
}

export function useLocale() {
  const router = useRouter();

  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    if (typeof window === "undefined") return DEFAULT_LOCALE;
    const fromCookie = readLocaleFromCookie();
    if (fromCookie !== DEFAULT_LOCALE) return fromCookie;
    return readLocaleFromStorage();
  });

  useEffect(() => {
    // Sync state with cookie on mount (resolves SSR hydration)
    const current = isCookieWritable()
      ? readLocaleFromCookie()
      : readLocaleFromStorage();
    setLocaleState(current);
  }, []);

  const setLocale = useCallback(
    (next: LocaleCode) => {
      setLocaleState(next);

      if (isCookieWritable()) {
        writeLocaleToCookie(next);
      } else {
        writeLocaleToStorage(next);
      }

      writeLocaleToStorage(next);
      router.refresh();
    },
    [router]
  );

  return { locale, setLocale };
}
