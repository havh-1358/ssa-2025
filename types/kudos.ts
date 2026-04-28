export interface Kudos {
  id: number;
  senderId: string | null;
  senderName: string | null;
  senderAvatar: string | null;
  recipientId: string | null;
  recipientName: string | null;
  recipientAvatar: string | null;
  title: string;
  message: string;
  hashtags: string[];
  imageUrls: string[];
  heartCount: number;
  isAnonymous: boolean;
  createdAt: string;
}

export interface Like {
  kudosId: number;
  userId: string;
  heartsGiven: 1 | 2;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string | null;
  department: string | null;
}

export interface KudosLocalState {
  heartCount: number;
  likedByMe: boolean;
  isLiking: boolean;
}

export interface KudosFeedMeta {
  total: number;
  page: number;
  limit: number;
}

export interface KudosStats {
  totalKudosSent: number;
  totalHeartsGiven: number;
  totalParticipants: number;
}

export interface TopSunner {
  userId: string;
  name: string;
  avatar: string | null;
  heartsReceived: number;
  rank: number;
}
