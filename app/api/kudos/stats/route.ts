import { NextResponse } from "next/server";
import { getStats } from "@/lib/kudos-service";

export async function GET() {
  try {
    const data = await getStats();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
