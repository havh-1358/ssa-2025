import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getKudosFeed, createKudos } from "@/lib/kudos-service";
import { findLikedKudosIds } from "@/lib/kudos-repository";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  hashtag: z.string().optional(),
  department: z.string().optional(),
});

// T005 — KudosCreateDto
const kudosCreateDto = z.object({
  recipientId: z.string().uuid(),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(1000),
  hashtags: z.array(z.string()).max(5).default([]),
  imageUrls: z.array(z.string().url()).max(5).default([]),
  isAnonymous: z.boolean().default(false),
  idempotencyKey: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = querySchema.parse(params);
    const { data, meta } = await getKudosFeed(parsed);

    // Annotate likedByMe per authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && data.length > 0) {
      const kudosIds = data.map((k) => k.id);
      const likedSet = await findLikedKudosIds(kudosIds, user.id);
      const annotated = data.map((k) => ({ ...k, likedByMe: likedSet.has(k.id) }));
      return NextResponse.json({ success: true, data: annotated, meta });
    }

    return NextResponse.json({ success: true, data, meta });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to fetch kudos" },
      { status: 500 }
    );
  }
}

// T006–T011 — POST /api/kudos
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = kudosCreateDto.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const dto = parsed.data;

  // T008 — self-send guard
  if (dto.recipientId === user.id) {
    return NextResponse.json(
      { success: false, error: "Cannot send Kudos to yourself" },
      { status: 400 }
    );
  }

  try {
    const kudos = await createKudos({
      senderId: user.id,
      recipientId: dto.recipientId,
      title: dto.title,
      message: dto.message,
      hashtags: dto.hashtags,
      imageUrls: dto.imageUrls,
      isAnonymous: dto.isAnonymous,
      idempotencyKey: dto.idempotencyKey,
    });
    return NextResponse.json({ success: true, data: kudos }, { status: 201 });
  } catch (error) {
    const err = error as Error & { code?: string };
    if (err.code === "23505" || err.message?.includes("idempotency")) {
      return NextResponse.json(
        { success: false, error: "Duplicate request (idempotency conflict)" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create kudos" },
      { status: 500 }
    );
  }
}
