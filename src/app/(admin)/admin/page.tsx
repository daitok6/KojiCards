export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminCardRow } from "@/components/admin/AdminCardRow";
import { AdminCardMobile } from "@/components/admin/AdminCardMobile";
import { AdminSignOut } from "@/components/admin/AdminSignOut";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const cards = await prisma.card.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
          <p className="text-white/40 mt-1">{cards.length} card{cards.length !== 1 ? "s" : ""} in inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/cards/new" className="btn-primary">
            + Add Card
          </Link>
          <Link href="/admin/settings" className="btn-ghost text-sm px-4 py-2">
            Contact Info
          </Link>
          <AdminSignOut />
        </div>
      </div>

      {cards.length === 0 ? (
        <div
          className="py-24 text-center rounded-2xl"
          style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <p className="text-4xl mb-4">🃏</p>
          <p className="text-white/40">No cards yet.</p>
          <Link href="/admin/cards/new" className="btn-primary mt-6">
            Add your first card
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile list — stacked cards */}
          <div className="md:hidden flex flex-col gap-3">
            {cards.map((card) => (
              <AdminCardMobile
                key={card.id}
                card={card as unknown as import("@/types").Card}
              />
            ))}
          </div>

          {/* Desktop table */}
          <div
            className="hidden md:block rounded-2xl overflow-x-auto"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {["Image", "Name", "Game / Set", "Rarity", "Condition", "Price", "Stock", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-white/40 font-semibold text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cards.map((card, i) => (
                  <AdminCardRow
                    key={card.id}
                    card={card as unknown as import("@/types").Card}
                    isEven={i % 2 === 0}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
