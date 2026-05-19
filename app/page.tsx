import Link from "next/link";
import { BookOpen, Skull, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-hunter-parchment dark:bg-hunter-shadow">
      {/* Gritty Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/noise.png')] opacity-10 dark:opacity-20 mix-blend-overlay"></div>

      {/* Subtle glowing radial gradient in the background (Aceternity-lite effect) */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="h-[40rem] w-[40rem] rounded-full bg-hunter-warm/10 dark:bg-hunter-gold/5 blur-[100px]"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Warning Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-hunter-warm/30 bg-black/5 dark:bg-white/5 px-4 py-1.5 text-sm font-medium text-hunter-mid dark:text-hunter-gold backdrop-blur-md">
          <Flame className="h-4 w-4" aria-hidden="true" />
          <span>The Mother&apos;s Fire is still burning.</span>
        </div>

        {/* Hero Typography */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-hunter-night dark:text-hunter-parchment tracking-tight mb-6">
          Welcome to the{" "}
          <span className="text-hunter-warm dark:text-hunter-gold">Frontline.</span>
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-hunter-dark dark:text-slate-300 mb-2 leading-relaxed">
          The Midnight Realm is bleeding into our world. This archive contains
          the lore, the bloodlines, and the weaknesses of the things hunting you
          in the dark.
        </p>

        <p className="font-caveat text-2xl text-hunter-mid dark:text-hunter-warm mb-10 -rotate-2">
          Read it. Memorize it. Survive. — Amber
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button
            asChild
            size="lg"
            className="bg-hunter-mid hover:bg-hunter-dark text-hunter-parchment font-semibold tracking-wide border border-transparent dark:border-hunter-dark dark:hover:border-hunter-gold transition-all"
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
            className="border-hunter-warm text-hunter-mid hover:bg-hunter-warm/10 dark:text-hunter-gold dark:border-hunter-gold dark:hover:bg-hunter-gold/10 dark:bg-transparent transition-all"
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
