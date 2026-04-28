import type { AwardCategory } from "@/types/awards";

export const AWARD_CATEGORIES: AwardCategory[] = [
  {
    id: "top-talent",
    slug: "top-talent",
    imageSrc: "/assets/awards/award-top-talent.png",
    imagePosition: "left",
    prizes: [
      { rank: "winner", amount: "7.000.000 VNĐ", recipientCount: 10, unit: "individual" },
    ],
  },
  {
    id: "top-project",
    slug: "top-project",
    imageSrc: "/assets/awards/award-top-project.png",
    imagePosition: "right",
    prizes: [
      { rank: "winner", amount: "15.000.000 VNĐ", recipientCount: 2, unit: "team" },
    ],
  },
  {
    id: "top-project-leader",
    slug: "top-project-leader",
    imageSrc: "/assets/awards/award-top-project-leader.png",
    imagePosition: "left",
    prizes: [
      { rank: "winner", amount: "7.000.000 VNĐ", recipientCount: 3, unit: "individual" },
    ],
  },
  {
    id: "best-manager",
    slug: "best-manager",
    imageSrc: "/assets/awards/award-best-manager.png",
    imagePosition: "right",
    prizes: [
      { rank: "winner", amount: "10.000.000 VNĐ", recipientCount: 1, unit: "individual", noSubLabel: true },
    ],
  },
  {
    id: "signature-2025",
    slug: "signature-2025",
    imageSrc: "/assets/awards/award-signature-2025.png",
    imagePosition: "left",
    prizes: [
      {
        rank: "winner",
        amount: "5.000.000 VNĐ",
        recipientCount: 1,
        unit: "individual",
        subLabel: "perIndividualPrize",
      },
      {
        rank: "winner",
        amount: "8.000.000 VNĐ",
        recipientCount: 1,
        unit: "team",
        subLabel: "perTeamPrize",
      },
    ],
  },
  {
    id: "mvp",
    slug: "mvp",
    imageSrc: "/assets/awards/award-mvp.png",
    imagePosition: "right",
    prizes: [
      { rank: "winner", amount: "15.000.000 VNĐ", recipientCount: 1, unit: "individual", noSubLabel: true },
    ],
  },
];

export const VALID_AWARD_HASHES = AWARD_CATEGORIES.map(
  (c) => `#${c.slug}`
) as readonly string[];
