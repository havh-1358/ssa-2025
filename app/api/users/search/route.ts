import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";

  let query = supabase
    .from("users")
    .select("id, name, avatar_url")
    .neq("id", user.id)
    .order("name", { ascending: true })
    .limit(100);

  if (q.trim().length >= 1) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ success: true, data: [] });
  }

  const results = (data ?? []).map((u: { id: string; name: string; avatar_url: string | null }) => ({
    id: u.id,
    name: u.name,
    avatarUrl: u.avatar_url ?? null,
  }));

  return NextResponse.json({ success: true, data: results });
}
