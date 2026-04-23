"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Moon, Sun, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Archive", href: "/" },
  { name: "About Amber", href: "/about" },
  { name: "Field Notes", href: "/blog" },
  { name: "Lore Wiki", href: "/wiki" },
];

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch on the theme toggle
  useEffect(() => setMounted(true), []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#3A2214] bg-[#5C3A21] shadow-lg transition-colors duration-300 dark:bg-[#1A1A1A] dark:border-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Title */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-serif font-bold text-[#F4ECD8] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4ECD8] rounded"
              aria-label="Diary of a Hunter Home"
            >
              <BookOpen className="h-6 w-6 text-[#D4A373]" aria-hidden="true" />
              <span>Diary of a Hunter</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" aria-label="Main Navigation">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[#F4ECD8] hover:text-[#D4A373] hover:bg-[#3A2214]/50 px-3 py-2 rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-[#F4ECD8] hover:bg-[#3A2214]/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-[#D4A373]" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            )}

            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center rounded-md p-2 text-[#F4ECD8] hover:bg-[#3A2214]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A373]"
                aria-expanded={isOpen}
                aria-label="Toggle mobile menu"
              >
                {isOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (Book Cover Animation) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ transformOrigin: "left" }}
            className="md:hidden absolute top-16 left-0 w-full bg-[#5C3A21] dark:bg-[#1A1A1A] border-b border-[#3A2214] dark:border-black shadow-xl origin-left"
            id="mobile-menu"
          >
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-[#F4ECD8] hover:bg-[#3A2214]/50 hover:text-[#D4A373] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
