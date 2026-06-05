import type { Metadata } from "next";
import "./globals.css";
import { getSite } from "@/lib/site";
import { fontVariables } from "@/lib/theme/fonts";

/**
 * Root layout. Sets site-wide metadata defaults derived from the Site JSON:
 * - `metadataBase` so relative OG/canonical URLs resolve to absolute ones.
 * - a default title/description used when a page doesn't override them.
 *
 * Per-page <title>, description, canonical, OG, and JSON-LD are produced by each
 * route's `generateMetadata` + the JsonLd component — all from the schema.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    metadataBase: new URL(site.baseUrl),
    title: {
      default: site.profile.name,
      // Pages provide a complete titleTag, used verbatim (no brand appended).
      template: "%s",
    },
    description: site.profile.tagline,
    openGraph: {
      siteName: site.profile.name,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${fontVariables}`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
