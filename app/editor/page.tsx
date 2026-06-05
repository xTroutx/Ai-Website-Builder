import type { Metadata } from "next";
import { getSite } from "@/lib/site";
import { getHomePage } from "@/lib/schema";
import { PageRenderer } from "@/components/templates/PageRenderer";
import { EditorShell } from "@/components/editor/EditorShell";

// The editor is a private tool surface — never index it.
export const metadata: Metadata = {
  title: "FishySites Editor",
  robots: { index: false, follow: false },
};

// Always render the latest working copy (so edits show immediately).
export const dynamic = "force-dynamic";

/**
 * Click-to-edit editor for the home page. Renders the real templates as a live
 * preview inside the editor shell; every editable element already carries its
 * data-edit path, so the shell can target the chat at exactly the right field.
 */
export default async function EditorPage() {
  const site = await getSite();
  const page = getHomePage(site);
  return (
    <EditorShell pageLabel="Home" liveHref="/">
      <PageRenderer site={site} page={page} />
    </EditorShell>
  );
}
