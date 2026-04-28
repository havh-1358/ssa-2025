import { NextResponse } from "next/server";
import { getHighlights } from "@/lib/kudos-service";

export async function GET() {
  try {
    const data = await getHighlights();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch highlights" },
      { status: 500 }
    );
  }
}
