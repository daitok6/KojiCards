import Link from "next/link";
import { EventForm } from "@/components/admin/EventForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Event" };

export default function NewEventPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/admin/events" className="text-white/40 hover:text-white text-sm no-underline">
          ← Back to Events
        </Link>
        <h1 className="text-3xl font-black text-white mt-4">Add New Event</h1>
      </div>
      <EventForm />
    </div>
  );
}
