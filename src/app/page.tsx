export const dynamic = "force-dynamic";

import Link from "next/link";
import { getFeaturedCards, getCards } from "@/lib/cards";
import { HoloCard } from "@/components/ui/HoloCard";
import type { Card } from "@/types";

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    getFeaturedCards(),
    getCards(),
  ]);

  const showcase = featured.length > 0 ? featured : recent.slice(0, 6);

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center text-center px-4">
        {/* Ambient background blobs */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
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

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Pokémon · One Piece TCG
          </p>
          <h1
            className="text-5xl sm:text-7xl font-black tracking-tight mb-6"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            Cards Worth<br />Collecting
          </h1>
          <p className="text-white/50 text-lg sm:text-xl max-w-xl mx-auto mb-10">
            Holo rares, secret rares, and sought-after singles — every card
            hand-inspected and condition-graded by KojiCards.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/cards" className="btn-primary text-base px-8 py-3">
              Browse Catalog
            </Link>
            <Link href="/contact" className="btn-ghost text-base px-8 py-3">
              Ask About a Card
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured / Showcase ───────────────────────────────────────────── */}
      {showcase.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-purple-400 text-xs font-semibold tracking-widest uppercase mb-3">
                {featured.length > 0 ? "Featured Picks" : "Recent Additions"}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Hover to feel the magic
              </h2>
              <p className="text-white/40 mt-2">
                Move your cursor over any card to see the holographic effect
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">
              {(showcase as Card[]).map((card) => (
                <HoloCard key={card.id} card={card} size="md" />
              ))}
            </div>

            <div className="text-center mt-14">
              <Link href="/cards" className="btn-primary px-10 py-3 text-base">
                View All Cards
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── No cards yet state ────────────────────────────────────────────── */}
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
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: "🔍", title: "Condition-Graded", desc: "Every card is individually inspected — Mint, Near Mint, LP — so you know exactly what you're getting." },
            { icon: "🃏", title: "Pokémon & One Piece", desc: "Specialist focus on Pokémon and One Piece TCG singles, from Base Set classics to current-set pulls." },
            { icon: "💬", title: "Ask Before You Buy", desc: "Have a question about a card? Reach out directly — no bots, no ticket queues, just a real answer." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-4xl">{icon}</span>
              <h3 className="text-white font-bold text-lg mt-3 mb-2">{title}</h3>
              <p className="text-white/40 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
