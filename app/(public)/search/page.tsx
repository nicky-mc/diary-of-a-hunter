// src/app/(public)/search/page.tsx
//
// Unified search across blog posts and wiki entries.
//
// Reads the query from ?q= and runs $text searches against both
// collections in parallel. Results are sorted by MongoDB's textScore
// so the most relevant matches surface first.
//
// Type filter: ?type=blog or ?type=wiki limits to one collection.

import Link from "next/link";
import Image from "next/image";
import { Search, ShieldAlert, FileImage, BookOpen, ScrollText } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/app/models/blogPost";
import WikiEntry from "@/app/models/wikiEntry";
import { ensureSearchIndexes } from "@/lib/ensureSearchIndexes";

export const metadata = {
  title: "Search | Diary of a Hunter",
  description: "Cross-reference the archives and field notes.",
};

// Don't statically generate this — query changes per request
export const dynamic = "force-dynamic";

// =============================================================================
// Search hit shapes
// =============================================================================

interface BlogHit {
  _id: { toString(): string };
  title: string;
  slug: string;
  excerpt?: string;
  tags: string[];
  publishedAt: Date;
  coverImage?: { url: string; altText: string };
  score: number;
}

interface WikiHit {
  _id: { toString(): string };
  title: string;
  slug: string;
  category: string;
  threatLevel: string;
  coverImage?: { url: string; altText: string };
  score: number;
}

// =============================================================================
// Search box (rendered at the top of the results page so the user can refine
// without going back to the nav)
// =============================================================================

function SearchBox({ defaultValue }: { defaultValue: string }) {
  return (
    <form
      action="/search"
      method="get"
      className="flex items-center gap-2 max-w-2xl"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search the archives…"
          autoFocus
          className="w-full rounded border border-hunter-warm/40 bg-white/80 dark:bg-hunter-shadow pl-9 pr-3 py-2 text-sm focus:border-hunter-warm focus:ring-1 focus:ring-hunter-warm outline-none"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-hunter-mid hover:bg-hunter-warm text-hunter-parchment px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
      >
        Hunt
      </button>
    </form>
  );
}

// =============================================================================
// Page
// =============================================================================

type SearchPageProps = {
  searchParams: Promise<{ q?: string; type?: string }>;
};

export default async function SearchPage(props: SearchPageProps) {
  const params = await props.searchParams;
  const rawQuery = params.q?.trim() ?? "";
  const type = params.type === "blog" || params.type === "wiki" ? params.type : "all";

  // Below 2 chars MongoDB text search returns nothing useful — just show the
  // empty state instead of querying.
  const hasQuery = rawQuery.length >= 2;

  // Run both queries in parallel when needed
  let blogHits: BlogHit[] = [];
  let wikiHits: WikiHit[] = [];

  if (hasQuery) {
    await dbConnect();
    // First call hits Mongo to create the text indexes; subsequent calls
    // are a cached no-op for the lifetime of the Node process.
    await ensureSearchIndexes();

    const blogPromise =
      type !== "wiki"
        ? BlogPost.find(
            { $text: { $search: rawQuery }, isPublished: true },
            { score: { $meta: "textScore" } },
          )
            .select("title slug excerpt tags publishedAt coverImage")
            .sort({ score: { $meta: "textScore" } })
            .limit(20)
            .lean<BlogHit[]>()
        : Promise.resolve([]);

    const wikiPromise =
      type !== "blog"
        ? WikiEntry.find(
            { $text: { $search: rawQuery } },
            { score: { $meta: "textScore" } },
          )
            .select("title slug category threatLevel coverImage")
            .sort({ score: { $meta: "textScore" } })
            .limit(20)
            .lean<WikiHit[]>()
        : Promise.resolve([]);

    [blogHits, wikiHits] = await Promise.all([blogPromise, wikiPromise]);
  }

  const totalCount = blogHits.length + wikiHits.length;

  return (
    <div className="min-h-screen bg-hunter-parchment dark:bg-hunter-void py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <header className="space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold uppercase tracking-tight text-hunter-dark dark:text-hunter-parchment flex items-center gap-3">
            <Search className="h-8 w-8 text-hunter-warm" />
            Search the Archive
          </h1>

          <SearchBox defaultValue={rawQuery} />

          {/* Type filter chips */}
          {hasQuery && (
            <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-widest">
              <Link
                href={`/search?q=${encodeURIComponent(rawQuery)}`}
                className={`px-3 py-1 rounded-full border ${
                  type === "all"
                    ? "bg-hunter-warm text-hunter-parchment border-hunter-warm"
                    : "border-hunter-warm/40 text-slate-600 dark:text-slate-400 hover:border-hunter-warm"
                }`}
              >
                Everything ({totalCount})
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(rawQuery)}&type=wiki`}
                className={`px-3 py-1 rounded-full border ${
                  type === "wiki"
                    ? "bg-hunter-warm text-hunter-parchment border-hunter-warm"
                    : "border-hunter-warm/40 text-slate-600 dark:text-slate-400 hover:border-hunter-warm"
                }`}
              >
                Wiki ({wikiHits.length})
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(rawQuery)}&type=blog`}
                className={`px-3 py-1 rounded-full border ${
                  type === "blog"
                    ? "bg-hunter-warm text-hunter-parchment border-hunter-warm"
                    : "border-hunter-warm/40 text-slate-600 dark:text-slate-400 hover:border-hunter-warm"
                }`}
              >
                Field Notes ({blogHits.length})
              </Link>
            </div>
          )}
        </header>

        {/* Empty state — no query yet */}
        {!hasQuery && (
          <div className="border-2 border-dashed border-hunter-warm/30 rounded-lg p-12 text-center">
            <Search className="h-10 w-10 mx-auto text-hunter-warm/60 mb-4" />
            <p className="font-mono text-slate-500 italic">
              {rawQuery.length === 0
                ? "Type something to start hunting."
                : "Need at least 2 characters to narrow the search."}
            </p>
          </div>
        )}

        {/* No results */}
        {hasQuery && totalCount === 0 && (
          <div className="border-2 border-dashed border-hunter-warm/30 rounded-lg p-12 text-center">
            <p className="font-mono text-slate-500 italic">
              No matches for &ldquo;{rawQuery}&rdquo;. The archive is quiet.
            </p>
          </div>
        )}

        {/* Wiki results */}
        {wikiHits.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl uppercase tracking-widest text-hunter-mid dark:text-hunter-gold border-b-2 border-hunter-warm pb-2 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Lore Wiki
            </h2>
            <ul className="not-prose divide-y divide-hunter-warm/20 border border-hunter-warm/20 rounded-lg overflow-hidden bg-white/40 dark:bg-hunter-night/30">
              {wikiHits.map((hit) => (
                <li key={hit._id.toString()}>
                  <Link
                    href={`/wiki/${hit.slug}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-hunter-warm/10 transition-colors group"
                  >
                    <div className="relative shrink-0 h-16 w-16 overflow-hidden rounded border border-hunter-warm/30 bg-black/5 dark:bg-black/30">
                      {hit.coverImage?.url ? (
                        <Image
                          src={hit.coverImage.url}
                          alt={hit.coverImage.altText || hit.title}
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

                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg text-hunter-dark dark:text-hunter-parchment group-hover:text-hunter-warm dark:group-hover:text-hunter-gold truncate">
                        {hit.title}
                      </p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                        {hit.category} · Threat: {hit.threatLevel}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-widest text-red-700 dark:text-red-500 flex items-center gap-1 whitespace-nowrap">
                      <ShieldAlert className="h-3 w-3" />
                      {hit.threatLevel}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Blog results */}
        {blogHits.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl uppercase tracking-widest text-hunter-mid dark:text-hunter-gold border-b-2 border-hunter-warm pb-2 mb-4 flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Field Notes
            </h2>
            <ul className="not-prose divide-y divide-hunter-warm/20 border border-hunter-warm/20 rounded-lg overflow-hidden bg-white/40 dark:bg-hunter-night/30">
              {blogHits.map((hit) => (
                <li key={hit._id.toString()}>
                  <Link
                    href={`/blog/${hit.slug}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-hunter-warm/10 transition-colors group"
                  >
                    <div className="relative shrink-0 h-16 w-16 overflow-hidden rounded border border-hunter-warm/30 bg-black/5 dark:bg-black/30">
                      {hit.coverImage?.url ? (
                        <Image
                          src={hit.coverImage.url}
                          alt={hit.coverImage.altText || hit.title}
                          fill
                          sizes="64px"
                          className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-hunter-warm/50">
                          <ScrollText className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-lg text-hunter-dark dark:text-hunter-parchment group-hover:text-hunter-warm dark:group-hover:text-hunter-gold truncate">
                        {hit.title}
                      </p>
                      {hit.excerpt && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {hit.excerpt}
                        </p>
                      )}
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-0.5">
                        {new Date(hit.publishedAt).toLocaleDateString()}
                        {hit.tags.length > 0 && ` · ${hit.tags.join(", ")}`}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
