// src/app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Command Center | Restricted",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboard() {
  // Server-side session verification. We don't trust the client.
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F4ECD8] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-200 p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-[#8B5A2B] pb-6">
          <div>
            <h1 className="font-serif text-4xl font-bold uppercase tracking-widest text-[#5C3A21] dark:text-[#D4A373]">
              Command Center
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Welcome back, Hunter {session.user?.name || "Unknown"}. The
              perimeter is secure.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-bold uppercase rounded border border-slate-400 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-[#8B5A2B] outline-none"
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
          <section className="relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-[#121212] p-6 shadow-lg">
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
                className="inline-block bg-[#5C3A21] text-[#F4ECD8] px-4 py-2 rounded text-sm font-bold uppercase tracking-wider hover:bg-[#8B5A2B] transition-colors"
              >
                Open Bestiary
              </Link>
            </div>
          </section>
          {/* Action Card: New Field Report (Blog) */}
          <section className="group relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-[#121212] p-6 shadow-lg transition-all hover:border-[#8B5A2B] dark:hover:border-[#D4A373]">
            <h2 className="font-serif text-2xl font-bold mb-2">
              Draft Field Report
            </h2>
            <p className="text-sm mb-6 text-slate-600 dark:text-slate-400">
              Update the network. Tell them what happened out there tonight.
            </p>
            <Link
              href="/admin/blog/new"
              className="inline-block bg-[#5C3A21] text-[#F4ECD8] px-4 py-2 rounded text-sm font-bold uppercase tracking-wider hover:bg-[#8B5A2B] transition-colors focus-visible:ring-2 focus-visible:ring-[#8B5A2B] outline-none"
              aria-label="Create a new Blog Post"
            >
              Write Report
            </Link>
          </section>

          {/* Action Card: Manage Archives */}
          <section className="group relative overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-[#121212] p-6 shadow-lg transition-all hover:border-[#8B5A2B] dark:hover:border-[#D4A373]">
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
        </div>
      </div>
    </div>
  );
}
