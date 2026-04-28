import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { parseLocale } from "@/lib/locale";
import { parseAndValidateLaunchDatetime, isPrelaunch } from "@/lib/launch";

const intlMiddleware = createIntlMiddleware(routing);

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

export async function middleware(request: NextRequest): Promise<NextResponse> {
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
        // Locale cookie is browser-stored and preserved naturally through redirects
        return NextResponse.redirect(url);
      }
    } catch {
      // Invalid/missing LAUNCH_DATETIME — continue normal routing
    }
  }

  // 1. Refresh Supabase session (must run first to keep cookies fresh)
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

  // 2. Forward locale from cookie so next-intl can pick it up
  const raw = request.cookies.get("locale")?.value;
  const locale = parseLocale(raw);
  supabaseResponse.headers.set("x-next-intl-locale", locale);

  // 3. Run next-intl middleware for locale routing
  const intlResponse = intlMiddleware(request);

  // Merge cookies from Supabase response into intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
