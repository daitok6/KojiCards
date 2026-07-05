"use client";

import { useState } from "react";
import Image from "next/image";
import { HoloCard } from "@/components/ui/HoloCard";
import type { Card, CardMedia } from "@/types";

interface CardGalleryProps {
  card: Card;
}

export function CardGallery({ card }: CardGalleryProps) {
  const media = card.media ?? [];
  // active: null = show the cover holo card; number = show that gallery item
  const [active, setActive] = useState<number | null>(null);

  const activeItem = active !== null ? media[active] : null;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Main display ──────────────────────────────────────────────────── */}
      <div className="flex justify-center lg:justify-start">
        {activeItem ? (
          <MediaViewer item={activeItem} />
        ) : (
          <HoloCard card={card} size="lg" linkable={false} />
        )}
      </div>

      {/* ── Thumbnail strip (only shown when there are gallery items) ─────── */}
      {media.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {/* Cover thumbnail */}
          <button
            type="button"
            onClick={() => setActive(null)}
            className="relative flex-shrink-0 rounded-lg overflow-hidden transition-all focus:outline-none"
            style={{
              width: 64,
              height: 90,
              border: active === null
                ? "2px solid #a855f7"
                : "2px solid rgba(255,255,255,0.1)",
              background: "rgba(0,0,0,0.3)",
            }}
            aria-label="Show cover"
          >
            <Image
              src={card.imageUrl}
              alt="Cover"
              fill
              className="object-cover"
              sizes="64px"
            />
            {active === null && (
              <div className="absolute inset-0 bg-purple-500/20" />
            )}
          </button>

          {/* Gallery thumbnails */}
          {media.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              className="relative flex-shrink-0 rounded-lg overflow-hidden transition-all focus:outline-none"
              style={{
                width: 64,
                height: 90,
                border: active === i
                  ? "2px solid #a855f7"
                  : "2px solid rgba(255,255,255,0.1)",
                background: "rgba(0,0,0,0.3)",
              }}
              aria-label={`View ${item.type} ${i + 1}`}
            >
              {item.type === "video" ? (
                <VideoThumb url={item.url} />
              ) : (
                <Image
                  src={item.url}
                  alt={`Gallery ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
              {active === i && (
                <div className="absolute inset-0 bg-purple-500/20" />
              )}
              {/* Type badge */}
              <span
                className="absolute bottom-1 right-1 text-[8px] font-bold px-1 rounded leading-tight"
                style={{
                  background: item.type === "video"
                    ? "rgba(168,85,247,0.9)"
                    : "rgba(59,130,246,0.9)",
                  color: "white",
                }}
              >
                {item.type === "video" ? "▶" : "📷"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Full-size media viewer ───────────────────────────────────────────────────

function MediaViewer({ item }: { item: CardMedia }) {
  if (item.type === "video") {
    return (
      <div
        className="rounded-xl overflow-hidden"
        style={{
          width: 320,
          maxWidth: "100%",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "#000",
        }}
      >
        <video
          src={item.url}
          autoPlay
          loop
          muted
          playsInline
          controls
          className="w-full h-auto"
          style={{ display: "block" }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{
        width: 320,
        height: 448,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(0,0,0,0.3)",
      }}
    >
      <Image
        src={item.url}
        alt="Gallery image"
        fill
        className="object-contain"
        sizes="320px"
      />
    </div>
  );
}

// ── Video thumbnail (shows first frame via <video> poster trick) ─────────────

function VideoThumb({ url }: { url: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black/60">
      <video
        src={url}
        muted
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <span className="relative z-10 text-white text-lg">▶</span>
    </div>
  );
}
