export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { VendorInfoForm } from "@/components/admin/VendorInfoForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Info Settings" };

export default async function SettingsPage() {
  const info = await prisma.vendorInfo.findUnique({ where: { id: "singleton" } });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/admin" className="text-white/40 hover:text-white text-sm no-underline">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-white mt-4">Contact Info</h1>
        <p className="text-white/40 mt-1">
          Shown publicly on the Contact page. All fields are optional.
        </p>
      </div>
      <VendorInfoForm info={info} />
    </div>
  );
}
