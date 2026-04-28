import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { likeKudos, unlikeKudos } from "@/lib/kudos-service";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const kudosId = parseInt(id, 10);
  if (isNaN(kudosId)) {
    return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    const isSpecialDay = false; // TODO: wire to special-day service
    const result = await likeKudos(kudosId, user.id, isSpecialDay);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const err = error as Error & { code?: string };
    if (err.code === "ALREADY_LIKED") {
      return NextResponse.json({ success: false, error: "Already liked" }, { status: 409 });
    }
    if (err.code === "OWN_KUDOS") {
      return NextResponse.json({ success: false, error: "Cannot like own kudos" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: "Failed to like kudos" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const kudosId = parseInt(id, 10);
  if (isNaN(kudosId)) {
    return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    const result = await unlikeKudos(kudosId, user.id);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const err = error as Error & { code?: string };
    if (err.code === "NOT_FOUND") {
      return NextResponse.json({ success: false, error: "Like not found" }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: "Failed to unlike kudos" }, { status: 500 });
  }
}
