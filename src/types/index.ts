export type CardRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Holo Rare"
  | "Ultra Rare"
  | "Secret Rare"
  | "Promo";

export type CardCondition =
  | "Mint"
  | "Near Mint"
  | "Lightly Played"
  | "Moderately Played"
  | "Heavily Played"
  | "Damaged";

export interface CardMedia {
  id: string;
  cardId: string;
  url: string;
  type: "image" | "video";
  position: number;
  createdAt: Date;
}

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  game: string;
  set: string;
  rarity: string;
  condition: string;
  price: number | null;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  media?: CardMedia[];
}

export interface CardFilters {
  query?: string;
  game?: string;
  set?: string;
  rarity?: string;
  minPrice?: number;
  maxPrice?: number;
}
