// src/app/(public)/wiki/page.tsx
import dbConnect from "@/lib/mongodb";
import WikiEntry from "@/app/models/wikiEntry";
import Link from "next/link";
import { Types } from "mongoose";

export const revalidate = 60;

// 1. Define the exact shape of the data coming from MongoDB
interface DirectoryEntry {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  category: "bestiary" | "weapons" | "bloodlines" | "conspiracy";
  threatLevel: string;
}

async function getWikiEntries() {
  await dbConnect();

  // Cast the lean() response to our strict DirectoryEntry array
  const entries = (await WikiEntry.find({})
    .sort({ title: 1 })
    .select("title slug category threatLevel")
    .lean()) as DirectoryEntry[];

  const grouped = {
    bestiary: entries.filter((e) => e.category === "bestiary"),
    weapons: entries.filter((e) => e.category === "weapons"),
    bloodlines: entries.filter((e) => e.category === "bloodlines"),
    conspiracy: entries.filter((e) => e.category === "conspiracy"),
  };

  return grouped;
}

export default async function PublicWikiDirectory() {
  const archives = await getWikiEntries();

  const categories = [
    {
      id: "bestiary",
      title: "The Bestiary",
      desc: "Catalogued monsters, predators, and supernatural threats.",
      data: archives.bestiary,
    },
    {
      id: "weapons",
      title: "Silver & Steel",
      desc: "Tactical gear, wards, and weapons that actually work.",
      data: archives.weapons,
    },
    {
      id: "bloodlines",
      title: "Bloodlines",
      desc: "The ancient families and supernatural factions.",
      data: archives.bloodlines,
    },
    {
      id: "conspiracy",
      title: "The Conspiracy",
      desc: "The Mother's Fire and the hidden war.",
      data: archives.conspiracy,
    },
  ];

  return (
    <div className="space-y-12">
      <header className="border-b border-[#8B5A2B]/50 pb-6">
        <h1 className="font-serif text-5xl font-bold uppercase tracking-widest text-slate-900 dark:text-[#EAE0D5]">
          The Archives
        </h1>
        <p className="mt-4 text-lg text-slate-700 dark:text-slate-400 max-w-2xl">
          Everything we know about the things that hunt us in the dark. Read
          carefully. Ignorance will get you killed.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {categories.map((category) => (
          <section key={category.id} className="relative group">
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-br from-[#8B5A2B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-lg"></div>

            <div className="relative">
              <h2 className="font-serif text-3xl font-bold text-[#5C3A21] dark:text-[#D4A373] border-b border-slate-300 dark:border-slate-800 pb-2 mb-4">
                {category.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {category.desc}
              </p>

              {category.data.length === 0 ? (
                <p className="text-sm italic text-slate-500 border border-dashed border-slate-400 dark:border-slate-700 p-4 rounded bg-white/30 dark:bg-black/30">
                  Files corrupted or missing. Check back later.
                </p>
              ) : (
                <ul className="space-y-2">
                  {/* Map using our strict type instead of 'any' */}
                  {category.data.map((entry: DirectoryEntry) => (
                    <li
                      key={entry._id.toString()}
                      className="flex items-center justify-between group/item"
                    >
                      <Link
                        href={`/wiki/${entry.slug}`}
                        className="font-semibold text-slate-800 dark:text-slate-200 hover:text-[#8B5A2B] dark:hover:text-[#D4A373] transition-colors focus-visible:ring-2 focus-visible:ring-[#8B5A2B] outline-none rounded py-1"
                      >
                        {entry.title}
                      </Link>
                      <span className="text-xs uppercase tracking-widest text-slate-500 group-hover/item:text-slate-800 dark:group-hover/item:text-slate-300 transition-colors">
                        [Threat: {entry.threatLevel}]
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
