import type { Kudos, KudosStats, TopSunner } from "@/types/kudos";

export const MOCK_KUDOS: Kudos[] = [
  {
    id: 1,
    senderId: "user-001",
    senderName: "Nguyễn Văn A",
    senderAvatar: null, senderDepartment: null,
    recipientId: "user-002",
    recipientName: "Trần Thị B",
    recipientAvatar: null, recipientDepartment: null,
    title: "Outstanding teamwork",
    message:
      "Cảm ơn bạn đã hỗ trợ mình rất nhiều trong sprint vừa rồi. Nhờ bạn mà tụi mình đã hoàn thành đúng deadline và chất lượng sản phẩm được nâng lên đáng kể. Mình rất trân trọng tinh thần nhiệt huyết và sự tận tâm của bạn!",
    hashtags: ["Dedicated", "Inspiring"],
    imageUrls: [],
    heartCount: 42,
    isAnonymous: false,
    createdAt: "2025-10-30T10:00:00.000Z",
  },
  {
    id: 2,
    senderId: "user-003",
    senderName: "Lê Minh C",
    senderAvatar: null, senderDepartment: null,
    recipientId: "user-004",
    recipientName: "Phạm Quốc D",
    recipientAvatar: null, recipientDepartment: null,
    title: "Great leadership",
    message:
      "Bạn đã dẫn dắt team vượt qua giai đoạn khó khăn nhất của dự án một cách xuất sắc. Phong cách lãnh đạo bình tĩnh, sáng suốt và luôn lắng nghe của bạn thực sự truyền cảm hứng cho toàn team.",
    hashtags: ["Inspiring", "Dedicated"],
    imageUrls: [],
    heartCount: 28,
    isAnonymous: false,
    createdAt: "2025-10-30T09:00:00.000Z",
  },
  {
    id: 3,
    senderId: null,
    senderName: "Ẩn danh",
    senderAvatar: null, senderDepartment: null,
    recipientId: "user-005",
    recipientName: "Hoàng Thu E",
    recipientAvatar: null, recipientDepartment: null,
    title: "Creative problem solving",
    message:
      "Cách bạn giải quyết vấn đề kỹ thuật hôm qua thật sự ấn tượng. Bạn đã tìm ra hướng đi mà không ai nghĩ tới và giúp team tiết kiệm được rất nhiều thời gian.",
    hashtags: ["Dedicated"],
    imageUrls: [],
    heartCount: 15,
    isAnonymous: true,
    createdAt: "2025-10-29T15:30:00.000Z",
  },
  {
    id: 4,
    senderId: "user-006",
    senderName: "Vũ Hải F",
    senderAvatar: null, senderDepartment: null,
    recipientId: "user-007",
    recipientName: "Đặng Thành G",
    recipientAvatar: null, recipientDepartment: null,
    title: "Mentor of the month",
    message:
      "Cảm ơn bạn đã dành thời gian chia sẻ kiến thức và hướng dẫn mình trong suốt tháng qua. Nhờ bạn mà mình đã hiểu sâu hơn về kiến trúc hệ thống và tự tin hơn khi xử lý các task phức tạp.",
    hashtags: ["Inspiring", "Dedicated"],
    imageUrls: [],
    heartCount: 67,
    isAnonymous: false,
    createdAt: "2025-10-29T14:00:00.000Z",
  },
  {
    id: 5,
    senderId: "user-008",
    senderName: "Bùi Lan H",
    senderAvatar: null, senderDepartment: null,
    recipientId: "user-009",
    recipientName: "Ngô Minh I",
    recipientAvatar: null, recipientDepartment: null,
    title: "Above and beyond",
    message:
      "Bạn đã làm việc thêm giờ để đảm bảo release được đúng hạn. Sự cống hiến và trách nhiệm của bạn thực sự đáng được ghi nhận. Team rất may mắn khi có bạn đồng hành.",
    hashtags: ["Dedicated"],
    imageUrls: [],
    heartCount: 33,
    isAnonymous: false,
    createdAt: "2025-10-28T11:00:00.000Z",
  },
];

export const MOCK_HIGHLIGHTS: Kudos[] = MOCK_KUDOS.slice(0, 3);

export const MOCK_STATS: KudosStats = {
  totalKudosSent: 388,
  totalHeartsGiven: 1240,
  totalParticipants: 96,
};

export const MOCK_PERSONAL_STATS = {
  kudosReceived: 12,
  kudosSent: 8,
  heartsReceived: 47,
  secretBoxesOpened: 1,
  secretBoxesUnopened: 0,
};

export const MOCK_TOP_SUNNERS: TopSunner[] = [
  { userId: "u1", name: "Trần Thị B", avatar: null, heartsReceived: 67, rank: 1 },
  { userId: "u2", name: "Đặng Thành G", avatar: null, heartsReceived: 42, rank: 2 },
  { userId: "u3", name: "Nguyễn Văn A", avatar: null, heartsReceived: 38, rank: 3 },
  { userId: "u4", name: "Hoàng Thu E", avatar: null, heartsReceived: 35, rank: 4 },
  { userId: "u5", name: "Phạm Quốc D", avatar: null, heartsReceived: 33, rank: 5 },
  { userId: "u6", name: "Lê Minh C", avatar: null, heartsReceived: 28, rank: 6 },
  { userId: "u7", name: "Vũ Hải F", avatar: null, heartsReceived: 21, rank: 7 },
  { userId: "u8", name: "Bùi Lan H", avatar: null, heartsReceived: 18, rank: 8 },
  { userId: "u9", name: "Ngô Minh I", avatar: null, heartsReceived: 15, rank: 9 },
  { userId: "u10", name: "Đỗ Anh J", avatar: null, heartsReceived: 12, rank: 10 },
];

export const MOCK_RECENT_GIFTS = [
  { userId: "u1", name: "Trần Thị B", avatar: null, giftDescription: "Nhận được 1 áo phông SAA" },
  { userId: "u2", name: "Đặng Thành G", avatar: null, giftDescription: "Nhận được 1 voucher Shopee" },
  { userId: "u3", name: "Nguyễn Văn A", avatar: null, giftDescription: "Nhận được 1 áo phông SAA" },
  { userId: "u4", name: "Hoàng Thu E", avatar: null, giftDescription: "Nhận được 1 voucher Grab" },
  { userId: "u5", name: "Phạm Quốc D", avatar: null, giftDescription: "Nhận được 1 áo phông SAA" },
];
