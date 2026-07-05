import { prisma } from "@/lib/prisma";
import type { Card, CardFilters } from "@/types";

// Prisma returns price as Decimal — convert to plain number so it can cross
// the Server→Client component boundary.
function serialize(card: Record<string, unknown>): Card {
  return { ...card, price: card.price !== null && card.price !== undefined ? Number(card.price) : null } as Card;
}

export async function getCards(filters: CardFilters = {}) {
  const { query, game, set, rarity, minPrice, maxPrice } = filters;

  return prisma.card.findMany({
    where: {
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { game: { contains: query, mode: "insensitive" } },
              { set: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(game ? { game: { equals: game, mode: "insensitive" } } : {}),
      ...(set ? { set: { equals: set, mode: "insensitive" } } : {}),
      ...(rarity ? { rarity: { equals: rarity, mode: "insensitive" } } : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  }).then((cards) => cards.map(serialize));
}

export async function getFeaturedCards() {
  return prisma.card.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  }).then((cards) => cards.map(serialize));
}

export async function getCard(id: string) {
  return prisma.card.findUnique({
    where: { id },
    include: { media: { orderBy: { position: "asc" } } },
  }).then((card) => (card ? serialize(card as unknown as Record<string, unknown>) : null));
}

export async function getFilterOptions() {
  const [games, sets, rarities, gameCounts, totalCount] = await Promise.all([
    prisma.card.findMany({ select: { game: true }, distinct: ["game"] }),
    prisma.card.findMany({ select: { set: true }, distinct: ["set"] }),
    prisma.card.findMany({ select: { rarity: true }, distinct: ["rarity"] }),
    prisma.card.groupBy({ by: ["game"], _count: { id: true } }),
    prisma.card.count(),
  ]);

  const gameCountMap: Record<string, number> = {};
  for (const g of gameCounts) gameCountMap[g.game] = g._count.id;

  return {
    games: games.map((c) => c.game),
    sets: sets.map((c) => c.set),
    rarities: rarities.map((c) => c.rarity),
    gameCounts: gameCountMap,
    totalCount,
  };
}
