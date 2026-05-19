// src/app/api/blog/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/app/models/blogPost";
import { MongoError } from "mongodb";

// Shape of the incoming body for a new post
interface CreateBlogBody {
  title: string;
  content: string;
  tags?: string | string[];
  excerpt?: string;
  coverImage?: {
    url: string;
    altText: string;
  };
  isPublished?: boolean;
}

// ----------------------------------------------------------------------
// CREATE (POST): File a new field report
// ----------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Step away from the terminal." },
        { status: 401 },
      );
    }

    const body = (await req.json()) as CreateBlogBody;
    const { title, content, tags, excerpt, coverImage, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are mandatory." },
        { status: 400 },
      );
    }

    await dbConnect();

    // Slugify the title for human-readable URLs
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Tags may arrive as a comma-separated string from the form,
    // or as an array from a future API client. Handle both safely.
    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

    // Auto-generate excerpt from content if not provided (strip HTML, trim)
    const autoExcerpt =
      excerpt ||
      content
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 200);

    const newPost = await BlogPost.create({
      title,
      slug,
      content,
      excerpt: autoExcerpt,
      tags: parsedTags,
      coverImage,
      isPublished: isPublished ?? true,
      publishedAt: new Date(),
      authorId: session.user.id,
    });

    return NextResponse.json(
      { success: true, post: newPost },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Blog POST Error:", error);

    if (error instanceof Error && (error as MongoError).code === 11000) {
      return NextResponse.json(
        { error: "A report with this designation already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Database link severed. The transmission failed." },
      { status: 500 },
    );
  }
}

// ----------------------------------------------------------------------
// READ ALL (GET): Retrieve published field reports
// ----------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const includeDrafts = searchParams.get("drafts") === "true";

    // Drafts are admin-only. Anyone asking for them must be authenticated.
    const baseQuery: Record<string, unknown> = {};
    if (!includeDrafts) {
      baseQuery.isPublished = true;
    } else {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Unauthorized. Drafts are classified." },
          { status: 401 },
        );
      }
    }

    if (tag) {
      baseQuery.tags = tag;
    }

    // Trim content from list payloads — keeps it light
    const posts = await BlogPost.find(baseQuery)
      .select("-content")
      .sort({ publishedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, posts }, { status: 200 });
  } catch (error: unknown) {
    console.error("Blog GET Error:", error);
    return NextResponse.json(
      { error: "Failed to access the archives." },
      { status: 500 },
    );
  }
}
