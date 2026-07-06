"use client";

import { useState } from "react";
import { createEvent, updateEvent } from "@/lib/actions";
import type { Event } from "@/types";

interface EventFormProps {
  event?: Event;
}

function toDateInputValue(d?: Date | string | null): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function EventForm({ event }: EventFormProps) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    try {
      if (event) {
        await updateEvent(event.id, formData);
      } else {
        await createEvent(formData);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div
        className="p-6 rounded-xl space-y-5"
        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
      >
        <div>
          <label className="block text-sm text-white/50 mb-1.5">Event Name *</label>
          <input name="name" type="text" required defaultValue={event?.name} placeholder="e.g. Collect-A-Con Dallas" />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Start Date *</label>
            <input name="startDate" type="date" required defaultValue={toDateInputValue(event?.startDate)} />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">End Date</label>
            <input name="endDate" type="date" defaultValue={toDateInputValue(event?.endDate)} />
            <p className="text-white/30 text-xs mt-1">Leave blank for a single-day event.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-white/50 mb-1.5">City *</label>
            <input name="city" type="text" required defaultValue={event?.city} placeholder="e.g. Dallas, TX" />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Venue</label>
            <input name="venue" type="text" defaultValue={event?.venue ?? ""} placeholder="e.g. Kay Bailey Hutchison Convention Center" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/50 mb-1.5">Booth / Table Number</label>
          <input name="booth" type="text" defaultValue={event?.booth ?? ""} placeholder="e.g. 214" />
        </div>

        <div>
          <label className="block text-sm text-white/50 mb-1.5">Convention Link</label>
          <input name="link" type="text" defaultValue={event?.link ?? ""} placeholder="https://example.com" />
        </div>

        <div>
          <label className="block text-sm text-white/50 mb-1.5">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={event?.description ?? ""}
            placeholder="Anything customers should know — what you're bringing, special deals, etc."
            style={{ resize: "vertical" }}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary px-10 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving…" : event ? "Save Changes" : "Add Event"}
        </button>
        <a href="/admin/events" className="btn-ghost px-8 py-3">Cancel</a>
      </div>
    </form>
  );
}
