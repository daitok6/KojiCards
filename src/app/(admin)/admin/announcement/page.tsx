export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Home Banner" };

export default async function AnnouncementPage() {
  const announcement = await prisma.announcement.findUnique({ where: { id: "singleton" } });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/admin" className="text-white/40 hover:text-white text-sm no-underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-white mt-4">Home Banner</h1>
        <p className="text-white/40 mt-1">
          A dismissible announcement strip shown at the top of the home page.
        </p>
      </div>
      <AnnouncementForm announcement={announcement} />
    </div>
  );
}
