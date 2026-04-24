// app/admin/wiki/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Save, Plus, Trash2, ArrowLeft } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function NewWikiEntry() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weaknesses, setWeaknesses] = useState<string[]>([""]);

  const addWeakness = () => setWeaknesses([...weaknesses, ""]);
  const removeWeakness = (index: number) => {
    setWeaknesses(weaknesses.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title"),
      category: formData.get("category"),
      threatLevel: formData.get("threatLevel") || "Unknown",
      content: content, // HTML from your custom RichTextEditor
      weaknesses: weaknesses.filter((w) => w.trim() !== ""),
    };

    try {
      const res = await fetch("/api/wiki", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to commit to archives.");
      }

      router.push("/wiki");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4ECD8] dark:bg-[#0a0a0a] p-6 md:p-12 text-slate-900 dark:text-slate-200">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-sm font-bold uppercase text-[#8B5A2B] hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <header className="border-b-4 border-[#5C3A21] pb-4 mb-8">
          <h1 className="font-serif text-4xl font-bold uppercase text-[#5C3A21] dark:text-[#D4A373] flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-red-600" />
            Classify New Lore
          </h1>
        </header>

        {error && (
          <div className="bg-red-900/10 border-l-4 border-red-600 p-4 mb-6 text-red-600 font-mono text-sm">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/50 dark:bg-[#121212] p-6 rounded border border-slate-300 dark:border-slate-800">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Entity Name
              </label>
              <input
                name="title"
                required
                className="w-full bg-transparent border-b border-slate-400 focus:border-[#8B5A2B] outline-none py-2 text-xl font-serif"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Category
              </label>
              <select
                name="category"
                required
                className="w-full bg-transparent border-b border-slate-400 focus:border-[#8B5A2B] outline-none py-2"
              >
                <option value="bestiary">Bestiary</option>
                <option value="weapons">Weapons</option>
                <option value="bloodlines">Bloodlines</option>
                <option value="conspiracy">Conspiracy</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 bg-white/50 dark:bg-[#121212] p-6 rounded border border-slate-300 dark:border-slate-800">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Threat Level & Countermeasures
            </label>
            <input
              name="threatLevel"
              className="w-full bg-transparent border-b border-slate-400 focus:border-[#8B5A2B] outline-none py-2 mb-4"
              placeholder="Threat Level (e.g. Level IV)"
            />

            {weaknesses.map((w, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={w}
                  onChange={(e) => {
                    const newW = [...weaknesses];
                    newW[index] = e.target.value;
                    setWeaknesses(newW);
                  }}
                  className="flex-grow bg-slate-100 dark:bg-white/5 p-2 rounded outline-none"
                  placeholder="Known weakness..."
                />
                <button
                  type="button"
                  onClick={() => removeWeakness(index)}
                  className="text-red-500 hover:bg-red-500/10 p-2 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addWeakness}
              className="flex items-center gap-2 text-xs font-bold text-[#8B5A2B] uppercase"
            >
              <Plus size={16} /> Add Countermeasure
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Detailed Observation logs
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
            className="w-full bg-[#5C3A21] text-[#F4ECD8] py-5 font-bold uppercase tracking-[0.3em] hover:bg-[#8B5A2B] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
          >
            {loading ? (
              "COMMITTING..."
            ) : (
              <>
                <Save className="h-5 w-5" /> Save to Archive
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
