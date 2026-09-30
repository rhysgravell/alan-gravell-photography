import type { Metadata } from "next";
import { Cormorant_Garamond, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/content/site";
import "./globals.css";

// The three Google families the design system's tokens/fonts.css loads, self-hosted
// through next/font. app/tokens/typography.css reads these variables.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s — ${site.name}` },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${cormorant.variable} ${hanken.variable} ${plexMono.variable} antialiased`}
    >
      <body>
        <a
          href="#content"
          className="sr-only type-label focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:border focus:border-line-strong focus:bg-raised focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <div className="mx-auto flex min-h-dvh max-w-(--page-max) flex-col px-(--page-gutter)">
          <SiteHeader />
          <main id="content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
