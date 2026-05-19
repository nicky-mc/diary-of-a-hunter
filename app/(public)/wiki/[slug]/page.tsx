// src/app/(public)/wiki/[slug]/page.tsx
import dbConnect from "@/lib/mongodb";
import WikiEntry, { IWikiEntry } from "@/app/models/wikiEntry";
import { notFound } from "next/navigation";
import { Skull, ShieldAlert, Zap } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { redirectLegacyIdToSlug } from "@/lib/legacySlugRedirect";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export default async function WikiEntryPage(props: PageProps) {
  const { slug } = await props.params;

  await dbConnect();

  // Honour legacy /wiki/[_id] URLs (from before the slug switch) by
  // 308-redirecting to the canonical slug URL. No-op if `slug` looks
  // like an actual slug.
  await redirectLegacyIdToSlug(WikiEntry, slug, "/wiki");

  // Resolve by slug instead of _id — keeps URLs human-readable and stable
  // across database reseeds. Double-cast kills 'any' on nested fields.
  const entry = (await WikiEntry.findOne({
    slug,
  }).lean()) as unknown as IWikiEntry | null;

  if (!entry) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-hunter-parchment dark:bg-hunter-void py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-10 border-b-4 border-hunter-mid pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-hunter-warm text-hunter-parchment px-3 py-1 text-xs font-bold uppercase tracking-widest">
              {entry.category}
            </span>
            <div className="flex items-center gap-1 text-red-700 dark:text-red-500 font-mono text-xs">
              <ShieldAlert className="h-4 w-4" />
              <span>THREAT: {entry.threatLevel}</span>
            </div>
          </div>
          <h1 className="font-serif text-5xl font-bold text-hunter-dark dark:text-hunter-bone uppercase italic">
            {entry.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tactical Sidebar */}
          <aside className="md:col-span-1 space-y-6">
            {/* Entity photo — only rendered when an image has been uploaded */}
            {entry.coverImage?.url && (
              <figure className="border-2 border-hunter-warm bg-black/5 dark:bg-black/30 overflow-hidden shadow-lg">
                <div className="relative aspect-square w-full">
                  <CldImage
                    src={entry.coverImage.url}
                    alt={entry.coverImage.altText || entry.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale-[30%]"
                  />
                </div>
                <figcaption className="p-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center border-t border-hunter-warm/40">
                  Field Photograph · {entry.title}
                </figcaption>
              </figure>
            )}

            <div className="bg-hunter-bone dark:bg-hunter-night p-6 border-2 border-hunter-warm shadow-inner">
              <h3 className="flex items-center gap-2 font-bold uppercase text-sm mb-4 text-hunter-mid dark:text-hunter-gold">
                <Skull className="h-4 w-4" />
                Critical Weaknesses
              </h3>
              <ul className="space-y-3">
                {entry.weaknesses.map((weakness: string) => (
                  <li
                    key={weakness}
                    className="flex items-center gap-2 text-sm font-mono bg-white/50 dark:bg-black/20 p-2 border-l-4 border-red-600"
                  >
                    <Zap className="h-3 w-3 text-red-600" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Lore Content */}
          <main className="md:col-span-2">
            <div
              className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none prose-headings:font-serif"
              dangerouslySetInnerHTML={{ __html: entry.content }}
            />
          </main>
        </div>

        <footer className="mt-16 pt-8 border-t border-hunter-warm/30 flex justify-between text-[10px] uppercase tracking-[0.3em] text-slate-500">
          <span>Archive ID: {entry._id.toString().substring(0, 12)}</span>
          <span>Status: Verified Intelligence</span>
        </footer>
      </div>
    </div>
  );
}
