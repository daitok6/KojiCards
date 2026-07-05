"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

interface CardFiltersProps {
  games: string[];
  sets: string[];
  rarities: string[];
  gameCounts?: Record<string, number>;
  totalCount?: number;
}

const PRICE_BANDS = [
  { value: "", label: "Any price" },
  { value: "u50", label: "Under $50" },
  { value: "50-150", label: "$50–$150" },
  { value: "o150", label: "Over $150" },
];

export function CardFilters({
  games,
  sets,
  rarities,
  gameCounts = {},
  totalCount = 0,
}: CardFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const get = (key: string) => searchParams.get(key) ?? "";

  const currentGame = get("game");
  const currentRarity = get("rarity");
  const currentPriceBand = get("priceBand");
  const currentQ = get("q");

  const chips: { label: string; remove: () => void }[] = [];
  if (currentGame) chips.push({ label: currentGame, remove: () => update({ game: "" }) });
  if (currentRarity) chips.push({ label: currentRarity, remove: () => update({ rarity: "" }) });
  if (currentPriceBand) {
    const bandLabel = PRICE_BANDS.find((b) => b.value === currentPriceBand)?.label ?? currentPriceBand;
    chips.push({ label: bandLabel, remove: () => update({ priceBand: "" }) });
  }
  if (currentQ) chips.push({ label: `"${currentQ}"`, remove: () => update({ q: "" }) });

  const gameTabs = [
    { value: "", label: "All", count: totalCount },
    ...games.map((g) => ({ value: g, label: g, count: gameCounts[g] ?? 0 })),
  ];

  return (
    <div className={`flex flex-col gap-3 transition-opacity ${isPending ? "opacity-50" : ""}`}>
      {/* Filter row */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Game tab bar */}
        <div
          className="inline-flex flex-shrink-0 overflow-hidden rounded-lg"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {gameTabs.map((tab, i) => {
            const active = currentGame === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => update({ game: tab.value })}
                className="cursor-pointer"
                style={{
                  padding: "9px 18px",
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  background: active ? "rgba(168,85,247,0.2)" : "transparent",
                  color: active ? "#d8b4fe" : "rgba(255,255,255,0.55)",
                  border: "none",
                  borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {tab.label} {tab.count > 0 ? tab.count : ""}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Search cards…"
          defaultValue={get("q")}
          onChange={(e) => update({ q: e.target.value })}
          className="flex-1 min-w-[180px]"
          style={{ fontSize: "0.9rem" }}
        />

        {/* Rarity */}
        {rarities.length > 0 && (
          <select
            value={get("rarity")}
            onChange={(e) => update({ rarity: e.target.value })}
            className="min-w-[150px]"
          >
            <option value="">All rarities</option>
            {rarities.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        )}

        {/* Price band */}
        <select
          value={get("priceBand")}
          onChange={(e) => update({ priceBand: e.target.value })}
          className="min-w-[130px]"
        >
          {PRICE_BANDS.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </div>

      {/* Active chips */}
      {chips.length > 0 && (
        <div className="flex gap-2 flex-wrap items-center">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.remove}
              className="inline-flex items-center gap-1.5 text-sm font-medium rounded-full cursor-pointer"
              style={{
                padding: "5px 12px",
                color: "#d8b4fe",
                background: "rgba(168,85,247,0.15)",
                border: "1px solid rgba(168,85,247,0.3)",
                fontFamily: "inherit",
              }}
            >
              {chip.label} ✕
            </button>
          ))}
          <button
            onClick={() => startTransition(() => router.replace(pathname))}
            className="text-sm cursor-pointer"
            style={{
              color: "rgba(255,255,255,0.4)",
              textDecoration: "underline",
              background: "none",
              border: "none",
              fontFamily: "inherit",
            }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
