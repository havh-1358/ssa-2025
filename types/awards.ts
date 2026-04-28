export interface AwardPrize {
  rank: string;
  amount: string;
  recipientCount: number;
}

export interface AwardCategory {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  prizes: AwardPrize[];
}
