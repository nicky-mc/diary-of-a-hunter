// src/app/admin/wiki/[slug]/edit/EditWikiForm.tsx
//
// Client form for editing a wiki entry. Mirrors the /new form layout but is
// initialised from props and PUTs to /api/wiki/[id] instead of POSTing.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Save, Plus, Trash2, ArrowLeft } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import CoverImageUploader, {
  type CoverImageValue,
} from "@/components/ui/CoverImageUploader";

export interface WikiInitialData {
  id: string;
  title: string;
  category: string;
  threatLevel: string;
  weaknesses: string[];
  content: string;
  coverImage: CoverImageValue | null;
}

export default function EditWikiForm({
  initial,
}: {
  initial: WikiInitialData;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [category, setCategory] = useState(initial.category);
  const [threatLevel, setThreatLevel] = useState(initial.threatLevel);
  const [weaknesses, setWeaknesses] = useState<string[]>(initial.weaknesses);
  const [content, setContent] = useState(initial.content);
  const [coverImage, setCoverImage] = useState<CoverImageValue | null>(
    initial.coverImage,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addWeakness = () => setWeaknesses([...weaknesses, ""]);
  const removeWeakness = (i: number) =>
    setWeaknesses(weaknesses.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/wiki/${initial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          threatLevel,
          weaknesses: weaknesses.filter((w) => w.trim() !== ""),
          content,
          // Always send the field — null explicitly clears an existing image,
          // an object replaces it. (undefined would leave it untouched.)
          coverImage: coverImage
            ? {
                url: coverImage.url,
                altText: coverImage.altText || title,
              }
            : null,
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Update failed.");
      }

      router.push("/admin/manage");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/manage"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase text-hunter-warm hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Manage
        </Link>

        <header className="border-b-4 border-hunter-mid pb-4 mb-8">
          <h1 className="font-serif text-4xl font-bold uppercase text-hunter-mid dark:text-hunter-gold flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-red-600" />
            Edit Lore Entry
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Editing &ldquo;{initial.title}&rdquo;
          </p>
        </header>

        {error && (
          <div className="bg-red-900/10 border-l-4 border-red-600 p-4 mb-6 text-red-600 font-mono text-sm">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/50 dark:bg-hunter-shadow p-6 rounded border border-slate-300 dark:border-slate-800">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Entity Name
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-transparent border-b border-slate-400 focus:border-hunter-warm outline-none py-2 text-xl font-serif"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-transparent border-b border-slate-400 focus:border-hunter-warm outline-none py-2 dark:bg-hunter-shadow"
              >
                <option value="bestiary">Bestiary</option>
                <option value="weapons">Weapons</option>
                <option value="bloodlines">Bloodlines</option>
                <option value="conspiracy">Conspiracy</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 bg-white/50 dark:bg-hunter-shadow p-6 rounded border border-slate-300 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Threat Level & Countermeasures
            </label>
            <select
              value={threatLevel}
              onChange={(e) => setThreatLevel(e.target.value)}
              className="w-full bg-transparent border-b border-slate-400 focus:border-hunter-warm outline-none py-2 mb-4 dark:bg-hunter-shadow"
            >
              <option value="Unknown">Unknown</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
              <option value="Apocalyptic">Apocalyptic</option>
            </select>

            {weaknesses.map((w, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={w}
                  onChange={(e) => {
                    const next = [...weaknesses];
                    next[index] = e.target.value;
                    setWeaknesses(next);
                  }}
                  className="flex-grow bg-slate-100 dark:bg-white/5 p-2 rounded outline-none"
                  placeholder="Known weakness..."
                />
                <button
                  type="button"
                  onClick={() => removeWeakness(index)}
                  className="text-red-500 hover:bg-red-500/10 p-2 rounded"
                  aria-label="Remove weakness"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addWeakness}
              className="flex items-center gap-2 text-xs font-bold text-hunter-warm uppercase"
            >
              <Plus size={16} /> Add Countermeasure
            </button>
          </div>

          <div className="bg-white/50 dark:bg-hunter-shadow p-6 rounded border border-slate-300 dark:border-slate-800">
            <CoverImageUploader
              value={coverImage}
              onChange={setCoverImage}
              label="Entity Photo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Detailed Observation Logs
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Record the encounter, origin, and specific behaviors..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hunter-mid text-hunter-parchment py-5 font-bold uppercase tracking-[0.3em] hover:bg-hunter-warm transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
          >
            {loading ? (
              "SAVING..."
            ) : (
              <>
                <Save className="h-5 w-5" /> Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
