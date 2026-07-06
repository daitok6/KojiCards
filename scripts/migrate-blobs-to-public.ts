/**
 * One-time migration script: re-upload private Vercel Blob images as public blobs
 * and update all DB references.
 *
 * Usage (run against prod env):
 *   npx tsx scripts/migrate-blobs-to-public.ts
 *
 * Required env vars (same as production):
 *   BLOB_READ_WRITE_TOKEN   — Vercel Blob read-write token
 *   DATABASE_URL            — Postgres connection string
 *
 * The script is idempotent: already-public URLs (*.public.blob.vercel-storage.com)
 * are skipped. Run it, verify images load, then delete /api/blob-proxy if desired.
 */

import { put, del } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PRIVATE_HOST = ".private.blob.vercel-storage.com";

/**
 * Fetch bytes from a private Vercel Blob URL using direct bearer auth.
 * Avoids issueSignedToken/presignUrl which require OIDC in non-Vercel environments.
 */
async function fetchPrivateBlob(privateUrl: string): Promise<{ bytes: Buffer; contentType: string }> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is not set");

  const res = await fetch(privateUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch private blob ${privateUrl}: ${res.status}`);

  const contentType = res.headers.get("content-type") ?? "application/octet-stream";
  const arrayBuffer = await res.arrayBuffer();
  return { bytes: Buffer.from(arrayBuffer), contentType };
}

/**
 * Re-upload as a public blob and return the new public URL.
 * Derives the dest pathname from the private URL's path (keeps original filename).
 */
async function reuploadAsPublic(privateUrl: string): Promise<string> {
  const parsed = new URL(privateUrl);
  // e.g. /cards/charizard-abc123.jpg  →  "cards/charizard-abc123.jpg"
  const destPathname = parsed.pathname.slice(1);

  const { bytes, contentType } = await fetchPrivateBlob(privateUrl);

  const result = await put(destPathname, bytes, {
    access: "public",
    addRandomSuffix: false, // preserve the existing filename/path
    contentType,
  });

  return result.url;
}

async function main() {
  console.log("🔍 Scanning DB for private blob URLs…\n");

  const cards = await prisma.card.findMany({ include: { media: true } });

  let migratedCards = 0;
  let migratedMedia = 0;
  let skipped = 0;
  let errors = 0;

  for (const card of cards) {
    // ── Cover image ─────────────────────────────────────────────────────────
    if (card.imageUrl.includes(PRIVATE_HOST)) {
      process.stdout.write(`Card "${card.name}" (${card.id}) cover: ${card.imageUrl}\n  → `);
      try {
        const publicUrl = await reuploadAsPublic(card.imageUrl);
        const oldUrl = card.imageUrl;
        await prisma.card.update({ where: { id: card.id }, data: { imageUrl: publicUrl } });
        // Optionally delete old private blob
        try { await del(oldUrl); } catch { /* best-effort */ }
        console.log(`✅ ${publicUrl}`);
        migratedCards++;
      } catch (err) {
        console.error(`❌ Error: ${(err as Error).message}`);
        errors++;
      }
    } else {
      skipped++;
    }

    // ── Gallery media ────────────────────────────────────────────────────────
    for (const item of card.media) {
      if (item.url.includes(PRIVATE_HOST)) {
        process.stdout.write(`  Media ${item.id} (${item.type}): ${item.url}\n  → `);
        try {
          const publicUrl = await reuploadAsPublic(item.url);
          const oldUrl = item.url;
          await prisma.cardMedia.update({ where: { id: item.id }, data: { url: publicUrl } });
          try { await del(oldUrl); } catch { /* best-effort */ }
          console.log(`✅ ${publicUrl}`);
          migratedMedia++;
        } catch (err) {
          console.error(`❌ Error: ${(err as Error).message}`);
          errors++;
        }
      } else {
        skipped++;
      }
    }
  }

  console.log(`
────────────────────────────────────────
Done.
  Migrated card covers : ${migratedCards}
  Migrated media items : ${migratedMedia}
  Already public (skip): ${skipped}
  Errors               : ${errors}
────────────────────────────────────────`);

  if (errors > 0) {
    console.error("\n⚠️  Some items failed — re-run the script to retry (it is idempotent).");
    process.exit(1);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
