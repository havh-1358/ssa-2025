export type AwardPrizeRank = "first" | "second" | "third" | "winner";
export type AwardUnit = "individual" | "team";

export interface AwardPrize {
  rank: AwardPrizeRank;
  amount: string;
  recipientCount: number;
  unit: AwardUnit;
  subLabel?: string;
  noSubLabel?: boolean;
}

export interface AwardCategory {
  id: string;
  slug: string;
  imageSrc: string;
  imagePosition: "left" | "right";
  prizes: AwardPrize[];
}
