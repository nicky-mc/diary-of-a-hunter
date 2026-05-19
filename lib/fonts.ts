// src/lib/fonts.ts
//
// =============================================================================
// FONT REGISTRY
// =============================================================================
// Single source of truth for every font in the app.
//
// HOW TO ADD A NEW FONT:
//
//   GOOGLE FONT:
//   1. Import the loader from "next/font/google" below
//   2. Call it with subsets + variable name and assign to a const
//   3. Add an entry to FONT_OPTIONS so the editor toolbar picks it up
//
//   LOCAL FONT FILE:
//   1. Drop the .woff2 (or .woff/.otf/.ttf) into public/fonts/
//   2. Import localFont from "next/font/local" below (already imported)
//   3. Call localFont({ src: [{ path: "../public/fonts/your-font.woff2", weight: "400" }], variable: "--font-yourname" })
//   4. Add an entry to FONT_OPTIONS
//
// The toolbar's font-family dropdown is automatically generated from
// FONT_OPTIONS — no other code changes required.
// =============================================================================

import { Inter, Caveat, Playfair_Display, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

// -----------------------------------------------------------------------------
// Loader declarations.
//
// next/font requires these calls to live at the top level of a statically
// analysable module — that's why we can't make this dynamic. The variable
// name on the left of the `=` is also used as the CSS variable name on the
// right, by convention.
// -----------------------------------------------------------------------------

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jetbrains",
  display: "swap",
});

/**
 * EXAMPLE of a local font — uncomment after dropping a .woff2 into public/fonts/
 * and remove this comment block. Then add it to FONT_OPTIONS below.
 *
 * const eldritch = localFont({
 *   src: [
 *     { path: "../public/fonts/Eldritch-Regular.woff2", weight: "400", style: "normal" },
 *     { path: "../public/fonts/Eldritch-Bold.woff2", weight: "700", style: "normal" },
 *   ],
 *   variable: "--font-eldritch",
 *   display: "swap",
 * });
 */

// Silence unused-import warning until the user adds a local font
void localFont;

// -----------------------------------------------------------------------------
// PUBLIC API
// -----------------------------------------------------------------------------

/**
 * Class names containing all font CSS variables. Spread this onto <body>
 * in app/layout.tsx so every font is available everywhere.
 */
export const FONT_VARIABLES = [
  inter.variable,
  playfair.variable,
  caveat.variable,
  jetbrainsMono.variable,
  // Add new font.variable references here
].join(" ");

/**
 * Toolbar-facing list of available fonts. The Tiptap editor's font-family
 * dropdown reads from this array.
 *
 * `cssValue` is what gets written into the document as `font-family: ...`.
 * Use the CSS variable so the resolved font cascades from the layout-level
 * `<body>` element.
 */
export interface FontOption {
  label: string;
  cssValue: string;
}

export const FONT_OPTIONS: readonly FontOption[] = [
  { label: "Default (Sans)", cssValue: "var(--font-inter)" },
  { label: "Display Serif", cssValue: "var(--font-playfair)" },
  { label: "Handwritten", cssValue: "var(--font-caveat)" },
  { label: "Monospace", cssValue: "var(--font-mono-jetbrains)" },
  // Generic system stacks — always available, useful for fallbacks
  { label: "System Serif", cssValue: "Georgia, 'Times New Roman', serif" },
  { label: "System Mono", cssValue: "ui-monospace, SFMono-Regular, monospace" },
] as const;
