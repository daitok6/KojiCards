"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Card } from "@/types";

const COND_SHORT: Record<string, string> = {
  Mint: "M",
  "Near Mint": "NM",
  "Lightly Played": "LP",
  "Moderately Played": "MP",
  "Heavily Played": "HP",
  Damaged: "DMG",
};

export function HeroFan({ cards }: { cards: Card[] }) {
  const centerRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<number>(0);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!centerRef.current) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const el = centerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rY = ((x - r.width / 2) / (r.width / 2)) * 10;
      const rX = -((y - r.height / 2) / (r.height / 2)) * 10;
      el.style.transform = `translateX(-50%) perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.04,1.04,1.04)`;
      el.style.setProperty("--mx", `${(x / r.width) * 100}%`);
      el.style.setProperty("--my", `${(y / r.height) * 100}%`);
      const foil = el.querySelector<HTMLElement>("[data-foil]");
      const glare = el.querySelector<HTMLElement>("[data-glare]");
      if (foil) foil.style.opacity = "1";
      if (glare) glare.style.opacity = "1";
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    if (!centerRef.current) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const el = centerRef.current;
    el.style.transform = "translateX(-50%)";
    const foil = el.querySelector<HTMLElement>("[data-foil]");
    const glare = el.querySelector<HTMLElement>("[data-glare]");
    if (foil) foil.style.opacity = "0";
    if (glare) glare.style.opacity = "0";
  }, []);

  if (cards.length === 0) return null;
  const center = cards[0];
  const left = cards[1] ?? cards[0];
  const right = cards[2] ?? cards[0];
  const condLabel = COND_SHORT[center.condition] ?? center.condition.slice(0, 2);

  return (
    <div className="relative" style={{ height: 460 }}>
      {/* Left card */}
      <div
        className="absolute overflow-hidden rounded-xl"
        style={{
          left: 10, top: 52, width: 220, height: 308,
          background: "linear-gradient(145deg,#1a1a2e,#16213e)",
          border: "1px solid rgba(255,255,255,0.12)",
          transform: "rotate(-9deg)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        }}
      >
        <Image src={left.imageUrl} alt={left.name} fill className="object-contain" sizes="220px" />
      </div>

      {/* Right card */}
      <div
        className="absolute overflow-hidden rounded-xl"
        style={{
          right: 10, top: 60, width: 220, height: 308,
          background: "linear-gradient(145deg,#1a1a2e,#16213e)",
          border: "1px solid rgba(255,255,255,0.12)",
          transform: "rotate(9deg)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
        }}
      >
        <Image src={right.imageUrl} alt={right.name} fill className="object-contain" sizes="220px" />
      </div>

      {/* Center card — holo hover, links to detail */}
      <Link
        ref={centerRef}
        href={`/cards/${center.id}`}
        className="absolute no-underline block rounded-xl overflow-hidden"
        style={{
          left: "50%", top: 0, width: 264, height: 370,
          transform: "translateX(-50%)",
          background: "linear-gradient(145deg,#1a1a2e,#16213e)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 60px rgba(168,85,247,0.18)",
          transition: "transform 0.1s ease-out",
          willChange: "transform",
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <Image src={center.imageUrl} alt={center.name} fill className="object-contain" sizes="264px" />
        {/* Holo foil */}
        <div
          data-foil=""
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "repeating-linear-gradient(45deg, rgba(168,85,247,0.15) 0%, rgba(59,130,246,0.15) 15%, rgba(6,182,212,0.15) 30%, rgba(34,197,94,0.15) 45%, rgba(234,179,8,0.15) 60%, rgba(236,72,153,0.15) 75%, rgba(168,85,247,0.15) 90%)",
            mixBlendMode: "color-dodge",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Glare */}
        <div
          data-glare=""
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)",
            mixBlendMode: "screen",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Name + price overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between"
          style={{ padding: "12px 14px", background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)" }}
        >
          <span className="text-white font-bold truncate" style={{ fontSize: 14 }}>
            {center.name} · {condLabel}
          </span>
          {center.price !== null && (
            <span className="text-green-400 font-extrabold flex-shrink-0 ml-2" style={{ fontSize: 14 }}>
              ${Number(center.price).toFixed(0)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
