// src/components/ui/rich-text/Figure.tsx
//
// Custom Tiptap node — renders <figure><img /><figcaption /></figure> with
// attributes for width, alignment, border radius, border, and alt text.
//
// The matching React NodeView (FigureNodeView below) gives editor users:
//   - A draggable right-edge resize handle
//   - Inline caption editing
//   - Alignment shortcuts
//   - All the styling attributes (width/border/radius/alt) the user requested
//
// The persisted HTML is plain semantic markup — works in `prose` containers
// on the public detail pages with no extra renderer needed.

import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  NodeViewContent,
} from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { useRef, useState, useEffect, type MouseEvent as ReactMouseEvent } from "react";

// -----------------------------------------------------------------------------
// Tiptap module augmentation — gives editor.commands.insertFigure(...) types
// -----------------------------------------------------------------------------

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    figure: {
      /**
       * Insert a figure with the given source. Other attributes default to
       * sensible values and can be edited via the bubble menu after insertion.
       */
      insertFigure: (attrs: {
        src: string;
        alt?: string;
        caption?: string;
      }) => ReturnType;
    };
  }
}

// -----------------------------------------------------------------------------
// Attribute shape
// -----------------------------------------------------------------------------

export type FigureAlign = "left" | "center" | "right" | "full";

export interface FigureAttrs {
  src: string;
  alt: string;
  width: number | null; // null = intrinsic
  align: FigureAlign;
  borderRadius: number; // px
  borderWidth: number; // px
  borderColor: string; // CSS color
  caption: string;
}

// -----------------------------------------------------------------------------
// The Node definition
// -----------------------------------------------------------------------------

export const Figure = Node.create({
  name: "figure",
  group: "block",
  // Captions can contain inline content. We expose this via the NodeViewContent
  // so the caption is part of the ProseMirror document, not just an attribute.
  content: "inline*",
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      src: { default: "" },
      alt: { default: "" },
      width: {
        default: null,
        parseHTML: (el) => {
          const w = el.querySelector("img")?.getAttribute("width");
          return w ? Number(w) : null;
        },
      },
      align: { default: "center" as FigureAlign },
      borderRadius: { default: 8 },
      borderWidth: { default: 0 },
      borderColor: { default: "#8B5A2B" },
      // Caption text is also stored as the node's inline content (see content
      // schema) — we keep the attribute as a fallback for plain HTML parsing.
      caption: { default: "" },
    };
  },

  // Parse incoming HTML — handles both our own output and pasted HTML
  parseHTML() {
    return [
      {
        tag: "figure[data-figure]",
        getAttrs: (el) => {
          if (!(el instanceof HTMLElement)) return false;
          const img = el.querySelector("img");
          if (!img) return false;
          return {
            src: img.getAttribute("src") ?? "",
            alt: img.getAttribute("alt") ?? "",
            width: img.getAttribute("width")
              ? Number(img.getAttribute("width"))
              : null,
            align: (el.getAttribute("data-align") ?? "center") as FigureAlign,
            borderRadius: Number(el.getAttribute("data-border-radius") ?? 8),
            borderWidth: Number(el.getAttribute("data-border-width") ?? 0),
            borderColor: el.getAttribute("data-border-color") ?? "#8B5A2B",
            caption: el.querySelector("figcaption")?.textContent ?? "",
          };
        },
      },
    ];
  },

  // Render to the persisted HTML that lives in the database.
  // The wrapping <figure data-figure ...> tag carries our custom attributes
  // so they round-trip through parseHTML cleanly.
  renderHTML({ HTMLAttributes, node }) {
    const attrs = node.attrs as FigureAttrs;
    const wrapperStyle = [
      attrs.align === "left" && "float: left; margin-right: 1rem;",
      attrs.align === "right" && "float: right; margin-left: 1rem;",
      attrs.align === "center" && "margin-left: auto; margin-right: auto;",
      attrs.align === "full" && "width: 100%;",
    ]
      .filter(Boolean)
      .join(" ");

    const imgStyle = [
      `border-radius: ${attrs.borderRadius}px;`,
      attrs.borderWidth > 0 &&
        `border: ${attrs.borderWidth}px solid ${attrs.borderColor};`,
      attrs.width && `width: ${attrs.width}px;`,
      "display: block;",
      "max-width: 100%;",
      attrs.align === "center" && "margin-left: auto; margin-right: auto;",
    ]
      .filter(Boolean)
      .join(" ");

    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-figure": "",
        "data-align": attrs.align,
        "data-border-radius": String(attrs.borderRadius),
        "data-border-width": String(attrs.borderWidth),
        "data-border-color": attrs.borderColor,
        style: wrapperStyle,
        class: "doah-figure",
      }),
      ["img", { src: attrs.src, alt: attrs.alt, style: imgStyle }],
      ["figcaption", { class: "doah-figcaption" }, 0],
    ];
  },

  addCommands() {
    return {
      insertFigure:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              src: attrs.src,
              alt: attrs.alt ?? "",
              caption: attrs.caption ?? "",
              width: null,
              align: "center",
              borderRadius: 8,
              borderWidth: 0,
              borderColor: "#8B5A2B",
            },
            content: attrs.caption
              ? [{ type: "text", text: attrs.caption }]
              : [],
          }),
    };
  },

  // Hook the React NodeView in so users get the interactive editor
  addNodeView() {
    return ReactNodeViewRenderer(FigureNodeView);
  },
});

// -----------------------------------------------------------------------------
// React NodeView — what the user sees while editing
// -----------------------------------------------------------------------------

function FigureNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const attrs = node.attrs as FigureAttrs;
  const imgRef = useRef<HTMLImageElement>(null);
  const [dragging, setDragging] = useState(false);

  // Drag-to-resize: clamp between 80 and the container width
  const onResizeStart = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
    const startX = e.clientX;
    const startWidth =
      attrs.width ?? imgRef.current?.getBoundingClientRect().width ?? 0;

    const onMove = (ev: MouseEvent) => {
      const next = Math.max(80, Math.round(startWidth + (ev.clientX - startX)));
      updateAttributes({ width: next });
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // Cleanup if component unmounts mid-drag
  useEffect(() => {
    return () => setDragging(false);
  }, []);

  const wrapperJustify =
    attrs.align === "left"
      ? "justify-start"
      : attrs.align === "right"
        ? "justify-end"
        : attrs.align === "full"
          ? "justify-stretch"
          : "justify-center";

  const imgStyle: React.CSSProperties = {
    borderRadius: `${attrs.borderRadius}px`,
    border:
      attrs.borderWidth > 0
        ? `${attrs.borderWidth}px solid ${attrs.borderColor}`
        : undefined,
    width: attrs.align === "full" ? "100%" : attrs.width ?? undefined,
    maxWidth: "100%",
    display: "block",
    userSelect: "none",
  };

  return (
    <NodeViewWrapper
      data-figure
      data-drag-handle
      className={`doah-figure-edit my-4 flex ${wrapperJustify} ${
        selected ? "ring-2 ring-hunter-warm/60 rounded-md" : ""
      }`}
    >
      <figure className="inline-block relative max-w-full group">
        <img
          ref={imgRef}
          src={attrs.src}
          alt={attrs.alt}
          style={imgStyle}
          draggable={false}
        />

        {/* Resize handle — right edge, visible on hover or when selected */}
        <div
          role="slider"
          aria-label="Resize image"
          aria-valuenow={attrs.width ?? 0}
          tabIndex={-1}
          onMouseDown={onResizeStart}
          className={`absolute top-1/2 -right-1.5 -translate-y-1/2 h-12 w-3 rounded-full bg-hunter-warm border-2 border-hunter-parchment shadow-md cursor-ew-resize transition-opacity ${
            selected || dragging
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
        />

        {/* Caption — editable via NodeViewContent so ProseMirror owns it */}
        <NodeViewContent
          as="figcaption"
          className="doah-figcaption mt-2 text-center text-sm italic text-slate-600 dark:text-slate-400 empty:before:content-['Add_a_caption…'] empty:before:text-slate-400 empty:before:italic"
        />
      </figure>
    </NodeViewWrapper>
  );
}
