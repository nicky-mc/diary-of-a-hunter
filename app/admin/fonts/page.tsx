// src/app/admin/fonts/page.tsx
//
// Server component for managing user-uploaded fonts.
// Lists existing fonts (with a live preview using each font) and renders
// the client-side upload + delete UI.

import Link from "next/link";
import { ArrowLeft, Type } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Font from "@/app/models/font";
import FontUploadForm from "./FontUploadForm";
import DeleteFontButton from "./DeleteFontButton";

export const metadata = {
  title: "Manage Fonts | Restricted",
};

export const dynamic = "force-dynamic";

interface FontRow {
  _id: { toString(): string };
  name: string;
  family: string;
  fileUrl: string;
  weight: string;
  style: string;
  fileSize: number;
  createdAt: Date;
}

function humanFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default async function ManageFontsPage() {
  await dbConnect();
  const fonts = await Font.find()
    .select("name family fileUrl weight style fileSize createdAt")
    .sort({ name: 1 })
    .lean<FontRow[]>();

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <header>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-hunter-warm hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Command Center
          </Link>
          <h1 className="font-serif text-4xl font-bold uppercase tracking-widest text-hunter-mid dark:text-hunter-gold flex items-center gap-3">
            <Type className="h-8 w-8" />
            Fonts
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Upload custom fonts. Once added they appear automatically in the
            rich-text editor&apos;s font-family dropdown across the site.
          </p>
        </header>

        {/* ====================================================================
            UPLOAD FORM
            ==================================================================== */}
        <section className="bg-white/50 dark:bg-hunter-shadow p-6 rounded border border-slate-300 dark:border-slate-800">
          <h2 className="font-serif text-xl uppercase tracking-widest text-hunter-mid dark:text-hunter-gold mb-4">
            Install New Font
          </h2>
          <FontUploadForm />
        </section>

        {/* ====================================================================
            INSTALLED FONTS
            ==================================================================== */}
        <section>
          <div className="flex items-baseline justify-between border-b-2 border-hunter-warm pb-2 mb-4">
            <h2 className="font-serif text-2xl uppercase tracking-widest text-hunter-mid dark:text-hunter-gold">
              Installed Fonts
            </h2>
            <span className="font-mono text-xs text-slate-500">
              {fonts.length} {fonts.length === 1 ? "font" : "fonts"}
            </span>
          </div>

          {fonts.length === 0 ? (
            <p className="font-mono italic text-slate-500 text-sm">
              No custom fonts uploaded yet. The built-in fonts (Inter,
              Playfair Display, Caveat, JetBrains Mono) are still available
              in the editor.
            </p>
          ) : (
            <ul className="space-y-3">
              {fonts.map((font) => {
                const id = font._id.toString();
                return (
                  <li
                    key={id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center px-4 py-3 rounded border border-hunter-warm/20 bg-white/40 dark:bg-hunter-night/30"
                  >
                    <div>
                      <p className="font-serif text-lg text-hunter-dark dark:text-hunter-parchment">
                        {font.name}
                      </p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mt-0.5">
                        family: {font.family} · weight: {font.weight} ·{" "}
                        {font.style} · {humanFileSize(font.fileSize)}
                      </p>
                      {/* Live preview using the actual font.
                          The @font-face is injected by CustomFontStyles in
                          app/layout.tsx — `font-family: "<family>"` works
                          everywhere by the time this renders. */}
                      <p
                        className="mt-3 text-2xl text-hunter-dark dark:text-hunter-parchment"
                        style={{ fontFamily: `"${font.family}"` }}
                      >
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                    <DeleteFontButton id={id} name={font.name} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
