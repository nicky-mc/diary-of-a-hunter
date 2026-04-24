"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { Menu, X, Moon, Sun, BookOpen, ShieldAlert, LogIn } from "lucide-react";
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
  const { data: session, status } = useSession();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#3A2214] bg-[#5C3A21] shadow-lg transition-colors duration-300 dark:bg-[#0a0a0a] dark:border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg sm:text-xl font-serif font-bold text-[#F4ECD8] hover:text-white transition-colors"
            >
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#D4A373]" />
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
                className="text-[#F4ECD8] hover:text-[#D4A373] px-3 py-2 rounded-md text-sm font-medium transition-all"
              >
                {link.name}
              </Link>
            ))}

            <div className="h-4 w-px bg-[#F4ECD8]/20 mx-2" />

            {/* Authenticated State vs Guest State */}
            {status === "authenticated" ? (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-[#D4A373] bg-[#D4A373]/10 border border-[#D4A373]/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#D4A373]/20 transition-all"
              >
                <ShieldAlert className="h-4 w-4" />
                Admin
              </Link>
            ) : status === "loading" ? (
              <div className="h-4 w-12 bg-slate-400/20 animate-pulse rounded" />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-[#F4ECD8] hover:text-white text-xs font-bold uppercase tracking-widest"
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
              className="p-2 rounded-full text-[#F4ECD8] hover:bg-[#3A2214]/50 transition-colors"
              aria-label="Toggle Night Vision"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-[#D4A373]" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-[#F4ECD8] hover:bg-[#3A2214]/50"
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
            className="lg:hidden fixed inset-0 top-16 z-40 bg-[#5C3A21] dark:bg-[#111] px-6 py-12 flex flex-col gap-8"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-serif text-[#F4ECD8] border-b border-[#F4ECD8]/10 pb-4"
              >
                {link.name}
              </Link>
            ))}

            {status === "authenticated" ? (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-2xl text-[#D4A373] font-bold uppercase"
              >
                <ShieldAlert className="h-8 w-8" />
                Admin Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-2xl text-[#F4ECD8] font-bold uppercase"
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
