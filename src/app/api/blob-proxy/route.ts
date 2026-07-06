import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

// Proxies private Vercel Blob URLs server-side so the browser can display them.
// Only accepts *.private.blob.vercel-storage.com to prevent SSRF.
const PRIVATE_BLOB_PATTERN = /^https:\/\/[a-z0-9]+\.private\.blob\.vercel-storage\.com\//;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !PRIVATE_BLOB_PATTERN.test(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const result = await get(url, {
    access: "private",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  if (!result || result.statusCode !== 200) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
