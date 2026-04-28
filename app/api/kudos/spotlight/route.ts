import { NextResponse } from "next/server";

// Spotlight boards are a future feature — returns empty array until implemented
export async function GET() {
  return NextResponse.json({ success: true, data: [] });
}
