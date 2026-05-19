"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import {
  Menu,
  X,
  Moon,
  Sun,
  BookOpen,
  ShieldAlert,
  LogIn,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Archive", href: "/" },
  { name: "Field Notes", href: "/blog" },
  { name: "Lore Wiki", href: "/wiki" },
];

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { status } = useSession();

  // Only the theme-toggle icon needs the mounted gate — useTheme can't be
  // resolved on the server. Everything else renders SSR-safe so we don't
  // get a layout shift while React hydrates.
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hunter-dark bg-hunter-mid shadow-lg dark:bg-hunter-void dark:border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg sm:text-xl font-serif font-bold text-hunter-parchment hover:text-white transition-colors"
            >
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-hunter-gold" />
              <span className="hidden sm:inline">Diary of a Hunter</span>
              <span className="sm:hidden">DOAH</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-hunter-parchment hover:text-hunter-gold px-3 py-2 rounded-md text-sm font-medium transition-all"
              >
                {link.name}
              </Link>
            ))}

            <div className="h-4 w-px bg-hunter-parchment/20 mx-2" />

            {/* Desktop search — a plain GET form, no client state required.
                Hitting Enter (or clicking the icon) navigates to /search?q=… */}
            <form
              action="/search"
              method="get"
              role="search"
              className="relative"
            >
              <label htmlFor="topnav-search" className="sr-only">
                Search the archive
              </label>
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-hunter-parchment/60 pointer-events-none" />
              <input
                id="topnav-search"
                type="search"
                name="q"
                placeholder="Search the archive…"
                className="w-44 xl:w-56 rounded-full bg-black/20 placeholder:text-hunter-parchment/50 text-hunter-parchment text-xs pl-7 pr-3 py-1.5 border border-hunter-parchment/20 focus:border-hunter-gold focus:bg-black/30 focus:w-64 transition-all outline-none"
              />
            </form>

            <div className="h-4 w-px bg-hunter-parchment/20 mx-2" />

            {/* Authenticated State vs Guest State */}
            {status === "authenticated" ? (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-hunter-gold bg-hunter-gold/10 border border-hunter-gold/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest hover:bg-hunter-gold/20 transition-all"
              >
                <ShieldAlert className="h-4 w-4" />
                Admin
              </Link>
            ) : status === "loading" ? (
              <div className="h-4 w-12 bg-slate-400/20 animate-pulse rounded" />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-hunter-parchment hover:text-white text-xs font-bold uppercase tracking-widest"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </nav>

          {/* Utility Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-hunter-parchment hover:bg-hunter-dark/50 transition-colors"
              aria-label="Toggle Night Vision"
              // Disable until mounted — clicking before hydration would
              // toggle to the wrong state because `theme` is undefined.
              disabled={!mounted}
            >
              {/* Reserve space with a neutral icon on the server so the layout
                  doesn't shift once the actual theme is known on the client. */}
              {mounted ? (
                theme === "dark" ? (
                  <Sun className="h-5 w-5 text-hunter-gold" />
                ) : (
                  <Moon className="h-5 w-5" />
                )
              ) : (
                <Moon
                  className="h-5 w-5 opacity-0"
                  aria-hidden="true"
                />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-hunter-parchment hover:bg-hunter-dark/50"
              aria-label="Open Archive Menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-out */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 top-16 z-40 bg-hunter-mid dark:bg-[#111] px-6 py-12 flex flex-col gap-8 overflow-y-auto"
          >
            {/* Mobile search — same GET form, larger target for thumbs */}
            <form
              action="/search"
              method="get"
              role="search"
              onSubmit={() => setIsOpen(false)}
              className="relative"
            >
              <label htmlFor="topnav-search-mobile" className="sr-only">
                Search the archive
              </label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hunter-parchment/60 pointer-events-none" />
              <input
                id="topnav-search-mobile"
                type="search"
                name="q"
                placeholder="Search the archive…"
                className="w-full rounded bg-black/30 placeholder:text-hunter-parchment/50 text-hunter-parchment pl-10 pr-3 py-3 border border-hunter-parchment/20 focus:border-hunter-gold outline-none"
              />
            </form>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-serif text-hunter-parchment border-b border-hunter-parchment/10 pb-4"
              >
                {link.name}
              </Link>
            ))}

            {status === "authenticated" ? (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-2xl text-hunter-gold font-bold uppercase"
              >
                <ShieldAlert className="h-8 w-8" />
                Admin Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-2xl text-hunter-parchment font-bold uppercase"
              >
                <LogIn className="h-8 w-8" />
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
