import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Kudos, Like, KudosStats, TopSunner } from "@/types/kudos";

// ─── Zod schemas ────────────────────────────────────────────────────────────

export const kudosRowSchema = z.object({
  id: z.number(),
  sender_id: z.string().uuid().nullable(),
  recipient_id: z.string().uuid().nullable(),
  title: z.string(),
  message: z.string(),
  hashtags: z.array(z.string()),
  image_urls: z.array(z.string()),
  heart_count: z.number(),
  is_anonymous: z.boolean(),
  created_at: z.string(),
});

export const likeRowSchema = z.object({
  kudos_id: z.number(),
  user_id: z.string().uuid(),
  hearts_given: z.union([z.literal(1), z.literal(2)]),
  created_at: z.string(),
});

export const userRowSchema = z.object({
  id: z.string().uuid(),
  raw_user_meta_data: z
    .object({
      full_name: z.string().optional(),
      name: z.string().optional(),
      avatar_url: z.string().optional(),
      picture: z.string().optional(),
    })
    .optional(),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function rowToKudos(row: z.infer<typeof kudosRowSchema>): Kudos {
  return {
    id: row.id,
    senderId: row.sender_id,
    senderName: null,
    senderAvatar: null,
    recipientId: row.recipient_id,
    recipientName: null,
    recipientAvatar: null,
    title: row.title,
    message: row.message,
    hashtags: row.hashtags ?? [],
    imageUrls: row.image_urls ?? [],
    heartCount: row.heart_count,
    isAnonymous: row.is_anonymous,
    createdAt: row.created_at,
  };
}

// ─── Repository ───────────────────────────────────────────────────────────────

export async function findKudosFeed({
  page = 1,
  limit = 10,
  hashtag,
  department,
}: {
  page?: number;
  limit?: number;
  hashtag?: string;
  department?: string;
}): Promise<{ data: Kudos[]; total: number }> {
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("kudos")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (hashtag) {
    query = query.contains("hashtags", [hashtag]);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  const rows = z.array(kudosRowSchema).parse(data ?? []);
  return { data: rows.map(rowToKudos), total: count ?? 0 };
}

export async function findKudosHighlights(limit = 5): Promise<Kudos[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kudos")
    .select("*")
    .order("heart_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  const rows = z.array(kudosRowSchema).parse(data ?? []);
  return rows.map(rowToKudos);
}

export async function findHashtags(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("kudos").select("hashtags");
  if (error) throw error;
  const all = (data ?? []).flatMap((r: { hashtags: string[] }) => r.hashtags);
  return [...new Set(all)].sort();
}

export async function findKudosStats(): Promise<KudosStats> {
  const supabase = await createClient();
  const [kudosRes, likesRes, participantsRes] = await Promise.all([
    supabase.from("kudos").select("id", { count: "exact", head: true }),
    supabase.from("likes").select("hearts_given"),
    supabase
      .from("kudos")
      .select("recipient_id")
      .not("recipient_id", "is", null),
  ]);
  const totalHeartsGiven = (likesRes.data ?? []).reduce(
    (sum: number, r: { hearts_given: number }) => sum + r.hearts_given,
    0
  );
  const uniqueParticipants = new Set(
    (participantsRes.data ?? []).map(
      (r: { recipient_id: string }) => r.recipient_id
    )
  ).size;
  return {
    totalKudosSent: kudosRes.count ?? 0,
    totalHeartsGiven,
    totalParticipants: uniqueParticipants,
  };
}

export async function findTopSunners(limit = 10): Promise<TopSunner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("likes")
    .select("kudos:kudos(recipient_id), hearts_given");
  if (error) throw error;

  const totals = new Map<string, number>();
  for (const row of data ?? []) {
    const recipientId =
      row.kudos &&
      typeof row.kudos === "object" &&
      "recipient_id" in row.kudos
        ? (row.kudos as { recipient_id: string }).recipient_id
        : null;
    if (!recipientId) continue;
    totals.set(
      recipientId,
      (totals.get(recipientId) ?? 0) + (row.hearts_given as number)
    );
  }

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([userId, heartsReceived], idx) => ({
      userId,
      name: userId,
      avatar: null,
      heartsReceived,
      rank: idx + 1,
    }));
}

export async function insertKudos(params: {
  senderId: string;
  recipientId: string;
  title: string;
  message: string;
  hashtags: string[];
  imageUrls: string[];
  isAnonymous: boolean;
  idempotencyKey: string;
}): Promise<Kudos> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kudos")
    .insert({
      sender_id: params.senderId,
      recipient_id: params.recipientId,
      title: params.title,
      message: params.message,
      hashtags: params.hashtags,
      image_urls: params.imageUrls,
      is_anonymous: params.isAnonymous,
      idempotency_key: params.idempotencyKey,
    })
    .select("*")
    .single();
  if (error) throw error;
  const row = kudosRowSchema.parse(data);
  return rowToKudos(row);
}

export async function insertLike(
  kudosId: number,
  userId: string,
  heartsGiven: 1 | 2
): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from("likes")
    .insert({ kudos_id: kudosId, user_id: userId, hearts_given: heartsGiven });

  await supabase.rpc("increment_heart_count", {
    kudos_id: kudosId,
    delta: heartsGiven,
  });
}

export async function deleteLike(
  kudosId: number,
  userId: string
): Promise<void> {
  const supabase = await createClient();

  const { data: like, error: fetchErr } = await supabase
    .from("likes")
    .select("hearts_given")
    .eq("kudos_id", kudosId)
    .eq("user_id", userId)
    .single();
  if (fetchErr || !like) return;

  await supabase
    .from("likes")
    .delete()
    .eq("kudos_id", kudosId)
    .eq("user_id", userId);

  await supabase.rpc("increment_heart_count", {
    kudos_id: kudosId,
    delta: -(like.hearts_given as number),
  });
}

export async function findUserLike(
  kudosId: number,
  userId: string
): Promise<Like | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("likes")
    .select("*")
    .eq("kudos_id", kudosId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  const row = likeRowSchema.parse(data);
  return {
    kudosId: row.kudos_id,
    userId: row.user_id,
    heartsGiven: row.hearts_given,
    createdAt: row.created_at,
  };
}
