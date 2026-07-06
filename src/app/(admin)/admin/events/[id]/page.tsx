import { notFound } from "next/navigation";
import Link from "next/link";
import { getEvent } from "@/lib/events";
import { EventForm } from "@/components/admin/EventForm";
import type { Event } from "@/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  return { title: event ? `Edit ${event.name}` : "Event Not Found" };
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/admin/events" className="text-white/40 hover:text-white text-sm no-underline">
          ← Back to Events
        </Link>
        <h1 className="text-3xl font-black text-white mt-4">Edit Event</h1>
        <p className="text-white/40 mt-1">{event.name}</p>
      </div>
      <EventForm event={event as unknown as Event} />
    </div>
  );
}
