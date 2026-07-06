import { issueSignedToken, presignUrl } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

// Proxies private Vercel Blob URLs server-side so the browser can display them.
// Only accepts *.private.blob.vercel-storage.com to prevent SSRF.
const PRIVATE_BLOB_PATTERN = /^https:\/\/[a-z0-9]+\.private\.blob\.vercel-storage\.com\//;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !PRIVATE_BLOB_PATTERN.test(url)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Extract the pathname (strip leading /) from the private blob URL.
  const pathname = new URL(url).pathname.slice(1);

  // Issue a short-lived delegation token for GET and build a presigned URL.
  // The presigned URL has auth embedded so no Authorization header is needed.
  const token = await issueSignedToken({
    operations: ["get"],
    pathname,
    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  const { presignedUrl } = await presignUrl(token, {
    operation: "get",
    pathname,
    access: "private",
  });

  // Fetch the presigned URL and stream it back — no auth header needed.
  const res = await fetch(presignedUrl);

  if (!res.ok) {
    return new NextResponse(null, { status: res.status });
  }

  const contentType = res.headers.get("content-type") ?? "application/octet-stream";

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
