export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getCards, getFilterOptions } from "@/lib/cards";
import { HoloCard } from "@/components/ui/HoloCard";
import { CardFilters } from "@/components/ui/CardFilters";
import type { Card, CardFilters as Filters } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card Catalog",
  description: "Browse all trading cards available from KojiCards.",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? sp[k] : undefined);

  const filters: Filters = {
    query: get("q"),
    game: get("game"),
    set: get("set"),
    rarity: get("rarity"),
    minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
  };

  const [cards, options] = await Promise.all([
    getCards(filters),
    getFilterOptions(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-2">Card Catalog</h1>
        <p className="text-white/40">
          {cards.length} card{cards.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Filters */}
      <div className="mb-10">
        <Suspense fallback={null}>
          <CardFilters
            games={options.games}
            sets={options.sets}
            rarities={options.rarities}
          />
        </Suspense>
      </div>

      {/* Grid */}
      {cards.length > 0 ? (
        <div className="flex flex-wrap gap-8 justify-start">
          {(cards as unknown as Card[]).map((card) => (
            <HoloCard key={card.id} card={card} size="md" />
          ))}
        </div>
      ) : (
        <div
          className="py-32 text-center rounded-2xl"
          style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-white/40 text-lg">No cards match your search.</p>
          <p className="text-white/25 text-sm mt-2">Try adjusting the filters above.</p>
        </div>
      )}
    </div>
  );
}
