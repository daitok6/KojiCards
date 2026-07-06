export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { getFeaturedCards, getCards } from "@/lib/cards";
import { prisma } from "@/lib/prisma";
import { HoloCard } from "@/components/ui/HoloCard";
import { HeroFan } from "@/components/ui/HeroFan";
import { MobileCatalogCard } from "@/components/ui/MobileCatalogCard";
import { AnnouncementBanner } from "@/components/ui/AnnouncementBanner";
import type { Card } from "@/types";

export default async function HomePage() {
  const [featured, recent, announcement] = await Promise.all([
    getFeaturedCards(),
    getCards(),
    prisma.announcement.findUnique({ where: { id: "singleton" } }),
  ]);

  const showcase = featured.length > 0 ? featured : recent.slice(0, 6);
  const inStockCount = recent.filter((c) => c.stock > 0).length;
  const fanCards = showcase.slice(0, 3) as Card[];

  return (
    <>
      {announcement?.active && announcement.message && (
        <AnnouncementBanner message={announcement.message} link={announcement.link || undefined} />
      )}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center text-center px-4">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 blur-3xl"
            style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }}
          />
        </div>

        {/* ── Mobile hero ───────────────────────────────────────────────── */}
        <div className="relative z-10 w-full max-w-sm mx-auto md:hidden">
          <p className="text-purple-400 font-semibold tracking-widest uppercase mb-2.5" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
            Pokémon · One Piece TCG singles
          </p>
          <h1 className="font-black tracking-tight text-white mb-3 leading-[1.12]" style={{ fontSize: 34 }}>
            Cards worth collecting.
          </h1>
          <p className="text-white/50 mx-auto mb-5 leading-relaxed" style={{ fontSize: 15, maxWidth: 300 }}>
            Every single hand-inspected and condition-graded. A real person answers.
          </p>

          {/* Fan of 3 cards */}
          {fanCards.length >= 3 ? (
            <div className="relative mb-5" style={{ height: 280 }}>
              {/* Left card – rotated */}
              <div
                className="absolute overflow-hidden rounded-xl"
                style={{
                  left: 28, top: 34, width: 136, height: 190,
                  background: "linear-gradient(145deg,#1a1a2e,#16213e)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  transform: "rotate(-9deg)",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.5)",
                }}
              >
                <Image src={fanCards[1].imageUrl} alt={fanCards[1].name} fill className="object-contain" sizes="136px" />
              </div>
              {/* Right card – rotated */}
              <div
                className="absolute overflow-hidden rounded-xl"
                style={{
                  right: 28, top: 40, width: 136, height: 190,
                  background: "linear-gradient(145deg,#1a1a2e,#16213e)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  transform: "rotate(9deg)",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.5)",
                }}
              >
                <Image src={fanCards[2].imageUrl} alt={fanCards[2].name} fill className="object-contain" sizes="136px" />
              </div>
              {/* Center card – prominent */}
              <div
                className="absolute overflow-hidden rounded-xl"
                style={{
                  left: "50%", top: 0, width: 164, height: 230,
                  transform: "translateX(-50%)",
                  background: "linear-gradient(145deg,#1a1a2e,#16213e)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 28px 56px rgba(0,0,0,0.7), 0 0 40px rgba(168,85,247,0.18)",
                }}
              >
                <Image src={fanCards[0].imageUrl} alt={fanCards[0].name} fill className="object-contain" sizes="164px" />
                <div
                  className="absolute bottom-0 left-0 right-0 flex items-center justify-between"
                  style={{ padding: "8px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)" }}
                >
                  <span className="text-white font-bold truncate" style={{ fontSize: 11 }}>{fanCards[0].name}</span>
                  {fanCards[0].price !== null && (
                    <span className="text-green-400 font-extrabold flex-shrink-0 ml-1" style={{ fontSize: 11 }}>
                      ${Number(fanCards[0].price).toFixed(0)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center mb-5" style={{ height: 200 }}>
              <div
                className="flex items-center justify-center text-4xl rounded-xl"
                style={{ width: 164, height: 180, background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
              >
                🃏
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <Link href="/cards" className="btn-primary" style={{ padding: "15px", fontSize: 15 }}>
              Browse {inStockCount > 0 ? `${inStockCount} cards in stock` : "catalog"}
            </Link>
            <Link href="/contact" className="btn-ghost" style={{ padding: "14px", fontSize: 15 }}>
              Ask about a card
            </Link>
            <p className="mt-1.5 text-center text-white/45" style={{ fontSize: 12 }}>
              Condition-graded · Ships insured · Replies within 24h
            </p>
          </div>
        </div>

        {/* ── Desktop hero ──────────────────────────────────────────────── */}
        <div
          className="relative z-10 w-full hidden md:grid items-center gap-12"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", gridTemplateColumns: "1fr 560px" }}
        >
          {/* Left: copy */}
          <div>
            <p
              className="text-purple-400 font-semibold tracking-widest uppercase mb-4"
              style={{ fontSize: 11, letterSpacing: "0.12em" }}
            >
              Pokémon · One Piece TCG singles
            </p>
            <h1
              className="font-black tracking-tight text-white leading-[1.08] mb-5"
              style={{ fontSize: 64 }}
            >
              Cards worth<br />collecting.
            </h1>
            <p className="text-white/50 leading-relaxed mb-8" style={{ fontSize: 18, maxWidth: 480 }}>
              Every single hand-inspected and condition-graded. Holo rares, secret rares, and
              sought-after singles from Pokémon and One Piece TCG.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/cards" className="btn-primary" style={{ padding: "14px 32px", fontSize: 15 }}>
                Browse {inStockCount > 0 ? `${inStockCount} cards` : "catalog"}
              </Link>
              <Link href="/contact" className="btn-ghost" style={{ padding: "13px 28px", fontSize: 15 }}>
                Ask about a card
              </Link>
            </div>
            <p className="text-white/30 mt-5" style={{ fontSize: 12.5 }}>
              Condition-graded · Ships insured · Replies within 24h
            </p>
          </div>

          {/* Right: card fan */}
          {fanCards.length >= 3 ? (
            <HeroFan cards={fanCards} />
          ) : (
            <div className="flex items-center justify-center" style={{ height: 460 }}>
              <div
                className="flex items-center justify-center text-6xl rounded-2xl"
                style={{ width: 264, height: 370, background: "rgba(168,85,247,0.08)", border: "1px dashed rgba(168,85,247,0.25)" }}
              >
                🃏
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Featured / Showcase ───────────────────────────────────────────── */}
      {showcase.length > 0 && (
        <section className="py-10 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Mobile heading */}
            <div className="flex items-baseline justify-between mb-3.5 md:hidden">
              <h2 className="font-extrabold text-white" style={{ fontSize: 19 }}>Featured picks</h2>
              <Link href="/cards" className="text-purple-400 font-semibold" style={{ fontSize: 13 }}>
                View all →
              </Link>
            </div>

            {/* Desktop heading */}
            <div className="mb-10 hidden md:flex items-baseline justify-between">
              <h2 className="text-2xl font-bold text-white">Featured picks</h2>
              <Link href="/cards" className="text-purple-400 font-semibold text-sm">View all →</Link>
            </div>

            {/* Mobile 2-col grid */}
            <div className="grid grid-cols-2 gap-3.5 md:hidden">
              {(showcase as Card[]).slice(0, 4).map((card) => (
                <MobileCatalogCard key={card.id} card={card} />
              ))}
            </div>

            {/* Desktop 4-col grid */}
            <div className="hidden md:grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {(showcase as Card[]).slice(0, 4).map((card) => (
                <HoloCard key={card.id} card={card} size="md" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No cards state */}
      {showcase.length === 0 && (
        <section className="py-32 text-center px-4">
          <div
            className="inline-block px-8 py-12 rounded-2xl"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
          >
            <p className="text-6xl mb-4">🃏</p>
            <p className="text-white/40 text-lg">No cards added yet.</p>
          </div>
        </section>
      )}

      {/* ── Value props ───────────────────────────────────────────────────── */}
      <section className="py-8 md:py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          {/* Mobile list */}
          <div className="md:hidden flex flex-col gap-0">
            {[
              { title: "Condition-graded", desc: "Mint to LP, graded under proper lighting." },
              { title: "Two games, deep focus", desc: "Pokémon and One Piece singles only." },
              { title: "A real person answers", desc: "Direct line, replies within 24h." },
            ].map(({ title, desc }) => (
              <div key={title} className="py-3.5 border-b border-white/[0.06]">
                <p className="text-white font-bold mb-0.5" style={{ fontSize: 13.5 }}>{title}</p>
                <p className="text-white/40 leading-relaxed" style={{ fontSize: 12.5 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Desktop 3-col text-only */}
          <div className="hidden md:grid grid-cols-3 gap-12">
            {[
              { title: "Condition-graded", desc: "Every card is individually inspected — Mint, Near Mint, LP — so you know exactly what you're getting." },
              { title: "Pokémon & One Piece", desc: "Specialist focus on two games only. From Base Set classics to current-set pulls." },
              { title: "Ask before you buy", desc: "Have a question about a card? Reach out directly — no bots, no ticket queues, just a real answer." },
            ].map(({ title, desc }) => (
              <div key={title}>
                <h3 className="text-white font-bold text-base mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
