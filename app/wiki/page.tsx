// src/app/(public)/wiki/page.tsx
import Link from "next/link";
import { BookOpen, Crosshair, Droplet, Flame } from "lucide-react";

export const metadata = {
  title: "The Archives | Diary of a Hunter",
  description:
    "Comprehensive A-Z directory of supernatural entities, weapons, and the Mother's Fire conspiracy.",
};

// Mock data for the categories to map through cleanly
const WIKI_CATEGORIES = [
  {
    title: "Bestiary",
    description:
      "Strengths, weaknesses, and feeding habits of the things in the dark.",
    icon: <BookOpen className="h-6 w-6 text-[#8B5A2B] dark:text-[#D4A373]" />,
    href: "/wiki/bestiary",
    count: 42,
  },
  {
    title: "Silver & Steel",
    description:
      "Weapons, wards, and survival tactics. Don't leave home without them.",
    icon: <Crosshair className="h-6 w-6 text-[#8B5A2B] dark:text-[#D4A373]" />,
    href: "/wiki/weapons",
    count: 15,
  },
  {
    title: "Bloodlines",
    description:
      "The ancient families, the covens, and the cursed hierarchies.",
    icon: <Droplet className="h-6 w-6 text-[#8B5A2B] dark:text-[#D4A373]" />,
    href: "/wiki/bloodlines",
    count: 8,
  },
  {
    title: "The Mother's Fire",
    description:
      "Declassified police reports, suspect lists, and the burning conspiracy.",
    icon: <Flame className="h-6 w-6 text-[#8B5A2B] dark:text-[#D4A373]" />,
    href: "/wiki/conspiracy",
    count: 11,
  },
];

// Mock data for recent field notes to simulate dynamic database fetching
const RECENT_ENTRIES = [
  {
    name: "Strigoi (Romanian Strain)",
    updated: "2 days ago",
    href: "/wiki/bestiary/strigoi",
  },
  {
    name: "Dead-Iron Forging Techniques",
    updated: "5 days ago",
    href: "/wiki/weapons/dead-iron",
  },
  {
    name: "The Obsidian Council",
    updated: "1 week ago",
    href: "/wiki/bloodlines/obsidian-council",
  },
];

export default function WikiHomePage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="border-b-2 border-[#8B5A2B]/30 dark:border-[#3A2214] pb-6">
        <h1 className="mt-0 text-5xl font-bold tracking-tight text-[#3A2214] dark:text-[#F4ECD8]">
          The Archives
        </h1>
        <p className="text-xl text-[#5C3A21] dark:text-slate-400 mt-4 leading-relaxed max-w-3xl">
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
          {WIKI_CATEGORIES.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative flex flex-col justify-between p-6 rounded-xl border border-[#8B5A2B]/20 dark:border-slate-800 bg-[#F4ECD8]/50 dark:bg-[#1A1A1A]/50 overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,90,43,0.15)] dark:hover:shadow-[0_0_20px_rgba(212,163,115,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5A2B]"
            >
              {/* Aceternity-style background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5A2B]/0 to-[#8B5A2B]/5 dark:from-[#D4A373]/0 dark:to-[#D4A373]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-white/50 dark:bg-black/50 border border-[#8B5A2B]/10 dark:border-slate-700">
                    {category.icon}
                  </div>
                  <span className="text-sm font-bold text-[#8B5A2B] dark:text-[#5C3A21] bg-[#8B5A2B]/10 dark:bg-black/40 px-3 py-1 rounded-full">
                    {category.count} Entries
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-[#EAE0D5] mb-2 group-hover:text-[#8B5A2B] dark:group-hover:text-[#D4A373] transition-colors">
                  {category.title}
                </h3>
                <p className="text-slate-700 dark:text-slate-400 font-sans">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Updated Entries */}
      <section
        aria-labelledby="recent-updates-heading"
        className="mt-12 bg-white/40 dark:bg-[#1A1A1A]/30 p-6 rounded-lg border border-[#8B5A2B]/10 dark:border-black shadow-inner"
      >
        <h2
          id="recent-updates-heading"
          className="text-3xl font-serif font-bold text-[#3A2214] dark:text-[#EAE0D5] mb-6 flex items-center gap-2"
        >
          <span className="w-2 h-6 bg-[#8B5A2B] dark:bg-[#D4A373] rounded-sm inline-block animate-pulse"></span>
          Recently Declassified
        </h2>

        <ul className="space-y-3 font-sans">
          {RECENT_ENTRIES.map((entry) => (
            <li
              key={entry.name}
              className="flex items-center justify-between border-b border-dashed border-[#8B5A2B]/30 dark:border-slate-700 pb-2 last:border-0"
            >
              <Link
                href={entry.href}
                className="text-[#5C3A21] dark:text-slate-300 hover:text-[#8B5A2B] dark:hover:text-[#D4A373] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8B5A2B] rounded"
              >
                {entry.name}
              </Link>
              <span className="text-sm text-slate-500 dark:text-slate-500 font-mono">
                {entry.updated}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
