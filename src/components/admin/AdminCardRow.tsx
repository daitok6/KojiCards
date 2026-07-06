"use client";

import Image from "next/image";
import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import type { Card } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  available: "text-green-400 bg-green-500/15 border border-green-500/25",
  reserved: "text-amber-400 bg-amber-500/15 border border-amber-500/25",
  sold: "text-red-400 bg-red-500/15 border border-red-500/25",
};

interface Props {
  card: Card;
  isEven: boolean;
}

export function AdminCardRow({ card, isEven }: Props) {
  return (
    <tr
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: isEven ? "transparent" : "rgba(255,255,255,0.01)",
      }}
    >
      {/* Image */}
      <td className="px-4 py-3">
        <div className="relative w-10 h-14 rounded-md overflow-hidden">
          <Image src={card.imageUrl} alt={card.name} fill className="object-cover" sizes="40px" />
        </div>
      </td>

      {/* Name */}
      <td className="px-4 py-3">
        <Link href={`/cards/${card.id}`} className="text-white font-semibold hover:text-purple-300 no-underline">
          {card.name}
        </Link>
        {card.featured && (
          <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
            ★ Featured
          </span>
        )}
      </td>

      {/* Game / Set */}
      <td className="px-4 py-3 text-white/50">
        <p>{card.game}</p>
        <p className="text-white/30 text-xs">{card.set}</p>
      </td>

      {/* Rarity */}
      <td className="px-4 py-3 text-white/60">{card.rarity}</td>

      {/* Condition */}
      <td className="px-4 py-3 text-white/60">{card.condition}</td>

      {/* Price */}
      <td className="px-4 py-3">
        {card.price !== null ? (
          <span className="text-green-400 font-semibold">${Number(card.price).toFixed(2)}</span>
        ) : (
          <span className="text-white/25">—</span>
        )}
      </td>

      {/* Stock */}
      <td className="px-4 py-3">
        <span
          className={`font-semibold ${card.stock === 0 ? "text-red-400" : "text-white/70"}`}
        >
          {card.stock}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[card.status] || STATUS_STYLES.available}`}>
          {card.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link href={`/admin/cards/${card.id}`} className="btn-ghost text-xs px-3 py-1.5">
            Edit
          </Link>
          <AdminDeleteButton cardId={card.id} />
        </div>
      </td>
    </tr>
  );
}
