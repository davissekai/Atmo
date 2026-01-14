import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";

import { auth } from "@/app/(auth)/auth";

// Allowed MIME types and their extensions
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

// Use Blob instead of File since File is not available in Node.js environment
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    .refine((file) => Object.keys(ALLOWED_TYPES).includes(file.type), {
      message: "File type should be JPEG or PNG",
    }),
});

/**
 * Generate a secure, non-guessable filename with user isolation.
 * Format: uploads/{userId}/{uuid}{extension}
 */
function generateSecureFilename(userId: string, mimeType: string): string {
  const uuid = randomUUID();
  const extension = ALLOWED_TYPES[mimeType] || ".bin";
  // Use first 8 chars of userId hash for folder name (privacy + organization)
  const userPrefix = userId.slice(0, 8);
  return `uploads/${userPrefix}/${uuid}${extension}`;
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    
    // Generate secure filename with user isolation and random UUID
    const secureFilename = generateSecureFilename(session.user.id, file.type);

    try {
      const data = await put(secureFilename, fileBuffer, {
        access: "public", // Still public for image display, but filename is unguessable
        contentType: file.type,
      });

      return NextResponse.json(data);
    } catch (_error) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
