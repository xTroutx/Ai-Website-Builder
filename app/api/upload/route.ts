import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@/auth";

/**
 * Vercel Blob client-upload handler. The browser uploads the file directly to
 * Blob (so large videos bypass the serverless body limit); this route only mints
 * a short-lived upload token. We authenticate at token time (logged-in captains
 * only). The upload-completed callback is verified by Blob's signature, so this
 * path is allowed through the proxy without a session.
 *
 * Requires BLOB_READ_WRITE_TOKEN (set when you create a Blob store in Vercel).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth();
        if (!session?.user) throw new Error("You must be signed in to upload.");
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/avif",
            "video/mp4",
            "video/webm",
            "video/quicktime",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 200 * 1024 * 1024, // 200 MB
        };
      },
      onUploadCompleted: async () => {
        // No-op: the editor sets media.src from the returned URL.
      },
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
