import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Kudos, Like, KudosStats, TopSunner, SpotlightNode, UserStats, RecentGift } from "@/types/kudos";

// ─── Zod schemas ────────────────────────────────────────────────────────────

export const kudosRowSchema = z.object({
  id: z.number(),
  sender_id: z.string().nullable(),
  recipient_id: z.string().nullable(),
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
  user_id: z.string(),
  hearts_given: z.union([z.literal(1), z.literal(2)]),
  created_at: z.string(),
});

export const userRowSchema = z.object({
  id: z.string(),
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
    senderDepartment: null,
    recipientId: row.recipient_id,
    recipientName: null,
    recipientAvatar: null,
    recipientDepartment: null,
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

  if (department) {
    // Resolve department name → user IDs → filter kudos
    const { data: deptRow } = await supabase
      .from("departments")
      .select("id")
      .eq("name", department)
      .single();

    if (!deptRow) {
      return { data: [], total: 0 };
    }

    const { data: userRows } = await supabase
      .from("users")
      .select("id")
      .eq("department_id", (deptRow as { id: number }).id);

    const userIds = ((userRows ?? []) as { id: string }[]).map((r) => r.id);
    if (userIds.length === 0) {
      return { data: [], total: 0 };
    }

    query = query.or(
      `sender_id.in.(${userIds.join(",")}),recipient_id.in.(${userIds.join(",")})`
    );
  }

  const { data, count, error } = await query;
  if (error) throw error;

  const rows = z.array(kudosRowSchema).parse(data ?? []);
  const kudosList = rows.map(rowToKudos);

  // Enrich with user names/avatars via batch lookup
  const ids = [...new Set([
    ...kudosList.map((k) => k.senderId).filter(Boolean),
    ...kudosList.map((k) => k.recipientId).filter(Boolean),
  ])] as string[];

  const userMap = ids.length > 0 ? await findUsersByIds(ids) : {};

  const enriched = kudosList.map((k) => ({
    ...k,
    senderName: k.senderId ? (userMap[k.senderId]?.name ?? null) : null,
    senderAvatar: k.senderId ? (userMap[k.senderId]?.avatar ?? null) : null,
    senderDepartment: k.senderId ? (userMap[k.senderId]?.department ?? null) : null,
    recipientName: k.recipientId ? (userMap[k.recipientId]?.name ?? null) : null,
    recipientAvatar: k.recipientId ? (userMap[k.recipientId]?.avatar ?? null) : null,
    recipientDepartment: k.recipientId ? (userMap[k.recipientId]?.department ?? null) : null,
  }));

  return { data: enriched, total: count ?? 0 };
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
  const kudosList = rows.map(rowToKudos);

  const ids = [...new Set([
    ...kudosList.map((k) => k.senderId).filter(Boolean),
    ...kudosList.map((k) => k.recipientId).filter(Boolean),
  ])] as string[];
  const userMap = ids.length > 0 ? await findUsersByIds(ids) : {};

  return kudosList.map((k) => ({
    ...k,
    senderName: k.senderId ? (userMap[k.senderId]?.name ?? null) : null,
    senderAvatar: k.senderId ? (userMap[k.senderId]?.avatar ?? null) : null,
    senderDepartment: k.senderId ? (userMap[k.senderId]?.department ?? null) : null,
    recipientName: k.recipientId ? (userMap[k.recipientId]?.name ?? null) : null,
    recipientAvatar: k.recipientId ? (userMap[k.recipientId]?.avatar ?? null) : null,
    recipientDepartment: k.recipientId ? (userMap[k.recipientId]?.department ?? null) : null,
  }));
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

// ─── User name / avatar lookup ───────────────────────────────────────────────

const userProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar_url: z.string().nullable().optional(),
  department_id: z.number().nullable().optional(),
});

const departmentSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export async function findUsersByIds(
  ids: string[]
): Promise<Record<string, { name: string; avatar: string | null; department: string | null }>> {
  if (ids.length === 0) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, avatar_url, department_id")
    .in("id", ids);
  if (error) {
    console.warn("[kudos-repository] findUsersByIds failed:", error.message);
    return {};
  }
  const rows = z.array(userProfileSchema).parse(data ?? []);

  // Batch-load departments
  const deptIds = [...new Set(rows.map((r) => r.department_id).filter(Boolean))] as number[];
  let deptMap: Record<number, string> = {};
  if (deptIds.length > 0) {
    const { data: deptData } = await supabase
      .from("departments")
      .select("id, name")
      .in("id", deptIds);
    const depts = z.array(departmentSchema).parse(deptData ?? []);
    deptMap = Object.fromEntries(depts.map((d) => [d.id, d.name]));
  }

  return Object.fromEntries(
    rows.map((r) => [r.id, {
      name: r.name,
      avatar: r.avatar_url ?? null,
      department: r.department_id ? (deptMap[r.department_id] ?? null) : null,
    }])
  );
}

// ─── Spotlight board ─────────────────────────────────────────────────────────

const spotlightRowSchema = z.object({
  recipient_id: z.string().nullable(),
  id: z.number(),
  created_at: z.string(),
});

export async function findSpotlightData(): Promise<SpotlightNode[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kudos")
    .select("recipient_id, id, created_at")
    .not("recipient_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = z.array(spotlightRowSchema).parse(data ?? []);

  // Aggregate by recipient
  const map = new Map<string, { count: number; latestId: number; latestAt: string }>();
  for (const row of rows) {
    if (!row.recipient_id) continue;
    const existing = map.get(row.recipient_id);
    if (!existing) {
      map.set(row.recipient_id, { count: 1, latestId: row.id, latestAt: row.created_at });
    } else {
      existing.count += 1;
    }
  }

  // Fetch recipient names
  const recipientIds = [...map.keys()];
  const userMap = await findUsersByIds(recipientIds);

  return Array.from(map.entries()).map(([recipientId, val]) => ({
    recipientId,
    recipientName: userMap[recipientId]?.name ?? recipientId,
    kudosCount: val.count,
    latestKudosId: val.latestId,
    latestKudosAt: val.latestAt,
  }));
}

// ─── User personal stats ─────────────────────────────────────────────────────

const secretBoxRowSchema = z.object({
  id: z.string(),
  status: z.enum(["opened", "unopened"]),
});

export async function findUserStats(userId: string): Promise<UserStats> {
  const supabase = await createClient();

  // For hearts received: sum hearts_given on kudos where recipient = userId
  const { data: recipientKudos } = await supabase
    .from("kudos")
    .select("id")
    .eq("recipient_id", userId);

  const recipientKudosIds = (recipientKudos ?? []).map((k: { id: number }) => k.id);

  const [receivedRes, sentRes, heartsRes] = await Promise.all([
    supabase.from("kudos").select("id", { count: "exact", head: true }).eq("recipient_id", userId),
    supabase.from("kudos").select("id", { count: "exact", head: true }).eq("sender_id", userId),
    recipientKudosIds.length > 0
      ? supabase.from("likes").select("hearts_given").in("kudos_id", recipientKudosIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const heartsReceived = (heartsRes.data ?? []).reduce(
    (sum: number, r: { hearts_given: number }) => sum + r.hearts_given,
    0
  );

  return {
    kudosReceived: receivedRes.count ?? 0,
    kudosSent: sentRes.count ?? 0,
    heartsReceived,
    secretBoxesOpened: 0,
    secretBoxesUnopened: 0,
  };
}

// ─── Recent gift recipients ───────────────────────────────────────────────────

const secretBoxGiftRowSchema = z.object({
  user_id: z.string(),
  gift_description: z.string().nullable().optional(),
  opened_at: z.string().nullable().optional(),
});

export async function findRecentGifts(limit = 10): Promise<RecentGift[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("secret_boxes")
    .select("user_id, gift_description, opened_at")
    .eq("status", "opened")
    .not("opened_at", "is", null)
    .order("opened_at", { ascending: false })
    .limit(limit);

  // secret_boxes table is optional — return empty if not yet created
  if (error) {
    console.warn("[kudos-repository] findRecentGifts skipped:", error.message);
    return [];
  }

  const rows = z.array(secretBoxGiftRowSchema).parse(data ?? []);
  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const userMap = await findUsersByIds(userIds);

  return rows.map((r) => ({
    userId: r.user_id,
    name: userMap[r.user_id]?.name ?? r.user_id,
    avatar: userMap[r.user_id]?.avatar ?? null,
    giftDescription: r.gift_description ?? "Nhận được quà",
    receivedAt: r.opened_at ?? "",
  }));
}

// ─── Single kudos heart count ─────────────────────────────────────────────────

export async function findKudosHeartCount(kudosId: number): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kudos")
    .select("heart_count")
    .eq("id", kudosId)
    .single();
  if (error || !data) return 0;
  return (data as { heart_count: number }).heart_count ?? 0;
}

// ─── Batch user likes lookup ─────────────────────────────────────────────────

export async function findLikedKudosIds(
  kudosIds: number[],
  userId: string
): Promise<Set<number>> {
  if (kudosIds.length === 0) return new Set();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("likes")
    .select("kudos_id")
    .eq("user_id", userId)
    .in("kudos_id", kudosIds);
  if (error || !data) return new Set();
  return new Set((data as { kudos_id: number }[]).map((r) => r.kudos_id));
}

// ─── Highlights enriched ─────────────────────────────────────────────────────

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
