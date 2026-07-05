"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { deleteCard } from "@/lib/actions";
import type { Card } from "@/types";

interface Props {
  card: Card;
  isEven: boolean;
}

export function AdminCardRow({ card, isEven }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleDelete() {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setDeleting(true);
    await deleteCard(card.id);
  }

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

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Link href={`/admin/cards/${card.id}`} className="btn-ghost text-xs px-3 py-1.5">
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium disabled:opacity-50 ${
              confirmed
                ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                : "bg-transparent border-red-500/20 text-red-500/60 hover:border-red-500/50 hover:text-red-400"
            }`}
          >
            {deleting ? "Deleting…" : confirmed ? "Confirm?" : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
