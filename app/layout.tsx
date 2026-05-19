// src/app/layout.tsx
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import { FONT_VARIABLES } from "@/lib/fonts";
import "./globals.css";

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
        // FONT_VARIABLES contains every --font-* CSS variable defined in
        // lib/fonts.ts. Spreading it here makes them available throughout
        // the tree — anywhere we use `font-serif`, `font-caveat`, etc.
        className={`${FONT_VARIABLES} font-sans antialiased bg-hunter-parchment dark:bg-hunter-shadow`}
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
