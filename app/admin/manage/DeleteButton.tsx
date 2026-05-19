// src/app/admin/manage/DeleteButton.tsx
//
// Small client component for the manage table — wraps a confirm + DELETE
// fetch against /api/blog/[id] or /api/wiki/[id]. Refreshes the route's
// server data on success so the row disappears without a full page reload.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteButtonProps {
  kind: "blog" | "wiki";
  id: string;
  title: string;
}

export default function DeleteButton({ kind, id, title }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    if (loading) return;
    // Double-confirm purge — these are irreversible
    const ok = window.confirm(
      `Purge "${title}" permanently? This cannot be undone.`,
    );
    if (!ok) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/${kind}/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Delete failed.");
      }
      // Re-fetch the server component so the row vanishes
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={onDelete}
        disabled={loading}
        className="inline-flex items-center gap-1 rounded border border-red-700/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-700 hover:bg-red-700/10 transition-colors disabled:opacity-50"
        aria-label={`Delete ${title}`}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        Purge
      </button>
      {error && (
        <span className="mt-1 text-[10px] font-mono text-red-600">{error}</span>
      )}
    </div>
  );
}
