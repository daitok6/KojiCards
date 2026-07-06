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

export type CardStatus = "available" | "reserved" | "sold";
export type CardFinish = "Normal" | "Holo" | "Reverse Holo" | "Foil" | "Other";
export type GradingCompany = "PSA" | "BGS" | "CGC" | "SGC" | "Other";

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
  // Catalogue fields
  cardNumber?: string;
  finish: string;
  language: string;
  firstEdition: boolean;
  graded: boolean;
  gradingCompany?: string;
  grade?: string;
  certNumber?: string;
  sku?: string;
  artist?: string;
  releaseYear?: number;
  status: string;
  details?: string;
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
  priceBand?: string;
  status?: string;
  finish?: string;
}
