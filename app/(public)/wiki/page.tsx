// src/app/(public)/wiki/page.tsx
import Link from "next/link";
import { BookOpen, Crosshair, Droplet, Flame } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import WikiEntry from "@/app/models/wikiEntry";
import type { LucideIcon } from "lucide-react";

export const metadata = {
  title: "The Archives | Diary of a Hunter",
  description:
    "Comprehensive A-Z directory of supernatural entities, weapons, and the Mother's Fire conspiracy.",
};

// Re-fetch counts/recent entries at most once a minute on the public list page
export const revalidate = 60;

// Each category gets its own display metadata. The icon is a component
// reference so the JSX stays in the render — keeps this map serialisable.
type CategoryKey = "bestiary" | "weapons" | "bloodlines" | "conspiracy";

const CATEGORY_META: Record<
  CategoryKey,
  { title: string; description: string; icon: LucideIcon }
> = {
  bestiary: {
    title: "Bestiary",
    description:
      "Strengths, weaknesses, and feeding habits of the things in the dark.",
    icon: BookOpen,
  },
  weapons: {
    title: "Silver & Steel",
    description:
      "Weapons, wards, and survival tactics. Don't leave home without them.",
    icon: Crosshair,
  },
  bloodlines: {
    title: "Bloodlines",
    description:
      "The ancient families, the covens, and the cursed hierarchies.",
    icon: Droplet,
  },
  conspiracy: {
    title: "The Mother's Fire",
    description:
      "Declassified police reports, suspect lists, and the burning conspiracy.",
    icon: Flame,
  },
};

// Shape of a recently-updated entry as returned from .lean()
interface RecentEntry {
  _id: { toString(): string };
  title: string;
  slug: string;
  updatedAt: Date;
}

// Returns "2 days ago" / "1 week ago" — keeps the original aesthetic
function relativeTime(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const week = Math.floor(day / 7);

  if (sec < 60) return "just now";
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;
  if (week < 4) return `${week} week${week === 1 ? "" : "s"} ago`;
  return new Date(date).toLocaleDateString();
}

export default async function WikiHomePage() {
  await dbConnect();

  // Two queries in parallel: category counts and most-recently-updated entries
  const [countsAgg, recent] = await Promise.all([
    WikiEntry.aggregate<{ _id: CategoryKey; count: number }>([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),
    WikiEntry.find()
      .select("title slug updatedAt")
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean<RecentEntry[]>(),
  ]);

  // Flatten aggregate result into { bestiary: 12, weapons: 4, ... }
  const counts: Record<CategoryKey, number> = {
    bestiary: 0,
    weapons: 0,
    bloodlines: 0,
    conspiracy: 0,
  };
  for (const row of countsAgg) {
    counts[row._id] = row.count;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="border-b-2 border-hunter-warm/30 dark:border-hunter-dark pb-6">
        <h1 className="mt-0 text-5xl font-bold tracking-tight text-hunter-dark dark:text-hunter-parchment font-serif">
          The Archives
        </h1>
        <p className="text-xl text-hunter-mid dark:text-slate-400 mt-4 leading-relaxed max-w-3xl">
          Consider this your tactical briefing. Every entity, weapon, and
          conspiracy I have uncovered is documented here. Cross-reference
          everything. Assume nothing.
        </p>
      </header>

      {/* Categories Grid */}
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="sr-only">
          Wiki Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(CATEGORY_META) as CategoryKey[]).map((key) => {
            const category = CATEGORY_META[key];
            const Icon = category.icon;
            const count = counts[key];

            return (
              <Link
                key={key}
                href={`/wiki/category/${key}`}
                className="group relative flex flex-col justify-between p-6 rounded-xl border border-hunter-warm/20 dark:border-slate-800 bg-hunter-parchment/50 dark:bg-hunter-night/50 overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,90,43,0.15)] dark:hover:shadow-[0_0_20px_rgba(212,163,115,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hunter-warm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-hunter-warm/0 to-hunter-warm/5 dark:from-hunter-gold/0 dark:to-hunter-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-white/50 dark:bg-black/50 border border-hunter-warm/10 dark:border-slate-700">
                      <Icon className="h-6 w-6 text-hunter-warm dark:text-hunter-gold" />
                    </div>
                    <span className="text-sm font-bold text-hunter-warm dark:text-hunter-mid bg-hunter-warm/10 dark:bg-black/40 px-3 py-1 rounded-full">
                      {count} {count === 1 ? "Entry" : "Entries"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-hunter-night dark:text-hunter-bone mb-2 group-hover:text-hunter-warm dark:group-hover:text-hunter-gold transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-400 font-sans">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recently Updated Entries */}
      <section
        aria-labelledby="recent-updates-heading"
        className="mt-12 bg-white/40 dark:bg-hunter-night/30 p-6 rounded-lg border border-hunter-warm/10 dark:border-black shadow-inner"
      >
        <h2
          id="recent-updates-heading"
          className="text-3xl font-serif font-bold text-hunter-dark dark:text-hunter-bone mb-6 flex items-center gap-2"
        >
          <span className="w-2 h-6 bg-hunter-warm dark:bg-hunter-gold rounded-sm inline-block animate-pulse"></span>
          Recently Declassified
        </h2>

        {recent.length === 0 ? (
          <p className="text-slate-500 font-mono text-sm italic">
            The archive is empty. Nothing has been declassified yet.
          </p>
        ) : (
          <ul className="space-y-3 font-sans">
            {recent.map((entry) => (
              <li
                key={entry._id.toString()}
                className="flex items-center justify-between border-b border-dashed border-hunter-warm/30 dark:border-slate-700 pb-2 last:border-0"
              >
                <Link
                  href={`/wiki/${entry.slug}`}
                  className="text-hunter-mid dark:text-slate-300 hover:text-hunter-warm dark:hover:text-hunter-gold font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hunter-warm rounded"
                >
                  {entry.title}
                </Link>
                <span className="text-sm text-slate-500 dark:text-slate-500 font-mono">
                  {relativeTime(entry.updatedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
