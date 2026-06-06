import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSite, saveSite } from "@/lib/site";
import { getValueAtPath, isProtectedPath } from "@/lib/builder/paths";
import {
  setContent,
  setSectionHidden,
  moveSection,
  removeSection,
  setMedia,
  setSectionBackground,
  setSectionBackgroundMedia,
  InvalidEditError,
} from "@/lib/builder/mutations";
import { proposeEdit } from "@/lib/builder/ai";

const SEO_LOCKED =
  "Page SEO (title, description, and search data) is optimized automatically by FishySites. Turn on Advanced SEO to edit it directly.";

/**
 * The builder's edit endpoint. Gated by the proxy (logged-in captains only) and
 * always scoped to the current account's site. Supported ops:
 *   - { op: "ai",  path, instruction }     AI proposes a new value for a field
 *   - { op: "set", path, value }           set a field to an exact value (no AI)
 *   - { op: "section", action, pageSlug, sectionId }   hide/show/up/down/remove
 *
 * Every change goes through a Zod-validated mutation, so invalid edits never save.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const op = body.op;
  // SEO is platform-managed by default; an "Advanced SEO" toggle opts in.
  const advanced = body.advanced === true;
  const site = await getSite();

  try {
    if (op === "ai") {
      const { path, instruction } = body as { path?: string; instruction?: string };
      if (!path || !instruction?.trim()) {
        return NextResponse.json({ error: "path and instruction required." }, { status: 400 });
      }
      if (isProtectedPath(path) && !advanced) {
        return NextResponse.json({ error: SEO_LOCKED }, { status: 422 });
      }
      const current = getValueAtPath(site, path);
      if (current === undefined) {
        return NextResponse.json({ error: `No field at "${path}".` }, { status: 404 });
      }
      if (typeof current === "object" && current !== null) {
        return NextResponse.json({ error: "That field isn't editable text." }, { status: 422 });
      }
      const proposal = await proposeEdit({
        path,
        currentValue: current as string | number,
        instruction,
      });
      await saveSite(setContent(site, path, proposal.value));
      revalidatePath("/", "layout");
      return NextResponse.json({ ok: true, value: proposal.value, note: proposal.note });
    }

    if (op === "set") {
      const { path, value } = body as { path?: string; value?: string | number };
      if (!path || (typeof value !== "string" && typeof value !== "number")) {
        return NextResponse.json({ error: "path and value required." }, { status: 400 });
      }
      if (isProtectedPath(path) && !advanced) {
        return NextResponse.json({ error: SEO_LOCKED }, { status: 422 });
      }
      await saveSite(setContent(site, path, value));
      revalidatePath("/", "layout");
      return NextResponse.json({ ok: true, value });
    }

    if (op === "section") {
      const { action, pageSlug, sectionId } = body as {
        action?: string;
        pageSlug?: string;
        sectionId?: string;
      };
      if (!action || !pageSlug || !sectionId) {
        return NextResponse.json({ error: "action, pageSlug, sectionId required." }, { status: 400 });
      }
      let updated;
      switch (action) {
        case "hide":
          updated = setSectionHidden(site, pageSlug, sectionId, true);
          break;
        case "show":
          updated = setSectionHidden(site, pageSlug, sectionId, false);
          break;
        case "up":
          updated = moveSection(site, pageSlug, sectionId, -1);
          break;
        case "down":
          updated = moveSection(site, pageSlug, sectionId, 1);
          break;
        case "remove":
          updated = removeSection(site, pageSlug, sectionId);
          break;
        default:
          return NextResponse.json({ error: `Unknown action "${action}".` }, { status: 400 });
      }
      await saveSite(updated);
      revalidatePath("/", "layout");
      return NextResponse.json({ ok: true });
    }

    if (op === "media") {
      const { path, src, kind, width, height, caption } = body as {
        path?: string;
        src?: string;
        kind?: "image" | "video";
        width?: number;
        height?: number;
        caption?: string;
      };
      if (!path) {
        return NextResponse.json({ error: "path required." }, { status: 400 });
      }
      await saveSite(setMedia(site, path, { src, kind, width, height, caption }));
      revalidatePath("/", "layout");
      return NextResponse.json({ ok: true });
    }

    if (op === "sectionBg") {
      const { pageSlug, sectionId, color, overlay } = body as {
        pageSlug?: string;
        sectionId?: string;
        color?: "default" | "surface" | "band" | "primary";
        overlay?: { tone: "dark" | "light"; opacity: number } | null;
      };
      if (!pageSlug || !sectionId) {
        return NextResponse.json({ error: "pageSlug and sectionId required." }, { status: 400 });
      }
      await saveSite(setSectionBackground(site, pageSlug, sectionId, { color, overlay }));
      revalidatePath("/", "layout");
      return NextResponse.json({ ok: true });
    }

    if (op === "sectionBgMedia") {
      const { pageSlug, sectionId, src, kind } = body as {
        pageSlug?: string;
        sectionId?: string;
        src?: string;
        kind?: "image" | "video";
      };
      if (!pageSlug || !sectionId || !src || !kind) {
        return NextResponse.json({ error: "pageSlug, sectionId, src, kind required." }, { status: 400 });
      }
      await saveSite(setSectionBackgroundMedia(site, pageSlug, sectionId, { src, kind }));
      revalidatePath("/", "layout");
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: `Unknown op "${String(op)}".` }, { status: 400 });
  } catch (err) {
    if (err instanceof InvalidEditError) {
      return NextResponse.json({ error: err.message, issues: err.issues }, { status: 422 });
    }
    return NextResponse.json(
      { error: (err as Error).message ?? "Edit failed." },
      { status: 500 },
    );
  }
}
