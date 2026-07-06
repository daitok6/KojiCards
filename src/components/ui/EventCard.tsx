import type { Event } from "@/types";

interface Props {
  event: Event;
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateRange(event: Event) {
  const start = new Date(event.startDate);
  if (!event.endDate) return formatDate(start);
  const end = new Date(event.endDate);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { day: "numeric" })}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function EventCard({ event }: Props) {
  const start = new Date(event.startDate);

  return (
    <div
      className="flex gap-5 p-5 rounded-2xl"
      style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
    >
      {/* Date badge */}
      <div
        className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl"
        style={{
          width: 72,
          height: 72,
          background: "rgba(168,85,247,0.12)",
          border: "1px solid rgba(168,85,247,0.2)",
        }}
      >
        <span className="text-purple-300 font-black text-lg leading-none">{start.getDate()}</span>
        <span className="text-purple-400/70 font-semibold text-[11px] uppercase tracking-wide mt-1">
          {start.toLocaleDateString("en-US", { month: "short" })}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3 className="text-white font-bold text-lg">{event.name}</h3>
          {event.booth && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25 whitespace-nowrap">
              Booth {event.booth}
            </span>
          )}
        </div>
        <p className="text-white/50 text-sm mt-1">
          {formatDateRange(event)}
          {" · "}
          {event.venue ? `${event.venue}, ${event.city}` : event.city}
        </p>
        {event.description && (
          <p className="text-white/40 text-sm mt-3 leading-relaxed">{event.description}</p>
        )}
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-xs px-4 py-2 mt-4 inline-block"
          >
            Event details ↗
          </a>
        )}
      </div>
    </div>
  );
}
