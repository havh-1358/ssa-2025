import type { AwardCategory } from "@/types/awards";

export const AWARD_CATEGORIES: AwardCategory[] = [
  {
    id: "top-talent",
    slug: "top-talent",
    name: "Top Talent",
    nameEn: "Top Talent",
    description: "Vinh danh những cá nhân xuất sắc nhất trong SSA 2025",
    prizes: [
      { rank: "1st", amount: "50,000,000 VNĐ", recipientCount: 1 },
      { rank: "2nd", amount: "30,000,000 VNĐ", recipientCount: 2 },
      { rank: "3rd", amount: "20,000,000 VNĐ", recipientCount: 3 },
    ],
  },
  {
    id: "top-project",
    slug: "top-project",
    name: "Top Project",
    nameEn: "Top Project",
    description: "Vinh danh những dự án tiêu biểu nhất năm 2025",
    prizes: [
      { rank: "1st", amount: "100,000,000 VNĐ", recipientCount: 1 },
      { rank: "2nd", amount: "70,000,000 VNĐ", recipientCount: 1 },
      { rank: "3rd", amount: "50,000,000 VNĐ", recipientCount: 1 },
    ],
  },
  {
    id: "top-project-leader",
    slug: "top-project-leader",
    name: "Top Project Leader",
    nameEn: "Top Project Leader",
    description: "Vinh danh những nhà lãnh đạo dự án xuất sắc",
    prizes: [
      { rank: "1st", amount: "50,000,000 VNĐ", recipientCount: 1 },
      { rank: "2nd", amount: "30,000,000 VNĐ", recipientCount: 2 },
    ],
  },
  {
    id: "best-manager",
    slug: "best-manager",
    name: "Best Manager",
    nameEn: "Best Manager",
    description: "Vinh danh những quản lý xuất sắc nhất tại Sun*",
    prizes: [
      { rank: "1st", amount: "50,000,000 VNĐ", recipientCount: 1 },
      { rank: "2nd", amount: "30,000,000 VNĐ", recipientCount: 2 },
    ],
  },
  {
    id: "signature-2025",
    slug: "signature-2025",
    name: "Signature 2025",
    nameEn: "Signature 2025",
    description: "Giải thưởng đặc biệt của năm SSA 2025",
    prizes: [{ rank: "Winner", amount: "200,000,000 VNĐ", recipientCount: 1 }],
  },
  {
    id: "mvp",
    slug: "mvp",
    name: "MVP",
    nameEn: "Most Valuable Person",
    description: "Người có giá trị nhất toàn hệ thống Sun*",
    prizes: [{ rank: "Winner", amount: "100,000,000 VNĐ", recipientCount: 1 }],
  },
];

export const VALID_AWARD_HASHES = AWARD_CATEGORIES.map(
  (c) => `#${c.slug}`
) as readonly string[];
