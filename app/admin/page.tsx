// src/app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export const metadata = {
  title: "Command Center | Restricted",
};

export default async function AdminDashboard() {
  // app/admin/layout.tsx already redirects unauthenticated users; this call
  // is just to pull the user info for the welcome banner.
  const session = await getServerSession(authOptions);

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-hunter-warm pb-6">
          <div>
            <h1 className="font-serif text-4xl font-bold uppercase tracking-widest text-hunter-mid dark:text-hunter-gold">
              Command Center
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Welcome back, Hunter {session?.user?.name || "Unknown"}. The
              perimeter is secure.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-bold uppercase rounded border border-slate-400 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-hunter-warm outline-none"
            >
              Return to Surface
            </Link>
            <Link
              href="/api/auth/signout"
              className="px-4 py-2 text-sm font-bold uppercase rounded bg-red-900 text-white hover:bg-red-800 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
            >
              Lock Down (Log Out)
            </Link>
          </div>
        </header>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Action Card: New Lore Entry */}
          <section className="relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-hunter-shadow p-6 shadow-lg">
            {/* FIXED: pointer-events-none ensures the noise doesn't block clicks */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            <div className="relative z-10">
              <h2 className="font-serif text-2xl font-bold mb-2">
                Log New Entity
              </h2>
              <p className="text-sm mb-6 text-slate-600 dark:text-slate-400">
                Document a new breed and its weaknesses.
              </p>
              <Link
                href="/admin/wiki/new"
                className="inline-block bg-hunter-mid text-hunter-parchment px-4 py-2 rounded text-sm font-bold uppercase tracking-wider hover:bg-hunter-warm transition-colors"
              >
                Open Bestiary
              </Link>
            </div>
          </section>
          {/* Action Card: New Field Report (Blog) */}
          <section className="group relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-hunter-shadow p-6 shadow-lg transition-all hover:border-hunter-warm dark:hover:border-hunter-gold">
            <h2 className="font-serif text-2xl font-bold mb-2">
              Draft Field Report
            </h2>
            <p className="text-sm mb-6 text-slate-600 dark:text-slate-400">
              Update the network. Tell them what happened out there tonight.
            </p>
            <Link
              href="/admin/blog/new"
              className="inline-block bg-hunter-mid text-hunter-parchment px-4 py-2 rounded text-sm font-bold uppercase tracking-wider hover:bg-hunter-warm transition-colors focus-visible:ring-2 focus-visible:ring-hunter-warm outline-none"
              aria-label="Create a new Blog Post"
            >
              Write Report
            </Link>
          </section>

          {/* Action Card: Manage Archives */}
          <section className="group relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-hunter-shadow p-6 shadow-lg transition-all hover:border-hunter-warm dark:hover:border-hunter-gold">
            <h2 className="font-serif text-2xl font-bold mb-2">
              Manage Archives
            </h2>
            <p className="text-sm mb-6 text-slate-600 dark:text-slate-400">
              Review, edit, or purge existing records from the database.
            </p>
            <Link
              href="/admin/manage"
              className="inline-block bg-slate-800 dark:bg-slate-700 text-white px-4 py-2 rounded text-sm font-bold uppercase tracking-wider hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors focus-visible:ring-2 focus-visible:ring-slate-500 outline-none"
              aria-label="Manage existing database entries"
            >
              Access Files
            </Link>
          </section>

          {/* Action Card: Fonts */}
          <section className="group relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-hunter-shadow p-6 shadow-lg transition-all hover:border-hunter-warm dark:hover:border-hunter-gold">
            <h2 className="font-serif text-2xl font-bold mb-2">Fonts</h2>
            <p className="text-sm mb-6 text-slate-600 dark:text-slate-400">
              Upload custom typefaces. New fonts appear automatically in the
              editor&apos;s font dropdown.
            </p>
            <Link
              href="/admin/fonts"
              className="inline-block bg-hunter-mid text-hunter-parchment px-4 py-2 rounded text-sm font-bold uppercase tracking-wider hover:bg-hunter-warm transition-colors focus-visible:ring-2 focus-visible:ring-hunter-warm outline-none"
              aria-label="Manage uploaded fonts"
            >
              Manage Fonts
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
