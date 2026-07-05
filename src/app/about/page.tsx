import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about KojiCards — a specialist trading card vendor focused on Pokémon and One Piece TCG singles.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

      {/* ── Mobile layout ───────────────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="mb-6">
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

        <div className="mb-6">
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

        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
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

        <div className="grid grid-cols-2 gap-3 mb-6">
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

        <div className="border-t mb-6" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
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

        <div className="flex flex-col gap-2.5">
          <Link href="/cards" className="btn-primary" style={{ padding: "14px", fontSize: 14.5 }}>
            Browse the catalog
          </Link>
          <Link href="/contact" className="btn-ghost" style={{ padding: "13px", fontSize: 14.5 }}>
            Get in touch
          </Link>
        </div>
      </div>

      {/* ── Desktop layout ──────────────────────────────────────────────── */}
      <div className="hidden md:block">
        {/* 2-col intro */}
        <div
          className="grid gap-16 mb-20"
          style={{ gridTemplateColumns: "1fr 420px", alignItems: "start" }}
        >
          {/* Left: copy + stats + game tiles */}
          <div>
            <p
              className="text-purple-400 font-semibold tracking-widest uppercase mb-4"
              style={{ fontSize: 11, letterSpacing: "0.12em" }}
            >
              Who we are
            </p>
            <h1 className="font-black text-white leading-[1.1] mb-6" style={{ fontSize: 46 }}>
              One collector,<br />grading every card<br />by hand.
            </h1>
            <p className="text-white/55 leading-relaxed mb-4" style={{ fontSize: 16 }}>
              KojiCards started with pulling packs and chasing holos. It turned into sourcing
              the specific singles people were hunting — and grading them honestly before they ship.
            </p>
            <p className="text-white/55 leading-relaxed mb-10" style={{ fontSize: 16 }}>
              No bulk lots, no mystery boxes. Every card is photographed as the exact copy you&apos;ll receive.
            </p>

            {/* Stats */}
            <div className="flex gap-12 mb-10">
              {[
                { stat: "500+", label: "singles sold" },
                { stat: "2", label: "games" },
                { stat: "<24h", label: "reply time" },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <p className="font-black text-white" style={{ fontSize: 32 }}>{stat}</p>
                  <p className="text-white/45 mt-1" style={{ fontSize: 12 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Game tiles */}
            <div className="flex gap-4">
              <div
                className="px-5 py-4 rounded-xl"
                style={{ border: "1px solid rgba(168,85,247,0.25)", background: "rgba(168,85,247,0.05)" }}
              >
                <p className="text-white font-bold mb-0.5">Pokémon TCG</p>
                <p className="text-white/45 text-sm">Base Set → S&amp;V</p>
              </div>
              <div
                className="px-5 py-4 rounded-xl"
                style={{ border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.05)" }}
              >
                <p className="text-white font-bold mb-0.5">One Piece TCG</p>
                <p className="text-white/45 text-sm">Romance Dawn → now</p>
              </div>
            </div>
          </div>

          {/* Right: photo placeholder */}
          <div
            className="rounded-2xl flex flex-col items-center justify-center text-center sticky top-24"
            style={{
              width: 420, height: 420,
              border: "2px dashed rgba(168,85,247,0.4)",
              background: "rgba(168,85,247,0.04)",
            }}
          >
            <p className="font-bold text-purple-300 mb-1.5" style={{ fontSize: 14 }}>Your photo goes here</p>
            <p className="text-white/45 leading-relaxed" style={{ fontSize: 13, maxWidth: 240 }}>
              You at a show, your binder wall, or your grading desk.
            </p>
          </div>
        </div>

        {/* Values 3-col */}
        <div
          className="grid grid-cols-3 gap-16 mb-16 pt-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          {[
            { title: "Honest grading", desc: "Every card is graded against standard conditions — Mint through Damaged — with flaws listed transparently in the notes." },
            { title: "Singles only", desc: "No bulk lots, no mystery boxes. Every card is listed individually so you know exactly what you're ordering." },
            { title: "Real answers", desc: "Have a question? Message directly and get close-up photos and honest answers within 24 hours — no bots, no queues." },
          ].map(({ title, desc }) => (
            <div key={title}>
              <h3 className="text-white font-bold mb-2" style={{ fontSize: 15 }}>{title}</h3>
              <p className="text-white/45 leading-relaxed text-sm">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div
          className="rounded-2xl p-12 flex items-center justify-between"
          style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}
        >
          <div>
            <h2 className="text-white font-black mb-2" style={{ fontSize: 24 }}>Ready to find your card?</h2>
            <p className="text-white/45 text-sm">Browse the full catalog or get in touch directly.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0 ml-12">
            <Link href="/cards" className="btn-primary" style={{ padding: "14px 28px", fontSize: 14.5 }}>
              Browse the catalog
            </Link>
            <Link href="/contact" className="btn-ghost" style={{ padding: "13px 24px", fontSize: 14.5 }}>
              Get in touch
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
