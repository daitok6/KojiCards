"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Card } from "@/types";

interface HoloCardProps {
  card: Card;
  size?: "sm" | "md" | "lg";
  linkable?: boolean;
}

const RARITY_COLORS: Record<string, string> = {
  Common: "from-gray-400 to-gray-300",
  Uncommon: "from-green-400 to-emerald-300",
  Rare: "from-blue-400 to-blue-300",
  "Holo Rare": "from-purple-500 to-pink-400",
  "Ultra Rare": "from-yellow-400 to-orange-400",
  "Secret Rare": "from-pink-400 via-purple-400 to-cyan-400",
  Promo: "from-cyan-400 to-teal-300",
};

const SIZE_CONFIG = {
  sm: { width: 180, height: 252, classes: "w-[180px] h-[252px]" },
  md: { width: 240, height: 336, classes: "w-[240px] h-[336px]" },
  lg: { width: 320, height: 448, classes: "w-[320px] h-[448px]" },
};

export function HoloCard({ card, size = "md", linkable = true }: HoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const { width, height, classes } = SIZE_CONFIG[size];

  const rarityGradient = RARITY_COLORS[card.rarity] ?? "from-purple-500 to-blue-400";
  const isHolo = ["Holo Rare", "Ultra Rare", "Secret Rare"].includes(card.rarity);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    frameRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateY = ((x - cx) / cx) * 12;
      const rotateX = -((y - cy) / cy) * 12;
      const mx = (x / rect.width) * 100;
      const my = (y / rect.height) * 100;

      cardRef.current.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.04, 1.04, 1.04)
      `;
      cardRef.current.style.setProperty("--mx", `${mx}%`);
      cardRef.current.style.setProperty("--my", `${my}%`);
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    if (!cardRef.current) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    cardRef.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);

  const cardContent = (
    <div
      ref={cardRef}
      className={`holo-card ${classes} select-none`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        willChange: "transform",
        background: "linear-gradient(145deg, #1a1a2e, #16213e)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* Card image */}
      <div className="relative w-full" style={{ height: "65%" }}>
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          sizes={`${width}px`}
          className="object-cover"
          priority={false}
        />
        {/* Holographic foil overlay — only for holo/ultra/secret */}
        {isHolo && <div className="holo-foil" />}
      </div>

      {/* Glare layer — always present on hover */}
      <div className="holo-glare" />

      {/* Bottom info panel */}
      <div
        className="absolute bottom-0 left-0 right-0 p-3"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4))",
        }}
      >
        <p className="text-white font-bold text-sm truncate leading-tight">{card.name}</p>
        <p className="text-white/50 text-xs truncate">{card.game} · {card.set}</p>

        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${rarityGradient} text-black/80`}
          >
            {card.rarity}
          </span>
          {card.price !== null && (
            <span className="text-green-400 text-xs font-bold">
              ${Number(card.price).toFixed(2)}
            </span>
          )}
        </div>

        {card.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center rounded-b-xl bg-black/60">
            <span className="text-red-400 font-bold text-sm tracking-widest uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Featured shimmer bar */}
      {card.featured && (
        <div className="absolute top-0 left-0 right-0 h-0.5 shimmer-bar" />
      )}
    </div>
  );

  if (linkable) {
    return (
      <Link href={`/cards/${card.id}`} className="block no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
