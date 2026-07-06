import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 50 MB)" }, { status: 400 });
  }

  const isVideo = file.type.startsWith("video/");
  const folder = isVideo ? "videos" : "cards";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  const blob = await put(`${folder}/${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
