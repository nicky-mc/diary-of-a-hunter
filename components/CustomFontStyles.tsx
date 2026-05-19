// src/components/CustomFontStyles.tsx
//
// Server component that fetches every uploaded Font from MongoDB and
// renders a <style> tag containing @font-face rules.
//
// Once mounted in app/layout.tsx, every uploaded font is available
// across the site via `font-family: "<family-slug>"` — including inside
// the rich text editor, on public detail pages (where Tiptap-saved
// inline styles reference the same family names), everywhere.

import dbConnect from "@/lib/mongodb";
import Font from "@/app/models/font";

// Match the lean projection — only the fields needed to emit CSS.
interface FontCSSRow {
  family: string;
  fileUrl: string;
  weight: string;
  style: string;
}

// Map file extension → @font-face `format(…)` hint. Browsers don't strictly
// need it but it speeds up format negotiation.
function formatHint(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  switch (ext) {
    case "woff2":
      return "woff2";
    case "woff":
      return "woff";
    case "ttf":
      return "truetype";
    case "otf":
      return "opentype";
    default:
      return "woff2";
  }
}

export default async function CustomFontStyles() {
  // If MongoDB is unreachable we don't want to take down every page —
  // catch the error and render no custom fonts. Built-in next/font fonts
  // still work because they're separate.
  let fonts: FontCSSRow[] = [];
  try {
    await dbConnect();
    fonts = await Font.find()
      .select("family fileUrl weight style")
      .lean<FontCSSRow[]>();
  } catch (err) {
    console.error("CustomFontStyles: failed to load fonts:", err);
    return null;
  }

  if (fonts.length === 0) return null;

  // Build one @font-face block per font. `font-display: swap` shows the
  // fallback first and swaps in the real font once it loads — avoids
  // invisible-text flashes on slow connections.
  const css = fonts
    .map(
      (f) => `
@font-face {
  font-family: "${f.family}";
  src: url("${f.fileUrl}") format("${formatHint(f.fileUrl)}");
  font-weight: ${f.weight || "400"};
  font-style: ${f.style || "normal"};
  font-display: swap;
}`,
    )
    .join("\n");

  // `dangerouslySetInnerHTML` on <style> is the canonical way to embed
  // generated CSS in Next.js. The content is sourced from our own DB,
  // not user-controlled inputs that could break out.
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
