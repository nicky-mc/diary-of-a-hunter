// src/app/(public)/wiki/layout.tsx
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Lore Wiki | Diary of a Hunter",
  description:
    "An A-Z archive of supernatural entities, weapons, and survival tactics.",
};

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The background transitions between aged paper and a gritty dark theme
    <div className="min-h-screen bg-[#F4ECD8] dark:bg-[#1A1A1A] text-slate-900 dark:text-slate-200 transition-colors duration-300">
      {/* Aceternity UI overlay effect simulation (e.g., subtle vignette or noise) */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[url('/noise.png')] opacity-10 dark:opacity-20 mix-blend-overlay"></div>

      {/* Semantic Grid Layout */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* A-Z Lore Directory Aside */}
        <aside
          className="md:col-span-3 lg:col-span-2 space-y-6"
          aria-label="Wiki A to Z Directory"
        >
          <div className="sticky top-24 rounded-lg border border-[#8B5A2B]/30 dark:border-[#5C3A21]/50 bg-white/50 dark:bg-black/40 backdrop-blur-md p-4 shadow-lg">
            <h2 className="font-serif text-2xl font-bold mb-4 border-b border-[#8B5A2B] pb-2 dark:text-[#EAE0D5]">
              The Archives
            </h2>
            <nav className="flex flex-col space-y-2 text-sm font-medium">
              {/* Ensure high contrast (AAA) links */}
              <Link
                href="/wiki/bestiary"
                className="hover:text-[#8B5A2B] dark:hover:text-[#D4A373] transition-colors focus-visible:ring-2 focus-visible:ring-[#8B5A2B] outline-none rounded"
              >
                Bestiary (Monsters)
              </Link>
              <Link
                href="/wiki/weapons"
                className="hover:text-[#8B5A2B] dark:hover:text-[#D4A373] transition-colors focus-visible:ring-2 focus-visible:ring-[#8B5A2B] outline-none rounded"
              >
                Silver & Steel
              </Link>
              <Link
                href="/wiki/bloodlines"
                className="hover:text-[#8B5A2B] dark:hover:text-[#D4A373] transition-colors focus-visible:ring-2 focus-visible:ring-[#8B5A2B] outline-none rounded"
              >
                Supernatural Bloodlines
              </Link>
              <Link
                href="/wiki/conspiracy"
                className="hover:text-[#8B5A2B] dark:hover:text-[#D4A373] transition-colors focus-visible:ring-2 focus-visible:ring-[#8B5A2B] outline-none rounded"
              >
                The Mother`&apos;s Fire
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className="md:col-span-9 lg:col-span-10 min-h-[80vh] rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-[#121212]/90 shadow-2xl p-6 md:p-10"
          role="main"
        >
          {/* Children will render individual Wiki articles (TipTap content) */}
          <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-h1:text-4xl prose-a:text-[#8B5A2B] dark:prose-a:text-[#D4A373]">
            {children}
          </article>
        </main>
      </div>
    </div>
  );
}
