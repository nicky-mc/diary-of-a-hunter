// src/components/ui/rich-text/extensions.ts
//
// One place to wire up every Tiptap extension the editor uses.
// The main RichTextEditor imports buildExtensions() and passes the result
// straight into useEditor — keeps the editor file uncluttered.

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import Typography from "@tiptap/extension-typography";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

import { Figure } from "./Figure";
import { FontSize } from "./FontSize";

export function buildExtensions(placeholder = "Start writing…") {
  return [
    // StarterKit covers: doc, paragraph, text, bold, italic, strike, code,
    // codeBlock, blockquote, heading, hardBreak, history, horizontalRule,
    // listItem, bulletList, orderedList. We disable codeBlock here only if
    // we wanted to customise it; the default is good.
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      // dropcursor + gapcursor are included — both important for a good UX
    }),

    // Inline formatting that's not in StarterKit
    Underline,
    Subscript,
    Superscript,

    // textStyle is a base mark that Color / FontFamily / FontSize all hang off
    TextStyle,
    Color,
    FontFamily,
    FontSize,
    Highlight.configure({ multicolor: true }),

    // Block formatting
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right", "justify"],
    }),

    // Smart typography — automatic em-dashes, smart quotes, etc.
    Typography,

    // Links — opens in a new tab and adds rel=noopener
    Link.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: {
        rel: "noopener noreferrer",
        target: "_blank",
      },
    }),

    // Our custom Figure node — handles all image needs (no @tiptap/extension-image)
    Figure,

    // YouTube embeds. The user pastes a URL via the toolbar.
    Youtube.configure({
      controls: true,
      modestBranding: true,
      HTMLAttributes: { class: "doah-youtube my-4 mx-auto" },
    }),

    // Tables
    Table.configure({
      resizable: true,
      HTMLAttributes: { class: "doah-table" },
    }),
    TableRow,
    TableHeader,
    TableCell,

    // Empty-state placeholder
    Placeholder.configure({
      placeholder,
      // Show placeholder inside empty paragraphs anywhere in the document,
      // not just the first one — handy when content is cleared.
      showOnlyWhenEditable: true,
    }),
  ];
}
