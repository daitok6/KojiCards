import Image from "next/image";
import Link from "next/link";
import type { Card } from "@/types";

const CONDITION_SHORT: Record<string, string> = {
  Mint: "MINT",
  "Near Mint": "NM",
  "Lightly Played": "LP",
  "Moderately Played": "MP",
  "Heavily Played": "HP",
  Damaged: "DMG",
};

export function MobileCatalogCard({ card }: { card: Card }) {
  const condLabel = CONDITION_SHORT[card.condition] ?? card.condition.slice(0, 4).toUpperCase();
  const isSold = card.status === "sold";
  const isReserved = card.status === "reserved";

  return (
    <Link href={`/cards/${card.id}`} className="block no-underline">
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          height: 240,
          background: "linear-gradient(145deg, #1a1a2e, #16213e)",
          border: "1px solid rgba(255,255,255,0.12)",
          opacity: isSold ? 0.45 : isReserved ? 0.75 : 1,
        }}
      >
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="object-contain"
          sizes="50vw"
        />
        <span
          className="absolute top-2 left-2 font-extrabold rounded-md"
          style={{
            fontSize: "9.5px",
            padding: "3px 7px",
            background: "rgba(0,0,0,0.7)",
            color: isSold ? "rgba(255,255,255,0.5)" : isReserved ? "#fbbf24" : "#86efac",
            border: isSold
              ? "1px solid rgba(255,255,255,0.15)"
              : isReserved
              ? "1px solid rgba(251,191,36,0.3)"
              : "1px solid rgba(134,239,172,0.3)",
          }}
        >
          {isSold ? "SOLD" : isReserved ? "Reserved" : condLabel}
        </span>
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            padding: "8px 10px",
            background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
          }}
        >
          <div className="flex justify-between gap-1.5">
            <span
              className="text-[11px] font-bold truncate"
              style={{ color: isSold ? "rgba(255,255,255,0.5)" : isReserved ? "rgba(255,255,255,0.7)" : "#fff" }}
            >
              {card.name}
            </span>
            {card.price !== null && (
              <span
                className="text-[11px] font-extrabold flex-shrink-0"
                style={{
                  color: isSold ? "rgba(255,255,255,0.35)" : isReserved ? "#fbbf24" : "#4ade80",
                  textDecoration: isSold ? "line-through" : undefined,
                }}
              >
                ${Number(card.price).toFixed(0)}
              </span>
            )}
          </div>
          <span className="block text-[9.5px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            {card.set}
          </span>
        </div>
      </div>
    </Link>
  );
}
