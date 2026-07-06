export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllEvents } from "@/lib/events";
import { EventDeleteButton } from "@/components/admin/EventDeleteButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Events" };

function formatRange(startDate: Date, endDate: Date | null) {
  const start = new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (!endDate) return start;
  const end = new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${start} – ${end}`;
}

export default async function AdminEventsPage() {
  const events = await getAllEvents();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <Link href="/admin" className="text-white/40 hover:text-white text-sm no-underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-white mt-4">Manage Events</h1>
          <p className="text-white/40 mt-1">{events.length} event{events.length !== 1 ? "s" : ""} total</p>
        </div>
        <Link href="/admin/events/new" className="btn-primary">
          + Add Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div
          className="py-24 text-center rounded-2xl"
          style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <p className="text-4xl mb-4">📅</p>
          <p className="text-white/40">No events yet.</p>
          <Link href="/admin/events/new" className="btn-primary mt-6">
            Add your first event
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => {
            const effectiveEnd = event.endDate ?? event.startDate;
            const isPast = new Date(effectiveEnd) < today;
            return (
              <div
                key={event.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl flex-wrap"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                  opacity: isPast ? 0.5 : 1,
                }}
              >
                <div className="min-w-0">
                  <p className="text-white font-semibold">
                    {event.name}
                    {isPast && <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/10 text-white/40">Past</span>}
                  </p>
                  <p className="text-white/40 text-sm mt-0.5">
                    {formatRange(event.startDate, event.endDate)} · {event.venue ? `${event.venue}, ${event.city}` : event.city}
                    {event.booth && ` · Booth ${event.booth}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/events/${event.id}`} className="btn-ghost text-xs px-3 py-1.5">
                    Edit
                  </Link>
                  <EventDeleteButton eventId={event.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
