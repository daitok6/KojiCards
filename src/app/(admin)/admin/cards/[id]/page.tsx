import { notFound } from "next/navigation";
import Link from "next/link";
import { getCard } from "@/lib/cards";
import { CardForm } from "@/components/admin/CardForm";
import type { Card } from "@/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const card = await getCard(id);
  return { title: card ? `Edit ${card.name}` : "Card Not Found" };
}

export default async function EditCardPage({ params }: PageProps) {
  const { id } = await params;
  const card = await getCard(id);
  if (!card) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/admin" className="text-white/40 hover:text-white text-sm no-underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-white mt-4">Edit Card</h1>
        <p className="text-white/40 mt-1">{card.name}</p>
      </div>
      <CardForm card={card as unknown as Card} />
    </div>
  );
}
