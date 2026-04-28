import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/lib/constants/routes";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");
  const code = searchParams.get("code");

  // User cancelled Google consent — no error message shown
  if (error === "access_denied") {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  // Any other OAuth provider error
  if (error) {
    return NextResponse.redirect(
      new URL(`${ROUTES.LOGIN}?error=auth_failed`, request.url)
    );
  }

  // Code is required for session exchange
  if (!code || code.trim() === "") {
    return NextResponse.redirect(
      new URL(`${ROUTES.LOGIN}?error=auth_failed`, request.url)
    );
  }

  try {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  } catch {
    return NextResponse.redirect(
      new URL(`${ROUTES.LOGIN}?error=auth_failed`, request.url)
    );
  }
}
