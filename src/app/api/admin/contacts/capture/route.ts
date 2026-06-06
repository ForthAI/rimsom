import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { checkAuth } from "@/lib/admin-auth";
import { extractContactFromCard } from "@/lib/card-extract";
import { findContactByEmail } from "@/lib/contacts";

export const runtime = "nodejs";
// Allow up to 30s for the model call.
export const maxDuration = 30;

/**
 * Quick-capture endpoint. Takes a single business-card photo, uploads
 * the original to Vercel Blob, runs Claude vision over it, and returns
 * structured contact fields ready for the intern to review before save.
 *
 * Body: multipart/form-data with a single `image` file (JPEG/PNG/WebP).
 *
 * Response:
 *   {
 *     extracted: ContactInput,
 *     photoUrl: string,
 *     duplicate?: { rowIndex, firstName, surname, email } // if email already exists
 *   }
 */
export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "image is required." }, { status: 400 });
    }
    const mediaType = (file.type || "").toLowerCase();
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mediaType)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${mediaType}` },
        { status: 400 }
      );
    }

    // Read the bytes once; we need them for both Blob upload and the model call.
    const buf = Buffer.from(await file.arrayBuffer());

    // Upload to Vercel Blob first so we have an archive even if extraction fails.
    // Path includes a timestamp for stable ordering and uniqueness.
    const ts = Date.now();
    const ext = mediaType.split("/")[1].replace("jpeg", "jpg");
    const blobPath = `cards/${ts}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    let photoUrl = "";
    try {
      const uploaded = await put(blobPath, buf, {
        access: "public",
        contentType: mediaType,
      });
      photoUrl = uploaded.url;
    } catch (err) {
      console.error("Blob upload failed:", err);
      // Non-fatal — proceed with extraction without an archived URL.
    }

    // Send to Claude.
    const extracted = await extractContactFromCard(
      buf.toString("base64"),
      mediaType as "image/jpeg" | "image/png" | "image/webp" | "image/gif"
    );

    // Stamp the photo URL onto the returned contact data so it's saved
    // alongside the rest of the fields if the intern hits Save.
    if (photoUrl) extracted.cardPhoto = photoUrl;

    // Optional duplicate check: if the extracted email already exists,
    // surface the existing contact so the UI can offer "update existing"
    // instead of just throwing later when they hit Save.
    let duplicate:
      | { rowIndex: number; firstName: string; surname: string; email: string }
      | undefined;
    if (extracted.email) {
      const existing = await findContactByEmail(extracted.email);
      if (existing) {
        duplicate = {
          rowIndex: existing.rowIndex,
          firstName: existing.firstName,
          surname: existing.surname,
          email: existing.email,
        };
      }
    }

    return NextResponse.json({
      extracted,
      photoUrl,
      duplicate,
    });
  } catch (error) {
    console.error("Card capture error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to extract contact.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
