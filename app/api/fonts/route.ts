// src/app/api/fonts/route.ts
//
// GET  /api/fonts  — list every uploaded font (public; the editor toolbar
//                    needs the list to populate its dropdown for everyone)
// POST /api/fonts  — admin-only; receives a multipart upload with a font file,
//                    forwards it to Cloudinary as a raw asset, and saves
//                    metadata to MongoDB.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Font, { IFont } from "@/app/models/font";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

// Accept the common web-font formats. woff2 is preferred (best compression,
// universal browser support); the others stay in for backwards compat.
const ALLOWED_EXTENSIONS = ["woff2", "woff", "ttf", "otf"] as const;
const MAX_BYTES = 5_000_000; // 5MB — most fonts are under 200KB

// Slugify "Eldritch Display Pro" → "eldritch-display-pro" so the value
// works as a CSS font-family and a Cloudinary public_id.
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// =============================================================================
// GET — list fonts
// =============================================================================

export async function GET() {
  try {
    await dbConnect();
    const fonts = await Font.find()
      .select("name family fileUrl weight style fileSize createdAt")
      .sort({ name: 1 })
      .lean();
    return NextResponse.json({ success: true, fonts }, { status: 200 });
  } catch (error) {
    console.error("Fonts GET error:", error);
    return NextResponse.json(
      { error: "Failed to load fonts." },
      { status: 500 },
    );
  }
}

// =============================================================================
// POST — upload a new font
// =============================================================================

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    // Multipart form: `name` + `file` are required
    const formData = await req.formData();
    const name = (formData.get("name") as string | null)?.trim() ?? "";
    const weight = (formData.get("weight") as string | null)?.trim() || "400";
    const style = (formData.get("style") as string | null)?.trim() || "normal";
    const file = formData.get("file");

    if (!name) {
      return NextResponse.json(
        { error: "Font name is required." },
        { status: 400 },
      );
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "No font file uploaded." },
        { status: 400 },
      );
    }

    // Validate extension + size
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
      return NextResponse.json(
        {
          error: `Unsupported format. Use one of: ${ALLOWED_EXTENSIONS.join(", ")}`,
        },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_BYTES / 1_000_000}MB).` },
        { status: 400 },
      );
    }

    await dbConnect();

    const family = slugify(name);

    // Reject if a font with this slug already exists
    const existing = await Font.findOne({ family });
    if (existing) {
      return NextResponse.json(
        {
          error: `A font with the family name "${family}" already exists.`,
        },
        { status: 409 },
      );
    }

    // Stream the file buffer to Cloudinary as a raw asset.
    // resource_type: "raw" tells Cloudinary not to try image processing —
    // it accepts any file and serves it back at the same URL.
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "doah/fonts",
            public_id: family,
            // Stamp the .woff2 (or whatever) extension onto the URL so the
            // browser still sniffs the right Content-Type when loading.
            format: ext,
          },
          (err, result) => {
            if (err || !result) reject(err ?? new Error("Upload failed"));
            else resolve(result);
          },
        );
        stream.end(buffer);
      },
    );

    const newFont = await Font.create({
      name,
      family,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      weight,
      style,
      fileSize: file.size,
    });

    return NextResponse.json(
      { success: true, font: newFont as IFont },
      { status: 201 },
    );
  } catch (error) {
    console.error("Fonts POST error:", error);
    return NextResponse.json(
      { error: "Font upload failed. The signal scrambled." },
      { status: 500 },
    );
  }
}
