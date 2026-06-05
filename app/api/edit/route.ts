import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSite, saveSite } from "@/lib/site";
import { getValueAtPath } from "@/lib/builder/paths";
import { setContent, InvalidEditError } from "@/lib/builder/mutations";
import { proposeEdit } from "@/lib/builder/ai";

/**
 * Click-to-edit endpoint. The editor posts { path, instruction }; we:
 *   1. load the current site + the current value at `path`
 *   2. ask the AI (mock for now) to propose a new value for that one field
 *   3. apply it via setContent() — which re-validates the WHOLE site
 *   4. persist and return the new value
 *
 * The AI never writes the JSON. It proposes a value; setContent + Zod decide
 * whether it's allowed to take effect.
 */
export async function POST(request: Request) {
  let body: { path?: unknown; instruction?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { path, instruction } = body;
  if (typeof path !== "string" || typeof instruction !== "string" || !path || !instruction.trim()) {
    return NextResponse.json(
      { error: "Both `path` and `instruction` are required strings." },
      { status: 400 },
    );
  }

  const site = await getSite();

  const currentValue = getValueAtPath(site, path);
  if (currentValue === undefined) {
    return NextResponse.json(
      { error: `No editable field at "${path}".` },
      { status: 404 },
    );
  }
  if (typeof currentValue === "object" && currentValue !== null) {
    return NextResponse.json(
      { error: `"${path}" is a structured field; editing it isn't supported yet.` },
      { status: 422 },
    );
  }

  try {
    const proposal = await proposeEdit({
      path,
      currentValue: currentValue as string | number,
      instruction,
    });
    const updated = setContent(site, path, proposal.value);
    await saveSite(updated);
    // Content lives in nav/footer/profile/any page, so refresh everything.
    revalidatePath("/", "layout");
    return NextResponse.json({
      ok: true,
      path,
      value: proposal.value,
      note: proposal.note,
    });
  } catch (err) {
    if (err instanceof InvalidEditError) {
      return NextResponse.json(
        { error: err.message, issues: err.issues },
        { status: 422 },
      );
    }
    return NextResponse.json(
      { error: (err as Error).message ?? "Edit failed." },
      { status: 500 },
    );
  }
}
