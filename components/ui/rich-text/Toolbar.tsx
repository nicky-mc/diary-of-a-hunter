// src/components/ui/rich-text/Toolbar.tsx
//
// The persistent top toolbar for the rich text editor.
// Each section is grouped visually with a divider. Buttons are typed via
// the small ToolbarButton helper so adding more is trivial.

"use client";

import { type Editor } from "@tiptap/react";
import { CldUploadWidget } from "next-cloudinary";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Subscript as SubIcon,
  Superscript as SupIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  // lucide-react v1.x dropped the `Youtube` brand icon — `Video` is the
  // standard generic substitute and renders nicely in the toolbar.
  Video,
  Table as TableIcon,
  Undo2,
  Redo2,
  RemoveFormatting,
  Highlighter,
  Palette,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
} from "lucide-react";
import { FONT_OPTIONS } from "@/lib/fonts";

interface ToolbarProps {
  editor: Editor;
}

// =============================================================================
// Reusable button helpers
// =============================================================================

interface BtnProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function Btn({ onClick, active, disabled, title, children }: BtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`inline-flex h-8 w-8 items-center justify-center rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active
          ? "bg-hunter-warm text-hunter-parchment"
          : "text-slate-700 dark:text-slate-300 hover:bg-hunter-warm/20"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-slate-300 dark:bg-slate-700" />;
}

// =============================================================================
// Predefined font-size values (CSS pixel strings)
// =============================================================================

const FONT_SIZES = [
  { label: "XS", value: "12px" },
  { label: "S", value: "14px" },
  { label: "Default", value: "" },
  { label: "L", value: "18px" },
  { label: "XL", value: "22px" },
  { label: "2XL", value: "28px" },
  { label: "3XL", value: "36px" },
];

// =============================================================================
// Toolbar
// =============================================================================

export default function Toolbar({ editor }: ToolbarProps) {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // -------- Prompts (link / youtube) ----------------------------------------

  const setLink = () => {
    const existing = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL (leave empty to remove):", existing);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const addYoutube = () => {
    const url = window.prompt("YouTube URL:");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url, width: 640, height: 360 });
  };

  const insertTable = () =>
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();

  // -------- Block format dropdown -------------------------------------------

  const currentBlock = (() => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    if (editor.isActive("heading", { level: 4 })) return "h4";
    if (editor.isActive("heading", { level: 5 })) return "h5";
    if (editor.isActive("heading", { level: 6 })) return "h6";
    return "p";
  })();

  const applyBlock = (val: string) => {
    const chain = editor.chain().focus();
    if (val === "p") chain.setParagraph().run();
    else
      chain
        .toggleHeading({
          level: Number(val.replace("h", "")) as 1 | 2 | 3 | 4 | 5 | 6,
        })
        .run();
  };

  return (
    {/*
       Sticky at top-16 so the toolbar sits BELOW the h-16 TopNav as the
       user scrolls through long content. z-20 keeps it above editor body
       text but below the nav (z-50) and dropdown menus.
    */}
    <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 border-slate-300 dark:border-slate-700 bg-hunter-parchment/95 dark:bg-hunter-shadow/95 backdrop-blur-sm px-2 py-1.5 sticky top-16 z-20">
      {/* ============================================================
          Undo / Redo
         ============================================================ */}
      <Btn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 className="h-4 w-4" />
      </Btn>

      <Divider />

      {/* ============================================================
          Block format dropdown (paragraph / h1..h6)
         ============================================================ */}
      <select
        value={currentBlock}
        onChange={(e) => applyBlock(e.target.value)}
        className="h-8 rounded bg-transparent px-2 text-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-hunter-warm/10 cursor-pointer"
        aria-label="Block format"
        title="Block format"
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="h5">Heading 5</option>
        <option value="h6">Heading 6</option>
      </select>

      {/* ============================================================
          Quick paragraph / H1-3 shortcuts (icons mirror the dropdown)
         ============================================================ */}
      <Btn
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive("paragraph")}
        title="Paragraph"
      >
        <Pilcrow className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Btn>

      <Divider />

      {/* ============================================================
          Font family + size dropdowns
         ============================================================ */}
      <select
        onChange={(e) => {
          const val = e.target.value;
          if (val) editor.chain().focus().setFontFamily(val).run();
          else editor.chain().focus().unsetFontFamily().run();
        }}
        value={editor.getAttributes("textStyle").fontFamily ?? ""}
        className="h-8 rounded bg-transparent px-2 text-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-hunter-warm/10 cursor-pointer"
        aria-label="Font family"
        title="Font family"
      >
        <option value="">Font…</option>
        {FONT_OPTIONS.map((f) => (
          <option key={f.label} value={f.cssValue}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => {
          const v = e.target.value;
          if (v) editor.chain().focus().setFontSize(v).run();
          else editor.chain().focus().unsetFontSize().run();
        }}
        value={editor.getAttributes("textStyle").fontSize ?? ""}
        className="h-8 rounded bg-transparent px-2 text-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-hunter-warm/10 cursor-pointer"
        aria-label="Font size"
        title="Font size"
      >
        {FONT_SIZES.map((s) => (
          <option key={s.label} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <Divider />

      {/* ============================================================
          Inline formatting
         ============================================================ */}
      <Btn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Inline code"
      >
        <Code className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        active={editor.isActive("subscript")}
        title="Subscript"
      >
        <SubIcon className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        active={editor.isActive("superscript")}
        title="Superscript"
      >
        <SupIcon className="h-4 w-4" />
      </Btn>

      <Divider />

      {/* ============================================================
          Colour pickers — native <input type=color> keeps it light
         ============================================================ */}
      <label
        className="inline-flex h-8 items-center gap-1 rounded px-1.5 hover:bg-hunter-warm/20 cursor-pointer text-slate-700 dark:text-slate-300"
        title="Text colour"
      >
        <Palette className="h-4 w-4" />
        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          className="h-4 w-4 cursor-pointer rounded border-0 bg-transparent p-0"
          aria-label="Text colour"
        />
      </label>
      <label
        className="inline-flex h-8 items-center gap-1 rounded px-1.5 hover:bg-hunter-warm/20 cursor-pointer text-slate-700 dark:text-slate-300"
        title="Highlight colour"
      >
        <Highlighter className="h-4 w-4" />
        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().toggleHighlight({ color: e.target.value }).run()
          }
          className="h-4 w-4 cursor-pointer rounded border-0 bg-transparent p-0"
          aria-label="Highlight colour"
        />
      </label>

      <Divider />

      {/* ============================================================
          Alignment
         ============================================================ */}
      <Btn
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        title="Align left"
      >
        <AlignLeft className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        title="Align centre"
      >
        <AlignCenter className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        title="Align right"
      >
        <AlignRight className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        active={editor.isActive({ textAlign: "justify" })}
        title="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </Btn>

      <Divider />

      {/* ============================================================
          Lists & block elements
         ============================================================ */}
      <Btn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <List className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Numbered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Code block"
      >
        <Code2 className="h-4 w-4" />
      </Btn>
      <Btn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal rule"
      >
        <Minus className="h-4 w-4" />
      </Btn>

      <Divider />

      {/* ============================================================
          Link / image / youtube / table
         ============================================================ */}
      <Btn
        onClick={setLink}
        active={editor.isActive("link")}
        title="Insert / edit link"
      >
        <LinkIcon className="h-4 w-4" />
      </Btn>

      {uploadPreset ? (
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{
            sources: ["local", "url", "camera"],
            maxFiles: 1,
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
            maxFileSize: 10_000_000,
          }}
          onSuccess={(result) => {
            const info = result?.info as
              | { secure_url?: string; url?: string }
              | undefined;
            const src = info?.secure_url || info?.url;
            if (src) {
              editor.commands.insertFigure({ src, alt: "", caption: "" });
            }
          }}
        >
          {({ open }) => (
            <Btn onClick={() => open()} title="Insert image">
              <ImageIcon className="h-4 w-4" />
            </Btn>
          )}
        </CldUploadWidget>
      ) : (
        <Btn
          onClick={() =>
            alert(
              "Image upload disabled — set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local",
            )
          }
          title="Insert image (Cloudinary not configured)"
        >
          <ImageIcon className="h-4 w-4" />
        </Btn>
      )}

      <Btn onClick={addYoutube} title="Embed YouTube video">
        <Video className="h-4 w-4" />
      </Btn>

      <Btn onClick={insertTable} title="Insert 3×3 table">
        <TableIcon className="h-4 w-4" />
      </Btn>

      <Divider />

      {/* ============================================================
          Clear formatting
         ============================================================ */}
      <Btn
        onClick={() =>
          editor.chain().focus().unsetAllMarks().clearNodes().run()
        }
        title="Clear all formatting"
      >
        <RemoveFormatting className="h-4 w-4" />
      </Btn>
    </div>
  );
}
