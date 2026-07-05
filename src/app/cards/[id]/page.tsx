export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getCard } from "@/lib/cards";
import { CardGallery } from "@/components/ui/CardGallery";
import type { Card, CardMedia } from "@/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) return { title: "Card Not Found" };
  return {
    title: card.name,
    description: `${card.game} · ${card.set} · ${card.rarity} · ${card.condition}`,
  };
}

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  Mint: { label: "Mint", color: "text-green-400" },
  "Near Mint": { label: "Near Mint", color: "text-green-300" },
  "Lightly Played": { label: "Lightly Played", color: "text-yellow-400" },
  "Moderately Played": { label: "Moderately Played", color: "text-orange-400" },
  "Heavily Played": { label: "Heavily Played", color: "text-red-400" },
  Damaged: { label: "Damaged", color: "text-red-600" },
};

export default async function CardDetailPage({ params }: PageProps) {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) notFound();

  const typedCard = {
    ...card,
    price: card.price !== null ? Number(card.price) : null,
    media: (card.media ?? []) as unknown as CardMedia[],
  } as Card;
  const condition = CONDITION_LABELS[card.condition] ?? { label: card.condition, color: "text-white/60" };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/cards" className="btn-ghost text-sm mb-10 inline-flex">
        ← Back to Catalog
      </Link>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Card gallery (cover holo + optional media thumbnails) */}
        <div className="flex-shrink-0">
          <CardGallery card={typedCard} />
        </div>

        {/* Card details */}
        <div className="flex-1 pt-4">
          <div className="flex items-start gap-3 flex-wrap mb-2">
            {card.featured && (
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                ⭐ Featured
              </span>
            )}
            {card.stock === 0 && (
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Out of Stock
              </span>
            )}
          </div>

          <h1 className="text-4xl font-black text-white mb-1">{card.name}</h1>
          <p className="text-white/40 text-lg mb-8">{card.game} · {card.set}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: "Rarity", value: card.rarity },
              { label: "Condition", value: <span className={condition.color}>{condition.label}</span> },
              { label: "In Stock", value: card.stock > 0 ? card.stock : "—" },
              {
                label: "Price",
                value: card.price !== null
                  ? <span className="text-green-400 font-bold text-xl">${Number(card.price).toFixed(2)}</span>
                  : <span className="text-white/30">Contact for price</span>,
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-4 rounded-xl"
                style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
              >
                <p className="text-white/30 text-xs uppercase tracking-wider mb-1">{label}</p>
                <p className="text-white font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-white/40 text-sm mb-8">
            Interested? Contact the vendor directly to arrange a purchase — no checkout required.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link href="/contact" className="btn-primary px-8 py-3">
              Contact Vendor
            </Link>
            <Link href="/cards" className="btn-ghost px-8 py-3">
              More Cards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
