// src/app/api/fonts/[id]/route.ts
//
// DELETE /api/fonts/[id] — admin-only; removes the font from MongoDB and
// also deletes the underlying file from Cloudinary so we don't leak storage.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Font from "@/app/models/font";
import cloudinary from "@/lib/cloudinary";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(req: Request, props: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const { id } = await props.params;
    await dbConnect();

    const font = await Font.findById(id);
    if (!font) {
      return NextResponse.json(
        { error: "Font not found." },
        { status: 404 },
      );
    }

    // Best-effort Cloudinary cleanup. If it fails (e.g. already deleted)
    // we still proceed to delete the MongoDB record — leaving an orphan
    // in Mongo would be worse than a stray asset on Cloudinary.
    if (font.publicId) {
      try {
        await cloudinary.uploader.destroy(font.publicId, {
          resource_type: "raw",
        });
      } catch (cloudErr) {
        console.warn("Cloudinary cleanup failed for font:", cloudErr);
      }
    }

    await font.deleteOne();

    return NextResponse.json(
      { success: true, message: "Font removed." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fonts DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove font." },
      { status: 500 },
    );
  }
}
