import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getHashtags } from "@/lib/kudos-service";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getHashtags();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch hashtags" },
      { status: 500 }
    );
  }
}
