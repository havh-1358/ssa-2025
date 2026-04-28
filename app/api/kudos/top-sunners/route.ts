import { NextResponse } from "next/server";
import { getTopSunners } from "@/lib/kudos-service";

export async function GET() {
  try {
    const data = await getTopSunners();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch top sunners" },
      { status: 500 }
    );
  }
}
