import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "@/i18n/routing";
import { parseLocale } from "@/lib/locale";
import { parseAndValidateLaunchDatetime, isPrelaunch } from "@/lib/launch";

async function updateSupabaseSession(
  request: NextRequest
): Promise<NextResponse> {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshes auth token if expired — do not remove
  await supabase.auth.getUser();

  return response;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Pre-launch gate: redirect all non-root routes to / while platform is pre-launch.
  // Fail-open: if LAUNCH_DATETIME is missing or invalid, skip redirect.
  if (pathname !== "/") {
    try {
      const launchAt = parseAndValidateLaunchDatetime(
        process.env.LAUNCH_DATETIME
      );
      if (isPrelaunch(new Date(), launchAt)) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        url.search = "";
        return NextResponse.redirect(url);
      }
    } catch {
      // Invalid/missing LAUNCH_DATETIME — continue normal routing
    }
  }

  // Refresh Supabase session
  const supabaseResponse = await updateSupabaseSession(request);

  // Auth guard: /kudos requires authentication
  if (pathname === "/kudos" || pathname.startsWith("/kudos/")) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Resolve locale (from custom cookie, NEXT_LOCALE cookie, or default)
  const raw =
    request.cookies.get("locale")?.value ??
    request.cookies.get("NEXT_LOCALE")?.value;
  const localeCode = parseLocale(raw);

  // Validate against supported locales; fall back to default
  const locale = routing.locales.includes(localeCode as "vi" | "en")
    ? localeCode
    : routing.defaultLocale;

  // Forward locale to Server Components via request header (no URL rewrite)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-intl-locale", locale);

  const finalResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Persist locale in NEXT_LOCALE cookie for next-intl client detection
  finalResponse.cookies.set("NEXT_LOCALE", locale, {
    sameSite: "lax",
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
  });

  // Merge Supabase session cookies
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value);
  });

  return finalResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
