import { NextResponse } from "next/server";
import { getSpotlightData } from "@/lib/kudos-service";

export async function GET() {
  try {
    const data = await getSpotlightData();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch spotlight data" }, { status: 500 });
  }
}
