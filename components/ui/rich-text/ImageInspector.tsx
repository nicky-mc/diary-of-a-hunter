// src/components/ui/rich-text/ImageInspector.tsx
//
// Floating panel that appears whenever a Figure node is selected.
// Lets the user tune everything about an image without diving into HTML:
//   - Alignment (left / center / right / full-width)
//   - Width (numeric input + slider)
//   - Border radius (slider)
//   - Border width + colour
//   - Alt text (accessibility — separate from caption which lives in the figcaption)
//   - Delete

"use client";

import { BubbleMenu, type Editor } from "@tiptap/react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Trash2,
} from "lucide-react";
import type { FigureAlign, FigureAttrs } from "./Figure";

interface ImageInspectorProps {
  editor: Editor;
}

// Reusable mini-button used for the alignment row
function MiniBtn({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`inline-flex h-7 w-7 items-center justify-center rounded transition-colors ${
        active
          ? "bg-hunter-warm text-hunter-parchment"
          : "text-slate-700 dark:text-slate-300 hover:bg-hunter-warm/20"
      }`}
    >
      {children}
    </button>
  );
}

export default function ImageInspector({ editor }: ImageInspectorProps) {
  return (
    <BubbleMenu
      editor={editor}
      // Only render when a Figure is the active selection
      shouldShow={({ editor }) => editor.isActive("figure")}
      tippyOptions={{
        placement: "top",
        offset: [0, 12],
        maxWidth: 360,
      }}
      className="w-[320px] rounded-lg border border-hunter-warm/40 bg-hunter-parchment dark:bg-hunter-shadow shadow-xl p-3 space-y-3"
    >
      {(() => {
        // Pull live attrs from the editor each render
        const attrs = editor.getAttributes("figure") as Partial<FigureAttrs>;
        const align = (attrs.align ?? "center") as FigureAlign;
        const width = attrs.width ?? null;
        const borderRadius = attrs.borderRadius ?? 8;
        const borderWidth = attrs.borderWidth ?? 0;
        const borderColor = attrs.borderColor ?? "#8B5A2B";
        const alt = attrs.alt ?? "";

        const update = (patch: Partial<FigureAttrs>) =>
          editor.chain().focus().updateAttributes("figure", patch).run();

        return (
          <>
            {/* ALIGNMENT */}
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Alignment
              </p>
              <div className="flex gap-1">
                <MiniBtn
                  active={align === "left"}
                  onClick={() => update({ align: "left" })}
                  title="Float left"
                >
                  <AlignLeft className="h-4 w-4" />
                </MiniBtn>
                <MiniBtn
                  active={align === "center"}
                  onClick={() => update({ align: "center" })}
                  title="Centre"
                >
                  <AlignCenter className="h-4 w-4" />
                </MiniBtn>
                <MiniBtn
                  active={align === "right"}
                  onClick={() => update({ align: "right" })}
                  title="Float right"
                >
                  <AlignRight className="h-4 w-4" />
                </MiniBtn>
                <MiniBtn
                  active={align === "full"}
                  onClick={() => update({ align: "full", width: null })}
                  title="Full width"
                >
                  <Maximize2 className="h-4 w-4" />
                </MiniBtn>
              </div>
            </div>

            {/* WIDTH */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Width
                </p>
                <input
                  type="number"
                  min={80}
                  max={1600}
                  step={10}
                  value={width ?? ""}
                  placeholder="auto"
                  onChange={(e) =>
                    update({
                      width: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-20 rounded border border-slate-300 dark:border-slate-700 bg-transparent px-1.5 py-0.5 text-xs text-right"
                />
              </div>
              <input
                type="range"
                min={80}
                max={1200}
                step={10}
                value={width ?? 600}
                onChange={(e) => update({ width: Number(e.target.value) })}
                className="mt-1 w-full accent-hunter-warm"
              />
            </div>

            {/* BORDER RADIUS */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Border radius
                </p>
                <span className="text-xs font-mono text-slate-500">
                  {borderRadius}px
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={64}
                step={1}
                value={borderRadius}
                onChange={(e) =>
                  update({ borderRadius: Number(e.target.value) })
                }
                className="mt-1 w-full accent-hunter-warm"
              />
            </div>

            {/* BORDER */}
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Border
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={1}
                  value={borderWidth}
                  onChange={(e) =>
                    update({ borderWidth: Number(e.target.value) })
                  }
                  className="flex-1 accent-hunter-warm"
                />
                <span className="text-xs font-mono text-slate-500 w-10 text-right">
                  {borderWidth}px
                </span>
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => update({ borderColor: e.target.value })}
                  className="h-6 w-8 cursor-pointer rounded border border-slate-300 dark:border-slate-700 p-0"
                  aria-label="Border colour"
                />
              </div>
            </div>

            {/* ALT TEXT */}
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Alt text (accessibility)
              </p>
              <input
                type="text"
                value={alt}
                onChange={(e) => update({ alt: e.target.value })}
                placeholder="Describe the image for screen readers"
                className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-xs font-mono"
              />
            </div>

            {/* DELETE */}
            <div className="pt-2 border-t border-hunter-warm/20">
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().deleteSelection().run()
                }
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove image
              </button>
            </div>
          </>
        );
      })()}
    </BubbleMenu>
  );
}
