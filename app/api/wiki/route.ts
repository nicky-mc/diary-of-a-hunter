// src/app/api/wiki/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import WikiEntry from "@/app/models/wikiEntry";
import { MongoError } from "mongodb";

// Interface for the Wiki Creation data
interface CreateWikiBody {
  title: string;
  category: "bestiary" | "weapons" | "bloodlines" | "conspiracy";
  threatLevel?: string;
  weaknesses?: string | string[];
  content: string;
  coverImage?: {
    url: string;
    altText: string;
  };
}

// ----------------------------------------------------------------------
// CREATE (POST): Add a new entity to the archive
// ----------------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // session.user.id is now valid thanks to our earlier module augmentation
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Step away from the terminal." },
        { status: 401 },
      );
    }

    const body = (await req.json()) as CreateWikiBody;
    const { title, category, threatLevel, weaknesses, content, coverImage } =
      body;

    if (!title || !category || !content) {
      return NextResponse.json(
        { error: "Title, category, and content are mandatory." },
        { status: 400 },
      );
    }

    await dbConnect();

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Safe parsing for weaknesses array
    const parsedWeaknesses = Array.isArray(weaknesses)
      ? weaknesses
      : typeof weaknesses === "string"
        ? weaknesses
            .split(",")
            .map((w) => w.trim())
            .filter(Boolean)
        : [];

    const newEntry = await WikiEntry.create({
      title,
      slug,
      category,
      threatLevel: threatLevel || "Unknown",
      weaknesses: parsedWeaknesses,
      content,
      coverImage,
      authorId: session.user.id,
    });

    return NextResponse.json(
      { success: true, entry: newEntry },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Wiki POST Error:", error);

    if (error instanceof Error && (error as MongoError).code === 11000) {
      return NextResponse.json(
        { error: "A file with this designation already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Database link severed. The archives are locked." },
      { status: 500 },
    );
  }
}

// ----------------------------------------------------------------------
// READ ALL (GET): Retrieve the archive
// ----------------------------------------------------------------------
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query = category ? { category } : {};

    // select("-content") keeps the payload light for directory pages
    const entries = await WikiEntry.find(query)
      .select("-content")
      .sort({ title: 1 }) // Alphabetical usually makes more sense for a Wiki
      .lean();

    return NextResponse.json({ success: true, entries }, { status: 200 });
  } catch (error: unknown) {
    console.error("Wiki GET Error:", error);
    return NextResponse.json(
      { error: "Failed to access the archives." },
      { status: 500 },
    );
  }
}
