// src/components/ui/RichTextEditor.tsx
"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
// Import the official v2 styles
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);
  const isInitializing = useRef(true);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      // The Full Suite: Every tool Quill offers natively.
      const fullToolbarOptions = [
        [{ font: [] }, { size: ["small", false, "large", "huge"] }], // Font family and size
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // Full heading control

        ["bold", "italic", "underline", "strike"], // Core formatting
        [{ color: [] }, { background: [] }], // Text color and highlighter
        [{ script: "sub" }, { script: "super" }], // Superscript/Subscript (good for chemistry/spells)

        [{ align: [] }], // Text alignment
        [{ list: "ordered" }, { list: "bullet" }], // Lists
        [{ indent: "-1" }, { indent: "+1" }], // Indentation control

        ["blockquote", "code-block"], // Blocks
        ["link", "image", "video"], // Media embeds (URL-based by default)

        ["clean"], // Clear all formatting
      ];

      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder || "Document the encounter in full detail...",
        modules: {
          toolbar: fullToolbarOptions,
        },
      });

      // Listen for text changes and pass the raw HTML back to your form
      quillInstance.current.on("text-change", () => {
        const html = quillInstance.current?.root.innerHTML || "";
        onChange(html);
      });
    }
  }, [onChange, placeholder]);

  // Handle updates if the value changes externally (like clearing the form after saving)
  useEffect(() => {
    if (
      quillInstance.current &&
      value !== quillInstance.current.root.innerHTML
    ) {
      if (isInitializing.current) {
        quillInstance.current.clipboard.dangerouslyPasteHTML(value);
        isInitializing.current = false;
      }
    }
  }, [value]);

  return (
    // We keep the container light because Quill's advanced dropdowns (colors, fonts, sizes)
    // are strictly designed for a light theme by default.
    <div className="quill-wrapper rounded bg-slate-50 border border-slate-300 dark:border-slate-600 transition-colors">
      <div ref={editorRef} className="min-h-[400px] text-slate-900" />
    </div>
  );
}
