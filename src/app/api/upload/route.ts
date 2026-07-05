import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const ALLOWED_VIDEOS = ["video/mp4", "video/webm", "video/quicktime"];
  const allowed = [...ALLOWED_IMAGES, ...ALLOWED_VIDEOS];

  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM." },
      { status: 400 }
    );
  }

  // 50 MB size cap
  const MAX_BYTES = 50 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 50 MB." },
      { status: 400 }
    );
  }

  const isVideo = ALLOWED_VIDEOS.includes(file.type);
  const folder = isVideo ? "videos" : "cards";

  const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({
    url: blob.url,
    type: isVideo ? "video" : "image",
  });
}
