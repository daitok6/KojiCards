"use client";

import Image from "next/image";
import Link from "next/link";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import type { Card } from "@/types";

export function AdminCardMobile({ card }: { card: Card }) {
  return (
    <div
      className="flex gap-3 rounded-xl p-3"
      style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.01)" }}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-14 h-20 rounded-md overflow-hidden">
        <Image src={card.imageUrl} alt={card.name} fill className="object-cover" sizes="56px" />
      </div>

      {/* Info + actions */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Name + featured badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-white truncate">{card.name}</span>
            {card.featured && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 flex-shrink-0">
                ★ Featured
              </span>
            )}
          </div>

          {/* Game · Set */}
          <p className="text-xs text-white/40 mt-0.5 truncate">
            {card.game}
            {card.set ? <> · {card.set}</> : null}
          </p>

          {/* Rarity · Condition · Price · Stock */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[11px] text-white/50">{card.rarity}</span>
            <span className="text-[11px] text-white/30">·</span>
            <span className="text-[11px] text-white/50">{card.condition}</span>
            <span className="text-[11px] text-white/30">·</span>
            {card.price !== null ? (
              <span className="text-[11px] font-semibold text-green-400">
                ${Number(card.price).toFixed(2)}
              </span>
            ) : (
              <span className="text-[11px] text-white/25">—</span>
            )}
            <span className="text-[11px] text-white/30">·</span>
            <span className={`text-[11px] font-semibold ${card.stock === 0 ? "text-red-400" : "text-white/60"}`}>
              {card.stock} in stock
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2">
          <Link
            href={`/admin/cards/${card.id}`}
            className="btn-ghost text-xs px-3 py-1.5"
          >
            Edit
          </Link>
          <AdminDeleteButton cardId={card.id} />
        </div>
      </div>
    </div>
  );
}
