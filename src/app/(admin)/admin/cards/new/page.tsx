import Link from "next/link";
import { CardForm } from "@/components/admin/CardForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Card" };

export default function NewCardPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/admin" className="text-white/40 hover:text-white text-sm no-underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-white mt-4">Add New Card</h1>
      </div>
      <CardForm />
    </div>
  );
}
