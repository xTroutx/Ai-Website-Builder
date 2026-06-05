import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/theme/fonts";

/**
 * Root layout. Wraps every route INCLUDING /login and /signup, so its metadata
 * must not depend on an authenticated site. Per-page <title>/description/OG +
 * JSON-LD for a captain's site are produced by each route's generateMetadata.
 */
export const metadata: Metadata = {
  title: { default: "FishySites", template: "%s" },
  description: "Websites for fishing guides and charter captains.",
};

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
