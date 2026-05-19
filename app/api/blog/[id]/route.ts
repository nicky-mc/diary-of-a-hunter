// src/app/api/blog/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/app/models/blogPost";
import { MongoError } from "mongodb";

// Strictly define the shape of the update body
interface UpdateBlogBody {
  title?: string;
  content?: string;
  tags?: string | string[];
  excerpt?: string;
  coverImage?: {
    url: string;
    altText: string;
  };
  isPublished?: boolean;
}

// Next.js dynamic route params are Promises in Next 16
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
    const post = await BlogPost.findById(id).lean();

    if (!post) {
      return NextResponse.json(
        { error: "Report not found. The signal may have been jammed." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (error: unknown) {
    console.error("Blog GET Error:", error);
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
    const body = (await req.json()) as UpdateBlogBody;

    await dbConnect();

    // Parse tags safely (same logic as POST)
    let parsedTags: string[] | undefined;
    if (body.tags !== undefined) {
      parsedTags = Array.isArray(body.tags)
        ? body.tags
        : typeof body.tags === "string"
          ? body.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [];
    }

    const updates: Record<string, unknown> = { ...body };
    if (parsedTags !== undefined) updates.tags = parsedTags;

    // Regenerate slug if the title changed
    if (body.title) {
      updates.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return NextResponse.json(
        { error: "Target not found. Update aborted." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, post: updatedPost },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Blog PUT Error:", error);
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
    const deletedPost = await BlogPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json(
        { error: "Target already destroyed or missing." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Report permanently purged." },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Blog DELETE Error:", error);
    return NextResponse.json(
      { error: "Purge failed. Intel is stuck." },
      { status: 500 },
    );
  }
}
