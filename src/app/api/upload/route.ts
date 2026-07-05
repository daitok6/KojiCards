import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { issueSignedToken } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEOS = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadPresignedBody;

  try {
    const jsonResponse = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname) => {
        const session = await auth();
        if (!session?.user) throw new Error("Unauthorized");

        const token = await issueSignedToken({
          operations: ["put"],
          allowedContentTypes: [...ALLOWED_IMAGES, ...ALLOWED_VIDEOS],
          maximumSizeInBytes: 50 * 1024 * 1024,
          pathname,
        });

        return {
          token,
          urlOptions: { addRandomSuffix: true },
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
