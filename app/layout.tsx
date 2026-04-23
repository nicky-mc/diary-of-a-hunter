// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
// IMPORT YOUR NEW WRAPPER, NOT THE RAW PACKAGE
import { ThemeProvider } from "@/components/theme-provider";
import TopNav from "@/components/layout/TopNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

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
    // suppressHydrationWarning is CRITICAL here on the HTML tag
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${caveat.variable} font-sans antialiased bg-[#F4ECD8] dark:bg-[#121212]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TopNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
