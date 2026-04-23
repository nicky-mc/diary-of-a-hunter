// src/app/admin/blog/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function NewFieldReport() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tags, content }),
      });

      const data = (await response.json()) as {
        error?: string;
        success?: boolean;
      };

      if (!response.ok) {
        throw new Error(data.error || "Transmission failed. Signal lost.");
      }

      // Success. The intel is in the vault.
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      // Type guard: Check if err is actually an Error object
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown supernatural error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4ECD8] dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-200 p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b-2 border-[#8B5A2B] pb-4">
          <h1 className="font-serif text-3xl font-bold uppercase tracking-widest text-[#5C3A21] dark:text-[#D4A373]">
            Draft Field Report
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Log the details. Keep it accurate. Your intel might save a life.
          </p>
        </header>

        {error && (
          <div
            className="rounded border border-red-900/50 bg-red-500/10 p-4 text-sm text-red-800 dark:text-red-400 font-bold"
            role="alert"
          >
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-semibold uppercase tracking-wider"
            >
              Subject / Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white/80 p-3 text-slate-900 focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] outline-none dark:border-slate-700 dark:bg-[#121212] dark:text-slate-100"
              placeholder="e.g., Midnight Skirmish at the Docks"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="tags"
              className="text-sm font-semibold uppercase tracking-wider"
            >
              Classification Tags (Comma Separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white/80 p-3 text-slate-900 focus:border-[#8B5A2B] focus:ring-1 focus:ring-[#8B5A2B] outline-none dark:border-slate-700 dark:bg-[#121212] dark:text-slate-100"
              placeholder="e.g., ghoul, silver, close-call"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider block">
              Incident Report (Content)
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Document the encounter..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !content || !title}
            className="w-full rounded bg-[#5C3A21] px-4 py-3 font-bold uppercase tracking-widest text-[#F4ECD8] hover:bg-[#8B5A2B] disabled:opacity-50 transition-all active:scale-95"
          >
            {isSubmitting ? "Encrypting..." : "Publish Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
