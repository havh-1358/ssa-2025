import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";

  if (q.length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  // Search auth.users via their metadata — using a view or RPC if available
  // Fallback: search on profiles table if it exists, otherwise return empty
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .ilike("full_name", `%${q}%`)
    .neq("id", user.id)
    .limit(10);

  if (error) {
    // profiles table may not exist yet — return empty rather than crash
    return NextResponse.json({ success: true, data: [] });
  }

  const results = (data ?? []).map((u: { id: string; full_name: string; avatar_url: string }) => ({
    id: u.id,
    name: u.full_name,
    avatarUrl: u.avatar_url,
  }));

  return NextResponse.json({ success: true, data: results });
}
