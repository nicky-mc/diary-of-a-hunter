// src/app/admin/manage/page.tsx
//
// Lists every blog post and wiki entry with edit + delete actions.
// Data is loaded server-side, then a small client component handles the
// delete confirmation flow against the existing API routes.

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/app/models/blogPost";
import WikiEntry from "@/app/models/wikiEntry";
import DeleteButton from "./DeleteButton";

export const metadata = {
  title: "Manage Archives | Restricted",
};

export const dynamic = "force-dynamic";

// Shape returned by .lean() — only the fields the table needs
interface BlogRow {
  _id: { toString(): string };
  title: string;
  slug: string;
  isPublished: boolean;
  publishedAt: Date;
}

interface WikiRow {
  _id: { toString(): string };
  title: string;
  slug: string;
  category: string;
  threatLevel: string;
  updatedAt: Date;
}

export default async function ManageArchivesPage() {
  await dbConnect();

  const [posts, entries] = await Promise.all([
    BlogPost.find()
      .select("title slug isPublished publishedAt")
      .sort({ publishedAt: -1 })
      .lean<BlogRow[]>(),
    WikiEntry.find()
      .select("title slug category threatLevel updatedAt")
      .sort({ title: 1 })
      .lean<WikiRow[]>(),
  ]);

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <header>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-hunter-warm hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Command Center
          </Link>
          <h1 className="font-serif text-4xl font-bold uppercase tracking-widest text-hunter-mid dark:text-hunter-gold">
            Manage Archives
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Review, edit, or purge any record from the database.
          </p>
        </header>

        {/* ====================================================================
            FIELD NOTES (blog posts)
            ==================================================================== */}
        <section>
          <div className="flex items-baseline justify-between border-b-2 border-hunter-warm pb-2 mb-4">
            <h2 className="font-serif text-2xl uppercase tracking-widest text-hunter-mid dark:text-hunter-gold">
              Field Notes
            </h2>
            <span className="font-mono text-xs text-slate-500">
              {posts.length} {posts.length === 1 ? "report" : "reports"}
            </span>
          </div>

          {posts.length === 0 ? (
            <p className="font-mono italic text-slate-500">
              No field reports filed yet.
            </p>
          ) : (
            <ul className="divide-y divide-hunter-warm/20 border border-hunter-warm/20 rounded-lg overflow-hidden bg-white/40 dark:bg-hunter-night/30">
              {posts.map((post) => {
                const id = post._id.toString();
                return (
                  <li
                    key={id}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-hunter-warm/5 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-base text-hunter-dark dark:text-hunter-parchment truncate">
                        {post.title}
                      </p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                        {post.isPublished ? "Published" : "Draft"} ·{" "}
                        {new Date(post.publishedAt).toLocaleDateString()} ·{" "}
                        /blog/{post.slug}
                      </p>
                    </div>
                    <Link
                      href={`/admin/blog/${post.slug}/edit`}
                      className="inline-flex items-center gap-1 rounded border border-hunter-warm/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-hunter-warm hover:bg-hunter-warm/10 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <DeleteButton
                      kind="blog"
                      id={id}
                      title={post.title}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ====================================================================
            WIKI ENTRIES
            ==================================================================== */}
        <section>
          <div className="flex items-baseline justify-between border-b-2 border-hunter-warm pb-2 mb-4">
            <h2 className="font-serif text-2xl uppercase tracking-widest text-hunter-mid dark:text-hunter-gold">
              Lore Wiki
            </h2>
            <span className="font-mono text-xs text-slate-500">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {entries.length === 0 ? (
            <p className="font-mono italic text-slate-500">
              No wiki entries yet.
            </p>
          ) : (
            <ul className="divide-y divide-hunter-warm/20 border border-hunter-warm/20 rounded-lg overflow-hidden bg-white/40 dark:bg-hunter-night/30">
              {entries.map((entry) => {
                const id = entry._id.toString();
                return (
                  <li
                    key={id}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-hunter-warm/5 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-base text-hunter-dark dark:text-hunter-parchment truncate">
                        {entry.title}
                      </p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                        {entry.category} · Threat: {entry.threatLevel} ·{" "}
                        /wiki/{entry.slug}
                      </p>
                    </div>
                    <Link
                      href={`/admin/wiki/${entry.slug}/edit`}
                      className="inline-flex items-center gap-1 rounded border border-hunter-warm/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-hunter-warm hover:bg-hunter-warm/10 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Link>
                    <DeleteButton
                      kind="wiki"
                      id={id}
                      title={entry.title}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
