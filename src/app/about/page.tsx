import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about KojiCards — a specialist trading card vendor focused on Pokémon and One Piece TCG singles.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-6 md:text-center md:mb-16">
        <p
          className="text-purple-400 font-semibold tracking-widest uppercase mb-2.5"
          style={{ fontSize: 11, letterSpacing: "0.1em" }}
        >
          Who we are
        </p>
        <h1 className="font-black text-white leading-[1.15] mb-4" style={{ fontSize: "clamp(26px, 5vw, 42px)" }}>
          One collector, grading every card by hand.
        </h1>
        <p className="text-white/55 leading-relaxed" style={{ fontSize: 14.5 }}>
          KojiCards started with pulling packs and chasing holos. It turned into sourcing
          the specific singles people were hunting — and grading them honestly before they ship.
        </p>
        <p className="text-white/55 leading-relaxed mt-3" style={{ fontSize: 14.5 }}>
          No bulk lots, no mystery boxes. Every card is photographed as the exact copy you&apos;ll receive.
        </p>
      </div>

      {/* ── Photo placeholder ──────────────────────────────────────────────── */}
      <div className="mb-6 md:mb-10">
        <div
          className="rounded-2xl flex flex-col items-center justify-center text-center"
          style={{
            height: 260,
            border: "2px dashed rgba(168,85,247,0.4)",
            background: "rgba(168,85,247,0.04)",
            padding: 20,
          }}
        >
          <p className="font-bold text-purple-300 mb-1" style={{ fontSize: 13.5 }}>Your photo goes here</p>
          <p className="text-white/45 leading-relaxed" style={{ fontSize: 12 }}>
            You at a show, your binder wall, or your grading desk.
          </p>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-6 text-center md:mb-10">
        {[
          { stat: "500+", label: "singles sold" },
          { stat: "2", label: "games" },
          { stat: "<24h", label: "reply time" },
        ].map(({ stat, label }) => (
          <div key={label}>
            <p className="font-black text-white" style={{ fontSize: 22 }}>{stat}</p>
            <p className="text-white/45" style={{ fontSize: 10.5, marginTop: 3 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Game specialties ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 mb-6 md:mb-10">
        <div
          className="p-3.5 rounded-xl"
          style={{ border: "1px solid rgba(168,85,247,0.25)", background: "rgba(168,85,247,0.05)" }}
        >
          <p className="text-white font-bold" style={{ fontSize: 12.5 }}>Pokémon TCG</p>
          <p className="text-white/45" style={{ fontSize: 11, marginTop: 2 }}>Base Set → S&amp;V</p>
        </div>
        <div
          className="p-3.5 rounded-xl"
          style={{ border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.05)" }}
        >
          <p className="text-white font-bold" style={{ fontSize: 12.5 }}>One Piece TCG</p>
          <p className="text-white/45" style={{ fontSize: 11, marginTop: 2 }}>Romance Dawn → now</p>
        </div>
      </div>

      {/* ── Values ─────────────────────────────────────────────────────────── */}
      <div
        className="border-t mb-6 md:mb-10"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        {[
          { title: "Honest grading", desc: "Standard conditions, flaws listed in the notes." },
          { title: "Singles only", desc: "Every card listed individually — no mystery lots." },
          { title: "Real answers", desc: "Close-ups and extra angles on request, within 24h." },
        ].map(({ title, desc }) => (
          <div key={title} className="py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-white font-bold mb-0.5" style={{ fontSize: 13.5 }}>{title}</p>
            <p className="text-white/45 leading-relaxed" style={{ fontSize: 12.5 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* ── CTAs ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5 md:flex-row md:justify-center md:gap-4">
        <Link href="/cards" className="btn-primary" style={{ padding: "14px", fontSize: 14.5 }}>
          Browse the catalog
        </Link>
        <Link href="/contact" className="btn-ghost" style={{ padding: "13px", fontSize: 14.5 }}>
          Get in touch
        </Link>
      </div>
    </div>
  );
}
