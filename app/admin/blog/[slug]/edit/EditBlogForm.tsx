// src/app/admin/blog/[slug]/edit/EditBlogForm.tsx
//
// Client form for editing a blog post. Mirrors the /new form layout but is
// initialised from props and PUTs to /api/blog/[id] instead of POSTing.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";
import CoverImageUploader, {
  type CoverImageValue,
} from "@/components/ui/CoverImageUploader";

export interface BlogInitialData {
  id: string;
  title: string;
  tags: string;
  content: string;
  excerpt: string;
  isPublished: boolean;
  coverImage: CoverImageValue | null;
}

export default function EditBlogForm({
  initial,
}: {
  initial: BlogInitialData;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [tags, setTags] = useState(initial.tags);
  const [content, setContent] = useState(initial.content);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [isPublished, setIsPublished] = useState(initial.isPublished);
  const [coverImage, setCoverImage] = useState<CoverImageValue | null>(
    initial.coverImage,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/blog/${initial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tags,
          content,
          excerpt: excerpt || undefined,
          isPublished,
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

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Update failed.");
      }

      router.push("/admin/manage");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/admin/manage"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-hunter-warm hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Manage
        </Link>

        <header className="border-b-2 border-hunter-warm pb-4">
          <h1 className="font-serif text-3xl font-bold uppercase tracking-widest text-hunter-mid dark:text-hunter-gold">
            Edit Field Report
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Editing &ldquo;{initial.title}&rdquo;
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
              className="w-full rounded border border-slate-300 bg-white/80 p-3 text-slate-900 focus:border-hunter-warm focus:ring-1 focus:ring-hunter-warm outline-none dark:border-slate-700 dark:bg-hunter-shadow dark:text-slate-100"
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
              className="w-full rounded border border-slate-300 bg-white/80 p-3 text-slate-900 focus:border-hunter-warm focus:ring-1 focus:ring-hunter-warm outline-none dark:border-slate-700 dark:bg-hunter-shadow dark:text-slate-100"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="excerpt"
              className="text-sm font-semibold uppercase tracking-wider"
            >
              Excerpt (Optional — auto-generated from content if blank)
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full rounded border border-slate-300 bg-white/80 p-3 text-sm text-slate-900 focus:border-hunter-warm focus:ring-1 focus:ring-hunter-warm outline-none dark:border-slate-700 dark:bg-hunter-shadow dark:text-slate-100"
            />
          </div>

          <CoverImageUploader
            value={coverImage}
            onChange={setCoverImage}
            label="Cover Image"
          />

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

          {/* Publish toggle — drafts are hidden from /blog */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4 accent-hunter-warm"
            />
            <span className="text-sm font-bold uppercase tracking-widest">
              {isPublished ? "Published" : "Draft (hidden from public)"}
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !content || !title}
            className="w-full rounded bg-hunter-mid px-4 py-3 font-bold uppercase tracking-widest text-hunter-parchment hover:bg-hunter-warm disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
