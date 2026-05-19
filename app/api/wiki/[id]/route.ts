// src/app/api/wiki/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import WikiEntry from "@/app/models/wikiEntry";
import { MongoError } from "mongodb";

// Strictly define the shape of the update body
interface UpdateWikiBody {
  title?: string;
  category?: string;
  threatLevel?: string;
  weaknesses?: string | string[];
  content?: string;
  // Pass `null` to explicitly remove an existing cover image;
  // omit to leave it untouched.
  coverImage?: {
    url: string;
    altText: string;
  } | null;
}

// Next.js dynamic route params are now Promises in recent versions
type RouteContext = {
  params: Promise<{ id: string }>;
};

// ----------------------------------------------------------------------
// READ ONE (GET)
// ----------------------------------------------------------------------
export async function GET(req: Request, props: RouteContext) {
  try {
    const params = await props.params;
    const id = params.id;

    await dbConnect();
    const entry = await WikiEntry.findById(id).lean();

    if (!entry) {
      return NextResponse.json(
        { error: "File not found. It may have been purged." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, entry }, { status: 200 });
  } catch (error: unknown) {
    console.error("Wiki GET Error:", error);
    return NextResponse.json(
      { error: "Failed to decrypt the file." },
      { status: 500 },
    );
  }
}

// ----------------------------------------------------------------------
// UPDATE (PUT)
// ----------------------------------------------------------------------
export async function PUT(req: Request, props: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Step away from the terminal." },
        { status: 401 },
      );
    }

    const params = await props.params;
    const id = params.id;
    const body = (await req.json()) as UpdateWikiBody;

    await dbConnect();

    // Parse weaknesses safely
    let parsedWeaknesses: string[] = [];
    if (body.weaknesses) {
      parsedWeaknesses =
        typeof body.weaknesses === "string"
          ? body.weaknesses
              .split(",")
              .map((w) => w.trim())
              .filter(Boolean)
          : body.weaknesses;
    }

    const updatedEntry = await WikiEntry.findByIdAndUpdate(
      id,
      {
        ...body,
        ...(body.weaknesses && { weaknesses: parsedWeaknesses }),
        ...(body.title && {
          slug: body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, ""),
        }),
      },
      { new: true, runValidators: true },
    );

    if (!updatedEntry) {
      return NextResponse.json(
        { error: "Target not found. Update aborted." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, entry: updatedEntry },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error && (error as MongoError).code === 11000) {
      return NextResponse.json(
        { error: "Title conflict. Designation already in use." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Server malfunction during update." },
      { status: 500 },
    );
  }
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------
export async function DELETE(req: Request, props: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized clearance." },
        { status: 401 },
      );
    }

    const params = await props.params;
    const id = params.id;

    await dbConnect();
    const deletedEntry = await WikiEntry.findByIdAndDelete(id);

    if (!deletedEntry) {
      return NextResponse.json(
        { error: "Target already destroyed or missing." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "File permanently purged." },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Purge failed. Intel is stuck." },
      { status: 500 },
    );
  }
}
