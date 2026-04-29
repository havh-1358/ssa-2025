import {
  findKudosFeed,
  findKudosHighlights,
  findHashtags,
  findKudosStats,
  findTopSunners,
  findSpotlightData,
  findUserStats,
  findRecentGifts,
  insertLike,
  deleteLike,
  findUserLike,
  insertKudos,
  findKudosHeartCount,
} from "./kudos-repository";
import type { Kudos, KudosFeedMeta, KudosStats, TopSunner, SpotlightNode, UserStats, RecentGift } from "@/types/kudos";

const ANONYMOUS_DISPLAY = {
  senderName: "Ẩn danh",
  senderId: null,
  senderAvatar: null,
} as const;

function redactAnonymous(kudos: Kudos): Kudos {
  if (!kudos.isAnonymous) return kudos;
  return { ...kudos, ...ANONYMOUS_DISPLAY };
}

export async function getKudosFeed(params: {
  page?: number;
  limit?: number;
  hashtag?: string;
  department?: string;
}): Promise<{ data: Kudos[]; meta: KudosFeedMeta }> {
  const { page = 1, limit = 10 } = params;
  const { data, total } = await findKudosFeed(params);
  return { data: data.map(redactAnonymous), meta: { total, page, limit } };
}

export async function getHighlights(): Promise<Kudos[]> {
  const data = await findKudosHighlights();
  return data.map(redactAnonymous);
}

export async function getHashtags(): Promise<string[]> {
  return findHashtags();
}

export async function getStats(): Promise<KudosStats> {
  return findKudosStats();
}

export async function getTopSunners(): Promise<TopSunner[]> {
  return findTopSunners();
}

export async function createKudos(params: {
  senderId: string;
  recipientId: string;
  title: string;
  message: string;
  hashtags: string[];
  imageUrls: string[];
  isAnonymous: boolean;
  idempotencyKey: string;
}): Promise<Kudos> {
  // T009 — server-side sanitization: strip all HTML tags
  const sanitizedMessage = params.message.replace(/<[^>]*>/g, "").trim();
  return insertKudos({ ...params, message: sanitizedMessage });
}

export async function likeKudos(
  kudosId: number,
  userId: string,
  isSpecialDay: boolean
): Promise<{ heartCount: number }> {
  const existing = await findUserLike(kudosId, userId);
  if (existing) {
    const error = new Error("Already liked") as Error & { code: string };
    error.code = "ALREADY_LIKED";
    throw error;
  }
  const heartsGiven: 1 | 2 = isSpecialDay ? 2 : 1;
  await insertLike(kudosId, userId, heartsGiven);
  const heartCount = await findKudosHeartCount(kudosId);
  return { heartCount };
}

export async function getSpotlightData(): Promise<SpotlightNode[]> {
  return findSpotlightData();
}

export async function getUserStats(userId: string): Promise<UserStats> {
  return findUserStats(userId);
}

export async function getRecentGiftRecipients(limit = 10): Promise<RecentGift[]> {
  return findRecentGifts(limit);
}

export async function unlikeKudos(
  kudosId: number,
  userId: string
): Promise<{ heartCount: number }> {
  const existing = await findUserLike(kudosId, userId);
  if (!existing) {
    const error = new Error("Like not found") as Error & { code: string };
    error.code = "NOT_FOUND";
    throw error;
  }
  await deleteLike(kudosId, userId);
  const heartCount = await findKudosHeartCount(kudosId);
  return { heartCount };
}
