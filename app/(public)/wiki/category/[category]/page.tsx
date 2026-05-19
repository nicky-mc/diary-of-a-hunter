// src/app/(public)/wiki/category/[category]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert, FileImage } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import WikiEntry from "@/app/models/wikiEntry";

// Must match the enum in app/models/wikiEntry.ts
const VALID_CATEGORIES = [
  "bestiary",
  "weapons",
  "bloodlines",
  "conspiracy",
] as const;

type CategoryKey = (typeof VALID_CATEGORIES)[number];

// Human-readable titles for each category slug
const CATEGORY_TITLES: Record<CategoryKey, string> = {
  bestiary: "Bestiary",
  weapons: "Silver & Steel",
  bloodlines: "Bloodlines",
  conspiracy: "The Mother's Fire",
};

type PageProps = {
  params: Promise<{ category: string }>;
};

export const revalidate = 60;

// Tell the build what the static set of categories is
export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

// Generate per-category metadata at build time
export async function generateMetadata(props: PageProps) {
  const { category } = await props.params;
  if (!VALID_CATEGORIES.includes(category as CategoryKey)) {
    return { title: "Unknown Archive" };
  }
  return {
    title: `${CATEGORY_TITLES[category as CategoryKey]} | The Archives`,
  };
}

// Shape of the lean entry list — only the fields we render
interface CategoryEntry {
  _id: { toString(): string };
  title: string;
  slug: string;
  threatLevel: string;
  // Optional — entries created before image upload was wired up won't have one
  coverImage?: {
    url: string;
    altText: string;
  };
}

export default async function CategoryPage(props: PageProps) {
  const { category } = await props.params;

  // Guard the URL — only known categories load real data
  if (!VALID_CATEGORIES.includes(category as CategoryKey)) {
    notFound();
  }

  const typedCategory = category as CategoryKey;

  await dbConnect();

  const entries = await WikiEntry.find({ category: typedCategory })
    .select("title slug threatLevel coverImage")
    .sort({ title: 1 })
    .lean<CategoryEntry[]>();

  return (
    <div className="min-h-screen bg-hunter-parchment dark:bg-hunter-void py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/wiki"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-hunter-warm hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Archives
        </Link>

        <header className="border-b-2 border-hunter-warm/40 pb-6 mb-10">
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-slate-500">
            Category Filter
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold uppercase italic text-hunter-dark dark:text-hunter-parchment mt-2">
            {CATEGORY_TITLES[typedCategory]}
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 font-mono">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} on
            record
          </p>
        </header>

        {entries.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-hunter-warm/30 rounded">
            <ShieldAlert className="h-10 w-10 mx-auto text-hunter-warm mb-4" />
            <p className="font-mono text-slate-500 italic">
              No files in this archive yet. The hunt continues.
            </p>
          </div>
        ) : (
          <ul className="not-prose divide-y divide-hunter-warm/20 dark:divide-slate-800 border border-hunter-warm/20 dark:border-slate-800 rounded-lg overflow-hidden bg-white/40 dark:bg-hunter-night/30">
            {entries.map((entry) => (
              <li key={entry._id.toString()}>
                <Link
                  href={`/wiki/${entry.slug}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-hunter-warm/10 dark:hover:bg-hunter-gold/5 transition-colors group"
                >
                  {/* Thumbnail — falls back to a placeholder icon block when
                      the entry has no cover image yet. Fixed 64×64 keeps
                      every row the same height. */}
                  <div className="relative shrink-0 h-16 w-16 overflow-hidden rounded border border-hunter-warm/30 bg-black/5 dark:bg-black/30">
                    {entry.coverImage?.url ? (
                      <Image
                        src={entry.coverImage.url}
                        alt={entry.coverImage.altText || entry.title}
                        fill
                        sizes="64px"
                        className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-hunter-warm/50">
                        <FileImage className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <span className="flex-1 font-serif text-lg text-hunter-dark dark:text-hunter-parchment group-hover:text-hunter-warm dark:group-hover:text-hunter-gold">
                    {entry.title}
                  </span>

                  <span className="text-[10px] font-mono uppercase tracking-widest text-red-700 dark:text-red-500 flex items-center gap-1 whitespace-nowrap">
                    <ShieldAlert className="h-3 w-3" />
                    {entry.threatLevel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
