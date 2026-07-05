import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about KojiCards — a specialist trading card vendor focused on Pokémon and One Piece TCG singles.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">
          Who We Are
        </p>
        <h1
          className="text-4xl sm:text-5xl font-black tracking-tight mb-5"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.15,
          }}
        >
          About KojiCards
        </h1>
        <p className="text-white/40 text-lg max-w-2xl mx-auto">
          A specialist trading card vendor with a simple focus: finding the cards
          collectors actually want and making sure they&apos;re in the condition described.
        </p>
      </div>

      {/* Story */}
      <div
        className="p-8 rounded-2xl mb-8"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
      >
        <h2 className="text-xl font-bold text-white mb-4">The story</h2>
        <p className="text-white/50 leading-relaxed mb-4">
          KojiCards started from a personal passion for the hobby — pulling packs,
          chasing holos, and slowly building a collection worth being proud of. Over time
          that turned into sourcing cards for others: hunting down the specific singles
          people were looking for, whether it was a Base Set Charizard or a freshly
          released One Piece alt art.
        </p>
        <p className="text-white/50 leading-relaxed">
          Today KojiCards operates as a dedicated singles vendor. Every card is handled
          individually — inspected, graded for condition, and listed honestly. No bulk
          lots, no mystery boxes, no hidden surprises.
        </p>
      </div>

      {/* Specialities */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div
          className="p-7 rounded-2xl"
          style={{ border: "1px solid rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.04)" }}
        >
          <span className="text-3xl">🎴</span>
          <h3 className="text-white font-bold text-lg mt-3 mb-2">Pokémon TCG</h3>
          <p className="text-white/40 text-sm leading-relaxed">
            From Base Set holos to the latest Scarlet &amp; Violet sets. We carry
            everything from iconic vintage singles to current meta staples and
            sought-after special art rares.
          </p>
        </div>
        <div
          className="p-7 rounded-2xl"
          style={{ border: "1px solid rgba(59,130,246,0.2)", background: "rgba(59,130,246,0.04)" }}
        >
          <span className="text-3xl">⚓</span>
          <h3 className="text-white font-bold text-lg mt-3 mb-2">One Piece TCG</h3>
          <p className="text-white/40 text-sm leading-relaxed">
            Leaders, event cards, and alt-art secret rares from Romance Dawn
            through the current sets. Great for collectors and competitive
            players alike.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="grid sm:grid-cols-3 gap-5 mb-14">
        {[
          {
            icon: "🔍",
            title: "Honest grading",
            desc: "Every card is graded under good lighting using standard conditions: Mint, Near Mint, Lightly Played, and so on. What you see is what you get.",
          },
          {
            icon: "📦",
            title: "Singles only",
            desc: "We don't sell sealed product or mystery lots. Every card is listed individually so you can see exactly what you're buying.",
          },
          {
            icon: "💬",
            title: "Real answers",
            desc: "Questions about a card? Want more photos or a condition close-up? Just ask — you'll hear from a real person.",
          },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            className="p-5 rounded-xl"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-2xl">{icon}</span>
            <h4 className="text-white font-semibold mt-3 mb-1">{title}</h4>
            <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="text-center py-12 px-6 rounded-2xl"
        style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
      >
        <p className="text-white font-bold text-xl mb-2">Ready to browse?</p>
        <p className="text-white/40 mb-7">
          Check out the full catalogue or reach out if you&apos;re looking for something specific.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/cards" className="btn-primary px-8 py-3 text-base">
            Browse Catalog
          </Link>
          <Link href="/contact" className="btn-ghost px-8 py-3 text-base">
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
