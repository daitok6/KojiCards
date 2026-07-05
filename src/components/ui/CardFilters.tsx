"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

interface CardFiltersProps {
  games: string[];
  sets: string[];
  rarities: string[];
}

export function CardFilters({ games, sets, rarities }: CardFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const get = (key: string) => searchParams.get(key) ?? "";

  return (
    <div
      className={`flex flex-wrap gap-3 transition-opacity ${isPending ? "opacity-50" : ""}`}
    >
      {/* Search */}
      <div className="flex-1 min-w-[220px]">
        <input
          type="search"
          placeholder="Search cards…"
          defaultValue={get("q")}
          onChange={(e) => update("q", e.target.value)}
          className="w-full"
          style={{ fontSize: "0.9rem" }}
        />
      </div>

      {/* Game filter */}
      <select
        value={get("game")}
        onChange={(e) => update("game", e.target.value)}
        className="min-w-[140px]"
      >
        <option value="">All Games</option>
        {games.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      {/* Set filter */}
      <select
        value={get("set")}
        onChange={(e) => update("set", e.target.value)}
        className="min-w-[160px]"
      >
        <option value="">All Sets</option>
        {sets.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Rarity filter */}
      <select
        value={get("rarity")}
        onChange={(e) => update("rarity", e.target.value)}
        className="min-w-[160px]"
      >
        <option value="">All Rarities</option>
        {rarities.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      {/* Clear */}
      {(get("q") || get("game") || get("set") || get("rarity")) && (
        <button
          onClick={() => {
            startTransition(() => {
              router.replace(pathname);
            });
          }}
          className="btn-ghost text-sm px-4 py-2 text-red-400 border-red-500/30 hover:bg-red-500/10"
        >
          Clear
        </button>
      )}
    </div>
  );
}
