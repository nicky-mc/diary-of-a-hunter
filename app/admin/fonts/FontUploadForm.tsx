// src/app/admin/fonts/FontUploadForm.tsx
//
// Client form for uploading a single font file.
// Sends multipart/form-data to /api/fonts which proxies the upload to
// Cloudinary as a raw asset — the user never needs to touch a Cloudinary
// upload preset.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, FileType } from "lucide-react";

export default function FontUploadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("400");
  const [style, setStyle] = useState("normal");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Give the font a display name.");
      return;
    }
    if (!file) {
      setError("Choose a font file (.woff2 recommended).");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("weight", weight);
      fd.append("style", style);
      fd.append("file", file);

      const res = await fetch("/api/fonts", { method: "POST", body: fd });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      // Reset form + refresh server data so the new font appears below
      setName("");
      setWeight("400");
      setStyle("normal");
      setFile(null);
      // The file input doesn't reset by clearing state — reset by selector.
      const input = document.getElementById("font-file") as HTMLInputElement | null;
      if (input) input.value = "";
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          role="alert"
          className="rounded border border-red-900/50 bg-red-500/10 p-3 text-sm text-red-800 dark:text-red-400 font-mono"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-3 space-y-1">
          <label
            htmlFor="font-name"
            className="text-xs font-bold uppercase tracking-widest text-slate-500"
          >
            Display Name
          </label>
          <input
            id="font-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Eldritch Display"
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-hunter-shadow px-3 py-2 outline-none focus:border-hunter-warm focus:ring-1 focus:ring-hunter-warm"
            disabled={submitting}
          />
          <p className="text-[10px] text-slate-400 font-mono">
            How the font appears in the editor dropdown. A URL-safe slug will
            be auto-generated for CSS use.
          </p>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="font-weight"
            className="text-xs font-bold uppercase tracking-widest text-slate-500"
          >
            Weight
          </label>
          <select
            id="font-weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-hunter-shadow px-3 py-2 outline-none focus:border-hunter-warm"
            disabled={submitting}
          >
            <option value="100">100 — Thin</option>
            <option value="300">300 — Light</option>
            <option value="400">400 — Regular</option>
            <option value="500">500 — Medium</option>
            <option value="600">600 — Semibold</option>
            <option value="700">700 — Bold</option>
            <option value="800">800 — Extrabold</option>
            <option value="900">900 — Black</option>
            <option value="100 900">100–900 — Variable</option>
          </select>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="font-style"
            className="text-xs font-bold uppercase tracking-widest text-slate-500"
          >
            Style
          </label>
          <select
            id="font-style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-hunter-shadow px-3 py-2 outline-none focus:border-hunter-warm"
            disabled={submitting}
          >
            <option value="normal">Normal</option>
            <option value="italic">Italic</option>
          </select>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="font-file"
            className="text-xs font-bold uppercase tracking-widest text-slate-500"
          >
            Font File
          </label>
          <label
            htmlFor="font-file"
            className="flex items-center gap-2 rounded border-2 border-dashed border-hunter-warm/40 bg-white/50 dark:bg-hunter-shadow/50 px-3 py-2 cursor-pointer hover:border-hunter-warm hover:bg-hunter-warm/5 transition-colors text-sm"
          >
            <FileType className="h-4 w-4 text-hunter-warm shrink-0" />
            <span className="truncate">
              {file ? file.name : "Choose .woff2 / .woff / .ttf / .otf"}
            </span>
          </label>
          <input
            id="font-file"
            type="file"
            accept=".woff2,.woff,.ttf,.otf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="sr-only"
            disabled={submitting}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded bg-hunter-mid hover:bg-hunter-warm text-hunter-parchment px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Install Font
          </>
        )}
      </button>
    </form>
  );
}
