import Link from "next/link";
import { BookOpen, Skull, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-[#F4ECD8] dark:bg-[#121212] transition-colors duration-300">
      {/* Gritty Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/noise.png')] opacity-10 dark:opacity-20 mix-blend-overlay"></div>

      {/* Subtle glowing radial gradient in the background (Aceternity-lite effect) */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="h-[40rem] w-[40rem] rounded-full bg-[#8B5A2B]/10 dark:bg-[#D4A373]/5 blur-[100px]"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Warning Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#8B5A2B]/30 bg-black/5 dark:bg-white/5 px-4 py-1.5 text-sm font-medium text-[#5C3A21] dark:text-[#D4A373] backdrop-blur-md">
          <Flame className="h-4 w-4" aria-hidden="true" />
          <span>The Mother&apos;s Fire is still burning.</span>
        </div>

        {/* Hero Typography */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#1A1A1A] dark:text-[#F4ECD8] tracking-tight mb-6">
          Welcome to the{" "}
          <span className="text-[#8B5A2B] dark:text-[#D4A373]">Frontline.</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-[#3A2214] dark:text-slate-300 mb-2 leading-relaxed">
          The Midnight Realm is bleeding into our world. This archive contains
          the lore, the bloodlines, and the weaknesses of the things hunting you
          in the dark.
        </p>

        <p className="font-['Caveat',_cursive] text-2xl text-[#5C3A21] dark:text-[#8B5A2B] mb-10 -rotate-2">
          Read it. Memorize it. Survive. — Amber
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            asChild
            size="lg"
            className="bg-[#5C3A21] hover:bg-[#3A2214] text-[#F4ECD8] font-semibold tracking-wide border border-transparent dark:border-[#3A2214] dark:hover:border-[#D4A373] transition-all"
          >
            <Link href="/wiki">
              <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" />
              Enter the Archives
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-[#8B5A2B] text-[#5C3A21] hover:bg-[#8B5A2B]/10 dark:text-[#D4A373] dark:border-[#D4A373] dark:hover:bg-[#D4A373]/10 dark:bg-transparent transition-all"
          >
            <Link href="/blog">
              <Skull className="mr-2 h-5 w-5" aria-hidden="true" />
              Read Field Notes
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
