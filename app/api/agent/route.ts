import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSite, saveSite } from "@/lib/site";
import { getAnthropicApiKey } from "@/lib/settings";
import { runAgent } from "@/lib/builder/agent";
import { getValueAtPath, isProtectedPath } from "@/lib/builder/paths";
import { setContent, InvalidEditError } from "@/lib/builder/mutations";
import { proposeEdit } from "@/lib/builder/ai";

const SEO_LOCKED =
  "That's an SEO field — managed automatically by FishySites. Turn on Advanced SEO to edit it.";

/**
 * The editor assistant. Gated by the proxy + scoped to the current account.
 * With an Anthropic key it runs the tool-using agent (text/image/button/section
 * edits, multi-step). Without a key it falls back to the simple mock for a
 * selected text field so the editor still does something useful.
 */
export async function POST(request: Request) {
  let body: {
    message?: string;
    pageSlug?: string;
    selectedPath?: string | null;
    advanced?: boolean;
    attachment?: { url: string; kind: "image" | "video" } | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  const pageSlug = body.pageSlug ?? "";
  const selectedPath = body.selectedPath ?? null;
  const advanced = body.advanced === true;
  const attachment = body.attachment ?? null;
  if ((!message && !attachment) || !pageSlug) {
    return NextResponse.json({ error: "message and pageSlug are required." }, { status: 400 });
  }

  const site = await getSite();
  const apiKey = await getAnthropicApiKey();

  try {
    if (apiKey) {
      const result = await runAgent({
        apiKey,
        message: message || "Place the attached media on the appropriate section.",
        pageSlug,
        selectedPath,
        advanced,
        site,
        attachment,
      });
      await saveSite(result.site);
      revalidatePath("/", "layout");
      return NextResponse.json({ ok: true, summary: result.summary, changed: result.changed });
    }

    // No key — limited fallback: rewrite the selected text field with the mock.
    if (attachment) {
      return NextResponse.json(
        { error: "Add an Anthropic API key in Admin to let the assistant place images." },
        { status: 422 },
      );
    }
    if (!selectedPath) {
      return NextResponse.json(
        { error: "Add an Anthropic API key in Admin to enable the assistant." },
        { status: 422 },
      );
    }
    if (isProtectedPath(selectedPath) && !advanced) {
      return NextResponse.json({ error: SEO_LOCKED }, { status: 422 });
    }
    const current = getValueAtPath(site, selectedPath);
    if (current === undefined || (typeof current === "object" && current !== null)) {
      return NextResponse.json(
        { error: "Add an Anthropic API key in Admin to let the assistant edit this." },
        { status: 422 },
      );
    }
    const proposal = await proposeEdit({
      path: selectedPath,
      currentValue: current as string | number,
      instruction: message,
    });
    await saveSite(setContent(site, selectedPath, proposal.value));
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, summary: proposal.note, changed: 1 });
  } catch (err) {
    if (err instanceof InvalidEditError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    return NextResponse.json(
      { error: (err as Error).message ?? "The assistant hit an error." },
      { status: 500 },
    );
  }
}
