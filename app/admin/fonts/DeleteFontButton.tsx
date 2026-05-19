// src/app/admin/fonts/DeleteFontButton.tsx
//
// Confirmation + DELETE for a single font row.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteFontButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    if (loading) return;
    const ok = window.confirm(
      `Remove "${name}"? Existing content using this font will fall back to the default sans-serif.`,
    );
    if (!ok) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/fonts/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Delete failed.");
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
        aria-label={`Remove ${name}`}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
        Remove
      </button>
      {error && (
        <span className="mt-1 text-[10px] font-mono text-red-600">{error}</span>
      )}
    </div>
  );
}
