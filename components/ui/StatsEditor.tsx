// src/components/ui/StatsEditor.tsx
//
// Reusable editor for the wiki-style infobox (label / value rows).
// Used by both /admin/wiki/new and /admin/wiki/[slug]/edit so adding,
// reordering, and removing stats lives in one place.

"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";

export interface StatRow {
  label: string;
  value: string;
}

interface StatsEditorProps {
  value: StatRow[];
  onChange: (next: StatRow[]) => void;
  label?: string;
}

export default function StatsEditor({
  value,
  onChange,
  label = "Infobox Stats",
}: StatsEditorProps) {
  // Always render at least one empty row so the user has somewhere to type
  const rows = value.length === 0 ? [{ label: "", value: "" }] : value;

  const updateRow = (index: number, patch: Partial<StatRow>) => {
    const next = rows.map((r, i) => (i === index ? { ...r, ...patch } : r));
    onChange(next);
  };

  const addRow = () => onChange([...rows, { label: "", value: "" }]);

  const removeRow = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    onChange(next);
  };

  const move = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= rows.length) return;
    const next = [...rows];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {label}
        </label>
        <span className="text-[10px] font-mono text-slate-400">
          Renders as a Wikipedia-style infobox in the sidebar
        </span>
      </div>

      <div className="space-y-2">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* Reorder controls — keyboard accessible, no drag library needed */}
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="text-slate-400 hover:text-hunter-warm disabled:opacity-30 text-[10px] leading-none"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === rows.length - 1}
                aria-label="Move down"
                className="text-slate-400 hover:text-hunter-warm disabled:opacity-30 text-[10px] leading-none"
              >
                ▼
              </button>
            </div>

            <GripVertical className="h-4 w-4 text-slate-400 shrink-0" />

            <input
              value={row.label}
              onChange={(e) => updateRow(index, { label: e.target.value })}
              placeholder="Label (e.g. Origin)"
              className="w-32 bg-slate-100 dark:bg-white/5 px-2 py-1.5 rounded text-sm font-bold outline-none focus:ring-1 focus:ring-hunter-warm"
              maxLength={60}
            />

            <input
              value={row.value}
              onChange={(e) => updateRow(index, { value: e.target.value })}
              placeholder="Value (e.g. Eastern Europe)"
              className="flex-1 bg-slate-100 dark:bg-white/5 px-2 py-1.5 rounded text-sm outline-none focus:ring-1 focus:ring-hunter-warm"
              maxLength={200}
            />

            <button
              type="button"
              onClick={() => removeRow(index)}
              className="text-red-500 hover:bg-red-500/10 p-1.5 rounded shrink-0"
              aria-label="Remove stat row"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-hunter-warm uppercase tracking-widest hover:underline"
      >
        <Plus size={14} /> Add stat row
      </button>
    </div>
  );
}
