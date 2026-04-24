// src/app/(public)/wiki/[id]/page.tsx
import dbConnect from "@/lib/mongodb";
import WikiEntry, { IWikiEntry } from "@/app/models/wikiEntry";
import { notFound } from "next/navigation";
import { Skull, ShieldAlert, Zap } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function WikiEntryPage(props: PageProps) {
  const { id } = await props.params;

  await dbConnect();

  // The double-cast to kill the 'any' ghost on the weaknesses array
  const entry = (await WikiEntry.findById(
    id,
  ).lean()) as unknown as IWikiEntry | null;

  if (!entry) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F4ECD8] dark:bg-[#0a0a0a] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-10 border-b-4 border-[#5C3A21] pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#8B5A2B] text-[#F4ECD8] px-3 py-1 text-xs font-bold uppercase tracking-widest">
              {entry.category}
            </span>
            <div className="flex items-center gap-1 text-red-700 dark:text-red-500 font-mono text-xs">
              <ShieldAlert className="h-4 w-4" />
              <span>THREAT: {entry.threatLevel}</span>
            </div>
          </div>
          <h1 className="font-serif text-5xl font-bold text-[#3A2214] dark:text-[#EAE0D5] uppercase italic">
            {entry.title}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tactical Sidebar */}
          <aside className="md:col-span-1 space-y-6">
            <div className="bg-[#EAE0D5] dark:bg-[#1A1A1A] p-6 border-2 border-[#8B5A2B] shadow-inner">
              <h3 className="flex items-center gap-2 font-bold uppercase text-sm mb-4 text-[#5C3A21] dark:text-[#D4A373]">
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

        <footer className="mt-16 pt-8 border-t border-[#8B5A2B]/30 flex justify-between text-[10px] uppercase tracking-[0.3em] text-slate-500">
          <span>Archive ID: {entry._id.toString().substring(0, 12)}</span>
          <span>Status: Verified Intelligence</span>
        </footer>
      </div>
    </div>
  );
}
