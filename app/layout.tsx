// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Caveat, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// Body copy
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Display serif used by every `font-serif` element across the site.
// Without this, font-serif falls back to Times New Roman.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// Handwritten accent used for Amber's voice
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Diary of a Hunter",
  description: "The truth burns. So do I.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // `disableTransitionOnChange` on ThemeProvider handles theme switching
        // cleanly — we no longer add transition-colors here (the two fight).
        className={`${inter.variable} ${playfair.variable} ${caveat.variable} font-sans antialiased bg-hunter-parchment dark:bg-hunter-shadow`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* flex-col min-h-screen pins the footer to the bottom */}
            <div className="flex flex-col min-h-screen">
              <TopNav />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
