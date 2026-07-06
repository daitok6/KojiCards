export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getCard } from "@/lib/cards";
import { prisma } from "@/lib/prisma";
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
    description: [
      card.game,
      card.set,
      card.cardNumber ? `#${card.cardNumber}` : null,
      card.rarity,
      card.condition,
      card.finish !== "Normal" ? card.finish : null,
    ].filter(Boolean).join(" · "),
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
  const [card, info] = await Promise.all([
    getCard(id),
    prisma.vendorInfo.findUnique({ where: { id: "singleton" } }),
  ]);
  if (!card) notFound();

  const typedCard = {
    ...card,
    price: card.price !== null ? Number(card.price) : null,
    media: (card.media ?? []) as unknown as CardMedia[],
  } as Card;
  const condition = CONDITION_LABELS[card.condition] ?? { label: card.condition, color: "text-white/60" };

  const whatsappNum = info?.whatsapp?.replace(/\D/g, "") ?? "";
  const whatsappUrl = whatsappNum
    ? `https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hi, I'm interested in the ${card.name} listed on KojiCards.`)}`
    : null;

  const priceDisplay = card.price !== null ? `$${Number(card.price).toFixed(0)}` : null;

  return (
    <>
      {/* ── Main content ───────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 pb-28 md:pb-16">
        {/* Mobile back link */}
        <Link href="/cards" className="btn-ghost text-sm mb-8 inline-flex md:hidden">
          ← Back to Catalog
        </Link>
        {/* Desktop breadcrumb */}
        <nav className="hidden md:flex items-center gap-2 text-sm text-white/40 mb-10">
          <Link href="/cards" className="hover:text-white/70 transition-colors">Catalog</Link>
          <span>/</span>
          <Link href={`/cards?game=${encodeURIComponent(card.game)}`} className="hover:text-white/70 transition-colors">{card.game}</Link>
          <span>/</span>
          <span className="text-white/70">{card.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          {/* Card gallery */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <CardGallery card={typedCard} />
          </div>

          {/* Card details */}
          <div className="flex-1 pt-0 lg:pt-4">
            <div className="flex items-start gap-3 flex-wrap mb-3">
              {card.rarity && (
                <span
                  className="text-[10.5px] font-bold px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(168,85,247,0.18)",
                    color: "#d8b4fe",
                    border: "1px solid rgba(168,85,247,0.3)",
                  }}
                >
                  {card.rarity}
                </span>
              )}
              <span
                className={`text-[10.5px] font-bold px-3 py-1 rounded-full ${condition.color}`}
                style={{
                  background: "rgba(134,239,172,0.1)",
                  border: "1px solid rgba(134,239,172,0.25)",
                }}
              >
                {condition.label}
              </span>
              {card.featured && (
                <span className="text-[10.5px] font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ⭐ Featured
                </span>
              )}
              {card.status === "sold" && (
                <span className="text-[10.5px] font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  SOLD
                </span>
              )}
              {card.status === "reserved" && (
                <span className="text-[10.5px] font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Reserved
                </span>
              )}
              {card.status !== "sold" && card.stock === 0 && (
                <span className="text-[10.5px] font-semibold px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-4xl font-black text-white mb-1">{card.name}</h1>
            <p className="text-white/40 mb-6" style={{ fontSize: 13.5 }}>
              {card.game} · {card.set}
            </p>

            {/* Spec chips */}
            {(card.cardNumber || card.finish !== "Normal" || card.language !== "English" || card.firstEdition || card.graded) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {card.cardNumber && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full text-white/50"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    #{card.cardNumber}
                  </span>
                )}
                {card.finish && card.finish !== "Normal" && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full text-white/50"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {card.finish}
                  </span>
                )}
                {card.language && card.language !== "English" && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full text-white/50"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {card.language}
                  </span>
                )}
                {card.firstEdition && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full text-yellow-400/80"
                    style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
                    1st Edition
                  </span>
                )}
                {card.graded && card.gradingCompany && card.grade && (
                  <span className="text-[11px] px-2.5 py-1 rounded-full text-purple-300/80"
                    style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                    {card.gradingCompany} {card.grade}
                  </span>
                )}
              </div>
            )}

            {card.price !== null && (
              <div className="mb-4">
                <p className="font-black text-green-400" style={{ fontSize: 32 }}>
                  {priceDisplay}<span className="text-lg">.00</span>
                </p>
                {card.stock > 0 && card.stock <= 3 && (
                  <p className="text-yellow-400 font-semibold mt-0.5" style={{ fontSize: 12.5 }}>
                    Only {card.stock} available
                  </p>
                )}
              </div>
            )}

            {card.details && (
              <div className="mb-6 p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">Condition Notes</p>
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{card.details}</p>
              </div>
            )}

            <p className="text-white/40 text-sm mb-8">
              Photos show the exact copy you&apos;ll receive. Ships insured &amp; tracked · Replies within 24h · No checkout, no fees
            </p>

            {/* Desktop CTA buttons — hidden on mobile (replaced by sticky bar) */}
            <div className="hidden md:flex flex-col gap-3" style={{ maxWidth: 400 }}>
              <Link
                href={`/contact?card=${card.id}`}
                className="btn-primary text-center"
                style={{ padding: "15px", fontSize: 15, fontWeight: 700 }}
              >
                Inquire about {card.name}
              </Link>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost text-center"
                  style={{ padding: "14px", fontSize: 15 }}
                >
                  Message on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky inquire bar ───────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          padding: "12px 20px 16px",
          background: "rgba(10,10,15,0.95)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex gap-2.5">
          <Link
            href={`/contact?card=${card.id}`}
            className="btn-primary flex-1"
            style={{ padding: "14px", fontSize: 14, fontWeight: 700 }}
          >
            Inquire{priceDisplay ? ` · ${priceDisplay}` : ""}
          </Link>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ padding: "14px 18px", fontSize: 14 }}
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </>
  );
}
