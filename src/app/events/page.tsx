export const dynamic = "force-dynamic";

import { getUpcomingEvents } from "@/lib/events";
import { EventCard } from "@/components/ui/EventCard";
import type { Event } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Where to find KojiCards — upcoming conventions and card shows.",
};

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">Where to Find Us</h1>
        <p className="text-white/40">
          {events.length > 0
            ? `${events.length} upcoming show${events.length !== 1 ? "s" : ""} — come say hi.`
            : "Upcoming conventions and card shows we'll be attending."}
        </p>
      </div>

      {events.length > 0 ? (
        <div className="flex flex-col gap-4">
          {(events as unknown as Event[]).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div
          className="py-24 text-center rounded-2xl"
          style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <p className="text-5xl mb-4">📅</p>
          <p className="text-white/40 text-lg">No events scheduled right now.</p>
          <p className="text-white/25 text-sm mt-2">Follow us on Instagram for announcements.</p>
        </div>
      )}
    </div>
  );
}
