import Link from "next/link";
import { ShieldCheck, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-hunter-parchment dark:bg-hunter-void border-t border-hunter-warm/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold uppercase tracking-widest text-hunter-mid dark:text-hunter-gold">
              Diary of a Hunter
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              Intel for those who walk the line between the light and the dark.
              Burn after reading.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Navigation
            </h4>
            <Link
              href="/blog"
              className="text-sm hover:text-hunter-warm transition-colors"
            >
              Field Notes
            </Link>
            <Link
              href="/wiki"
              className="text-sm hover:text-hunter-warm transition-colors"
            >
              Lore Wiki
            </Link>
            <Link
              href="/about"
              className="text-sm hover:text-hunter-warm transition-colors"
            >
              About Amber
            </Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Security
            </h4>
            <Link
              href="/admin"
              className="group flex items-center justify-center md:justify-start gap-2 text-sm font-mono text-slate-500 hover:text-hunter-warm transition-colors"
            >
              <ShieldCheck className="h-4 w-4 opacity-50 group-hover:opacity-100" />
              Terminal Login
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-hunter-warm/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            {"© "}
            {currentYear}
            {" Classified Archive. All Rights Reserved."}
          </p>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="text-[10px] italic">
              {'"Ignorance is a choice; survival is a skill."'}
            </span>
            <div className="flex gap-4">
              {/* Manual Instagram Icon */}
              <a
                href="https://www.instagram.com/thessaily/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="hover:text-[#E1306C] transition-colors"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              {/* Manual Facebook Icon */}
              <a
                href="https://www.facebook.com/charlie.cowles"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="hover:text-[#1877F2] transition-colors"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <Mail className="h-4 w-4 hover:text-hunter-warm cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
