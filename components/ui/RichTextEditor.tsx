// src/components/ui/RichTextEditor.tsx
//
// Tiptap-backed rich text editor.
//
// Public API stays identical to the previous Quill version — every form
// that imports this component continues to work without changes:
//
//   <RichTextEditor
//     value={html}
//     onChange={setHtml}
//     placeholder="…"
//   />
//
// Composition:
//   Toolbar         — the persistent top toolbar (lots of buttons)
//   ImageInspector  — floating menu shown when a figure is selected
//   Editor          — the actual contenteditable

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import Toolbar from "./rich-text/Toolbar";
import ImageInspector from "./rich-text/ImageInspector";
import { buildExtensions } from "./rich-text/extensions";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useEditor({
    // Important under Next.js App Router — Tiptap renders client-only,
    // and `immediatelyRender: false` avoids hydration warnings.
    immediatelyRender: false,
    extensions: buildExtensions(placeholder ?? "Start writing…"),
    content: value || "",
    editorProps: {
      attributes: {
        // These classes drive the prose styling INSIDE the editor.
        // The same classes are reused on the public detail pages, so what
        // you see while writing matches what readers will see.
        class:
          "doah-editor prose prose-slate dark:prose-invert max-w-none min-h-[400px] px-4 py-4 focus:outline-none prose-headings:font-serif prose-headings:text-hunter-dark dark:prose-headings:text-hunter-parchment prose-a:text-hunter-warm dark:prose-a:text-hunter-gold",
      },
    },
    onUpdate({ editor }) {
      // Emit HTML back to the parent on every change
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync if the parent resets it externally
  // (e.g. after a successful save that clears the form).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "");
    }
    // We intentionally don't include `editor` here — calling setContent on
    // every editor reference change would loop with the onUpdate handler.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) {
    // Skeleton placeholder while the editor instance is constructed
    return (
      <div className="rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-hunter-shadow min-h-[460px] animate-pulse" />
    );
  }

  // No `overflow-hidden` on the wrapper — it would create a scroll context
  // that traps the sticky toolbar inside the editor. Without it, the toolbar
  // sticks to the viewport instead, so it stays visible while the user
  // scrolls through a long document (or past a cover image above).
  // Border + radius live on the toolbar (top) and the content area (bottom)
  // instead of the outer wrapper, so visual edges still line up.
  return (
    <div className="rounded-md bg-white/80 dark:bg-hunter-shadow">
      <Toolbar editor={editor} />
      <ImageInspector editor={editor} />
      <EditorContent
        editor={editor}
        className="border border-t-0 border-slate-300 dark:border-slate-700 rounded-b-md"
      />
    </div>
  );
}
