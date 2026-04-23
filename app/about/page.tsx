// src/app/(public)/about/page.tsx
import Image from "next/image";

export const metadata = {
  title: "About Amber | Diary of a Hunter",
  description:
    "The truth behind the Mother's Fire and the supernatural war brewing in the shadows.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F4ECD8] dark:bg-[#121212] py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      {/* Gritty Noise Overlay - Simulates aged paper or a static-filled terminal */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/noise.png')] opacity-10 dark:opacity-20 mix-blend-overlay"></div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center md:items-start">
        {/* Visual Evidence Column */}
        <div className="w-full md:w-1/3 relative shrink-0 group">
          <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden border-4 border-[#5C3A21] dark:border-[#3A2214] shadow-2xl transform md:-rotate-2 transition-transform group-hover:rotate-0 duration-500">
            {/* Cloudinary Image Integration.
              CRITICAL: Update the src with your actual Cloudinary path once uploaded.
            */}
            <Image
              src="https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
              alt="A scorched, leather-bound diary resting on a wooden table next to a heavily scarred silver blade, representing Amber's inherited burden and tools of the trade."
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
            {/* Dark magical overlay effect */}
            <div className="absolute inset-0 bg-[#8B5A2B] mix-blend-multiply opacity-20 dark:opacity-40 pointer-events-none"></div>
          </div>
          <p className="mt-4 text-center font-['Caveat',_cursive] text-xl text-[#5C3A21] dark:text-[#D4A373] -rotate-2">
            Exhibit A: The Ashes
          </p>
        </div>

        {/* Manifesto Content Column */}
        <div className="w-full md:w-2/3">
          <header className="mb-8">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#3A2214] dark:text-[#F4ECD8] tracking-tight mb-2 border-b-2 border-[#8B5A2B] pb-4">
              The Truth Burns. <br />
              <span className="text-[#8B5A2B] dark:text-[#D4A373]">
                So Do I.
              </span>
            </h1>

            <h2 className="font-['Caveat',_cursive] text-3xl text-[#5C3A21] dark:text-[#D4A373] mt-4 font-normal tracking-wider">
              My name is Amber Thessaily. Welcome to the frontline.
            </h2>
          </header>

          <article className="space-y-6 text-[#1A1A1A] dark:text-slate-300 leading-relaxed text-lg font-sans">
            <p>
              Most people walk through life half-asleep. They think the
              scratching at the window is a stray cat. They think the shadow in
              the alley is just a trick of the light. They’re wrong.
            </p>
            <p>
              <strong className="text-[#5C3A21] dark:text-[#F4ECD8] font-bold">
                Monsters are real.
              </strong>{" "}
              And right now, they’re preparing for a war that humanity doesn`&apos;t
              even know it`&apos;s fighting.
            </p>
            <p>
              I didn`&apos;t choose this life. I was born into it, and it was paid for
              in ash. When I was younger, they came for my mother. They called
              her a witch. They burned her alive in a conspiracy so deep and so
              massive that the ashes are still choking this city. The police
              called it an &quot;industrial accident.&quot; I call it an act of
              war.
            </p>

            <blockquote className="border-l-4 border-[#8B5A2B] pl-6 italic my-8 text-xl font-serif text-[#3A2214] dark:text-[#D4A373] bg-black/5 dark:bg-white/5 p-4 rounded-r-lg shadow-sm">
              &quot;Since that night, I&apos;ve made it my life’s work to drag
              the truth out of the shadows.&quot;
            </blockquote>

            <p>
              This diary—this archive—is everything I know. It&apos;s the lore,
              the weaknesses, the bloodlines, and the conspiracies. Read it.
              Memorize it. Don&apos;t be caught unprepared when the dark finally
              bites back.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
